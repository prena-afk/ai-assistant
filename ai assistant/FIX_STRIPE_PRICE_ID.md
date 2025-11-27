# 🔧 Fix: "No such price" Error

## ❌ Problem

The error `No such price: 'price_1SXGORIXIjbVNKiTosknZaMi'` means:
- The Price ID doesn't exist in your Stripe account
- OR it was deleted
- OR you're using the wrong Stripe account (test vs live)

---

## ✅ Solution: Get Correct Price IDs from Stripe

### **Step 1: Go to Stripe Dashboard**

1. Open: https://dashboard.stripe.com/test/products
2. Make sure you're in **Test mode** (toggle in top right)

### **Step 2: Find Your Products**

You should see:
- **Setup** product
- **Monthly Retainer** product

### **Step 3: Get Price ID for Each Product**

**For Setup Product:**
1. Click on **"Setup"** product
2. Look for **"Pricing"** section
3. Find the price (should be $1000.00)
4. Click on the price or look in the **"Events"** section
5. Copy the Price ID (starts with `price_`)

**For Monthly Retainer Product:**
1. Click on **"Monthly Retainer"** product
2. Look for **"Pricing"** section
3. Find the price (should be $400.00/month)
4. Click on the price or look in the **"Events"** section
5. Copy the Price ID (starts with `price_`)

### **Step 4: Update .env.local File**

1. Open `.env.local` in your project root
2. Replace the Price IDs with the correct ones:

```env
NEXT_PUBLIC_STRIPE_SETUP_PRICE_ID=price_YOUR_NEW_SETUP_PRICE_ID
NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID=price_YOUR_NEW_MONTHLY_PRICE_ID
```

3. Save the file
4. **Restart your frontend server:**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

---

## 🔍 Alternative: Check Events Section

If you can't find the Price ID in the product page:

1. Go to the product page
2. Scroll down to **"Events"** section
3. Look for: **"A new price called price_XXX was created"**
4. Copy that Price ID

---

## ✅ Quick Check: Verify Price IDs

**In Stripe Dashboard:**
1. Go to: https://dashboard.stripe.com/test/prices
2. You should see all your prices listed
3. Find the ones for "Setup" and "Monthly Retainer"
4. Copy the Price IDs (they're in the first column)

---

## 🎯 After Updating

1. Update `.env.local` with correct Price IDs
2. Restart frontend: `npm run dev`
3. Try "Get Started" again
4. Should work now! ✅

---

## 📝 Example

**Wrong (what you have now):**
```env
NEXT_PUBLIC_STRIPE_SETUP_PRICE_ID=price_1SXGORIXIjbVNKiTosknZaMi  ❌
```

**Correct (what you need):**
```env
NEXT_PUBLIC_STRIPE_SETUP_PRICE_ID=price_1ABC123XYZ789  ✅
```

The Price ID should match exactly what's in your Stripe Dashboard!

