from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_cors import CORS
from config import Config

db = SQLAlchemy()
login_manager = LoginManager()
cors = CORS()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    db.init_app(app)
    login_manager.init_app(app)
    login_manager.login_view = 'main.login'

    # Enable CORS for React frontend
    cors.init_app(
        app,
        resources={r"/api/*": {"origins": app.config.get('CORS_ORIGINS', '*')}},
        supports_credentials=True
    )

    # Register blueprints
    from app.routes import main
    app.register_blueprint(main)

    from app.api import api_v1
    app.register_blueprint(api_v1)

    # Create tables if not present
    with app.app_context():
        db.create_all()

    # JSON error handlers for API
    @app.errorhandler(404)
    def handle_404(e):
        return jsonify({"success": False, "error": "Not Found", "message": "The requested resource was not found"}), 404

    @app.errorhandler(500)
    def handle_500(e):
        return jsonify({"success": False, "error": "Internal Server Error", "message": "An unexpected error occurred"}), 500

    return app