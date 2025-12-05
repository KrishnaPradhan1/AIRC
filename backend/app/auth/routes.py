from flask import request, jsonify, redirect, url_for, current_app
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app import db
from app.models import User, Otp
from . import bp
from .utils import create_and_send_otp
from datetime import datetime
import requests
import os

@bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')
    full_name = data.get('name')
    
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already registered'}), 400
        
    user = User(email=email, role=role, full_name=full_name)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    
    return jsonify({'message': 'User registered successfully'}), 201

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({'error': 'Invalid credentials'}), 401
        
    access_token = create_access_token(identity=str(user.id), additional_claims={'role': user.role})
    return jsonify({'access_token': access_token, 'role': user.role}), 200

@bp.route('/send-otp', methods=['POST'])
def send_otp_route():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({'error': 'Email is required'}), 400
    
    create_and_send_otp(email)
    return jsonify({'message': 'OTP sent successfully'}), 200

@bp.route('/verify-otp', methods=['POST'])
def verify_otp():
    data = request.get_json()
    email = data.get('email')
    otp_code = data.get('otp')
    
    otp_entry = Otp.query.filter_by(email=email).first()
    
    if not otp_entry or otp_entry.otp_code != otp_code:
        return jsonify({'error': 'Invalid OTP'}), 400
        
    if otp_entry.expires_at < datetime.utcnow():
        return jsonify({'error': 'OTP expired'}), 400
        
    # If OTP is valid, we can log the user in or allow password reset
    # For now, let's assume it's for login/signup verification
    
    # Check if user exists
    user = User.query.filter_by(email=email).first()
    if user:
        access_token = create_access_token(identity=str(user.id), additional_claims={'role': user.role})
        return jsonify({'message': 'OTP verified', 'access_token': access_token, 'role': user.role}), 200
    else:
        return jsonify({'message': 'OTP verified, please complete registration', 'verified': True}), 200

# Google Auth Placeholder
@bp.route('/google', methods=['GET'])
def google_login():
    # Redirect to Google OAuth
    # This requires client ID and redirect URI
    return jsonify({'message': 'Google login not fully implemented yet'}), 501

@bp.route('/reset-password', methods=['POST'])
@jwt_required()
def reset_password():
    data = request.get_json()
    new_password = data.get('password')
    
    if not new_password:
        return jsonify({'error': 'Password is required'}), 400
        
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
        
    user.set_password(new_password)
    db.session.commit()
    
    return jsonify({'message': 'Password updated successfully'}), 200

@bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
        
    return jsonify({
        'name': user.full_name,
        'email': user.email,
        'phone': user.phone,
        'location': user.location,
        'company': user.company,
        'position': user.position,
        'bio': user.bio,
        'skills': user.skills.split(',') if user.skills else [],
        'education': user.education
    }), 200

@bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
        
    data = request.get_json()
    
    user.full_name = data.get('name', user.full_name)
    user.phone = data.get('phone', user.phone)
    user.location = data.get('location', user.location)
    user.company = data.get('company', user.company)
    user.position = data.get('position', user.position)
    user.bio = data.get('bio', user.bio)
    user.education = data.get('education', user.education)
    
    skills = data.get('skills')
    if skills is not None:
        user.skills = ','.join(skills) if isinstance(skills, list) else skills
        
    db.session.commit()
    
    return jsonify({'message': 'Profile updated successfully'}), 200
