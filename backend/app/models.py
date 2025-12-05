from . import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    role = db.Column(db.String(20), nullable=False) # 'recruiter' or 'student'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Profile fields
    full_name = db.Column(db.String(100))
    phone = db.Column(db.String(20))
    location = db.Column(db.String(100))
    company = db.Column(db.String(100))
    position = db.Column(db.String(100))
    bio = db.Column(db.Text)
    skills = db.Column(db.Text) # JSON string or comma-separated
    education = db.Column(db.String(200))
    
    # Relationships
    jobs = db.relationship('Job', backref='recruiter', lazy='dynamic')
    applications = db.relationship('Application', backref='student', lazy='dynamic')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Job(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    requirements = db.Column(db.Text)
    
    # Extended fields
    company = db.Column(db.String(100))
    location = db.Column(db.String(100))
    job_type = db.Column(db.String(50)) # Full-time, Part-time, etc.
    experience = db.Column(db.String(50))
    salary = db.Column(db.String(100))
    skills = db.Column(db.Text) # JSON string or comma-separated
    status = db.Column(db.String(20), default='active') # active, draft, closed
    
    deadline = db.Column(db.DateTime)
    recruiter_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    applications = db.relationship('Application', backref='job', lazy='dynamic')

class Application(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    job_id = db.Column(db.Integer, db.ForeignKey('job.id'), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    resume_path = db.Column(db.String(200), nullable=False)
    score = db.Column(db.Float)
    analysis_summary = db.Column(db.Text)
    status = db.Column(db.String(20), default='pending') # pending, shortlisted, rejected, reviewed
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Otp(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), nullable=False)
    otp_code = db.Column(db.String(6), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    expires_at = db.Column(db.DateTime, nullable=False)

class Resume(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    filename = db.Column(db.String(200), nullable=False)
    file_path = db.Column(db.String(500), nullable=False)
    is_primary = db.Column(db.Boolean, default=False)
    
    # Analysis results
    analysis_summary = db.Column(db.Text)
    skills = db.Column(db.Text)
    experience_level = db.Column(db.String(50))
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
