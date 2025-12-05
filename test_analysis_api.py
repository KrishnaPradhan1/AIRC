import requests
import json
import os
import time

BASE_URL = "http://localhost:5000/api"

def login(email, password):
    url = f"{BASE_URL}/auth/login"
    payload = {"email": email, "password": password}
    response = requests.post(url, json=payload)
    if response.status_code == 200:
        return response.json().get('access_token')
    return None

def create_job(token):
    url = f"{BASE_URL}/jobs/"
    headers = {"Authorization": f"Bearer {token}"}
    payload = {
        "title": "AI Engineer",
        "description": "We need an AI Engineer with Python and Flask skills.",
        "requirements": "Python, Flask, AI, Machine Learning",
        "deadline": "2025-12-31T23:59:59"
    }
    response = requests.post(url, json=payload, headers=headers)
    return response.json().get('job_id')

def apply_job(token, job_id, file_path):
    url = f"{BASE_URL}/applications/"
    headers = {"Authorization": f"Bearer {token}"}
    with open(file_path, 'rb') as f:
        files = {'resume': f}
        data = {'job_id': job_id}
        response = requests.post(url, headers=headers, files=files, data=data)
    return response.json().get('application_id')

def analyze_application(token, application_id):
    url = f"{BASE_URL}/analysis/{application_id}"
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post(url, headers=headers)
    print(f"Analysis Status: {response.status_code}")
    print(f"Analysis Response: {response.text}")

if __name__ == "__main__":
    recruiter_email = "recruiter_analysis_test@example.com"
    student_email = "student_analysis_test@example.com"
    password = "password123"
    
    # Register users
    requests.post(f"{BASE_URL}/auth/register", json={"email": recruiter_email, "password": password, "role": "recruiter"})
    requests.post(f"{BASE_URL}/auth/register", json={"email": student_email, "password": password, "role": "student"})
    
    # Recruiter Flow
    recruiter_token = login(recruiter_email, password)
    job_id = create_job(recruiter_token)
    print(f"Job Created: {job_id}")
    
    # Student Flow
    student_token = login(student_email, password)
    
    # Create dummy resume with keywords
    with open("ai_resume.pdf", "wb") as f:
        f.write(b"%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length 100 >>\nstream\nBT /F1 24 Tf 100 700 Td (I am an AI Engineer with skills in Python, Flask and Machine Learning.) Tj ET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000010 00000 n \n0000000060 00000 n \n0000000117 00000 n \n0000000204 00000 n \ntrailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n350\n%%EOF")
        
    app_id = apply_job(student_token, job_id, "ai_resume.pdf")
    print(f"Application Submitted: {app_id}")
    
    # Analyze
    print("Analyzing Application...")
    analyze_application(recruiter_token, app_id)
