import requests
import json

BASE_URL = "http://localhost:5000/api"

def verify_flow():
    # 1. Login as Student
    print("Logging in as student...")
    login_payload = {
        "email": "stu2@test.com",
        "password": "password123"
    }
    response = requests.post(f"{BASE_URL}/auth/login", json=login_payload)
    if response.status_code != 200:
        print(f"Login failed: {response.text}")
        return
    
    token = response.json().get('access_token')
    headers = {"Authorization": f"Bearer {token}"}
    print("Login successful.")

    # 2. Get Jobs
    print("Fetching jobs...")
    response = requests.get(f"{BASE_URL}/jobs/", headers=headers)
    if response.status_code != 200:
        print(f"Failed to fetch jobs: {response.text}")
        return
    
    jobs = response.json()
    if not jobs:
        print("No jobs found.")
        return
    
    job_id = jobs[0]['id']
    print(f"Found job ID: {job_id}")

    # 3. Apply for Job
    print(f"Applying for job {job_id}...")
    files = {'resume': ('resume.docx', b'dummy content', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')}
    data = {'job_id': job_id}
    
    response = requests.post(f"{BASE_URL}/applications/", headers=headers, files=files, data=data)
    
    if response.status_code == 201:
        print("Application submitted successfully!")
    elif response.status_code == 400 and "already applied" in response.text:
        print("Already applied (expected if re-running).")
    else:
        print(f"Failed to apply: {response.text}")

if __name__ == "__main__":
    verify_flow()
