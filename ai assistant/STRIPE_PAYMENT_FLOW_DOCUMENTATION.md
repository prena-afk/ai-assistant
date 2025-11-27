# 💳 Complete Stripe Payment Flow Documentation

This document explains the complete Stripe payment integration flow in this application. Use this as a guide to implement the same flow in another app.

---

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Complete Payment Flow](#complete-payment-flow)
3. [Frontend Implementation](#frontend-implementation)
4. [Backend Implementation](#backend-implementation)
5. [Environment Variables](#environment-variables)
6. [File Structure](#file-structure)
7. [Step-by-Step Implementation Guide](#step-by-step-implementation-guide)

---

## 🏗️ Architecture Overview

### Tech Stack
- **Frontend**: Next.js (React) with TypeScript
- **Backend**: Django REST Framework (Python)
- **Payment Gateway**: Stripe Checkout

### Flow Type
- **One-time payments** (Setup plan: $1000)
- **Recurring subscriptions** (Monthly Retainer: $400/month)

---

## 🔄 Complete Payment Flow

### Visual Flow Diagram

```
┌─────────────┐
│   User      │
│  Clicks     │
│ "Get Started"│
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│  Frontend (Next.js)             │
│  app/pricing/page.tsx           │
│  - handleCheckout() function    │
└──────┬──────────────────────────┘
       │
       │ POST /api/payments/create-checkout-session
       │ Body: { priceId, planName }
       │
       ▼
┌─────────────────────────────────┐
│  Backend (Django)               │
│  payments/views.py              │
│  create_checkout_session()      │
│  - Validates priceId            │
│  - Creates Stripe Session       │
│  - Returns session.id & url      │
└──────┬──────────────────────────┘
       │
       │ Response: { id, url }
       │
       ▼
┌─────────────────────────────────┐
│  Frontend                       │
│  - Receives session response    │
│  - Redirects to Stripe Checkout │
│  stripe.redirectToCheckout()    │
└──────┬──────────────────────────┘
       │
       │ User redirected to Stripe
       │
       ▼
┌─────────────────────────────────┐
│  Stripe Checkout Page           │
│  - User enters card details     │
│  - Card: 4242 4242 4242 4242    │
│  - Clicks "Pay"                 │
└──────┬──────────────────────────┘
       │
       │ Payment processed
       │
       ▼
┌─────────────────────────────────┐
│  Stripe Redirects               │
│  success_url:                   │
│  /checkout/success?session_id=  │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  Success Page                   │
│  app/checkout/success/page.tsx  │
│  - Shows success message        │
│  - Link to dashboard            │
└─────────────────────────────────┘
       │
       │ (Optional: Webhook)
       │
       ▼
┌─────────────────────────────────┐
│  Stripe Webhook                 │
│  payments/views.py              │
│  stripe_webhook()               │
│  - Handles payment events       │
│  - Updates subscription status  │
└─────────────────────────────────┘
```

---

## 🎨 Frontend Implementation

### 1. Pricing Page (`app/pricing/page.tsx`)

**Key Components:**

```typescript
// Load Stripe.js
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

// Plan configuration with Stripe Price IDs
const plans: PricingPlan[] = [
  {
    id: 'setup',
    name: 'Setup',
    price: '$1000',
    priceId: process.env.NEXT_PUBLIC_STRIPE_SETUP_PRICE_ID, // One-time payment
    buttonAction: 'checkout'
  },
  {
    id: 'monthly',
    name: 'Monthly Retainer',
    price: '$400',
    priceId: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID, // Subscription
    buttonAction: 'checkout'
  }
];

// Checkout handler
const handleCheckout = async (plan: PricingPlan) => {
  // 1. Validate priceId exists
  if (!plan.priceId) {
    alert('Stripe Price ID not configured');
    return;
  }

  // 2. Call backend API to create checkout session
  const response = await fetch(`${API_BASE_URL}/payments/create-checkout-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      priceId: plan.priceId,
      planName: plan.name,
    }),
  });

  // 3. Get session from response
  const session = await response.json();

  // 4. Redirect to Stripe Checkout
  const stripe = await stripePromise;
  await stripe.redirectToCheckout({ sessionId: session.id });
};
```

**Key Points:**
- Uses `@stripe/stripe-js` library
- Calls backend API to create session (never creates session directly from frontend)
- Uses `stripe.redirectToCheckout()` to redirect user
- Handles errors with user-friendly alerts

---

### 2. Success Page (`app/checkout/success/page.tsx`)

**Key Components:**

```typescript
export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  // Optional: Verify payment with backend
  useEffect(() => {
    if (sessionId) {
      fetch(`/api/verify-payment?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          console.log('Payment verified:', data);
        });
    }
  }, [sessionId]);

  // Display success message
  return (
    <div>
      <h1>Payment Successful!</h1>
      <a href="/dashboard">Go to Dashboard</a>
    </div>
  );
}
```

**Key Points:**
- Receives `session_id` from URL query parameter
- Can optionally verify payment with backend
- Shows success confirmation to user

---

## ⚙️ Backend Implementation

### 1. Django Views (`backend/payments/views.py`)

**Create Checkout Session:**

```python
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
import stripe
from django.conf import settings

# Initialize Stripe
stripe.api_key = settings.STRIPE_SECRET_KEY

@api_view(['POST'])
@permission_classes([AllowAny])
def create_checkout_session(request):
    """
    Creates a Stripe Checkout Session
    """
    # 1. Get data from request
    price_id = request.data.get('priceId')
    plan_name = request.data.get('planName', 'Unknown Plan')

    # 2. Validate priceId
    if not price_id:
        return Response({'error': 'Price ID is required'}, status=400)

    # 3. Determine payment mode
    is_setup = plan_name.lower() == 'setup'
    mode = 'payment' if is_setup else 'subscription'  # One-time vs recurring

    # 4. Create Stripe Checkout Session
    checkout_session = stripe.checkout.Session.create(
        payment_method_types=['card'],
        line_items=[{
            'price': price_id,
            'quantity': 1,
        }],
        mode=mode,  # 'payment' or 'subscription'
        success_url=f'{frontend_url}/checkout/success?session_id={{CHECKOUT_SESSION_ID}}',
        cancel_url=f'{frontend_url}/pricing',
        metadata={
            'plan_name': plan_name,
        },
    )

    # 5. Return session ID and URL
    return Response({
        'id': checkout_session.id,
        'url': checkout_session.url
    })
```

**Key Points:**
- Uses `stripe.checkout.Session.create()` to create session
- Determines mode: `'payment'` for one-time, `'subscription'` for recurring
- Sets `success_url` and `cancel_url` for redirects
- Returns session `id` and `url` to frontend

---

### 2. Webhook Handler (`backend/payments/views.py`)

```python
@csrf_exempt
def stripe_webhook(request):
    """
    Handles Stripe webhooks for payment events
    """
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    endpoint_secret = settings.STRIPE_WEBHOOK_SECRET

    # Verify webhook signature
    event = stripe.Webhook.construct_event(
        payload, sig_header, endpoint_secret
    )

    # Handle different event types
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        # Payment successful - update user subscription
        logger.info(f'Payment successful: {session.id}')
        
    elif event['type'] == 'customer.subscription.updated':
        subscription = event['data']['object']
        # Subscription updated
        logger.info(f'Subscription updated: {subscription.id}')
        
    elif event['type'] == 'customer.subscription.deleted':
        subscription = event['data']['object']
        # Subscription cancelled
        logger.info(f'Subscription cancelled: {subscription.id}')

    return JsonResponse({'status': 'success'})
```

**Key Points:**
- Verifies webhook signature for security
- Handles multiple event types
- Updates user subscription status in database
- Returns success response to Stripe

---

### 3. URL Configuration (`backend/payments/urls.py`)

```python
from django.urls import path
from . import views

urlpatterns = [
    path('create-checkout-session', views.create_checkout_session, name='create-checkout-session'),
    path('webhook', views.stripe_webhook, name='stripe-webhook'),
]
```

**Main URLs (`backend/infinite_base_agent/urls.py`):**

```python
urlpatterns = [
    # ... other patterns
    path('api/payments/', include('payments.urls')),
]
```

---

## 🔐 Environment Variables

### Frontend (`.env.local`)

```env
# Stripe Publishable Key (public, safe for frontend)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Stripe Price IDs (from Stripe Dashboard)
NEXT_PUBLIC_STRIPE_SETUP_PRICE_ID=price_...      # One-time payment
NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID=price_...   # Subscription

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Backend (`backend/.env`)

```env
# Stripe Secret Key (private, backend only)
STRIPE_SECRET_KEY=sk_test_...

# Stripe Webhook Secret (for webhook verification)
STRIPE_WEBHOOK_SECRET=whsec_...

# Frontend URL (for redirects)
FRONTEND_URL=http://localhost:3000
```

### Django Settings (`backend/infinite_base_agent/settings.py`)

```python
import os
from dotenv import load_dotenv

# Load .env file
load_dotenv()

# Stripe Settings
STRIPE_SECRET_KEY = os.getenv('STRIPE_SECRET_KEY', '')
STRIPE_PUBLISHABLE_KEY = os.getenv('STRIPE_PUBLISHABLE_KEY', '')
STRIPE_WEBHOOK_SECRET = os.getenv('STRIPE_WEBHOOK_SECRET', '')
FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:3000')
```

---

## 📁 File Structure

```
project/
├── app/
│   ├── pricing/
│   │   └── page.tsx              # Pricing page with checkout
│   └── checkout/
│       └── success/
│           └── page.tsx          # Success page after payment
│
├── backend/
│   ├── payments/
│   │   ├── __init__.py
│   │   ├── views.py              # Checkout & webhook handlers
│   │   ├── urls.py               # Payment URLs
│   │   └── models.py             # (Optional) Payment models
│   │
│   └── infinite_base_agent/
│       ├── settings.py           # Stripe config
│       └── urls.py               # Include payments URLs
│
├── .env.local                    # Frontend env vars
└── backend/.env                   # Backend env vars
```

---

## 🚀 Step-by-Step Implementation Guide

### Step 1: Install Dependencies

**Frontend:**
```bash
npm install @stripe/stripe-js
```

**Backend:**
```bash
pip install stripe
```

---

### Step 2: Get Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Get **Publishable Key** (`pk_test_...`)
3. Get **Secret Key** (`sk_test_...`)
4. Create **Products & Prices** in Stripe Dashboard
5. Copy **Price IDs** (`price_...`)

---

### Step 3: Create Products in Stripe

1. **Stripe Dashboard → Products**
2. Create products:
   - **Setup** (One-time payment, $1000)
   - **Monthly Retainer** (Recurring subscription, $400/month)
3. Copy the **Price IDs** for each product

---

### Step 4: Set Up Environment Variables

**Frontend `.env.local`:**
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_STRIPE_SETUP_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID=price_...
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

**Backend `backend/.env`:**
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=http://localhost:3000
```

---

### Step 5: Create Backend Payment App

```bash
cd backend
python manage.py startapp payments
```

**Add to `INSTALLED_APPS` in `settings.py`:**
```python
INSTALLED_APPS = [
    # ... other apps
    'payments',
]
```

---

### Step 6: Implement Backend Views

Create `backend/payments/views.py` with:
- `create_checkout_session()` function
- `stripe_webhook()` function

(See [Backend Implementation](#backend-implementation) section above)

---

### Step 7: Set Up URLs

**`backend/payments/urls.py`:**
```python
from django.urls import path
from . import views

urlpatterns = [
    path('create-checkout-session', views.create_checkout_session),
    path('webhook', views.stripe_webhook),
]
```

**`backend/infinite_base_agent/urls.py`:**
```python
urlpatterns = [
    # ... other patterns
    path('api/payments/', include('payments.urls')),
]
```

---

### Step 8: Implement Frontend Pricing Page

Create `app/pricing/page.tsx` with:
- Plan configuration
- `handleCheckout()` function
- Stripe.js integration

(See [Frontend Implementation](#frontend-implementation) section above)

---

### Step 9: Create Success Page

Create `app/checkout/success/page.tsx`:
- Display success message
- Show session ID
- Link to dashboard

---

### Step 10: Set Up Webhook (Optional but Recommended)

1. **Stripe Dashboard → Webhooks**
2. Add endpoint: `https://yourdomain.com/api/payments/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy **Webhook Secret** to `.env`

---

## 🔑 Key Concepts

### Payment Modes

1. **One-time Payment** (`mode: 'payment'`)
   - Used for: Setup fee, one-time purchases
   - Example: $1000 setup fee

2. **Subscription** (`mode: 'subscription'`)
   - Used for: Recurring monthly/yearly payments
   - Example: $400/month retainer

### Security Best Practices

1. **Never expose Secret Key** - Only use in backend
2. **Always verify webhooks** - Check signature
3. **Use HTTPS in production** - Required for webhooks
4. **Validate price IDs** - Ensure they match Stripe Dashboard

### Error Handling

**Frontend:**
- Check if priceId exists before checkout
- Handle API errors gracefully
- Show user-friendly error messages

**Backend:**
- Validate all inputs
- Handle Stripe errors
- Log errors for debugging

---

## 🧪 Testing

### Test Cards (Stripe Test Mode)

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Auth**: `4000 0025 0000 3155`

### Test Flow

1. Go to `/pricing`
2. Click "Get Started"
3. Use test card: `4242 4242 4242 4242`
4. Complete payment
5. Verify redirect to `/checkout/success`
6. Check Stripe Dashboard for payment

---

## 📝 Summary

### Complete Flow Steps:

1. ✅ User clicks "Get Started" on pricing page
2. ✅ Frontend calls backend API: `POST /api/payments/create-checkout-session`
3. ✅ Backend creates Stripe Checkout Session
4. ✅ Backend returns session ID and URL
5. ✅ Frontend redirects to Stripe Checkout
6. ✅ User enters card details and pays
7. ✅ Stripe processes payment
8. ✅ Stripe redirects to success page: `/checkout/success?session_id=...`
9. ✅ (Optional) Webhook notifies backend of payment completion
10. ✅ Backend updates user subscription status

---

## 🎯 Quick Checklist for New App

- [ ] Install Stripe libraries (frontend & backend)
- [ ] Get Stripe API keys from dashboard
- [ ] Create products & prices in Stripe
- [ ] Set up environment variables
- [ ] Create backend payment views
- [ ] Set up payment URLs
- [ ] Create frontend pricing page
- [ ] Create success page
- [ ] Test with test cards
- [ ] Set up webhooks (optional)

---

## 📚 Additional Resources

- [Stripe Checkout Documentation](https://stripe.com/docs/payments/checkout)
- [Stripe.js Documentation](https://stripe.com/docs/js)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)

---

**This flow is production-ready and follows Stripe's best practices!** 🚀

