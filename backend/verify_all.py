import requests
import os
import time

BASE_URL = 'http://localhost:5000/api'
TIMESTAMP = int(time.time())
REC_EMAIL = f'rec_test_{TIMESTAMP}@test.com'
STU_EMAIL = f'stu_test_{TIMESTAMP}@test.com'
PASSWORD = 'password123'

def print_step(msg):
    print(f"\n[STEP] {msg}")

def print_success(msg):
    print(f"✅ {msg}")

def print_fail(msg):
    print(f"❌ {msg}")
    exit(1)

session = requests.Session()

# 1. Signup Recruiter
print_step("Registering Recruiter...")
res = session.post(f'{BASE_URL}/auth/register', json={
    'email': REC_EMAIL, 'password': PASSWORD, 'role': 'recruiter', 'name': 'Test Recruiter'
})
if res.status_code == 201:
    print_success(f"Recruiter registered: {REC_EMAIL}")
else:
    print_fail(f"Recruiter registration failed: {res.text}")

# 2. Login Recruiter
print_step("Logging in Recruiter...")
res = session.post(f'{BASE_URL}/auth/login', json={'email': REC_EMAIL, 'password': PASSWORD})
if res.status_code == 200:
    rec_token = res.json()['access_token']
    rec_headers = {'Authorization': f'Bearer {rec_token}'}
    print_success("Recruiter logged in")
else:
    print_fail(f"Recruiter login failed: {res.text}")

# 3. Post Job
print_step("Posting Job...")
job_data = {
    'title': 'AI Engineer',
    'description': 'Build AI models.',
    'requirements': 'Python, AI',
    'location': 'Remote',
    'type': 'Full-time',
    'salary': '$150k',
    'skills': ['Python', 'AI']
}
res = session.post(f'{BASE_URL}/jobs/', headers=rec_headers, json=job_data)
if res.status_code == 201:
    job_id = res.json()['job_id']
    print_success(f"Job posted: ID {job_id}")
else:
    print_fail(f"Job posting failed: {res.text}")

# 4. Signup Student
print_step("Registering Student...")
res = session.post(f'{BASE_URL}/auth/register', json={
    'email': STU_EMAIL, 'password': PASSWORD, 'role': 'student', 'name': 'Test Student'
})
if res.status_code == 201:
    print_success(f"Student registered: {STU_EMAIL}")
else:
    print_fail(f"Student registration failed: {res.text}")

# 5. Login Student
print_step("Logging in Student...")
res = session.post(f'{BASE_URL}/auth/login', json={'email': STU_EMAIL, 'password': PASSWORD})
if res.status_code == 200:
    stu_token = res.json()['access_token']
    stu_headers = {'Authorization': f'Bearer {stu_token}'}
    print_success("Student logged in")
else:
    print_fail(f"Student login failed: {res.text}")

# 6. Apply for Job
print_step("Applying for Job with Resume...")
file_path = 'dummy_resume.docx'
if not os.path.exists(file_path):
    print_fail("dummy_resume.docx not found")

with open(file_path, 'rb') as f:
    files = {'resume': f}
    data = {'job_id': job_id}
    res = session.post(f'{BASE_URL}/applications/', headers=stu_headers, files=files, data=data)
    if res.status_code == 201:
        print_success("Application submitted")
    else:
        print_fail(f"Application failed: {res.text}")

# 7. Verify AI Analysis (Recruiter View)
print_step("Verifying AI Analysis as Recruiter...")
# Wait a bit for async analysis if any (though it's sync now)
time.sleep(2)
res = session.get(f'{BASE_URL}/jobs/{job_id}/applications', headers=rec_headers)
if res.status_code == 200:
    apps = res.json()
    if len(apps) > 0:
        app = apps[0]
        print(f"   Score: {app['score']}")
        print(f"   Summary: {app['analysis_summary']}")
        if app['analysis_summary'] and app['analysis_summary'] != "Analysis failed.":
            print_success("AI Analysis verified")
        else:
            print_fail("AI Analysis missing or failed")
    else:
        print_fail("No applications found")
else:
    print_fail(f"Fetch applications failed: {res.text}")

print("\n🎉 ALL TESTS PASSED SUCCESSFULLY!")
