# 📧 How to Get Gmail App Password - Step by Step Guide

## Step 1: Go to Security Settings
1. In the left sidebar, click on **"Security"** (not "Data & privacy")
2. Or go directly to: https://myaccount.google.com/security

## Step 2: Enable 2-Step Verification (Required First!)
**Important:** You MUST have 2-Step Verification enabled before you can create App Passwords.

1. On the Security page, look for **"2-Step Verification"**
2. If it says "Off", click on it and enable it
3. Follow the steps to set up 2-Step Verification (you'll need your phone)

## Step 3: Create App Password
Once 2-Step Verification is enabled:

1. On the Security page, scroll down to find **"App passwords"**
   - It should be below "2-Step Verification"
   - If you don't see it, make sure 2-Step Verification is ON

2. Click on **"App passwords"**

3. You'll see a page with:
   - A dropdown to select app: Choose **"Mail"**
   - A dropdown to select device: Choose **"Other (Custom name)"**
   - Enter name: Type **"Infinite Base Agent"** or any name you like
   - Click **"Generate"**

4. Google will show you a 16-character password like: `abcd efgh ijkl mnop`
   - **Copy this password immediately** (you won't see it again!)
   - Remove the spaces when adding to .env file

## Step 4: Add to Your .env File
Open `backend/.env` and add:

```env
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=abcdefghijklmnop
DEFAULT_FROM_EMAIL=your-email@gmail.com
```

Replace:
- `your-email@gmail.com` with your actual Gmail address
- `abcdefghijklmnop` with the 16-character app password (no spaces)

## Alternative: Direct Links

**Security Page:** https://myaccount.google.com/security

**App Passwords (direct):** https://myaccount.google.com/apppasswords

**Note:** The App Passwords link only works if 2-Step Verification is enabled!

## Troubleshooting

**If you don't see "App passwords":**
- ✅ Make sure 2-Step Verification is enabled
- ✅ Try refreshing the page
- ✅ Make sure you're using a personal Gmail account (not a Google Workspace account)

**If you have a Google Workspace account:**
- You may need to enable "Less secure app access" in your admin console
- Or contact your administrator

