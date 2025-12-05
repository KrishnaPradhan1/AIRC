from app import create_app, db
from sqlalchemy import text

app = create_app()

with app.app_context():
    # Drop all tables to ensure clean state with new schema
    db.drop_all()
    db.create_all()
    print("Database recreated with new schema.")
