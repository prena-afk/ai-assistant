# 🔄 Complete Flow: From Lead to Conversation

## 📋 Step-by-Step Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    STEP 1: CREATE A LEAD                        │
└─────────────────────────────────────────────────────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────┐
        │  You click "Create Lead"        │
        │  Fill in: Name, Email, etc.     │
        │  Click "Create Lead" button     │
        └─────────────────────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────┐
        │  Lead is saved to DATABASE      │
        │  ✅ Lead ID: 123                 │
        │  ✅ Name: "John Doe"              │
        │  ✅ Email: "john@example.com"    │
        └─────────────────────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────┐
        │  Lead appears in LEADS TAB      │
        │  ✅ You can see it immediately   │
        └─────────────────────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────┐
        │  ❌ NO CONVERSATION YET          │
        │  (No message exists)             │
        └─────────────────────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────────────────────────────┐
        │              STEP 2: MESSAGE CREATION                   │
        │  (This is where conversations come from!)               │
        └─────────────────────────────────────────────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────────────────────────────┐
        │  🔀 THREE WAYS A MESSAGE CAN BE CREATED:                 │
        └─────────────────────────────────────────────────────────┘
                          │
        ┌─────────────────┴─────────────────┐
        │                                   │
        ▼                                   ▼
┌───────────────────┐            ┌───────────────────┐
│  METHOD 1:        │            │  METHOD 2:        │
│  AUTOMATION       │            │  MANUAL SEND      │
│  (Automatic)      │            │  (You do it)      │
└───────────────────┘            └───────────────────┘
        │                                   │
        ▼                                   ▼
┌───────────────────┐            ┌───────────────────┐
│  Backend detects  │            │  You send email/  │
│  new lead created  │            │  SMS to the lead  │
│                   │            │                   │
│  Automation       │            │  You click "Send  │
│  triggers         │            │  Message" button  │
│                   │            │                   │
│  Sends welcome    │            │  Message is sent  │
│  email            │            │  via API          │
└───────────────────┘            └───────────────────┘
        │                                   │
        └───────────────┬───────────────────┘
                        │
                        ▼
        ┌─────────────────────────────────┐
        │  MESSAGE IS CREATED IN DATABASE │
        │  ✅ Message ID: 456              │
        │  ✅ Lead ID: 123 (linked)        │
        │  ✅ Channel: "email"              │
        │  ✅ Direction: "outbound"         │
        │  ✅ Content: "Welcome email..."   │
        └─────────────────────────────────┘
                        │
                        ▼
        ┌─────────────────────────────────┐
        │  CONVERSATION IS CREATED         │
        │  (Built from messages)           │
        └─────────────────────────────────┘
                        │
                        ▼
        ┌─────────────────────────────────┐
        │  Conversation appears in         │
        │  CONVERSATIONS TAB               │
        │  ✅ You can see it now!          │
        └─────────────────────────────────┘
