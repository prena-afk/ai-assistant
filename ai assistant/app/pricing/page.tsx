'use client';

import { useState } from 'react';
import { FiCheck, FiZap } from 'react-icons/fi';
import { loadStripe } from '@stripe/stripe-js';
import Layout from '@/components/Layout';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: string | 'custom';
  priceId?: string; // Stripe Price ID
  features: string[];
  buttonText: string;
  buttonAction: 'checkout' | 'contact';
  popular?: boolean;
}

const plans: PricingPlan[] = [
  {
    id: 'setup',
    name: 'Setup',
    description: 'Includes full onboarding, workflow creation, CRM & API integrations, AI training, testing, analytics, and support.',
    price: '$1000',
    priceId: process.env.NEXT_PUBLIC_STRIPE_SETUP_PRICE_ID,
    features: [
      'Full onboarding',
      'Workflow creation',
      'CRM & API integrations',
      'AI training',
      'Testing & analytics',
      'Dedicated support'
    ],
    buttonText: 'Get Started',
    buttonAction: 'checkout'
  },
  {
    id: 'monthly',
    name: 'Monthly Retainer',
    description: 'Includes 5 AI actions, omni-channel automation, CRM automations, 3 user accounts, advanced analytics, AI training, and 250 credits (~1,000 conversations). Pay-as-you-grow options available.',
    price: '$400',
    priceId: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID,
    features: [
      '4 team members',
      '8 GB storage',
      'Up to 6 pages',
      'Priority support',
      'AI assistance',
      '250 credits/month'
    ],
    buttonText: 'Get Started',
    buttonAction: 'checkout',
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Includes everything above plus multi-location support, ERP & billing integrations, private infrastructure, dedicated AI engineer, and high-volume credit tiers.',
    price: 'custom',
    features: [
      '10 team members',
      '20 GB storage',
      'Up to 10 pages',
      'Phone & email support',
      'AI assistance',
      'Custom credits'
    ],
    buttonText: 'Talk to Us',
    buttonAction: 'contact'
  }
];

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (plan: PricingPlan) => {
    if (!plan.priceId) {
      alert('Stripe Price ID not configured. Please contact support.');
      return;
    }

    setLoading(plan.id);
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      
      console.log('Creating checkout session...', { priceId: plan.priceId, planName: plan.name, apiUrl: API_BASE_URL });
      
      // Create checkout session via backend
      const response = await fetch(`${API_BASE_URL}/payments/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: plan.priceId,
          planName: plan.name,
        }),
      });

      console.log('Response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        let errorMessage = `Server error: ${response.status}`;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.error || errorJson.detail || errorMessage;
        } catch (e) {
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const session = await response.json();
      console.log('Checkout session created:', session);

      if (session.error) {
        throw new Error(session.error);
      }

      if (!session.id && !session.url) {
        throw new Error('Invalid response from server. Missing checkout session ID or URL.');
      }

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (stripe && session.id) {
        const { error } = await stripe.redirectToCheckout({
          sessionId: session.id,
        });

        if (error) {
          throw error;
        }
      } else if (session.url) {
        // Fallback: redirect directly to Stripe URL
        console.log('Redirecting to Stripe URL:', session.url);
        window.location.href = session.url;
      } else {
        throw new Error('No checkout session ID or URL received from server.');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      const errorMessage = error?.message || error?.toString() || 'Unknown error occurred';
      alert(`Failed to start checkout: ${errorMessage}\n\nPlease check:\n1. Backend server is running (http://localhost:8000)\n2. Check browser console (F12) for details`);
    } finally {
      setLoading(null);
    }
  };

  const handleContact = () => {
    // Open contact form or email
    window.location.href = 'mailto:support@infiniteforces.com?subject=Enterprise Plan Inquiry';
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Ready To Start</h1>
          <p className="text-xl text-gray-600">Choose the plan that's right for you</p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-lg shadow-lg p-8 relative ${
                plan.popular ? 'border-2 border-purple-500 transform scale-105' : 'border border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-4">
                  {plan.price === 'custom' ? (
                    <div>
                      <span className="text-4xl font-bold text-gray-900">Custom</span>
                    </div>
                  ) : (
                    <div>
                      <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-600"> /month</span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <FiCheck className="w-5 h-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => {
                  if (plan.buttonAction === 'checkout') {
                    handleCheckout(plan);
                  } else {
                    handleContact();
                  }
                }}
                disabled={loading === plan.id}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                  plan.popular
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2`}
              >
                {loading === plan.id ? (
                  <>
                    <FiZap className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>{plan.buttonText}</span>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-600">
            All plans include 24/7 support and regular updates. Cancel anytime.
          </p>
        </div>
      </div>
    </Layout>
  );
}

