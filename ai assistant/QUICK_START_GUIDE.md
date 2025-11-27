# 🚀 Quick Start Guide

## Step-by-Step: How to Use the App

### 1. **Login/Register**
```
1. Go to app
2. Enter email and password
3. Click "Login" or "Register"
4. You're in! ✅
```

### 2. **Get Leads (4 Ways)**

#### **Option A: Create Manually**
```
1. Go to "Leads" tab
2. Click "+ Create Lead" button
3. Fill in:
   - Name: "John Doe"
   - Email: "john@example.com"
   - Phone: (optional)
   - Source: "Website"
4. Click "Create Lead"
5. ✅ Lead appears in Leads Tab!
```

#### **Option B: Sync from CRM**
```
1. Go to "Settings" tab
2. Find "CRM Integration" section
3. Enter SimplyBook.me API key
4. Click "Connect CRM"
5. Go to "Leads" tab
6. Click "Sync CRM" button
7. ✅ Leads imported from CRM!
```

#### **Option C: Upload File (Excel/CSV)**
```
1. Prepare Excel/CSV file with columns:
   - Name, Email (required)
   - Phone, Source, Notes (optional)
2. Go to "Leads" tab
3. Click "Upload Leads" button
4. Select your file
5. Review preview
6. Click "Import Leads"
7. ✅ Leads imported from file!
```

#### **Option D: View Existing Leads**
```
1. Go to "Leads" tab
2. ✅ All your leads are already there!
3. Leads are loaded from database
```

### 3. **See the Magic Happen**
```
1. Wait 5-10 seconds
2. Go to "Conversations" tab
3. ✅ Conversation appears!
4. Click on it to see the welcome email
```

### 4. **Send a Message**
```
1. Go to "Conversations" tab
2. Click on a conversation
3. Type your message
4. Click "Send"
5. ✅ Message sent!
```

### 5. **Use AI Suggestions**
```
1. In Conversations tab
2. Click "AI Suggest" button
3. AI generates response
4. Click "Use Suggestion" or edit it
5. Click "Send"
```

---

## What Happens Automatically:

✅ **When you create a lead:**
- Lead is saved
- Welcome email is sent automatically
- Conversation appears in Conversations tab

✅ **Every 5 seconds:**
- Conversations tab refreshes
- New messages appear automatically

✅ **On page refresh:**
- Leads load from cache immediately
- Fresh data loads in background

---

## Common Tasks:

### **Create Lead with Follow-up Email:**
1. Create lead manually
2. Check "Send follow-up email immediately"
3. Click "AI Generate" (optional)
4. Enter or edit message
5. Click "Create Lead"
6. ✅ Lead created + Email sent!

### **Import Leads from CRM:**
1. Go to Settings → CRM Integration
2. Enter SimplyBook.me API key
3. Click "Connect CRM"
4. Go to Leads tab
5. Click "Sync CRM"
6. ✅ Leads imported + Welcome emails sent!

### **Upload Leads from Excel:**
1. Prepare Excel file with Name and Email columns
2. Go to Leads tab
3. Click "Upload Leads"
4. Select file
5. Review and import
6. ✅ Leads imported + Welcome emails sent!

### **View Conversation:**
1. Go to Conversations tab
2. Click on any conversation
3. See all messages
4. Reply or use AI suggestions

### **Edit Lead:**
1. Go to Leads tab
2. Click on a lead
3. Click "Edit"
4. Update information
5. Save

---

## Tips:

💡 **Leads Tab** = All your contacts (from all sources)
💡 **Conversations Tab** = Only people you've talked to
💡 **AI Suggest** = Get help writing messages
💡 **Auto-refresh** = New messages appear automatically
💡 **CRM Sync** = Keep leads in sync with your CRM
💡 **File Upload** = Import large lists quickly
💡 **Source Tracking** = See where each lead came from

---

## Troubleshooting:

❓ **Leads disappear on refresh?**
- Check browser console for errors
- Check if localStorage is enabled

❓ **No conversations showing?**
- Wait a few seconds (auto-refresh every 5s)
- Check if messages were created (backend logs)
- Check browser console for errors

❓ **Automation not working?**
- Check Settings → Automations
- Make sure "Welcome New Leads" is enabled
- Check backend logs for errors

---

## That's It! 🎉

You're ready to use the app. Start by creating a lead and watch the automation work!
