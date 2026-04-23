import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# Load from backend/.env
dotenv_path = os.path.join(os.getcwd(), 'backend', '.env')
load_dotenv(dotenv_path)

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:Ayush%40202325@localhost:5434/pmposhan")

engine = create_engine(DATABASE_URL)

with engine.connect() as conn:
    print("--- REGISTERED EMAILS ---")
    try:
        result = conn.execute(text("SELECT email FROM profiles;"))
        emails = [row[0] for row in result]
        if not emails:
            print("No users found in the database.")
        for email in emails:
            print(f"- {email}")
    except Exception as e:
        print(f"❌ Error: {e}")
    print("-------------------------")
