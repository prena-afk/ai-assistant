# ⚡ Quick Stripe Test

## ✅ Backend Status: READY

All Stripe settings are configured in your backend!

---

## 🚀 Quick Test (3 Steps)

### **1. Start Servers**

**Backend:**
```bash
cd backend
python manage.py runserver
```

**Frontend:**
```bash
npm run dev
```

---

### **2. Test in Browser**

1. Go to: **http://localhost:3000/pricing**
2. Click **"Get Started"** on any plan
3. Should open Stripe Checkout page ✅

---

### **3. Complete Test Payment**

**On Stripe Checkout:**
- Card: `4242 4242 4242 4242`
- Expiry: `12/25`
- CVC: `123`
- ZIP: `12345`
- Click **"Pay"**

**Expected:** Redirects to success page ✅

---

## 🔍 If Something Doesn't Work

### **Check Backend Terminal:**
- Look for errors in red
- Should see: `Creating checkout session...`

### **Check Browser Console (F12):**
- Look for errors in red
- Check Network tab for API calls

### **Common Fixes:**
- Restart both servers
- Clear browser cache
- Check `.env` files have all keys

---

## ✅ Success Indicators

- ✅ Pricing page loads
- ✅ "Get Started" opens Stripe Checkout
- ✅ Test payment completes
- ✅ Redirects to success page

**If all 4 work → Stripe is working! 🎉**

