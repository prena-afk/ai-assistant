"""
Test script to verify lead creation triggers automation and creates messages
Run this in Django shell: python manage.py shell < test_lead_creation.py
"""

from leads.models import Lead
from messages.models import Message
from accounts.models import User
from automations.models import Automation
import time

# Get user
user = User.objects.first()
if not user:
    print("❌ No user found!")
    exit()

print(f"✅ Using user: {user.email}")

# Check automation
auto = Automation.objects.filter(user=user, trigger='new_lead', enabled=True).first()
if not auto:
    print("❌ Automation not found!")
    exit()

print(f"✅ Automation found: {auto.name}")
print(f"   Enabled: {auto.enabled}")
print(f"   Delay: {auto.delay_hours}h, {auto.delay_days}d")
print(f"   Channel: {auto.channel}")

# Get current message count
initial_message_count = Message.objects.filter(user=user).count()
print(f"\n📊 Initial message count: {initial_message_count}")

# Create a test lead
print("\n🔄 Creating test lead...")
lead = Lead.objects.create(
    user=user,
    name="Test Lead Automation",
    email="test_automation@example.com",
    status="new",
    source="Test"
)

print(f"✅ Lead created: {lead.id} - {lead.name}")

# Wait a moment for signal to fire and automation to run
print("\n⏳ Waiting 3 seconds for automation to execute...")
time.sleep(3)

# Check if message was created
messages = Message.objects.filter(lead=lead, user=user)
message_count = messages.count()
print(f"\n📊 Messages created: {message_count}")

if message_count > 0:
    print("✅ SUCCESS! Message was created by automation!")
    for msg in messages:
        print(f"\n   Message ID: {msg.id}")
        print(f"   Channel: {msg.channel}")
        print(f"   Direction: {msg.direction}")
        print(f"   Status: {msg.status}")
        print(f"   Content preview: {msg.content[:100]}...")
else:
    print("❌ FAILED! No message was created.")
    print("\n🔍 Debugging:")
    print(f"   Lead ID: {lead.id}")
    print(f"   Lead user: {lead.user.email}")
    print(f"   Automation user: {auto.user.email}")
    print(f"   Users match: {lead.user == auto.user}")
    
    # Check all messages for this user
    all_messages = Message.objects.filter(user=user)
    print(f"\n   Total messages for user: {all_messages.count()}")
    
    # Check if signal fired (would be in logs, but we can't check here)
    print("\n   ⚠️  Check Django server logs for:")
    print("      - 'New lead created: X'")
    print("      - 'Triggered X automations for trigger type: new_lead'")
    print("      - 'Lead follow-up automation executed for lead X'")
    print("      - Any error messages")

# Cleanup (optional - comment out if you want to keep the test lead)
# lead.delete()
# print("\n🧹 Test lead deleted")

print("\n" + "="*50)
print("Test complete!")

