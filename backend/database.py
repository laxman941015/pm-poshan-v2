import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

load_dotenv()

# 🔗 Get connection string from .env file
# Fallback for local development if .env is missing
SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql://postgres:admin123@127.0.0.1:5434/postgres"
)

# Bulletproof fix: If we are running inside Docker and it tries to connect to 'db' on '5434',
# force it to use the correct internal port '5432'.
if "@db:5434" in SQLALCHEMY_DATABASE_URL:
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("@db:5434", "@db:5432")


# The 'engine' is the core of the connection
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# This will create a 'Session' whenever we need to talk to the DB
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# This is the base class that our data tables will inherit from
Base = declarative_base()

# Helper function to get a database connection
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()