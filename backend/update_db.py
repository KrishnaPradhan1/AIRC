from app import create_app, db
from sqlalchemy import text

app = create_app()

with app.app_context():
    # Drop application table
    try:
        db.session.execute(text('DROP TABLE IF EXISTS application'))
        db.session.commit()
        print("Dropped application table.")
    except Exception as e:
        print(f"Error dropping table: {e}")

    # Create all tables (will recreate application)
    db.create_all()
    print("Database tables updated.")
