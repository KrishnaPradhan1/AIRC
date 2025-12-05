import requests
import json
import os

BASE_URL = "http://localhost:5000/api"

def login(email, password):
    url = f"{BASE_URL}/auth/login"
    payload = {"email": email, "password": password}
    response = requests.post(url, json=payload)
    if response.status_code == 200:
        return response.json().get('access_token')
    else:
        print(f"Login failed: {response.text}")
        return None

def apply_job(token, job_id, file_path):
    url = f"{BASE_URL}/applications/"
    headers = {"Authorization": f"Bearer {token}"}
    
    with open(file_path, 'rb') as f:
        files = {'resume': f}
        data = {'job_id': job_id}
        response = requests.post(url, headers=headers, files=files, data=data)
        
    print(f"Apply Job Status: {response.status_code}")
    print(f"Apply Job Response: {response.text}")

def get_my_applications(token):
    url = f"{BASE_URL}/applications/my-applications"
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(url, headers=headers)
    print(f"My Applications Status: {response.status_code}")
    print(f"My Applications Response: {response.text}")

if __name__ == "__main__":
    # Use the student account created earlier or create a new one
    email = "student_app_test@example.com"
    password = "password123"
    
    # Ensure we have a job to apply to (assuming job_id 1 exists from previous tests)
    job_id = 1 
    
    # Create a dummy resume file if it doesn't exist
    if not os.path.exists("test_resume.pdf"):
        with open("test_resume.pdf", "wb") as f:
            f.write(b"%PDF-1.4 dummy content")

    print("Logging in...")
    token = login(email, password)
    
    if token:
        print("Applying to Job...")
        apply_job(token, job_id, "test_resume.pdf")
        
        print("Fetching My Applications...")
        get_my_applications(token)
