# ⚡ Stripe Quick Setup Checklist

## 🎯 What You Need

1. ✅ Stripe account (free)
2. ✅ Test API keys
3. ✅ Two products created
4. ✅ Environment variables set

---

## 📝 5-Minute Setup

### **1. Get Stripe Keys (2 minutes)**

1. Go to: https://dashboard.stripe.com/test/apikeys
2. Copy:
   - **Publishable key**: `pk_test_...`
   - **Secret key**: `sk_test_...`

### **2. Create Products (2 minutes)**

1. Go to: https://dashboard.stripe.com/test/products
2. Create **Setup** product:
   - One-time payment
   - $1000
   - Copy Price ID: `price_...`
3. Create **Monthly Retainer** product:
   - Recurring (monthly)
   - $400
   - Copy Price ID: `price_...`

### **3. Add Environment Variables (1 minute)**

**Frontend (`.env.local` in project root):**
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY
NEXT_PUBLIC_STRIPE_SETUP_PRICE_ID=price_YOUR_ID
NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID=price_YOUR_ID
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

**Backend (`backend/.env`):**
```env
STRIPE_SECRET_KEY=sk_test_YOUR_KEY
FRONTEND_URL=http://localhost:3000
```

### **4. Install & Restart**

```bash
# Install Stripe Python package
cd backend
pip install stripe

# Restart servers
# Frontend: npm run dev
# Backend: python manage.py runserver
```

### **5. Test**

1. Go to: http://localhost:3000/pricing
2. Click "Get Started"
3. Use test card: `4242 4242 4242 4242`
4. Complete payment
5. ✅ Done!

---

## 🧪 Test Card

- **Number**: `4242 4242 4242 4242`
- **Expiry**: Any future date
- **CVC**: Any 3 digits
- **ZIP**: Any 5 digits

---

## ✅ Verification

Stripe is working if:
- ✅ Pricing page loads
- ✅ Checkout opens when clicking "Get Started"
- ✅ Test payment succeeds
- ✅ Success page shows

---

## 📖 Full Guide

See `STRIPE_TESTING_GUIDE.md` for detailed instructions.

