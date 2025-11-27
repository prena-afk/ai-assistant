from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
import stripe
import logging
import json
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import os

logger = logging.getLogger(__name__)

# Initialize Stripe
stripe.api_key = settings.STRIPE_SECRET_KEY if hasattr(settings, 'STRIPE_SECRET_KEY') else None


@api_view(['POST'])
@permission_classes([AllowAny])
def create_checkout_session(request):
    """
    Create a Stripe Checkout Session
    """
    try:
        price_id = request.data.get('priceId')
        plan_name = request.data.get('planName', 'Unknown Plan')

        if not price_id:
            return Response(
                {'error': 'Price ID is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not stripe.api_key:
            return Response(
                {'error': 'Stripe not configured'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Get base URL - use frontend URL for redirects
        frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3000')
        
        # Determine mode based on plan (Setup is one-time, Monthly is recurring)
        is_setup = plan_name.lower() == 'setup'
        mode = 'payment' if is_setup else 'subscription'
        
        # Create checkout session
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[
                {
                    'price': price_id,
                    'quantity': 1,
                },
            ],
            mode=mode,
            success_url=f'{frontend_url}/checkout/success?session_id={{CHECKOUT_SESSION_ID}}',
            cancel_url=f'{frontend_url}/pricing',
            metadata={
                'plan_name': plan_name,
            },
        )

        return Response({
            'id': checkout_session.id,
            'url': checkout_session.url
        })

    except stripe.error.StripeError as e:
        logger.error(f'Stripe error: {str(e)}')
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        logger.error(f'Checkout session error: {str(e)}')
        return Response(
            {'error': 'Failed to create checkout session'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@csrf_exempt
def stripe_webhook(request):
    """
    Handle Stripe webhooks
    """
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    endpoint_secret = getattr(settings, 'STRIPE_WEBHOOK_SECRET', None)

    try:
        if endpoint_secret:
            event = stripe.Webhook.construct_event(
                payload, sig_header, endpoint_secret
            )
        else:
            # For testing without webhook secret
            event = stripe.Event.construct_from(
                json.loads(payload), stripe.api_key
            )

        # Handle the event
        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            # Handle successful payment
            logger.info(f'Payment successful: {session.id}')
            # TODO: Update user subscription status
            
        elif event['type'] == 'customer.subscription.updated':
            subscription = event['data']['object']
            # Handle subscription update
            logger.info(f'Subscription updated: {subscription.id}')
            # TODO: Update subscription status
            
        elif event['type'] == 'customer.subscription.deleted':
            subscription = event['data']['object']
            # Handle subscription cancellation
            logger.info(f'Subscription cancelled: {subscription.id}')
            # TODO: Update subscription status

        return JsonResponse({'status': 'success'})

    except ValueError as e:
        logger.error(f'Invalid payload: {str(e)}')
        return JsonResponse({'error': 'Invalid payload'}, status=400)
    except stripe.error.SignatureVerificationError as e:
        logger.error(f'Invalid signature: {str(e)}')
        return JsonResponse({'error': 'Invalid signature'}, status=400)
    except Exception as e:
        logger.error(f'Webhook error: {str(e)}')
        return JsonResponse({'error': str(e)}, status=500)

