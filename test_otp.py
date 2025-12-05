import requests
import json

url = "http://localhost:5000/api/auth/send-otp"
payload = {"email": "krishnapradhan1247413@gmail.com"}
headers = {"Content-Type": "application/json"}

try:
    response = requests.post(url, json=payload, headers=headers)
    print(f"Status Code: {response.status_code}")
    with open("error.html", "w", encoding="utf-8") as f:
        f.write(response.text)
    print("Saved response to error.html")
except Exception as e:
    print(f"Error: {e}")
