from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app import db
from app.models import Application, Job
from app.ai_engine.analyzer import analyzer
from . import bp
import os

@bp.route('/', methods=['GET'])
def analyze():
    return jsonify({'message': 'Analysis endpoint'}), 200

@bp.route('/<int:application_id>', methods=['POST'])
@jwt_required()
def analyze_application(application_id):
    claims = get_jwt()
    if claims.get('role') != 'recruiter':
        return jsonify({'error': 'Access denied. Recruiters only.'}), 403

    application = Application.query.get_or_404(application_id)
    job = Job.query.get(application.job_id)
    
    if not os.path.exists(application.resume_path):
        return jsonify({'error': 'Resume file not found'}), 404

    # Parse Resume
    resume_text = analyzer.extract_text(application.resume_path)
    if not resume_text:
        return jsonify({'error': 'Failed to parse resume'}), 500

    # Analyze
    analysis_result = analyzer.analyze_resume(resume_text, job.description)
    
    # Update Application
    application.score = analysis_result.get('match_score', 0)
    application.analysis_summary = analysis_result.get('summary', 'No summary generated.')
    db.session.commit()

    return jsonify({
        'message': 'Analysis complete',
        'score': application.score,
        'summary': application.analysis_summary
    }), 200
