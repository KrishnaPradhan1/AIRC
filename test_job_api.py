import requests
import json

BASE_URL = "http://localhost:5000/api"

def register_recruiter(email, password):
    url = f"{BASE_URL}/auth/register"
    payload = {
        "email": email,
        "password": password,
        "role": "recruiter",
        "full_name": "Test Recruiter"
    }
    try:
        requests.post(url, json=payload) # Ignore error if already exists
    except:
        pass

def login(email, password):
    url = f"{BASE_URL}/auth/login"
    payload = {"email": email, "password": password}
    response = requests.post(url, json=payload)
    if response.status_code == 200:
        return response.json().get('access_token')
    else:
        print(f"Login failed: {response.text}")
        return None

def create_job(token, title, description):
    url = f"{BASE_URL}/jobs/"
    headers = {"Authorization": f"Bearer {token}"}
    payload = {
        "title": title,
        "description": description,
        "requirements": "Python, Flask, React",
        "deadline": "2024-12-31T23:59:59"
    }
    response = requests.post(url, json=payload, headers=headers)
    print(f"Create Job Status: {response.status_code}")
    print(f"Create Job Response: {response.text}")
    return response.json().get('job_id')

def get_jobs(token):
    url = f"{BASE_URL}/jobs/"
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(url, headers=headers)
    print(f"Get Jobs Status: {response.status_code}")
    print(f"Get Jobs Response: {response.text}")

if __name__ == "__main__":
    email = "recruiter_test_api@example.com"
    password = "password123"
    
    print("Registering Recruiter...")
    register_recruiter(email, password)
    
    print("Logging in...")
    token = login(email, password)
    
    if token:
        print("Creating Job...")
        create_job(token, "Senior Software Engineer", "We are looking for a senior dev.")
        
        print("Listing Jobs...")
        get_jobs(token)
