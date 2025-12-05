import random
import string
import smtplib
from email.mime.text import MIMEText
from datetime import datetime, timedelta
from flask import current_app
from app import db
from app.models import Otp

def generate_otp(length=6):
    return ''.join(random.choices(string.digits, k=length))

def send_email(to_email, subject, body):
    # Placeholder for email sending logic
    # In production, use Flask-Mail or an external service like SendGrid
    print(f"Sending email to {to_email}: {subject}\n{body}")
    
    # Mock implementation
    if current_app.config['MAIL_SERVER']:
        try:
            msg = MIMEText(body)
            msg['Subject'] = subject
            msg['From'] = current_app.config['MAIL_USERNAME']
            msg['To'] = to_email
            
            with smtplib.SMTP(current_app.config['MAIL_SERVER'], current_app.config['MAIL_PORT']) as server:
                if current_app.config['MAIL_USE_TLS']:
                    server.starttls()
                server.login(current_app.config['MAIL_USERNAME'], current_app.config['MAIL_PASSWORD'])
                server.send_message(msg)
        except Exception as e:
            print(f"Failed to send email: {e}")

def create_and_send_otp(email):
    otp_code = generate_otp()
    expires_at = datetime.utcnow() + timedelta(minutes=10)
    
    # Remove existing OTPs for this email
    Otp.query.filter_by(email=email).delete()
    
    otp = Otp(email=email, otp_code=otp_code, expires_at=expires_at)
    db.session.add(otp)
    db.session.commit()
    
    send_email(email, "Your OTP Code", f"Your OTP code is: {otp_code}")
    return otp_code
