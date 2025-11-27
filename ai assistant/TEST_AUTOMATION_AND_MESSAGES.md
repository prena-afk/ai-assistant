# 🧪 Test Automation and Messages

## Quick Test Steps:

### 1. **Check if Automation Exists**
```bash
cd backend
.\venv\Scripts\Activate.ps1
python manage.py shell
```

```python
from automations.models import Automation
from accounts.models import User

user = User.objects.first()
auto = Automation.objects.filter(user=user, trigger='new_lead', enabled=True).first()

print(f"Automation found: {auto is not None}")
if auto:
    print(f"Name: {auto.name}")
    print(f"Delay: {auto.delay_hours}h, {auto.delay_days}d")
    print(f"Channel: {auto.channel}")
    print(f"Enabled: {auto.enabled}")
```

### 2. **Create a Test Lead and Check Messages**
```python
from leads.models import Lead
from messages.models import Message

# Create a test lead
lead = Lead.objects.create(
    user=user,
    name="Test Lead",
    email="test@example.com",
    status="new"
)

print(f"Created lead: {lead.id}")

# Wait a moment for automation to run
import time
time.sleep(2)

# Check if message was created
messages = Message.objects.filter(lead=lead)
print(f"Messages created: {messages.count()}")
for msg in messages:
    print(f"  - {msg.direction} {msg.channel}: {msg.content[:50]}...")
```

### 3. **Check Backend Logs**
When you create a lead, you should see in Django server terminal:
```
INFO: New lead created: 123
INFO: Triggered 1 automations for trigger type: new_lead
INFO: Lead follow-up automation executed for lead 123
```

### 4. **Check Frontend Console**
Open browser DevTools → Console, you should see:
```
[Leads] Saved X leads to localStorage after creating new lead
[Conversations] Fetched data: { messagesCount: 1, ... }
```

---

## If Messages Are Not Created:

### Check 1: Is Automation Enabled?
```python
auto = Automation.objects.filter(user=user, trigger='new_lead').first()
print(f"Enabled: {auto.enabled}")
```

### Check 2: Is Delay Set to 0?
```python
print(f"Delay hours: {auto.delay_hours}")
print(f"Delay days: {auto.delay_days}")
# Should be 0, 0 for immediate execution
```

### Check 3: Check Django Server Logs
Look for errors when creating a lead:
- "Error executing automation"
- "Failed to send message"
- "Error sending message"

### Check 4: Check Email Settings
```python
from django.conf import settings
print(f"EMAIL_HOST: {settings.EMAIL_HOST}")
print(f"EMAIL_HOST_USER: {settings.EMAIL_HOST_USER}")
# Should be configured in .env
```

---

## Fix: Create/Update Automation

If automation doesn't exist or is misconfigured:

```python
from automations.models import Automation
from accounts.models import User

user = User.objects.first()

# Create or get automation
auto, created = Automation.objects.get_or_create(
    user=user,
    trigger='new_lead',
    defaults={
        'name': 'Welcome New Leads',
        'type': 'lead_followup',
        'enabled': True,
        'delay_hours': 0,
        'delay_days': 0,
        'channel': 'email',
        'message_template': ''
    }
)

if not created:
    # Update existing
    auto.enabled = True
    auto.delay_hours = 0
    auto.delay_days = 0
    auto.save()

print(f"Automation {'created' if created else 'updated'}: {auto.name}")
```

