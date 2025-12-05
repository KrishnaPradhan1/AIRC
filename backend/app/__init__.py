from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from .config import Config

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(app)

    # Register Blueprints
    from .auth import bp as auth_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')

    from .jobs import bp as jobs_bp
    app.register_blueprint(jobs_bp, url_prefix='/api/jobs')
    
    from .applications import bp as applications_bp
    app.register_blueprint(applications_bp, url_prefix='/api/applications')

    from .analysis import bp as analysis_bp
    app.register_blueprint(analysis_bp, url_prefix='/api/analysis')

    from .resume import bp as resume_bp
    app.register_blueprint(resume_bp, url_prefix='/api/resume')

    @app.route('/health')
    def health_check():
        return {'status': 'healthy'}, 200

    return app
