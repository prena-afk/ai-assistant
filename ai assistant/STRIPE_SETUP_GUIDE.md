# 💳 Stripe Integration Setup Guide

## ✅ What's Been Added

1. **Pricing Page** (`/pricing`)
   - Three plans: Setup ($1000), Monthly Retainer ($400), Enterprise (Custom)
   - Stripe checkout integration
   - Responsive design

2. **Stripe Checkout**
   - Frontend: Stripe.js integration
   - Backend: Checkout session creation
   - Webhook handler for payment events

3. **Success Page** (`/checkout/success`)
   - Payment confirmation page

---

## 🔧 Setup Instructions

### **Step 1: Install Dependencies**

```bash
npm install @stripe/stripe-js stripe
```

### **Step 2: Get Stripe API Keys**

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Get your **Publishable Key** and **Secret Key**
3. Get your **Webhook Secret** (after setting up webhook)

### **Step 3: Create Stripe Products & Prices**

1. In Stripe Dashboard → Products
2. Create 3 products:
   - **Setup** - One-time payment ($1000)
   - **Monthly Retainer** - Recurring subscription ($400/month)
   - **Enterprise** - Custom (no price needed)

3. Copy the **Price IDs** for each product

### **Step 4: Add Environment Variables**

**Frontend (`.env.local`):**
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_STRIPE_SETUP_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID=price_...
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**Backend (`backend/.env`):**
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### **Step 5: Add Backend URL**

Update `backend/infinite_base_agent/urls.py`:
```python
path('api/payments/', include('payments.urls')),
```

### **Step 6: Create Payments App**

```bash
cd backend
python manage.py startapp payments
```

Then add to `INSTALLED_APPS` in `settings.py`:
```python
'payments',
```

### **Step 7: Set Up Webhook**

1. In Stripe Dashboard → Webhooks
2. Add endpoint: `https://yourdomain.com/api/payments/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy webhook secret to `.env`

---

## 📋 Pricing Plans

| Plan | Price | Type | Stripe Price ID |
|------|-------|------|----------------|
| **Setup** | $1000 | One-time | `price_...` |
| **Monthly Retainer** | $400/month | Recurring | `price_...` |
| **Enterprise** | Custom | Contact | N/A |

---

## 🎯 Features

- ✅ Stripe Checkout integration
- ✅ One-time payments (Setup)
- ✅ Recurring subscriptions (Monthly)
- ✅ Custom pricing (Enterprise - contact form)
- ✅ Payment success page
- ✅ Webhook handling
- ✅ Error handling

---

## 🧪 Testing

### **Test Mode:**
1. Use Stripe test keys (starts with `pk_test_` and `sk_test_`)
2. Use test card: `4242 4242 4242 4242`
3. Any future expiry date
4. Any CVC

### **Test Flow:**
1. Go to `/pricing`
2. Click "Get Started" on any plan
3. Use test card details
4. Complete checkout
5. Redirected to success page

---

## 📝 Next Steps

1. **Update User Model** - Add subscription fields
2. **Handle Webhooks** - Update user subscription status
3. **Add Subscription Management** - Cancel/upgrade plans
4. **Add Billing Dashboard** - View invoices, payment history

---

## 🔒 Security Notes

- ✅ Never expose secret keys in frontend
- ✅ Always verify webhook signatures
- ✅ Use HTTPS in production
- ✅ Validate payment on backend

---

## 📞 Support

For Stripe issues:
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com/)

