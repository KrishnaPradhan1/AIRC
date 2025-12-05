import requests
import json

BASE_URL = "http://localhost:5000/api"

def login_recruiter():
    response = requests.post(f"{BASE_URL}/auth/login", json={
        "email": "recruiter@example.com",
        "password": "password123"
    })
    if response.status_code == 200:
        return response.json()['access_token']
    else:
        print("Login failed:", response.text)
        return None

def verify_job_flow():
    token = login_recruiter()
    if not token:
        return

    headers = {"Authorization": f"Bearer {token}"}

    # 1. Create Job
    print("\n1. Creating Job...")
    job_data = {
        "title": "Test Job for Status",
        "description": "This is a test job.",
        "requirements": "None",
        "company": "Test Corp",
        "location": "Remote",
        "type": "Full-time",
        "experience": "Entry",
        "salary": "$50k",
        "skills": ["Python"]
    }
    response = requests.post(f"{BASE_URL}/jobs/", json=job_data, headers=headers)
    print(f"Create Status: {response.status_code}")
    if response.status_code != 201:
        print(response.text)
        return
    job_id = response.json()['job_id']
    print(f"Job ID: {job_id}")

    # 2. Get Job and check default status
    print("\n2. Getting Job...")
    response = requests.get(f"{BASE_URL}/jobs/{job_id}", headers=headers)
    print(f"Get Status: {response.status_code}")
    job = response.json()
    # Note: get_job endpoint might not return status yet if I didn't update it to return it in the single job view?
    # Let's check get_jobs list view which definitely has it.
    
    # 3. Get Jobs List
    print("\n3. Getting Jobs List...")
    response = requests.get(f"{BASE_URL}/jobs/", headers=headers)
    print(f"List Status: {response.status_code}")
    jobs = response.json()
    my_job = next((j for j in jobs if j['id'] == job_id), None)
    if my_job:
        print(f"Job Status: {my_job.get('status')}")
    else:
        print("Job not found in list")

    # 4. Update Status
    print("\n4. Updating Status to 'closed'...")
    response = requests.put(f"{BASE_URL}/jobs/{job_id}", json={"status": "closed"}, headers=headers)
    print(f"Update Status: {response.status_code}")

    # 5. Verify Update
    print("\n5. Verifying Update...")
    response = requests.get(f"{BASE_URL}/jobs/", headers=headers)
    jobs = response.json()
    my_job = next((j for j in jobs if j['id'] == job_id), None)
    if my_job:
        print(f"Job Status: {my_job.get('status')}")

    # 6. Delete Job
    print("\n6. Deleting Job...")
    response = requests.delete(f"{BASE_URL}/jobs/{job_id}", headers=headers)
    print(f"Delete Status: {response.status_code}")

    # 7. Verify Deletion
    print("\n7. Verifying Deletion...")
    response = requests.get(f"{BASE_URL}/jobs/{job_id}", headers=headers)
    print(f"Get Status (should be 404): {response.status_code}")

if __name__ == "__main__":
    verify_job_flow()
