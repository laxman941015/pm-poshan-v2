import requests

urls = [
    "http://localhost:8000/",
    "http://localhost:8000/test-reset",
    "http://localhost:8000/login",
    "http://localhost:8000/forgot-password"
]

for url in urls:
    print(f"\n--- Testing {url} ---")
    try:
        if "login" in url or "forgot" in url:
            res = requests.post(url, json={})
        else:
            res = requests.get(url)
        print(f"Status: {res.status_code}")
        print(f"Body: {res.text}")
    except Exception as e:
        print(f"Error: {e}")
