import os
import sys
from pathlib import Path
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

backend_path = Path(__file__).parent.parent / 'backend'
sys.path.append(str(backend_path))

dotenv_path = backend_path / '.env'
load_dotenv(dotenv_path)

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:Ayush%40202325@localhost:5434/pmposhan")

engine = create_engine(DATABASE_URL)

def add_columns():
    with engine.connect() as conn:
        print("Adding rate limiting columns to 'profiles' table...")
        try:
            conn.execute(text("ALTER TABLE profiles ADD COLUMN IF NOT EXISTS otp_request_count INTEGER DEFAULT 0;"))
            conn.execute(text("ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_otp_request_time TIMESTAMPTZ;"))
            conn.commit()
            print("✅ OTP Rate limiting columns added successfully.")
        except Exception as e:
            print(f"❌ Error: {e}")

if __name__ == "__main__":
    add_columns()
