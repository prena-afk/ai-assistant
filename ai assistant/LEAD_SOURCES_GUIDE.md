# 📥 Lead Sources Guide

## Overview

Your leads can come from **4 different sources**. All leads are stored in the same database and work the same way!

---

## 1. 📝 Manual Creation

### When to Use:
- Creating a single lead
- Quick entry
- One-off leads

### How:
1. Go to **Leads Tab**
2. Click **"+ Create Lead"**
3. Fill in the form
4. Click **"Create Lead"**

### Features:
- ✅ Instant creation
- ✅ Can send follow-up email immediately
- ✅ AI-generated follow-up emails
- ✅ Full control over data

---

## 2. 🔄 CRM Integration (SimplyBook.me)

### When to Use:
- You already use SimplyBook.me
- Want to sync existing clients
- Need two-way sync

### Setup:
1. Go to **Settings Tab**
2. Find **"CRM Integration"** section
3. Enter your **SimplyBook.me API key**
4. Click **"Connect CRM"**

### Sync:
1. Go to **Leads Tab**
2. Click **"Sync CRM"** button
3. Wait for sync to complete
4. ✅ Leads imported!

### What Gets Synced:
- ✅ **Clients** → Leads
- ✅ **Bookings** → Bookings
- ✅ **Two-way sync** - System ↔ CRM

### Features:
- ✅ Automatic deduplication (by email)
- ✅ Incremental sync (only changes)
- ✅ Error reporting
- ✅ Last sync timestamp

---

## 3. 📊 Data Upload (Excel/CSV/Google Sheets)

### When to Use:
- Large lists of leads
- Migrating from another system
- Bulk import
- One-time imports

### File Formats Supported:
- ✅ **Excel** (.xlsx)
- ✅ **CSV** (.csv)
- ✅ **Google Sheets** (export as CSV)

### Required Columns:
- `Name` (or `name`, `Full Name`)
- `Email` (or `email`, `Email Address`)

### Optional Columns:
- `Phone` (or `phone`, `Phone Number`)
- `Source` (or `source`, `Lead Source`)
- `Notes` (or `notes`, `Comments`)
- `Status` (or `status`)
- `Service Type` (or `service_type`)

### Example File:

**Excel/CSV Format:**
```csv
Name,Email,Phone,Source,Notes
John Doe,john@example.com,123-456-7890,Website,Interested in coaching
Jane Smith,jane@example.com,098-765-4321,Referral,Follow up next week
Bob Johnson,bob@example.com,555-1234,Email Campaign,Requested info
```

### How to Upload:
1. Prepare your file with required columns
2. Go to **Leads Tab**
3. Click **"Upload Leads"** button
4. Select your file
5. Review preview (first 10 rows)
6. Click **"Import Leads"**
7. ✅ Leads imported!

### Features:
- ✅ Auto-detects column names
- ✅ Validates data
- ✅ Skips duplicates (by email)
- ✅ Batch import (processes all at once)
- ✅ Error reporting (shows failed rows)
- ✅ Preview before import

---

## 4. 💾 Database (Existing Leads)

### When to Use:
- Viewing existing leads
- Leads already in system
- No action needed!

### How:
1. Go to **Leads Tab**
2. ✅ All your leads are there!
3. Leads are loaded from database automatically

### Features:
- ✅ Instant loading
- ✅ Cached in localStorage
- ✅ Persists on refresh
- ✅ Filter and search

---

## 📊 Lead Source Comparison

| Feature | Manual | CRM Sync | File Upload | Database |
|---------|--------|----------|-------------|----------|
| **Speed** | Fast | Medium | Fast | Instant |
| **Best For** | Single leads | Existing CRM | Large lists | Viewing |
| **Automation** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **Deduplication** | Manual | ✅ Auto | ✅ Auto | N/A |
| **Two-way Sync** | ❌ No | ✅ Yes | ❌ No | N/A |
| **Bulk Import** | ❌ No | ✅ Yes | ✅ Yes | N/A |

---

## 🔄 What Happens After Import?

**Regardless of source, all leads follow the same flow:**

```
LEAD CREATED/IMPORTED
        ↓
SAVED TO DATABASE
  (with source tracking)
        ↓
AUTOMATION TRIGGERS
  (Welcome email sent)
        ↓
MESSAGE CREATED
  (Conversation started)
        ↓
CONVERSATION APPEARS
  (In Conversations Tab)
```

---

## 📋 Source Tracking

Each lead has a `source` field showing where it came from:

| Source | Description |
|--------|-------------|
| `"Website"` | Manually created |
| `"SimplyBook.me"` | Synced from CRM |
| `"Upload"` | Imported from file |
| `"Referral"` | From referral |
| `"Email Campaign"` | From email campaign |
| Custom | User-defined |

You can filter leads by source in the Leads Tab!

---

## 💡 Best Practices

### **For New Users:**
1. Start with **manual creation** to test
2. Then **sync CRM** if you have one
3. Or **upload file** if you have a list

### **For Existing Users:**
1. **Sync CRM** regularly (weekly/daily)
2. **Upload files** for one-time imports
3. **Manual creation** for new leads

### **For Large Lists:**
1. Use **file upload** (faster)
2. Or **CRM sync** (if in CRM)
3. Avoid manual creation (too slow)

---

## ✅ Summary

- **4 ways** to get leads into the system
- **All leads** work the same way
- **Automation** works for all sources
- **Source tracking** shows where each lead came from
- **Choose the method** that works best for you!

---

## 🚀 Quick Start

1. **Try manual creation** first (easiest)
2. **Sync CRM** if you have SimplyBook.me
3. **Upload file** if you have a list
4. **View all leads** in Leads Tab

That's it! All leads are automatically processed the same way! 🎉

