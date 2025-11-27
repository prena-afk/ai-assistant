# 🔑 How to Get Stripe API Keys - Step by Step

## 🎯 Overview

You need **3 things** from Stripe:
1. **Publishable Key** (starts with `pk_test_`)
2. **Secret Key** (starts with `sk_test_`)
3. **Webhook Secret** (starts with `whsec_`) - Optional for basic testing

---

## 📝 Step-by-Step Instructions

### **Step 1: Create/Login to Stripe Account**

1. Go to: **https://stripe.com/**
2. Click **"Sign in"** (or **"Start now"** if new)
3. Create account or login
4. **It's FREE** - no credit card needed for test mode

---

### **Step 2: Switch to Test Mode**

1. After logging in, you'll see the Stripe Dashboard
2. Look at the **top right corner**
3. You'll see a toggle: **"Test mode"** / **"Live mode"**
4. Make sure it says **"Test mode"** (should be default)
5. If it says "Live mode", click to switch to **"Test mode"**

**Why Test Mode?**
- ✅ Free to use
- ✅ No real charges
- ✅ Safe for testing
- ✅ Can test payments without real money

---

### **Step 3: Get Publishable Key & Secret Key**

#### **Method 1: From API Keys Page (Easiest)**

1. Go to: **https://dashboard.stripe.com/test/apikeys**
   - Or: Dashboard → **Developers** → **API keys**

2. You'll see two keys:

   **a) Publishable key:**
   - Starts with: `pk_test_...`
   - Example: `pk_test_51AbC123...`
   - Click **"Reveal test key"** or **"Copy"** button
   - ✅ Copy this - this is your **Publishable Key**

   **b) Secret key:**
   - Starts with: `sk_test_...`
   - Example: `sk_test_51AbC123...`
   - Click **"Reveal test key"** or **"Copy"** button
   - ✅ Copy this - this is your **Secret Key**

3. **Save both keys** - you'll need them!

---

### **Step 4: Create Products & Get Price IDs**

You need to create products in Stripe to get Price IDs.

#### **A. Create Setup Product ($1000 one-time)**

1. Go to: **https://dashboard.stripe.com/test/products**
   - Or: Dashboard → **Products** → **"+ Add product"**

2. Fill in the form:
   - **Name**: `Setup`
   - **Description**: `Full onboarding and setup` (optional)
   - **Pricing model**: Select **"One time"**
   - **Price**: `1000.00`
   - **Currency**: `USD`

3. Click **"Save product"**

4. After saving, you'll see the product page
5. Look for **"Price ID"** - it starts with `price_`
   - Example: `price_1AbC123...`
   - ✅ Copy this - this is your **Setup Price ID**

#### **B. Create Monthly Retainer Product ($400/month recurring)**

1. Click **"+ Add product"** again

2. Fill in the form:
   - **Name**: `Monthly Retainer`
   - **Description**: `Monthly subscription` (optional)
   - **Pricing model**: Select **"Recurring"**
   - **Price**: `400.00`
   - **Currency**: `USD`
   - **Billing period**: Select **"Monthly"**

3. Click **"Save product"**

4. After saving, copy the **Price ID** (starts with `price_`)
   - ✅ Copy this - this is your **Monthly Retainer Price ID**

---

### **Step 5: Get Webhook Secret (Optional - for advanced testing)**

**Note:** Webhook secret is optional for basic testing. You can test payments without it.

**To get webhook secret:**

