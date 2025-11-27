# 🔍 File Upload Debugging Guide

## ✅ What I Fixed

1. **FormData Upload** - Removed Content-Type header (browser sets it automatically with boundary)
2. **Better Error Handling** - Added detailed error messages
3. **Console Logging** - Added extensive logging on both frontend and backend
4. **Error Display** - Shows errors in the UI

## 🐛 How to Debug

### **Step 1: Open Browser Console**
1. Press `F12` or right-click → Inspect
2. Go to **Console** tab
3. Keep it open while uploading

### **Step 2: Try Upload**
1. Go to **Leads Tab**
2. Click **"Upload Leads"**
3. Select a CSV or Excel file
4. Watch the console for messages

### **Step 3: Check Console Messages**

You should see messages like:
```
[Upload] File selected: File {name: "sample_leads.csv", ...}
[Upload] File extension: .csv
[Upload] File is valid, setting upload file
[Upload] Starting upload for file: sample_leads.csv
[API] Starting file upload: sample_leads.csv
[API] Making request to: http://localhost:8000/api/leads/upload
[API] Response status: 200 OK
[Upload] API response received: {success: true, ...}
```

### **Step 4: Check for Errors**

If you see errors, they will tell you what's wrong:

#### **Error: "No file provided"**
- File input not working
- Check if file is actually selected
- Check console for `[Upload] File selected:` message

#### **Error: "No authentication token found"**
- You're not logged in
- Log out and log back in
- Check localStorage for 'token'

#### **Error: "Server error: 404"**
- Backend endpoint not found
- Check if backend is running
- Check URL: `http://localhost:8000/api/leads/upload`

#### **Error: "Server error: 500"**
- Backend error
- Check backend console/logs
- Check if openpyxl is installed: `pip install openpyxl`

#### **Error: "CORS" or "Network"**
- Backend not running
- CORS issue
- Check backend is running on port 8000

## 🔧 Common Issues & Fixes

### **Issue 1: File Not Appearing After Selection**

**Check:**
- Console for `[Upload] File selected:` message
- File input `onChange` is firing
- File state is being set

**Fix:**
- Make sure file has valid extension (.csv, .xlsx, .xls)
- Check browser console for errors

### **Issue 2: Upload Button Does Nothing**

**Check:**
- Console for `[Upload] Starting upload` message
- File is selected (uploadFile is not null)
- Network tab shows request being sent

**Fix:**
- Make sure file is selected before clicking upload
- Check console for errors

### **Issue 3: "Failed to upload" Error**

**Check:**
- Backend is running: `python manage.py runserver`
- Backend logs show the request
- Network tab shows response

**Fix:**
- Check backend console for errors
- Verify endpoint exists: `/api/leads/upload`
- Check authentication token

### **Issue 4: File Uploads But Nothing Happens**

**Check:**
- Console for `[API] Response status: 200`
- Response contains `success: true`
- Leads list refreshes

**Fix:**
- Check if leads are actually created in database
- Check backend logs for processing errors
- Verify CSV format is correct

## 📋 Testing Checklist

- [ ] Backend is running (`python manage.py runserver`)
- [ ] Frontend is running (`npm run dev`)
- [ ] You're logged in (check localStorage for token)
- [ ] File has valid extension (.csv, .xlsx, .xls)
- [ ] File is not empty
- [ ] CSV has headers (Name, Email)
- [ ] Browser console is open (F12)
- [ ] Network tab shows request

## 🧪 Test with Sample File

1. Generate sample CSV:
   ```bash
   cd backend
   python manage.py generate_sample_csv --count 10
   ```

2. Upload `sample_leads.csv` from backend folder

3. Check console for all messages

4. Check if leads appear in Leads Tab

## 📞 What to Report

If it still doesn't work, please provide:

1. **Console Messages** - Copy all `[Upload]` and `[API]` messages
2. **Network Tab** - Screenshot of the request/response
3. **Backend Logs** - Any error messages from Django
4. **File Details** - File name, size, type
5. **Browser** - Which browser you're using

## 🎯 Quick Test

1. Open browser console (F12)
2. Go to Leads Tab
3. Click "Upload Leads"
4. Select `backend/sample_leads.csv`
5. Watch console
6. Click "Import Leads"
7. Check console for errors

**If you see errors in console, copy them and share!**

