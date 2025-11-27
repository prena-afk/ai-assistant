# 🧪 Stripe Testing Guide - Complete Setup & Testing

## ✅ What's Already Implemented

1. ✅ Pricing page (`/pricing`)
2. ✅ Stripe.js frontend integration
3. ✅ Backend checkout session API
4. ✅ Webhook handler
5. ✅ Success page
6. ✅ Django payments app

---

## 🔧 Step-by-Step Setup

### **Step 1: Install Stripe Python Package**

```bash
cd backend
pip install stripe
```

---

### **Step 2: Get Stripe Test Keys**

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Make sure you're in **Test Mode** (toggle in top right)
3. Copy:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)

---

### **Step 3: Create Stripe Products & Prices**

#### **A. Create Setup Product (One-time $1000)**

1. Go to [Products](https://dashboard.stripe.com/test/products)
2. Click **"+ Add product"**
3. Fill in:
   - **Name**: `Setup`
   - **Description**: `Full onboarding and setup`
   - **Pricing model**: `One time`
   - **Price**: `$1000.00 USD`
4. Click **"Save product"**
5. Copy the **Price ID** (starts with `price_`)

#### **B. Create Monthly Retainer Product (Recurring $400/month)**

1. Click **"+ Add product"**
2. Fill in:
   - **Name**: `Monthly Retainer`
   - **Description**: `Monthly subscription`
   - **Pricing model**: `Recurring`
   - **Price**: `$400.00 USD`
   - **Billing period**: `Monthly`
3. Click **"Save product"**
4. Copy the **Price ID** (starts with `price_`)

---

### **Step 4: Add Environment Variables**

#### **Frontend (`.env.local` in project root):**

Create or edit `.env.local`:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
NEXT_PUBLIC_STRIPE_SETUP_PRICE_ID=price_YOUR_PRICE_ID_HERE
NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID=price_YOUR_PRICE_ID_HERE
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

#### **Backend (`backend/.env`):**

Add to `backend/.env`:
```env
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE
```

**Note:** Webhook secret comes after setting up webhook (Step 7)

---

### **Step 5: Verify Backend Settings**

Check `backend/infinite_base_agent/settings.py` has:
```python
# Stripe Settings
STRIPE_SECRET_KEY = os.getenv('STRIPE_SECRET_KEY', '')
STRIPE_PUBLISHABLE_KEY = os.getenv('STRIPE_PUBLISHABLE_KEY', '')
STRIPE_WEBHOOK_SECRET = os.getenv('STRIPE_WEBHOOK_SECRET', '')
```

✅ Already added!

---

### **Step 6: Restart Servers**

**Frontend:**
```bash
# Stop current server (Ctrl+C)
npm run dev
```

**Backend:**
```bash
cd backend
# Stop current server (Ctrl+C)
python manage.py runserver
```

---

### **Step 7: Set Up Webhook (Optional for Testing)**

For local testing, you can skip webhooks initially. For production:

1. Install [Stripe CLI](https://stripe.com/docs/stripe-cli)
2. Login: `stripe login`
3. Forward webhooks: `stripe listen --forward-to localhost:8000/api/payments/webhook`
4. Copy the webhook secret (starts with `whsec_`)
5. Add to `backend/.env`

---

## 🧪 Testing Steps

### **Test 1: Check Environment Variables**

**Frontend:**
1. Go to `http://localhost:3000/pricing`
2. Open browser console (F12)
3. Check for errors about missing keys

**Backend:**
1. Check Django console for: `[Settings] Loaded .env from: ...`
2. No errors about Stripe

---

### **Test 2: Test Pricing Page Loads**

1. Go to `http://localhost:3000/pricing`
2. You should see:
   - ✅ Three pricing cards
   - ✅ Setup: $1000
   - ✅ Monthly Retainer: $400/month
   - ✅ Enterprise: Custom
3. No console errors

---

### **Test 3: Test Checkout Session Creation**

1. Open browser console (F12)
2. Go to `http://localhost:3000/pricing`
3. Click **"Get Started"** on Setup or Monthly Retainer
4. Watch console for:
   - ✅ API call to `/api/payments/create-checkout-session`
   - ✅ Response with session ID
   - ✅ Redirect to Stripe Checkout

**If error:**
- Check backend console for error message
- Verify `STRIPE_SECRET_KEY` is set
- Verify Price IDs are correct

---

### **Test 4: Test Stripe Checkout**

1. Click **"Get Started"** on any plan
2. Should redirect to Stripe Checkout page
3. Use test card:
   - **Card number**: `4242 4242 4242 4242`
   - **Expiry**: Any future date (e.g., `12/25`)
   - **CVC**: Any 3 digits (e.g., `123`)
   - **ZIP**: Any 5 digits (e.g., `12345`)
4. Click **"Pay"**
5. Should redirect to `/checkout/success`

**If error:**
- Check Stripe Dashboard → Payments for error
- Verify Price IDs are correct
- Check backend console for errors

---

### **Test 5: Test Success Page**

1. After payment, should see success page
2. URL: `http://localhost:3000/checkout/success?session_id=cs_test_...`
3. Should show:
   - ✅ Green checkmark
   - ✅ "Payment Successful!" message
   - ✅ "Go to Dashboard" button

---

### **Test 6: Verify Payment in Stripe Dashboard**

1. Go to [Stripe Dashboard → Payments](https://dashboard.stripe.com/test/payments)
2. Should see your test payment
3. Status: **Succeeded**

---

## 🔍 Debugging Checklist

### **If Pricing Page Doesn't Load:**

- [ ] Check `.env.local` exists in project root
- [ ] Check `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set
- [ ] Restart frontend server
- [ ] Check browser console for errors

### **If Checkout Doesn't Open:**

- [ ] Check backend is running on port 8000
- [ ] Check `STRIPE_SECRET_KEY` in `backend/.env`
- [ ] Check Price IDs are correct
- [ ] Check backend console for errors
- [ ] Check browser console for API errors
- [ ] Verify CORS is configured (should be already)

### **If Payment Fails:**

- [ ] Check you're using test keys (not live keys)
- [ ] Check Price IDs match Stripe Dashboard
- [ ] Check test card number is correct
- [ ] Check Stripe Dashboard for error details

### **If Webhook Doesn't Work:**

- [ ] Webhook is optional for basic testing
- [ ] Can test payments without webhook
- [ ] Webhook needed for subscription management

---

## 📋 Quick Test Checklist

```
[ ] Stripe Python package installed
[ ] Stripe test keys obtained
[ ] Products created in Stripe Dashboard
[ ] Price IDs copied
[ ] Frontend .env.local configured
[ ] Backend .env configured
[ ] Servers restarted
[ ] Pricing page loads
[ ] Checkout button works
[ ] Stripe Checkout opens
[ ] Test payment succeeds
[ ] Success page shows
[ ] Payment appears in Stripe Dashboard
```

---

## 🎯 Test Cards

### **Successful Payment:**
- Card: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits

### **Declined Payment:**
- Card: `4000 0000 0000 0002`
- Use to test error handling

### **Requires Authentication:**
- Card: `4000 0025 0000 3155`
- Will show 3D Secure challenge

---

## 🐛 Common Errors & Fixes

### **Error: "Stripe not configured"**
**Fix:** Add `STRIPE_SECRET_KEY` to `backend/.env`

### **Error: "Price ID is required"**
**Fix:** Add Price IDs to `.env.local`:
```
NEXT_PUBLIC_STRIPE_SETUP_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID=price_...
```

### **Error: "Invalid API Key"**
**Fix:** 
- Check you're using test keys (start with `pk_test_` and `sk_test_`)
- Check keys are copied correctly (no extra spaces)

### **Error: "No such price"**
**Fix:**
- Verify Price ID exists in Stripe Dashboard
- Check Price ID is copied correctly
- Make sure you're in Test Mode

### **Error: CORS**
**Fix:** Already configured in `settings.py`, but verify:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

---

## ✅ Success Indicators

You'll know Stripe is working when:

1. ✅ Pricing page loads without errors
2. ✅ "Get Started" button opens Stripe Checkout
3. ✅ Test payment completes successfully
4. ✅ Success page shows after payment
5. ✅ Payment appears in Stripe Dashboard
6. ✅ No errors in browser console
7. ✅ No errors in backend console

---

## 🚀 Next Steps After Testing

Once basic checkout works:

1. **Add Subscription Management**
   - Cancel subscription
   - Upgrade/downgrade plans
   - View subscription status

2. **Handle Webhooks**
   - Update user subscription status
   - Handle payment failures
   - Handle subscription cancellations

3. **Add Billing Dashboard**
   - View invoices
   - Payment history
   - Download receipts

4. **Add User Model Updates**
   - Store subscription status
   - Store customer ID
   - Store subscription ID

---

## 📞 Need Help?

1. Check Stripe Dashboard → Logs for detailed errors
2. Check browser console (F12) for frontend errors
3. Check backend console for API errors
4. Verify all environment variables are set
5. Make sure you're in Test Mode

---

## 🎉 You're Ready!

Once all tests pass, Stripe is fully integrated and working! 🚀

