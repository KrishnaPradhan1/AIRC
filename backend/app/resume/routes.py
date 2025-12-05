from flask import jsonify, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from werkzeug.utils import secure_filename
from app import db
from app.models import Resume, User
import os
from datetime import datetime
from . import bp

ALLOWED_EXTENSIONS = {'pdf', 'docx', 'doc'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@bp.route('/upload', methods=['POST'])
@jwt_required()
def upload_resume():
    claims = get_jwt()
    if claims.get('role') != 'student':
        return jsonify({'error': 'Access denied. Students only.'}), 403

    if 'resume' not in request.files:
        return jsonify({'error': 'No resume file provided'}), 400
    
    file = request.files['resume']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        student_id = get_jwt_identity()
        
        # Ensure upload directory exists
        upload_folder = os.path.join(current_app.root_path, '..', 'uploads', 'resumes')
        os.makedirs(upload_folder, exist_ok=True)
        
        # Save file with unique name
        unique_filename = f"resume_{student_id}_{int(datetime.utcnow().timestamp())}_{filename}"
        file_path = os.path.join(upload_folder, unique_filename)
        file.save(file_path)

        # Create Resume record
        # Check if primary resume exists, if so, this one is not primary unless specified?
        # For simplicity, let's make the latest one primary or just store one for now.
        # But the requirement implies "Resume Upload", maybe just one.
        
        # Let's create a Resume model entry
        resume = Resume(
            student_id=student_id,
            filename=filename,
            file_path=file_path,
            is_primary=True # Default to true for now
        )
        
        # Perform AI Analysis
        from app.ai_engine.analyzer import analyzer
        
        text = analyzer.extract_text(file_path)
        if text:
            analysis_result = analyzer.analyze_resume(text)
            
            resume.analysis_summary = analysis_result.get('summary', 'Analysis failed.')
            resume.skills = ', '.join(analysis_result.get('skills', []))
            resume.experience_level = analysis_result.get('experience_level', 'Unknown')
            
            db.session.add(resume)
            db.session.commit()

            return jsonify({
                'message': 'Resume uploaded and analyzed successfully', 
                'resume_id': resume.id,
                'analysis': analysis_result
            }), 201
        else:
            # Fallback if text extraction fails
            resume.analysis_summary = "Text extraction failed."
            db.session.add(resume)
            db.session.commit()
            return jsonify({'message': 'Resume uploaded but text extraction failed', 'resume_id': resume.id}), 201

    return jsonify({'error': 'Invalid file type. Only PDF and DOCX allowed.'}), 400

@bp.route('/', methods=['GET'])
@jwt_required()
def get_resume():
    student_id = get_jwt_identity()
    resume = Resume.query.filter_by(student_id=student_id, is_primary=True).first()
    
    if not resume:
        return jsonify({'message': 'No resume found'}), 404
        
    return jsonify({
        'id': resume.id,
        'filename': resume.filename,
        'uploaded_at': resume.created_at.isoformat(),
        'analysis_summary': resume.analysis_summary
    }), 200
