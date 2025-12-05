from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app import db
from app.models import Job, User, Application
from datetime import datetime
from . import bp

@bp.route('/', methods=['POST'])
@jwt_required()
def create_job():
    claims = get_jwt()
    if claims.get('role') != 'recruiter':
        return jsonify({'error': 'Access denied. Recruiters only.'}), 403

    data = request.get_json()
    title = data.get('title')
    description = data.get('description')
    requirements = data.get('requirements')
    deadline_str = data.get('deadline')
    
    company = data.get('company')
    location = data.get('location')
    job_type = data.get('type') # Frontend sends 'type', model has 'job_type'
    experience = data.get('experience')
    salary = data.get('salary')
    skills = data.get('skills') # List from frontend
    status = data.get('status', 'active')

    if not title or not description:
        return jsonify({'error': 'Title and description are required'}), 400

    deadline = None
    if deadline_str:
        try:
            deadline = datetime.fromisoformat(deadline_str.replace('Z', '+00:00'))
        except ValueError:
            pass # Handle invalid date format if needed

    recruiter_id = get_jwt_identity()
    
    job = Job(
        title=title,
        description=description,
        requirements=requirements,
        company=company,
        location=location,
        job_type=job_type,
        experience=experience,
        salary=salary,
        skills=','.join(skills) if isinstance(skills, list) else skills,
        status=status,
        deadline=deadline,
        recruiter_id=recruiter_id
    )

    db.session.add(job)
    db.session.commit()

    return jsonify({'message': 'Job posted successfully', 'job_id': job.id}), 201

@bp.route('/', methods=['GET'])
@jwt_required()
def get_jobs():
    # If recruiter, return their jobs. If student, return all jobs (or search).
    # For now, let's just return all jobs for simplicity, or filter by recruiter_id if provided.
    
    claims = get_jwt()
    role = claims.get('role')
    current_user_id = get_jwt_identity()

    if role == 'recruiter':
        jobs = Job.query.filter_by(recruiter_id=current_user_id).order_by(Job.created_at.desc()).all()
    else:
        jobs = Job.query.order_by(Job.created_at.desc()).all()

    result = []
    for job in jobs:
        result.append({
            'id': job.id,
            'title': job.title,
            'description': job.description,
            'requirements': job.requirements,
            'company': job.company,
            'location': job.location,
            'type': job.job_type,
            'experience': job.experience,
            'salary': job.salary,
            'skills': job.skills.split(',') if job.skills else [],
            'status': job.status,
            'deadline': job.deadline.isoformat() if job.deadline else None,
            'created_at': job.created_at.isoformat(),
            'recruiter_id': job.recruiter_id,
            'applicants_count': job.applications.count()
        })

    return jsonify(result), 200

@bp.route('/<int:job_id>', methods=['GET'])
@jwt_required()
def get_job(job_id):
    job = Job.query.get_or_404(job_id)
    return jsonify({
        'id': job.id,
        'title': job.title,
        'description': job.description,
        'requirements': job.requirements,
        'deadline': job.deadline.isoformat() if job.deadline else None,
        'created_at': job.created_at.isoformat(),
        'recruiter_id': job.recruiter_id,
        'status': job.status
    }), 200

@bp.route('/<int:job_id>/applications', methods=['GET'])
@jwt_required()
def get_job_applications(job_id):
    claims = get_jwt()
    if claims.get('role') != 'recruiter':
        return jsonify({'error': 'Access denied. Recruiters only.'}), 403
        
    job = Job.query.get_or_404(job_id)
    # Ensure recruiter owns the job
    current_user_id = get_jwt_identity()
    # Note: identity is string now, but recruiter_id in DB is int. 
    # We should cast or compare carefully.
    if str(job.recruiter_id) != str(current_user_id):
         return jsonify({'error': 'Access denied. You do not own this job.'}), 403

    applications = job.applications.order_by(Application.score.desc()).all()
    result = []
    for app in applications:
        result.append({
            'id': app.id,
            'student_id': app.student_id,
            'name': app.student.full_name or "Unknown",
            'email': app.student.email,
            'resume_path': app.resume_path,
            'score': app.score,
            'analysis_summary': app.analysis_summary,
            'created_at': app.created_at.isoformat()
        })
    return jsonify(result), 200

@bp.route('/<int:job_id>', methods=['DELETE'])
@jwt_required()
def delete_job(job_id):
    claims = get_jwt()
    if claims.get('role') != 'recruiter':
        return jsonify({'error': 'Access denied. Recruiters only.'}), 403

    job = Job.query.get_or_404(job_id)
    current_user_id = get_jwt_identity()
    
    if str(job.recruiter_id) != str(current_user_id):
        return jsonify({'error': 'Access denied. You do not own this job.'}), 403

    db.session.delete(job)
    db.session.commit()
    return jsonify({'message': 'Job deleted successfully'}), 200

@bp.route('/<int:job_id>', methods=['PUT'])
@jwt_required()
def update_job(job_id):
    claims = get_jwt()
    if claims.get('role') != 'recruiter':
        return jsonify({'error': 'Access denied. Recruiters only.'}), 403

    job = Job.query.get_or_404(job_id)
    current_user_id = get_jwt_identity()
    
    if str(job.recruiter_id) != str(current_user_id):
        return jsonify({'error': 'Access denied. You do not own this job.'}), 403

    data = request.get_json()
    # Update fields if provided
    if 'title' in data: job.title = data['title']
    if 'description' in data: job.description = data['description']
    if 'requirements' in data: job.requirements = data['requirements']
    if 'company' in data: job.company = data['company']
    if 'location' in data: job.location = data['location']
    if 'type' in data: job.job_type = data['type']
    if 'experience' in data: job.experience = data['experience']
    if 'salary' in data: job.salary = data['salary']
    if 'skills' in data: job.skills = ','.join(data['skills']) if isinstance(data['skills'], list) else data['skills']
    if 'status' in data: job.status = data['status']
    
    db.session.commit()
    return jsonify({'message': 'Job updated successfully'}), 200
