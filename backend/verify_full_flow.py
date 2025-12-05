import requests
import os

BASE_URL = 'http://localhost:5000/api'

# 1. Login as Recruiter
session = requests.Session()
login_res = session.post(f'{BASE_URL}/auth/login', json={'email': 'recruiter@example.com', 'password': 'password123'})
if login_res.status_code != 200:
    print("Recruiter login failed:", login_res.text)
    exit(1)
recruiter_token = login_res.json()['access_token']
recruiter_headers = {'Authorization': f'Bearer {recruiter_token}'}
print("Recruiter logged in.")

# 2. Create Job
job_data = {
    'title': 'Senior Python Developer',
    'description': 'We are looking for a Python expert with Flask and AI experience.',
    'requirements': 'Python, SQL, AI, Flask',
    'location': 'Remote',
    'type': 'Full-time',
    'salary': '$120k',
    'skills': ['Python', 'Flask', 'AI']
}
job_res = session.post(f'{BASE_URL}/jobs/', headers=recruiter_headers, json=job_data)
if job_res.status_code != 201:
    print("Create job failed:", job_res.text)
    exit(1)
job_id = job_res.json()['job_id']
print(f"Job created: {job_id}")

# 3. Login as Student
student_session = requests.Session()
stu_login_res = student_session.post(f'{BASE_URL}/auth/login', json={'email': 'student@example.com', 'password': 'password123'})
if stu_login_res.status_code != 200:
    print("Student login failed:", stu_login_res.text)
    exit(1)
student_token = stu_login_res.json()['access_token']
student_headers = {'Authorization': f'Bearer {student_token}'}
print("Student logged in.")

# 4. Apply for Job
file_path = 'dummy_resume.docx'
if not os.path.exists(file_path):
    print("dummy_resume.docx not found!")
    exit(1)

with open(file_path, 'rb') as f:
    files = {'resume': f}
    data = {'job_id': job_id}
    apply_res = student_session.post(f'{BASE_URL}/applications/', headers=student_headers, files=files, data=data)
    if apply_res.status_code != 201:
        print("Application failed:", apply_res.text)
        # If already applied, that's fine for testing, but we want to verify analysis.
    else:
        print("Applied successfully.")

# 5. Verify Application as Recruiter
apps_res = session.get(f'{BASE_URL}/jobs/{job_id}/applications', headers=recruiter_headers)
if apps_res.status_code == 200:
    apps = apps_res.json()
    print(f"Found {len(apps)} applications.")
    for app in apps:
        print(f"App ID: {app['id']}, Score: {app['score']}")
        print(f"Summary: {app['analysis_summary']}")
        if app['analysis_summary']:
            print("VERIFICATION SUCCESS: Analysis data present.")
        else:
            print("VERIFICATION FAILED: No analysis data.")
else:
    print("Fetch applications failed:", apps_res.text)
