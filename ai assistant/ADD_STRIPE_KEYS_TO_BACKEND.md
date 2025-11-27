# 🔧 Add Stripe Keys to Backend .env File

## ✅ Frontend Keys Added

I've created `.env.local` with your Publishable Key.

## 📝 Backend Keys - Manual Step Required

Since the backend `.env` file is protected, please add these manually:

### **Step 1: Open Backend .env File**

Open: `backend/.env`

### **Step 2: Add These Lines**

Add these lines to your `backend/.env` file:

```env
# Stripe Settings
STRIPE_SECRET_KEY=sk_test_51RJ9TqIXljbVNKiTL961YRQ00mU1w3CW5s64r2EZqMU3MISDS1Ir3wqA6QB0GlZZLmY4MtTMRBqRSD4CeVvxKdhY00XUXXMUwk
STRIPE_PUBLISHABLE_KEY=pk_test_51RJ9TqIXljbVNKiT1KRkONB9dRiBtmL9EDBvEUv8aF2PRGHWrKNMdjL7sCfjGJ5t33NjTdvrLRar9OZ7Jk59rqlh00pC4cUEmL
FRONTEND_URL=http://localhost:3000
```

### **Step 3: Save and Restart**

1. Save the file
2. Restart your backend server:
   ```bash
   cd backend
   python manage.py runserver
   ```

---

## ⚠️ Still Need: Price IDs

You still need to create products in Stripe and get Price IDs:

1. Go to: https://dashboard.stripe.com/test/products
2. Create **Setup** product ($1000, one-time)
3. Create **Monthly Retainer** product ($400/month, recurring)
4. Copy the Price IDs (start with `price_`)
5. Add them to `.env.local`:
   ```
   NEXT_PUBLIC_STRIPE_SETUP_PRICE_ID=price_YOUR_ACTUAL_ID
   NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID=price_YOUR_ACTUAL_ID
   ```

---

## ✅ What's Done

- ✅ Frontend `.env.local` created with Publishable Key
- ⚠️ Backend `.env` - needs manual update (see above)
- ⚠️ Price IDs - need to create products in Stripe

---

## 🧪 Test After Setup

1. Add keys to backend `.env` (manual step above)
2. Create products and get Price IDs
3. Add Price IDs to `.env.local`
4. Restart both servers
5. Go to: http://localhost:3000/pricing
6. Click "Get Started" to test!

