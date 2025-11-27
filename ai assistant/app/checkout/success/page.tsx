'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { FiCheckCircle } from 'react-icons/fi';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      // Verify payment with backend
      fetch(`/api/verify-payment?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          console.log('Payment verified:', data);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Payment verification error:', err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <FiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your subscription is now active.
        </p>
        <a
          href="/dashboard"
          className="inline-block bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}