```

---

## 🎯 Detailed Explanation

### **STEP 1: Create a Lead**

**What happens:**
1. You fill in the form (name, email, etc.)
2. Click "Create Lead"
3. Frontend calls `api.createLead()`
4. Backend saves to database
5. Lead appears in **Leads Tab**

**At this point:**
- ✅ Lead exists in database
- ✅ Lead appears in Leads Tab
- ❌ NO message exists yet
- ❌ NO conversation exists yet

---

### **STEP 2: Message Creation (THE KEY STEP!)**

**This is where conversations come from!**

A message can be created in **3 ways**:

#### **METHOD 1: Automation (Automatic)**

**What happens:**
1. Backend detects: "New lead created!"
2. Looks for automation with trigger: `new_lead`
3. Finds "Welcome New Leads" automation
4. Automation executes:
   - Sends email to the lead
   - **Creates a message record in database**
5. Message is created → Conversation appears!

**Where this happens:**
- **Backend code**: `backend/automations/services.py`
- **Function**: `trigger_automations('new_lead', context)`
- **When**: Immediately after lead creation (or after delay)

**Code flow:**
```
Lead created → Django signal fires → trigger_automations() → 
AutomationExecutor.execute() → Send email → Create Message → 
Conversation appears
```

---

#### **METHOD 2: Manual Send (You do it)**

**What happens:**
1. You create lead with "Send follow-up email" checked
2. OR you go to Conversations tab and send a message
3. Frontend calls `api.sendMessage()`
4. Backend:
   - Sends the email/SMS
   - **Creates a message record in database**
5. Message is created → Conversation appears!

**Where this happens:**
- **Frontend**: `app/leads/page.tsx` → `handleCreateLead()`
- **API**: `lib/api.ts` → `sendMessage()`
- **Backend**: `backend/messages/views.py` → `MessageListCreateView`

**Code flow:**
```
You click "Send" → api.sendMessage() → Backend API → 
Create Message in database → Conversation appears
```

---

#### **METHOD 3: Inbound Message (Lead contacts you)**

**What happens:**
1. Lead sends you an email/SMS
2. Backend receives it (webhook or polling)
3. Backend:
   - Processes the message
   - **Creates a message record in database**
4. Message is created → Conversation appears!

**Where this happens:**
- **Backend**: `backend/messages/services.py` → `process_inbound_message()`

---

### **STEP 3: Conversation Creation**

**What happens:**
1. Message exists in database (from Step 2)
2. Frontend fetches messages: `api.getMessages()`
3. Frontend groups messages by lead + channel
4. Creates conversation objects
5. Displays in **Conversations Tab**

**Where this happens:**
- **Frontend**: `app/conversations/page.tsx` → `fetchData()`
- **Function**: Groups messages into conversations

**Code:**
```typescript
// Group messages by lead and channel
messages.forEach((message) => {
  const leadId = message.leadId;
  const key = `${leadId}-${message.channel}`;
  
  // Create conversation if it doesn't exist
  if (!conversationsMap.has(key)) {
    conversationsMap.set(key, {
      lead: lead,
      messages: [message],
      lastMessage: message,
      channel: message.channel
    });
  }
});
```

---

## 🔍 Where Messages Are Created (Database)

### **Database Table: `messages_message`**

**Structure:**
```sql
CREATE TABLE messages_message (
    id INTEGER PRIMARY KEY,
    lead_id INTEGER,           -- Links to lead
    channel VARCHAR,            -- 'email', 'sms', etc.
    direction VARCHAR,          -- 'inbound' or 'outbound'
    content TEXT,               -- Message text
    timestamp DATETIME,         -- When sent/received
    ...
);
```

**When a message is created:**
- ✅ Record is inserted into `messages_message` table
- ✅ `lead_id` links it to the lead
- ✅ Frontend fetches this table to build conversations

---

## 📊 Complete Example Flow

### **Scenario: You create a lead named "Sarah"**

```
1. YOU CREATE LEAD
   ├─ Frontend: app/leads/page.tsx → handleCreateLead()
   ├─ API: lib/api.ts → createLead()
   ├─ Backend: backend/leads/views.py → LeadListCreateView
   └─ Database: INSERT INTO leads_lead (name, email, ...)
   
   Result: ✅ Lead "Sarah" in database
   Result: ✅ Lead "Sarah" appears in Leads Tab
   Result: ❌ NO conversation yet (no message)

2. AUTOMATION TRIGGERS (Automatic)
   ├─ Backend: Django signal fires
   ├─ Backend: automations/services.py → trigger_automations('new_lead')
   ├─ Backend: AutomationExecutor.execute()
   ├─ Backend: Sends email to sarah@example.com
   ├─ Backend: messages/views.py → Creates message record
   └─ Database: INSERT INTO messages_message (lead_id, content, ...)
   
   Result: ✅ Message created in database
   Result: ✅ Message linked to lead "Sarah"

3. FRONTEND FETCHES MESSAGES
   ├─ Frontend: app/conversations/page.tsx → fetchData()
   ├─ API: lib/api.ts → getMessages()
   ├─ Backend: backend/messages/views.py → MessageListCreateView
   └─ Frontend: Groups messages into conversations
   
   Result: ✅ Conversation appears in Conversations Tab
   Result: ✅ You can see "Sarah" with the welcome email
```

---

## 🎯 Key Points to Remember

### **1. Messages are created in the DATABASE**
- Not in the frontend
- Backend creates them
- Stored in `messages_message` table

### **2. Conversations are built from MESSAGES**
- Frontend fetches messages
- Groups them by lead + channel
- Displays as conversations

### **3. Three ways messages are created:**
1. **Automation** (automatic) - Most common
2. **Manual send** (you do it)
3. **Inbound** (lead contacts you)

### **4. The flow is:**
```
Lead Created → Message Created → Conversation Appears
     ✅              ✅                    ✅
```

---

## ❓ Common Questions

### **Q: Where exactly is the message created?**
**A:** In the backend, in the `messages_message` database table. The backend code creates it when:
- Automation runs
- You send a message via API
- Inbound message is received

### **Q: Why doesn't my lead show in Conversations?**
**A:** Because no message exists yet. Check:
1. Is automation enabled? (Settings → Automations)
2. Did automation run? (Check backend logs)
3. Did you send a message manually?

### **Q: How do I make a conversation appear?**
**A:** Create a message! Either:
1. Wait for automation to send welcome email
2. Send a follow-up email when creating lead
3. Manually send a message from Conversations tab

---

## ✅ Summary

**The Complete Flow:**
1. **Create Lead** → Saved to database → Appears in Leads Tab
2. **Message Created** → By automation, manual send, or inbound
3. **Conversation Built** → Frontend groups messages by lead
4. **Conversation Appears** → Shows in Conversations Tab

**Remember:**
- Leads = People (in Leads Tab)
- Messages = Communication records (in database)
- Conversations = Grouped messages (in Conversations Tab)

**No message = No conversation!**

