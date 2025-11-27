# 📧 How to Add Leads & Email Automation Works

## ✅ Where to Add Leads

### **Option 1: From the Leads Page (Easiest)**
1. Go to **"Leads"** in the left sidebar
2. Click the **"Create Lead"** button (green button at the top right)
3. Fill in the form:
   - **Name** * (required)
   - **Email** * (required) - This is where the automation email will be sent!
   - **Phone** (optional)
   - **Source** (where the lead came from)
   - **Notes** (optional)
4. Click **"Create Lead"**

### **Option 2: Sync from CRM**
1. Go to **"Leads"** page
2. Click **"Sync CRM"** button
3. Leads will be imported from your CRM (SimplyBook.me)

---

## 🤖 How Email Automation Works

### **Automatic Flow:**

```
1. You Create a Lead
   ↓
2. System Detects New Lead (Automatic Signal)
   ↓
3. Finds "Welcome New Leads" Automation
   ↓
4. AI Generates Personalized Welcome Message
   ↓
5. Email is Sent via Gmail SMTP
   ↓
6. Lead Receives Welcome Email! ✉️
```

### **What Happens Automatically:**

1. **When you create a lead:**
   - ✅ "Welcome New Leads" automation triggers automatically
   - ✅ AI generates a personalized welcome message
   - ✅ Email is sent to the lead's email address
   - ✅ Message is logged in your system
   - ✅ Activity is recorded in Audit History

2. **Email Details:**
   - **From:** `dhomejapiru@gmail.com` (your Gmail)
   - **To:** The lead's email address
   - **Subject:** "Message from Infinite Base Agent"
   - **Content:** AI-generated personalized welcome message

---

## 📋 Your Enabled Automations

1. **Welcome New Leads** ✅
   - Triggers: When a new lead is created
   - Channel: Email
   - Action: Sends welcome email immediately

2. **Follow-up After 3 Days** ✅
   - Triggers: If lead hasn't been contacted in 3 days
   - Channel: Email
   - Action: Sends follow-up email

3. **Follow-up After 7 Days** ✅
   - Triggers: If lead hasn't been contacted in 7 days
   - Channel: Email
   - Action: Sends follow-up email

---

## 🧪 Test It Now!

1. **Create a test lead:**
   - Go to Leads page
   - Click "Create Lead"
   - Enter:
     - Name: "Test User"
     - Email: **Your own email** (to test)
     - Source: "Website"
   - Click "Create Lead"

2. **Check your email:**
   - Within a few seconds, you should receive a welcome email
   - Check your inbox (and spam folder)

3. **Verify in the app:**
   - Go to **"Conversations"** page
   - You should see the conversation with the test lead
   - Go to **"Audit History"** to see the automation activity

---

## 🔍 Where to See Automation Activity

1. **Messages:**
   - Go to **"Conversations"** page
   - See all sent/received messages

2. **Audit History:**
   - Go to **"Audit History"** in sidebar
   - See all automation runs and activities

3. **Leads Page:**
   - See the lead status and details
   - Click on a lead to see full conversation

---

## ⚙️ Email Configuration

Your email is configured with:
- **SMTP:** Gmail (smtp.gmail.com)
- **Email:** dhomejapiru@gmail.com
- **Status:** ✅ Ready to send emails

**Note:** Make sure your Django server is running for automations to work!

---

## 🎯 Quick Summary

1. **Add Lead** → Leads page → "Create Lead" button
2. **Automation Triggers** → Automatically when lead is created
3. **Email Sent** → To the lead's email address
4. **Check Results** → Conversations page or Audit History

**That's it! The AI automation works automatically! 🚀**

