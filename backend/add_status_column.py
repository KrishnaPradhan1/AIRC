from app import create_app, db
from sqlalchemy import text

app = create_app()

with app.app_context():
    try:
        # Check if column exists first (SQLite specific check, or just try adding it)
        # For SQLite: ALTER TABLE job ADD COLUMN status VARCHAR(20) DEFAULT 'active'
        db.session.execute(text("ALTER TABLE job ADD COLUMN status VARCHAR(20) DEFAULT 'active'"))
        db.session.commit()
        print("Added status column to job table.")
    except Exception as e:
        print(f"Error adding column (might already exist): {e}")