1. Install [Stripe CLI](https://stripe.com/docs/stripe-cli)
2. Login: `stripe login`
3. Forward webhooks: `stripe listen --forward-to localhost:8000/api/payments/webhook`
4. Copy the webhook secret (starts with `whsec_`)

**OR** (for production):
1. Go to: **https://dashboard.stripe.com/test/webhooks**
2. Click **"+ Add endpoint"**
3. Enter URL: `https://yourdomain.com/api/payments/webhook`
4. Select events to listen to
5. Copy the webhook secret

**For now, you can skip this** - it's not required for basic testing.

---

## 📋 What You Should Have Now

After completing the steps above, you should have:

1. ✅ **Publishable Key**: `pk_test_...`
2. ✅ **Secret Key**: `sk_test_...`
3. ✅ **Setup Price ID**: `price_...`
4. ✅ **Monthly Retainer Price ID**: `price_...`
5. ⚠️ **Webhook Secret**: `whsec_...` (optional)

---

## 🔧 Where to Put These Keys

### **Frontend (`.env.local` in project root):**

Create file: `.env.local` (in the root folder, same level as `package.json`)

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_KEY_HERE
NEXT_PUBLIC_STRIPE_SETUP_PRICE_ID=price_YOUR_ACTUAL_PRICE_ID_HERE
NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID=price_YOUR_ACTUAL_PRICE_ID_HERE
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

**Replace:**
- `pk_test_YOUR_ACTUAL_KEY_HERE` with your actual Publishable Key
- `price_YOUR_ACTUAL_PRICE_ID_HERE` with your actual Price IDs

### **Backend (`backend/.env`):**

Add to `backend/.env`:

```env
STRIPE_SECRET_KEY=sk_test_YOUR_ACTUAL_KEY_HERE
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_KEY_HERE
FRONTEND_URL=http://localhost:3000
STRIPE_WEBHOOK_SECRET=whsec_YOUR_ACTUAL_SECRET_HERE
```

**Replace:**
- `sk_test_YOUR_ACTUAL_KEY_HERE` with your actual Secret Key
- `whsec_YOUR_ACTUAL_SECRET_HERE` with your webhook secret (or leave empty for now)

---

## 🎯 Quick Reference Links

- **API Keys**: https://dashboard.stripe.com/test/apikeys
- **Products**: https://dashboard.stripe.com/test/products
- **Webhooks**: https://dashboard.stripe.com/test/webhooks
- **Payments (to see test payments)**: https://dashboard.stripe.com/test/payments

---

## ⚠️ Important Notes

1. **Always use TEST keys** for development
   - Publishable: `pk_test_...`
   - Secret: `sk_test_...`

2. **Never commit keys to Git**
   - `.env` and `.env.local` should be in `.gitignore`
   - Never share keys publicly

3. **Test mode is free**
   - No charges
   - No credit card needed
   - Perfect for testing

4. **For production later:**
   - Switch to Live mode
   - Get Live keys (start with `pk_live_` and `sk_live_`)
   - Update environment variables

---

## ✅ Verification Checklist

After adding keys:

- [ ] Publishable key starts with `pk_test_`
- [ ] Secret key starts with `sk_test_`
- [ ] Setup Price ID starts with `price_`
- [ ] Monthly Price ID starts with `price_`
- [ ] Keys added to `.env.local` (frontend)
- [ ] Keys added to `backend/.env` (backend)
- [ ] No extra spaces or quotes around keys
- [ ] Servers restarted after adding keys

---

## 🧪 Test It Works

1. Restart both servers:
   ```bash
   # Frontend
   npm run dev
   
   # Backend
   cd backend
   python manage.py runserver
   ```

2. Go to: http://localhost:3000/pricing

3. Click "Get Started" on any plan

4. If Stripe Checkout opens → ✅ Keys are working!

5. If you see errors → Check:
   - Keys are correct
   - No extra spaces
   - Servers restarted
   - Check browser console for errors

---

## 🆘 Troubleshooting

### **"Stripe not configured" error:**
- Check `STRIPE_SECRET_KEY` is in `backend/.env`
- Restart backend server

### **"Price ID is required" error:**
- Check Price IDs are in `.env.local`
- Check Price IDs are correct (start with `price_`)
- Restart frontend server

### **"Invalid API Key" error:**
- Check you're using TEST keys (not live keys)
- Check keys are copied correctly (no spaces)
- Verify keys in Stripe Dashboard

---

## 📞 Need Help?

1. Check Stripe Dashboard → Logs for errors
2. Verify keys in: https://dashboard.stripe.com/test/apikeys
3. Make sure you're in **Test Mode**
4. Check all environment variables are set correctly

---

**That's it! You now have everything you need to test Stripe!** 🎉

