
import sys
import os

# Add the root directory to path so we can import models and database
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from backend.database import SessionLocal
from backend.models import Profile

def reset_users():
    db = SessionLocal()
    emails = [
        "laxmanrathod20241@gmail.com",
        "subodh7862@gmail.com",
        "sanvira09@gmail.com"
    ]
    
    try:
        print(f"--- Resetting OTP limits for {len(emails)} users ---")
        for email in emails:
            # Use ilike for case-insensitive matching
            user = db.query(Profile).filter(Profile.email.ilike(email.strip())).first()
            if user:
                user.otp_request_count = 0
                user.last_otp_request_time = None
                print(f"✅ Reset SUCCESS: {email}")
            else:
                print(f"❌ User NOT FOUND: {email}")
        
        db.commit()
        print("--- All changes committed to database ---")
    except Exception as e:
        print(f"❌ ERROR: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    reset_users()
