import os
import sys
from pathlib import Path
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# Make sure we can import from backend
backend_path = Path(__file__).parent.parent / 'backend'
sys.path.append(str(backend_path))

# Load from backend/.env
dotenv_path = backend_path / '.env'
load_dotenv(dotenv_path)

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:Ayush%40202325@localhost:5434/pmposhan")

engine = create_engine(DATABASE_URL)

def add_columns():
    with engine.connect() as conn:
        print("Checking for columns in 'profiles' table...")
        try:
            conn.execute(text("ALTER TABLE profiles ADD COLUMN IF NOT EXISTS reset_token VARCHAR;"))
            conn.execute(text("ALTER TABLE profiles ADD COLUMN IF NOT EXISTS reset_token_expiry TIMESTAMPTZ;"))
            conn.commit()
            print("✅ Columns added successfully (or already existed).")
        except Exception as e:
            print(f"❌ Error: {e}")

if __name__ == "__main__":
    add_columns()
