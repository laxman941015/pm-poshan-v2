import sys
from pathlib import Path

# Add backend to path
backend_path = Path(__file__).parent.parent / 'backend'
sys.path.append(str(backend_path))

try:
    from main import app
    print("--- REGISTERED ROUTES ---")
    for route in app.routes:
        if hasattr(route, 'path'):
            methods = getattr(route, 'methods', ['GET'])
            print(f"{list(methods)} {route.path}")
    print("-------------------------")
except Exception as e:
    print(f"Error loading app: {e}")
