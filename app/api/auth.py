import datetime
import jwt
from functools import wraps
from flask import request, jsonify, current_app
from app.models import User

def generate_token(user):
    payload = {
        'sub': user.id,
        'username': user.username,
        'role': user.role,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=current_app.config.get('JWT_EXPIRATION_HOURS', 72)),
        'iat': datetime.datetime.utcnow()
    }
    return jwt.encode(payload, current_app.config.get('JWT_SECRET', 'dev-secret'), algorithm='HS256')

def decode_token(token):
    try:
        return jwt.decode(token, current_app.config.get('JWT_SECRET', 'dev-secret'), algorithms=['HS256'])
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return None

def jwt_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'success': False, 'error': 'Unauthorized', 'message': 'Missing or invalid authentication token'}), 401
        
        token = auth_header.split(' ')[1]
        payload = decode_token(token)
        if not payload:
            return jsonify({'success': False, 'error': 'Unauthorized', 'message': 'Token has expired or is invalid'}), 401
        
        current_api_user = User.query.get(payload['sub'])
        if not current_api_user:
            return jsonify({'success': False, 'error': 'Unauthorized', 'message': 'User no longer exists'}), 401
        
        return f(current_api_user, *args, **kwargs)
    return decorated

def optional_jwt(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        current_api_user = None
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
            payload = decode_token(token)
            if payload:
                current_api_user = User.query.get(payload['sub'])
        return f(current_api_user, *args, **kwargs)
    return decorated
