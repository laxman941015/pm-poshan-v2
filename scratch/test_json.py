import requests

try:
    print("Sending forgot-password request...")
    res = requests.post("http://localhost:8000/forgot-password", json={"email": "laxmanrathod20241@gmail.com"})
    print(f"Status: {res.status_code}")
    print(f"Headers: {res.headers}")
    print(f"Raw Text: '{res.text}'")
except Exception as e:
    print(f"Request failed: {e}")
