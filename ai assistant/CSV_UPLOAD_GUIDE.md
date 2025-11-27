# 📊 CSV Upload Guide - Import Leads from File

## 🎯 Overview

Instead of CRM integration, you can now **upload leads from a CSV file**! This is perfect for:
- Importing existing customer lists
- Migrating from other systems
- Bulk adding leads
- Testing with sample data

---

## 📝 Step 1: Generate Sample CSV File

### **Command:**
```bash
cd backend
.\venv\Scripts\Activate.ps1
python manage.py generate_sample_csv --output sample_leads.csv --count 50
```

### **Options:**
- `--output`: File name (default: `sample_leads.csv`)
- `--count`: Number of leads to generate (default: 50)

### **Example:**
```bash
# Generate 100 leads
python manage.py generate_sample_csv --count 100

# Generate with custom filename
python manage.py generate_sample_csv --output my_leads.csv --count 30
```

### **Output:**
- CSV file created in `backend/` directory
- File contains dummy lead data
- Ready to upload!

---

## 📋 Step 2: CSV File Format

### **Required Columns:**
- `Name` (or `name`, `Full Name`)
- `Email` (or `email`, `Email Address`)

### **Optional Columns:**
- `Phone` (or `phone`, `Phone Number`)
- `Source` (or `source`, `Lead Source`)
- `Status` (or `status`) - new, contacted, qualified, converted, lost
- `Service Type` (or `Service Type`) - consultation, coaching, therapy, session, workshop, other
- `Notes` (or `notes`, `Comments`)
- `Price` (or `price`) - numeric value
- `Potential Value` (or `Potential Value`) - numeric value
- `Description of Enquiry` (or `Description`, `Enquiry`)

### **Example CSV:**
```csv
Name,Email,Phone,Source,Status,Service Type,Notes,Price,Potential Value,Description of Enquiry
John Doe,john.doe@example.com,123-456-7890,Website,new,Consultation,Interested in coaching,500,2000,Looking for business coaching
Jane Smith,jane.smith@example.com,098-765-4321,Referral,qualified,Coaching,Follow up next week,750,3000,Requested consultation
```

---

## 🚀 Step 3: Upload CSV File

### **In the App:**
1. Go to **Leads Tab**
2. Click **"Upload Leads"** button (blue button)
3. Click to select CSV file
4. Review preview (first 10 rows)
5. Click **"Import Leads"**
6. ✅ Done! Leads are imported

### **What Happens:**
- Backend reads CSV file
- Validates each row
- Creates new leads (if email doesn't exist)
- Updates existing leads (if email exists)
- Triggers automation for new leads
- Returns import statistics

---

## 📊 Upload Results

### **Success Response:**
```json
{
  "success": true,
  "message": "Import completed: 45 created, 3 updated, 2 skipped",
  "stats": {
    "total": 50,
    "created": 45,
    "updated": 3,
    "skipped": 2,
    "errors_count": 2
  },
  "errors": [
    "Row 5: Missing required fields (Name or Email)",
    "Row 12: Invalid email format"
  ]
}
```

### **What You See:**
- ✅ Success message with statistics
- ✅ Number of leads created
- ✅ Number of leads updated
- ✅ Number of leads skipped
- ⚠️ Errors (if any)

---

## 🔄 Complete Flow

```
1. Generate CSV
   python manage.py generate_sample_csv --count 50
        ↓
2. CSV file created
   sample_leads.csv (in backend/)
        ↓
3. Upload in Frontend
   Leads Tab → Upload Leads → Select file
        ↓
4. Preview shown
   First 10 rows displayed
        ↓
5. Click Import
   Import Leads button
        ↓
6. Backend processes
   - Reads CSV
   - Validates rows
   - Creates/updates leads
   - Triggers automation
        ↓
7. Results shown
   - Statistics displayed
   - Leads appear in table
   - Welcome emails sent (auto)
```

---

## 🎯 Features

### **✅ Automatic Deduplication**
- If email already exists → Updates existing lead
- If email is new → Creates new lead
- No duplicates!

### **✅ Flexible Column Names**
- Handles: `Name`, `name`, `Full Name`, `full_name`
- Auto-detects column names
- Works with different formats

### **✅ Data Validation**
- Validates required fields
- Validates email format
- Validates status values
- Validates service types
- Shows errors for invalid rows

### **✅ Automation Integration**
- New leads trigger automation
- Welcome emails sent automatically
- Conversations created automatically

### **✅ Error Handling**
- Shows which rows failed
- Explains why they failed
- Continues processing other rows
- Returns detailed statistics

---

## 📝 CSV Format Examples

### **Minimal (Required Only):**
```csv
Name,Email
John Doe,john@example.com
Jane Smith,jane@example.com
```

### **Complete (All Fields):**
```csv
Name,Email,Phone,Source,Status,Service Type,Notes,Price,Potential Value,Description of Enquiry
John Doe,john@example.com,123-456-7890,Website,new,Consultation,Interested,500,2000,Looking for help
Jane Smith,jane@example.com,098-765-4321,Referral,qualified,Coaching,Follow up,750,3000,Requested info
```

### **With Different Column Names:**
```csv
Full Name,Email Address,Phone Number,Lead Source
John Doe,john@example.com,123-456-7890,Website
Jane Smith,jane@example.com,098-765-4321,Referral
```

---

## 🐛 Troubleshooting

### **Error: "No file provided"**
- Make sure you selected a file
- Check file input is working

### **Error: "Invalid file type"**
- Only CSV files are supported
- Make sure file ends with `.csv`

### **Error: "Missing required fields"**
- Check CSV has `Name` and `Email` columns
- Check first row is headers
- Check no empty rows

### **Error: "Row X: Invalid email format"**
- Check email addresses are valid
- Format: `name@domain.com`

### **Many rows skipped:**
- Check CSV format
- Check column names match
- Check for empty rows
- Check for special characters

---

## 💡 Tips

1. **Test with small file first** (5-10 leads)
2. **Check preview** before importing
3. **Backup your data** before bulk import
4. **Use sample CSV** to test format
5. **Check errors** if many rows skipped

---

## ✅ Summary

1. **Generate CSV:** `python manage.py generate_sample_csv --count 50`
2. **Upload File:** Leads Tab → Upload Leads → Select file
3. **Review Preview:** Check first 10 rows
4. **Import:** Click "Import Leads"
5. **Done!** Leads imported + Automation runs

**That's it! Simple and easy!** 🎉

