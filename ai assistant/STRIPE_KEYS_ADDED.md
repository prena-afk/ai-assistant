# ✅ Stripe Keys - Setup Instructions

## 🎯 What I've Done

I've created template files with your Stripe keys. Here's what you need to do:

---

## 📝 Step 1: Create Frontend .env.local File

1. **Create a new file** in the project root (same folder as `package.json`)
2. **Name it**: `.env.local`
3. **Copy the contents** from `ENV_LOCAL_TEMPLATE.txt`
4. **Save the file**

**OR** manually create `.env.local` with:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51RJ9TqIXljbVNKiT1KRkONB9dRiBtmL9EDBvEUv8aF2PRGHWrKNMdjL7sCfjGJ5t33NjTdvrLRar9OZ7Jk59rqlh00pC4cUEmL
NEXT_PUBLIC_STRIPE_SETUP_PRICE_ID=price_YOUR_SETUP_PRICE_ID_HERE
NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID=price_YOUR_MONTHLY_PRICE_ID_HERE
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

---

## 📝 Step 2: Add Keys to Backend .env

1. **Open**: `backend/.env`
2. **Add these lines** (or copy from `BACKEND_ENV_STRIPE_KEYS.txt`):

```env
STRIPE_SECRET_KEY=sk_test_51RJ9TqIXljbVNKiTL961YRQ00mU1w3CW5s64r2EZqMU3MISDS1Ir3wqA6QB0GlZZLmY4MtTMRBqRSD4CeVvxKdhY00XUXXMUwk
STRIPE_PUBLISHABLE_KEY=pk_test_51RJ9TqIXljbVNKiT1KRkONB9dRiBtmL9EDBvEUv8aF2PRGHWrKNMdjL7sCfjGJ5t33NjTdvrLRar9OZ7Jk59rqlh00pC4cUEmL
FRONTEND_URL=http://localhost:3000
```

3. **Save the file**

---

## ⚠️ Step 3: Create Products & Get Price IDs

You still need to create products in Stripe to get Price IDs:

### **A. Create Setup Product**

1. Go to: **https://dashboard.stripe.com/test/products**
2. Click **"+ Add product"**
3. Fill in:
   - **Name**: `Setup`
   - **Pricing**: `One time`
   - **Price**: `1000.00 USD`
4. Click **"Save product"**
5. **Copy the Price ID** (starts with `price_`)
6. Replace `price_YOUR_SETUP_PRICE_ID_HERE` in `.env.local`

### **B. Create Monthly Retainer Product**

1. Click **"+ Add product"** again
2. Fill in:
   - **Name**: `Monthly Retainer`
   - **Pricing**: `Recurring`
   - **Price**: `400.00 USD`
   - **Billing period**: `Monthly`
3. Click **"Save product"**
4. **Copy the Price ID** (starts with `price_`)
5. Replace `price_YOUR_MONTHLY_PRICE_ID_HERE` in `.env.local`

---

## 🔄 Step 4: Restart Servers

After adding all keys:

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

## 🧪 Step 5: Test

1. Go to: **http://localhost:3000/pricing**
2. You should see the pricing page
3. Click **"Get Started"** on Setup or Monthly Retainer
4. Should open Stripe Checkout
5. Use test card: `4242 4242 4242 4242`
6. Complete payment
7. ✅ Should redirect to success page!

---

## ✅ Summary

**Keys Added:**
- ✅ Publishable Key: `pk_test_51RJ9TqIXljbVNKiT1KRkONB9dRiBtmL9EDBvEUv8aF2PRGHWrKNMdjL7sCfjGJ5t33NjTdvrLRar9OZ7Jk59rqlh00pC4cUEmL`
- ✅ Secret Key: `sk_test_51RJ9TqIXljbVNKiTL961YRQ00mU1w3CW5s64r2EZqMU3MISDS1Ir3wqA6QB0GlZZLmY4MtTMRBqRSD4CeVvxKdhY00XUXXMUwk`

**Still Need:**
- ⚠️ Create products in Stripe Dashboard
- ⚠️ Get Price IDs
- ⚠️ Add Price IDs to `.env.local`

**Files Created:**
- `ENV_LOCAL_TEMPLATE.txt` - Frontend keys template
- `BACKEND_ENV_STRIPE_KEYS.txt` - Backend keys template
- `ADD_STRIPE_KEYS_TO_BACKEND.md` - Instructions

---

## 🎯 Quick Checklist

- [ ] Created `.env.local` with Publishable Key
- [ ] Added Secret Key to `backend/.env`
- [ ] Created Setup product in Stripe
- [ ] Created Monthly Retainer product in Stripe
- [ ] Added Price IDs to `.env.local`
- [ ] Restarted both servers
- [ ] Tested pricing page
- [ ] Tested checkout

---

**You're almost there! Just need to create the products and add Price IDs!** 🚀

