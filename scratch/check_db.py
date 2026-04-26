import sys
import os
sys.path.append(os.getcwd())
from backend.database import SessionLocal, engine
from sqlalchemy import inspect

def check_columns():
    inspector = inspect(engine)
    columns = [c['name'] for c in inspector.get_columns('global_food_master')]
    print(f"Columns: {columns}")

if __name__ == "__main__":
    check_columns()
