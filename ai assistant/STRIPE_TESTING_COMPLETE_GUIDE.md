# 🧪 Complete Stripe Testing Guide

## ✅ Backend Status: READY

Your backend is fully configured:
- ✅ Stripe API keys in `.env`
- ✅ Price IDs in `.env`
- ✅ Payment endpoints configured
- ✅ Webhook handler ready

---

## 🚀 Step-by-Step Testing Process

### **Step 1: Start Your Servers**

**Terminal 1 - Backend:**
```bash
cd backend
python manage.py runserver
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

**Expected Output:**
- Backend: `Starting development server at http://127.0.0.1:8000/`
- Frontend: `Ready on http://localhost:3000`

---

### **Step 2: Test Backend API Directly**

**Option A: Using Browser (Quick Test)**
1. Open browser console (F12)
2. Run this JavaScript:
```javascript
fetch('http://localhost:8000/api/payments/create-checkout-session', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    priceId: 'price_1SXGORIXIjbVNKiTosknZaMi',
    planName: 'Setup'
  })
})
.then(r => r.json())
.then(data => console.log('✅ Success:', data))
.catch(err => console.error('❌ Error:', err));
```

**Expected Result:**
```json
{
  "id": "cs_test_...",
  "url": "https://checkout.stripe.com/c/pay/cs_test_..."
}
```

**Option B: Using PowerShell (Windows)**
```powershell
$body = @{
    priceId = "price_1SXGORIXIjbVNKiTosknZaMi"
    planName = "Setup"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/api/payments/create-checkout-session" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

**Expected Result:** Should return a checkout session with `id` and `url`

---

### **Step 3: Test Frontend Pricing Page**

1. **Open Browser:** http://localhost:3000/pricing

2. **Check Console (F12):**
   - Should see: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` loaded
   - No errors about missing Price IDs

3. **Click "Get Started" on Setup Plan:**
   - Should show "Processing..." briefly
   - Should redirect to Stripe Checkout page

4. **If Error Appears:**
   - Check browser console for error messages
   - Check backend terminal for error logs

---

### **Step 4: Complete Test Payment**

**On Stripe Checkout Page:**

1. **Use Test Card:**
   - Card Number: `4242 4242 4242 4242`
   - Expiry: `12/25` (any future date)
   - CVC: `123` (any 3 digits)
   - ZIP: `12345` (any 5 digits)

2. **Click "Pay"**

3. **Expected Result:**
   - ✅ Redirects to: `http://localhost:3000/checkout/success?session_id=cs_test_...`
   - ✅ Success page displays

---

### **Step 5: Verify in Stripe Dashboard**

1. **Go to:** https://dashboard.stripe.com/test/payments
2. **Check:**
   - ✅ New payment appears
   - ✅ Status: **Succeeded**
   - ✅ Amount: $1000.00 (for Setup) or $400.00 (for Monthly)

---

## 🔍 Troubleshooting

### **Error: "Stripe not configured"**
**Solution:**
- Check backend `.env` has `STRIPE_SECRET_KEY`
- Restart backend server

### **Error: "Price ID is required"**
**Solution:**
- Check frontend `.env.local` has Price IDs
- Restart frontend server
- Clear browser cache

### **Error: "Failed to create checkout session"**
**Solution:**
- Check backend terminal for error logs
- Verify Stripe keys are correct (test mode keys)
- Check Price IDs match Stripe Dashboard

### **Error: "CORS error" or "Network error"**
**Solution:**
- Verify backend is running on `http://localhost:8000`
- Verify frontend is running on `http://localhost:3000`
- Check `FRONTEND_URL` in backend `.env`

### **Checkout page doesn't open**
**Solution:**
- Open browser console (F12)
- Check for JavaScript errors
- Verify `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set
- Check network tab for API call to `/api/payments/create-checkout-session`

---

## ✅ Success Checklist

Before testing, verify:
- [ ] Backend server running (`python manage.py runserver`)
- [ ] Frontend server running (`npm run dev`)
- [ ] Backend `.env` has all Stripe keys
- [ ] Frontend `.env.local` has all Price IDs
- [ ] Both servers restarted after adding keys

After testing, verify:
- [ ] Pricing page loads without errors
- [ ] "Get Started" button opens Stripe Checkout
- [ ] Test payment completes successfully
- [ ] Redirects to success page
- [ ] Payment appears in Stripe Dashboard

---

## 🎯 Quick Test Commands

**Test Backend API:**
```bash
curl -X POST http://localhost:8000/api/payments/create-checkout-session \
  -H "Content-Type: application/json" \
  -d '{"priceId":"price_1SXGORIXIjbVNKiTosknZaMi","planName":"Setup"}'
```

**Check Backend Logs:**
- Watch backend terminal for any errors
- Look for: `Payment successful: cs_test_...`

**Check Frontend Console:**
- Open browser DevTools (F12)
- Check Console tab for errors
- Check Network tab for API calls

---

## 📊 What to Look For

### **Backend Terminal (Success):**
```
[INFO] Creating checkout session for plan: Setup
[INFO] Checkout session created: cs_test_...
```

### **Browser Console (Success):**
```
✅ Checkout session created
Redirecting to Stripe...
```

### **Stripe Dashboard (Success):**
- Payment status: **Succeeded**
- Amount: Correct
- Customer: Test customer

---

## 🚨 Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| "Stripe not configured" | Add `STRIPE_SECRET_KEY` to backend `.env` |
| "Price ID missing" | Add Price IDs to frontend `.env.local` |
| CORS error | Check `FRONTEND_URL` in backend `.env` |
| Checkout doesn't open | Check browser console for errors |
| Payment fails | Verify test card details are correct |

---

## 🎉 You're Ready!

Everything is configured. Just:
1. Start both servers
2. Go to `/pricing`
3. Click "Get Started"
4. Complete test payment

Your Stripe integration is ready to go! 🚀

