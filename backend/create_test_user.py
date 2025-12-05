from app import create_app, db
from app.models import User

app = create_app()

with app.app_context():
    email = "recruiter@example.com"
    user = User.query.filter_by(email=email).first()
    if not user:
        user = User(email=email, role='recruiter', full_name="Test Recruiter")
        user.set_password("password123")
        db.session.add(user)
        db.session.commit()
        print(f"Created user {email}")
    else:
        print(f"User {email} already exists")

    student_email = "student@example.com"
    student = User.query.filter_by(email=student_email).first()
    if not student:
        student = User(email=student_email, role='student', full_name="Test Student")
        student.set_password("password123")
        db.session.add(student)
        db.session.commit()
        print(f"Created user {student_email}")
    else:
        print(f"User {student_email} already exists")
