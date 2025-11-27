# 🔍 Stripe Checkout Error Debugging

## Error: "Failed to start checkout"

This guide will help you debug the Stripe checkout error.

---

## ✅ Step 1: Check Backend is Running

**Open a new terminal and run:**
```bash
cd backend
python manage.py runserver
```

**Expected output:**
```
Starting development server at http://127.0.0.1:8000/
```

**If backend is NOT running:**
- Start it now
- Wait for "Starting development server..." message
- Then try checkout again

---

## ✅ Step 2: Check Browser Console

1. **Open Browser Console:**
   - Press `F12` (or `Ctrl+Shift+I`)
   - Click "Console" tab

2. **Click "Get Started" again**

3. **Look for error messages:**
   - Red error messages will show the actual problem
   - Look for messages like:
     - `Network error`
     - `Failed to fetch`
     - `CORS error`
     - `Server error: 500`
     - `Stripe not configured`

4. **Copy the error message** and share it

---

## ✅ Step 3: Test Backend API Directly

**Open browser console (F12) and run:**

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
.then(data => {
  console.log('✅ Success:', data);
  if(data.url) {
    console.log('Checkout URL:', data.url);
    window.open(data.url); // Open in new tab
  }
})
.catch(err => {
  console.error('❌ Error:', err);
  alert('Error: ' + err.message);
});
```

**What to look for:**
- ✅ **Success**: You'll see `{id: "cs_test_...", url: "https://checkout.stripe.com/..."}`
- ❌ **Error**: You'll see an error message

---

## ✅ Step 4: Common Issues & Fixes

### **Issue 1: "Failed to fetch" or "Network error"**
**Problem:** Backend is not running or not accessible

**Fix:**
1. Make sure backend is running: `python manage.py runserver`
2. Check URL: Should be `http://localhost:8000`
3. Try accessing: http://localhost:8000/admin (should show Django admin)

---

### **Issue 2: "CORS error"**
**Problem:** Backend is blocking requests from frontend

**Fix:**
1. Check if `django-cors-headers` is installed
2. Check `settings.py` has CORS settings
3. Add to `settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]
```

---

### **Issue 3: "Stripe not configured"**
**Problem:** Stripe keys missing in backend `.env`

**Fix:**
1. Check `backend/.env` has:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```
2. Restart backend server after adding keys

---

### **Issue 4: "Price ID is required" or "Invalid price ID"**
**Problem:** Price ID not found in Stripe

**Fix:**
1. Check frontend `.env.local` has:
   ```
   NEXT_PUBLIC_STRIPE_SETUP_PRICE_ID=price_1SXGORIXIjbVNKiTosknZaMi
   NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID=price_1SXGpfIXljbVNKiTzY91estp
   ```
2. Restart frontend server: `npm run dev`

---

### **Issue 5: "Server error: 500"**
**Problem:** Backend has an error

**Fix:**
1. Check backend terminal for error messages
2. Look for Python traceback
3. Common causes:
   - Stripe key wrong
   - Missing environment variable
   - Python package not installed (`stripe`)

---

## ✅ Step 5: Verify Environment Variables

**Frontend `.env.local`:**
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_STRIPE_SETUP_PRICE_ID=price_1SXGORIXIjbVNKiTosknZaMi
NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID=price_1SXGpfIXljbVNKiTzY91estp
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

**Backend `.env`:**
```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
FRONTEND_URL=http://localhost:3000
```

---

## 🎯 Quick Test Checklist

- [ ] Backend server running (`python manage.py runserver`)
- [ ] Frontend server running (`npm run dev`)
- [ ] Both `.env` files have Stripe keys
- [ ] Browser console shows no CORS errors
- [ ] Test API directly in browser console (see Step 3)

---

## 📞 Still Not Working?

1. **Check browser console (F12)** - Copy the exact error
2. **Check backend terminal** - Look for error messages
3. **Share the error messages** so we can fix it!

---

## ✅ Expected Success Flow

1. Click "Get Started" → Button shows "Processing..."
2. Browser console shows: "Creating checkout session..."
3. Browser console shows: "Checkout session created: {id: '...', url: '...'}"
4. Redirects to Stripe Checkout page ✅

If you see this flow, Stripe is working! 🎉

