from flask import jsonify, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from werkzeug.utils import secure_filename
from app import db
from app.models import Application, Job
import os
from app.ai_engine.analyzer import analyzer
from . import bp

ALLOWED_EXTENSIONS = {'pdf', 'docx', 'doc'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@bp.route('/', methods=['POST'])
@jwt_required()
def apply_job():
    claims = get_jwt()
    if claims.get('role') != 'student':
        return jsonify({'error': 'Access denied. Students only.'}), 403

    if 'resume' not in request.files:
        return jsonify({'error': 'No resume file provided'}), 400
    
    file = request.files['resume']
    job_id = request.form.get('job_id')

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if not job_id:
        return jsonify({'error': 'Job ID is required'}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        student_id = get_jwt_identity()
        
        # Ensure upload directory exists
        upload_folder = os.path.join(current_app.root_path, '..', 'uploads', 'resumes')
        os.makedirs(upload_folder, exist_ok=True)
        
        # Save file with unique name to prevent overwrites
        unique_filename = f"{student_id}_{job_id}_{filename}"
        file_path = os.path.join(upload_folder, unique_filename)
        file.save(file_path)

        # Check if already applied
        existing_application = Application.query.filter_by(student_id=student_id, job_id=job_id).first()
        if existing_application:
            return jsonify({'error': 'You have already applied for this job'}), 400

        application = Application(
            job_id=job_id,
            student_id=student_id,
            resume_path=file_path
        )
        
        # Perform AI Analysis
        try:
            text = analyzer.extract_text(file_path)
            if text:
                # Get Job Description for comparison
                job = Job.query.get(job_id)
                job_desc = job.description if job else None
                
                analysis_result = analyzer.analyze_resume(text, job_description=job_desc)
                
                application.score = analysis_result.get('match_score', 0)
                application.analysis_summary = analysis_result.get('summary', 'Analysis failed.')
            else:
                application.analysis_summary = "Text extraction failed."
        except Exception as e:
            print(f"Analysis error: {e}")
            application.analysis_summary = "Analysis failed due to server error."

        db.session.add(application)
        db.session.commit()

        return jsonify({'message': 'Application submitted successfully', 'application_id': application.id}), 201

    return jsonify({'error': 'Invalid file type. Only PDF and DOCX allowed.'}), 400

@bp.route('/my-applications', methods=['GET'])
@jwt_required()
def my_applications():
    student_id = get_jwt_identity()
    applications = Application.query.filter_by(student_id=student_id).all()
    
    result = []
    for app in applications:
        job = Job.query.get(app.job_id)
        result.append({
            'id': app.id,
            'job_title': job.title if job else 'Unknown Job',
            'applied_at': app.created_at.isoformat(),
            'status': app.status
        })
    
    return jsonify(result), 200

@bp.route('/<int:application_id>/status', methods=['PUT'])
@jwt_required()
def update_application_status(application_id):
    claims = get_jwt()
    if claims.get('role') != 'recruiter':
        return jsonify({'error': 'Access denied. Recruiters only.'}), 403

    application = Application.query.get_or_404(application_id)
    
    # Ensure recruiter owns the job associated with the application
    job = Job.query.get(application.job_id)
    current_user_id = get_jwt_identity()
    
    if str(job.recruiter_id) != str(current_user_id):
        return jsonify({'error': 'Access denied. You do not own this job.'}), 403

    data = request.get_json()
    new_status = data.get('status')
    
    if new_status:
        application.status = new_status
        db.session.commit()
        return jsonify({'message': 'Application status updated successfully'}), 200
    
    return jsonify({'error': 'Status is required'}), 400

