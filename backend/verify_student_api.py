import requests
import os

BASE_URL = "http://localhost:5000/api"

def login_student():
    response = requests.post(f"{BASE_URL}/auth/login", json={
        "email": "student@example.com",
        "password": "password123"
    })
    if response.status_code == 200:
        return response.json()['access_token']
    else:
        # Create student if not exists
        print("Login failed, trying to register...")
        response = requests.post(f"{BASE_URL}/auth/register", json={
            "email": "student@example.com",
            "password": "password123",
            "full_name": "Test Student",
            "role": "student"
        })
        if response.status_code == 201:
            print("Registered successfully. Logging in...")
            return login_student()
        else:
            print("Registration failed:", response.text)
            return None

def verify_student_flow():
    token = login_student()
    if not token:
        return

    headers = {"Authorization": f"Bearer {token}"}

    # 1. Get Jobs
    print("\n1. Getting Jobs...")
    response = requests.get(f"{BASE_URL}/jobs/", headers=headers)
    print(f"Get Jobs Status: {response.status_code}")
    jobs = response.json()
    if not jobs:
        print("No jobs found. Please create a job first (using recruiter flow).")
        return
    
    job_id = jobs[0]['id']
    print(f"Applying for Job ID: {job_id}")

    # 2. Apply for Job
    print("\n2. Applying for Job...")
    # Create a dummy resume file
    with open("dummy_resume.pdf", "wb") as f:
        f.write(b"%PDF-1.4 dummy content")
    
    with open('dummy_resume.pdf', 'rb') as f:
        files = {'resume': ('dummy_resume.pdf', f, 'application/pdf')}
        data = {'job_id': job_id}
        
        response = requests.post(f"{BASE_URL}/applications/", headers=headers, files=files, data=data)
    
    print(f"Apply Status: {response.status_code}")
    if response.status_code not in [201, 400]: # 400 if already applied
        print(response.text)

    # 3. Get My Applications
    print("\n3. Getting My Applications...")
    response = requests.get(f"{BASE_URL}/applications/my-applications", headers=headers)
    print(f"My Applications Status: {response.status_code}")
    apps = response.json()
    print(f"Found {len(apps)} applications")
    if apps:
        print(f"First application status: {apps[0].get('status')}")

    # Clean up
    try:
        if os.path.exists("dummy_resume.pdf"):
            os.remove("dummy_resume.pdf")
    except Exception as e:
        print(f"Cleanup error: {e}")

if __name__ == "__main__":
    verify_student_flow()
