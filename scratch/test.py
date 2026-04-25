import sys
import os
import requests

sys.path.append("c:/Users/lrath/PMPY/backend")
from database import SessionLocal
from models import Profile

# 1. Test API endpoint
print("Testing API...")
try:
    res = requests.post("http://localhost:8000/forgot-password", json={"email": "laxmanrathod20241@gmail.com"})
    print(f"API Response Status: {res.status_code}")
    print(f"API Response Body: {res.text}")
except Exception as e:
    print(f"API Error: {e}")

# 2. Check DB directly
print("\nChecking Database...")
db = SessionLocal()
users = db.query(Profile).filter(Profile.email.ilike('%laxmanrathod20241%')).all()
for u in users:
    print(f"Found user: ID={u.id}, Email='{u.email}' (Length: {len(u.email)})")
if not users:
    print("No users found containing 'laxmanrathod20241'")
db.close()
