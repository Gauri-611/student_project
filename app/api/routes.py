import math
import re
from datetime import datetime
from flask import request, jsonify
from app import db
from app.models import Listing, Review, Favorite, User
from app.api import api_v1
from app.api.auth import generate_token, jwt_required, optional_jwt

# ==============================================================================
# 1. Health & Destination Info
# ==============================================================================

@api_v1.route('/health', methods=['GET'])
def health():
    return jsonify({
        'success': True,
        'status': 'healthy',
        'service': 'NearU Indore City Discovery Platform',
        'version': '1.0.0',
        'city': 'Indore',
        'timestamp': datetime.utcnow().isoformat()
    }), 200

@api_v1.route('/destinations', methods=['GET'])
def get_destinations():
    destinations = [
        {'id': 'iet-davv', 'name': 'IET-DAVV', 'subtitle': 'Khandwa Road Hub', 'latitude': 22.6806, 'longitude': 75.8778, 'area': 'Khandwa Road'},
        {'id': 'bhawarkua', 'name': 'Bhawarkua', 'subtitle': 'Student & Coaching Central', 'latitude': 22.6923, 'longitude': 75.8672, 'area': 'Bhawarkua'},
        {'id': 'vijay-nagar', 'name': 'Vijay Nagar', 'subtitle': 'Tech Park & Cafes', 'latitude': 22.7533, 'longitude': 75.8937, 'area': 'Vijay Nagar'},
        {'id': 'rau', 'name': 'Rau', 'subtitle': 'Medicaps & IIM Corridor', 'latitude': 22.6324, 'longitude': 75.8085, 'area': 'Rau'},
        {'id': 'sgsits', 'name': 'SGSITS', 'subtitle': 'Vallabh Nagar / Lantern Sq', 'latitude': 22.7244, 'longitude': 75.8711, 'area': 'Vallabh Nagar'}
    ]
    return jsonify({'success': True, 'data': destinations}), 200

# ==============================================================================
# 2. Listings Endpoints
# ==============================================================================

@api_v1.route('/listings', methods=['GET'])
def get_listings():
    query = Listing.query.filter_by(is_active=True)

    # 1. Search Query (name, description, address, area)
    search = request.args.get('search') or request.args.get('q')
    if search:
        search_term = f"%{search.strip()}%"
        query = query.filter(
            (Listing.name.ilike(search_term)) |
            (Listing.description.ilike(search_term)) |
            (Listing.address.ilike(search_term)) |
            (Listing.area.ilike(search_term)) |
            (Listing.subcategory.ilike(search_term))
        )

    # 2. Category ('stays', 'food', 'essentials')
    category = request.args.get('category')
    if category and category.lower() != 'all':
        query = query.filter(Listing.category == category.lower())

    # 3. Area / Destination
    area = request.args.get('area')
    if area and area.lower() != 'all':
        query = query.filter(Listing.area.ilike(f"%{area.strip()}%"))

    # 4. Price range
    min_price = request.args.get('min_price', type=float)
    if min_price is not None:
        query = query.filter(Listing.price >= min_price)

    max_price = request.args.get('max_price', type=float)
    if max_price is not None:
        query = query.filter(Listing.price <= max_price)

    # 5. Availability filter
    availability = request.args.get('availability')
    if availability == 'available':
        # Available means either available_units > 0 OR available_units is not confirmed 0
        query = query.filter((Listing.available_units > 0) | (Listing.available_units.is_(None)))
    elif availability == 'confirmed_zero':
        query = query.filter(Listing.available_units == 0)

    # 6. Specific amenity toggles
    food_included = request.args.get('food_included')
    if food_included in ('true', '1', 'yes'):
        query = query.filter(Listing.amenities.ilike('%food%') | Listing.amenities.ilike('%thali%') | Listing.amenities.ilike('%mess%'))

    has_ac = request.args.get('has_ac')
    if has_ac in ('true', '1', 'yes'):
        query = query.filter(Listing.amenities.ilike('%ac%') | Listing.amenities.ilike('%air condition%'))

    has_wifi = request.args.get('has_wifi')
    if has_wifi in ('true', '1', 'yes'):
        query = query.filter(Listing.amenities.ilike('%wifi%') | Listing.amenities.ilike('%wi-fi%') | Listing.amenities.ilike('%internet%'))

    # Coordinates for distance calculations
    target_lat = request.args.get('lat', type=float)
    target_lng = request.args.get('lng', type=float)
    radius_km = request.args.get('radius_km', type=float)

    # Execute base query
    all_results = query.all()

    # Process and filter in Python for complex calculations (Distance & Rating)
    min_rating = request.args.get('min_rating', type=float)
    processed = []

    for item in all_results:
        item_dict = item.to_dict(target_lat=target_lat, target_lng=target_lng)
        
        # Filter by minimum rating if requested
        if min_rating is not None:
            if item_dict['rating'] is None or item_dict['rating'] < min_rating:
                continue

        # Filter by radius if requested
        if radius_km is not None and item_dict['distance_km'] is not None:
            if item_dict['distance_km'] > radius_km:
                continue

        processed.append(item_dict)

    # 7. Sorting
    sort_by = request.args.get('sort', 'default')
    if sort_by == 'price_asc':
        processed.sort(key=lambda x: x['price'])
    elif sort_by == 'price_desc':
        processed.sort(key=lambda x: x['price'], reverse=True)
    elif sort_by == 'rating_desc':
        processed.sort(key=lambda x: (x['rating'] is not None, x['rating'] or 0), reverse=True)
    elif sort_by == 'distance_asc' and target_lat and target_lng:
        processed.sort(key=lambda x: (x['distance_km'] is not None, x['distance_km'] or float('inf')))
    elif sort_by == 'newest':
        processed.sort(key=lambda x: x['created_at'] or '', reverse=True)

    # 8. Pagination
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 50, type=int)
    limit = min(max(1, limit), 100)
    page = max(1, page)

    total_count = len(processed)
    start_idx = (page - 1) * limit
    end_idx = start_idx + limit
    paginated_data = processed[start_idx:end_idx]

    return jsonify({
        'success': True,
        'count': len(paginated_data),
        'total': total_count,
        'page': page,
        'pages': math.ceil(total_count / limit) if total_count > 0 else 1,
        'data': paginated_data
    }), 200

@api_v1.route('/listings/<int:listing_id>', methods=['GET'])
def get_listing(listing_id):
    listing = Listing.query.filter_by(id=listing_id, is_active=True).first()
    if not listing:
        return jsonify({'success': False, 'error': 'Not Found', 'message': f'Listing with ID {listing_id} not found'}), 404

    target_lat = request.args.get('lat', type=float)
    target_lng = request.args.get('lng', type=float)
    
    data = listing.to_dict(target_lat=target_lat, target_lng=target_lng)
    
    # Attach reviews directly
    reviews = listing.reviews.order_by(Review.created_at.desc()).all()
    data['reviews'] = [r.to_dict() for r in reviews]

    return jsonify({'success': True, 'data': data}), 200

@api_v1.route('/listings', methods=['POST'])
@optional_jwt
def create_listing(current_user):
    body = request.get_json() or {}

    # Required validation
    required_fields = ['name', 'category', 'address', 'area', 'price']
    missing = [f for f in required_fields if not body.get(f)]
    if missing:
        return jsonify({
            'success': False,
            'error': 'Bad Request',
            'message': f"Missing required fields: {', '.join(missing)}"
        }), 400

    # Clean & validate category
    valid_categories = ['stays', 'food', 'essentials']
    category = str(body['category']).lower().strip()
    if category not in valid_categories:
        return jsonify({
            'success': False,
            'error': 'Bad Request',
            'message': f"Invalid category. Must be one of {valid_categories}"
        }), 400

    # Price validation
    try:
        price = float(body['price'])
        if price < 0:
            raise ValueError
    except (ValueError, TypeError):
        return jsonify({'success': False, 'error': 'Bad Request', 'message': 'Price must be a valid positive number'}), 400

    # Units availability handling: distinguish unknown vs confirmed zero
    raw_units = body.get('available_units')
    if raw_units is not None and raw_units != '':
        try:
            available_units = int(raw_units)
        except (ValueError, TypeError):
            available_units = None
    else:
        available_units = None

    # Owner assignment
    owner_id = current_user.id if current_user else None

    # If created by admin or verified owner, auto-verify, otherwise mark as pending
    verification_status = 'verified' if (current_user and current_user.role in ('admin', 'owner')) else 'pending'

    new_listing = Listing(
        name=body['name'].strip(),
        category=category,
        subcategory=body.get('subcategory', '').strip() or None,
        description=body.get('description', '').strip() or None,
        address=body['address'].strip(),
        area=body['area'].strip(),
        city=body.get('city', 'Indore').strip(),
        latitude=float(body['latitude']) if body.get('latitude') else None,
        longitude=float(body['longitude']) if body.get('longitude') else None,
        price=price,
        price_period=body.get('price_period', 'month').strip(),
        phone=body.get('phone', '').strip() or None,
        whatsapp=body.get('whatsapp', '').strip() or None,
        available_units=available_units,
        verification_status=verification_status,
        owner_id=owner_id
    )

    if 'photos' in body:
        new_listing.set_photos(body['photos'])
    if 'amenities' in body:
        new_listing.set_amenities(body['amenities'])

    db.session.add(new_listing)
    db.session.commit()

    return jsonify({
        'success': True,
        'message': 'Listing created successfully',
        'data': new_listing.to_dict()
    }), 201

@api_v1.route('/listings/<int:listing_id>', methods=['PATCH'])
@jwt_required
def update_listing(current_user, listing_id):
    listing = Listing.query.get(listing_id)
    if not listing:
        return jsonify({'success': False, 'error': 'Not Found', 'message': 'Listing not found'}), 404

    # Authorization check: only owner or admin can edit
    if current_user.role != 'admin' and listing.owner_id != current_user.id:
        return jsonify({'success': False, 'error': 'Forbidden', 'message': 'You are not authorized to modify this listing'}), 403

    body = request.get_json() or {}

    updatable_fields = ['name', 'description', 'address', 'area', 'city', 'price', 'price_period', 'phone', 'whatsapp', 'latitude', 'longitude', 'is_active']
    for field in updatable_fields:
        if field in body:
            setattr(listing, field, body[field])

    if 'available_units' in body:
        listing.available_units = int(body['available_units']) if body['available_units'] is not None else None

    if 'photos' in body:
        listing.set_photos(body['photos'])
    if 'amenities' in body:
        listing.set_amenities(body['amenities'])

    # Admin only update for verification_status
    if 'verification_status' in body and current_user.role == 'admin':
        listing.verification_status = body['verification_status']

    listing.updated_at = datetime.utcnow()
    db.session.commit()

    return jsonify({
        'success': True,
        'message': 'Listing updated successfully',
        'data': listing.to_dict()
    }), 200

# ==============================================================================
# 3. Reviews Endpoints
# ==============================================================================

@api_v1.route('/listings/<int:listing_id>/reviews', methods=['GET'])
def get_listing_reviews(listing_id):
    listing = Listing.query.get(listing_id)
    if not listing:
        return jsonify({'success': False, 'error': 'Not Found', 'message': 'Listing not found'}), 404

    reviews = listing.reviews.order_by(Review.created_at.desc()).all()
    return jsonify({
        'success': True,
        'count': len(reviews),
        'data': [r.to_dict() for r in reviews]
    }), 200

@api_v1.route('/listings/<int:listing_id>/reviews', methods=['POST'])
@optional_jwt
def add_listing_review(current_user, listing_id):
    listing = Listing.query.get(listing_id)
    if not listing:
        return jsonify({'success': False, 'error': 'Not Found', 'message': 'Listing not found'}), 404

    body = request.get_json() or {}
    
    rating = body.get('rating')
    comment = body.get('comment', '').strip()
    
    if rating is None or not (1 <= int(rating) <= 5):
        return jsonify({'success': False, 'error': 'Bad Request', 'message': 'Rating must be an integer between 1 and 5'}), 400
    
    if not comment:
        return jsonify({'success': False, 'error': 'Bad Request', 'message': 'Comment is required'}), 400

    # User handling
    user_id = current_user.id if current_user else None
    
    # If anonymous/unregistered, associate with a default guest student or create a guest user
    if not user_id:
        author_name = body.get('author_name', 'Indore Fresher').strip()
        # Find or create guest user
        guest_user = User.query.filter_by(username='guest_student').first()
        if not guest_user:
            guest_user = User(username='guest_student', email='guest@nearu.in', name='Verified Student')
            guest_user.set_password('nearu-guest-pass-2026')
            db.session.add(guest_user)
            db.session.commit()
        user_id = guest_user.id
        visit_verified = body.get('visit_verified', False)
    else:
        visit_verified = body.get('visit_verified', True)

    new_review = Review(
        listing_id=listing.id,
        user_id=user_id,
        rating=int(rating),
        comment=comment,
        visit_verified=visit_verified,
        upvotes=1
    )
    db.session.add(new_review)
    db.session.commit()

    return jsonify({
        'success': True,
        'message': 'Review submitted successfully',
        'data': new_review.to_dict()
    }), 201

# ==============================================================================
# 4. Auth Endpoints
# ==============================================================================

# ==============================================================================
# 4. Auth & Email OTP Endpoints
# ==============================================================================

import random
from datetime import timedelta

@api_v1.route('/auth/register', methods=['POST'])
def register_user():
    body = request.get_json() or {}
    
    email = body.get('email', '').strip().lower()
    username = body.get('username', '').strip()
    password = body.get('password', '')
    name = body.get('name', '').strip()
    user_type = body.get('user_type', 'student').strip().lower()  # 'student' or 'working'
    role = body.get('role', 'student').strip().lower()

    if not email or not password:
        return jsonify({'success': False, 'error': 'Bad Request', 'message': 'Email and password are required'}), 400

    if not username:
        username = email.split('@')[0] + str(random.randint(100, 999))
    if not name:
        name = username

    # Validate email
    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return jsonify({'success': False, 'error': 'Bad Request', 'message': 'Invalid email address format'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'success': False, 'error': 'Conflict', 'message': 'An account with this email already exists'}), 409

    # Generate 6-digit OTP for email verification
    otp = str(random.randint(100000, 999999))
    expires = datetime.utcnow() + timedelta(minutes=10)

    user = User(
        username=username,
        email=email,
        name=name,
        role=role if role in ('student', 'owner', 'admin') else 'student',
        user_type='working' if user_type in ('working', 'working professional', 'professional') else 'student',
        otp_code=otp,
        otp_expires_at=expires,
        is_verified=False
    )
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    token = generate_token(user)

    return jsonify({
        'success': True,
        'message': f'Registration successful. OTP sent to {email}',
        'otp_required': True,
        'otp': otp,  # Included so demo/sandbox can auto-display or autofill
        'token': token,
        'user': user.to_dict()
    }), 201

@api_v1.route('/auth/send-otp', methods=['POST'])
def send_email_otp():
    body = request.get_json() or {}
    email = body.get('email', '').strip().lower()

    if not email:
        return jsonify({'success': False, 'error': 'Bad Request', 'message': 'Email is required'}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'success': False, 'error': 'Not Found', 'message': 'No user found with this email'}), 404

    otp = str(random.randint(100000, 999999))
    user.otp_code = otp
    user.otp_expires_at = datetime.utcnow() + timedelta(minutes=10)
    db.session.commit()

    return jsonify({
        'success': True,
        'message': f'OTP successfully sent to {email}',
        'otp': otp  # Provided for demo/testing
    }), 200

@api_v1.route('/auth/verify-otp', methods=['POST'])
def verify_email_otp():
    body = request.get_json() or {}
    email = body.get('email', '').strip().lower()
    otp = body.get('otp', '').strip()

    if not email or not otp:
        return jsonify({'success': False, 'error': 'Bad Request', 'message': 'Email and OTP code are required'}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'success': False, 'error': 'Not Found', 'message': 'User not found'}), 404

    if not user.otp_code or user.otp_code != otp:
        return jsonify({'success': False, 'error': 'Unauthorized', 'message': 'Invalid verification code'}), 401

    if user.otp_expires_at and user.otp_expires_at < datetime.utcnow():
        return jsonify({'success': False, 'error': 'Unauthorized', 'message': 'Verification code has expired. Please request a new one'}), 401

    # Mark as verified
    user.is_verified = True
    user.otp_code = None
    db.session.commit()

    token = generate_token(user)

    return jsonify({
        'success': True,
        'message': 'Email verified successfully! Welcome to NearU.',
        'token': token,
        'user': user.to_dict()
    }), 200

@api_v1.route('/auth/login', methods=['POST'])
def login_user_api():
    body = request.get_json() or {}
    
    identifier = body.get('email') or body.get('username')
    password = body.get('password')

    if not identifier or not password:
        return jsonify({'success': False, 'error': 'Bad Request', 'message': 'Email and password are required'}), 400

    identifier = identifier.strip().lower()
    user = User.query.filter((User.email == identifier) | (User.username == identifier)).first()

    if not user or not user.check_password(password):
        return jsonify({'success': False, 'error': 'Unauthorized', 'message': 'Invalid email or password'}), 401

    token = generate_token(user)

    return jsonify({
        'success': True,
        'message': 'Login successful',
        'token': token,
        'user': user.to_dict()
    }), 200

# ==============================================================================
# 5. Favorites Endpoints
# ==============================================================================

@api_v1.route('/favorites', methods=['GET'])
@jwt_required
def get_user_favorites(current_user):
    favs = Favorite.query.filter_by(user_id=current_user.id).all()
    return jsonify({
        'success': True,
        'count': len(favs),
        'data': [f.to_dict() for f in favs]
    }), 200

@api_v1.route('/favorites', methods=['POST'])
@jwt_required
def add_favorite(current_user):
    body = request.get_json() or {}
    listing_id = body.get('listing_id')

    if not listing_id:
        return jsonify({'success': False, 'error': 'Bad Request', 'message': 'listing_id is required'}), 400

    listing = Listing.query.get(listing_id)
    if not listing:
        return jsonify({'success': False, 'error': 'Not Found', 'message': 'Listing not found'}), 404

    existing = Favorite.query.filter_by(user_id=current_user.id, listing_id=listing.id).first()
    if existing:
        # Toggle off if already favorited
        db.session.delete(existing)
        db.session.commit()
        return jsonify({'success': True, 'action': 'removed', 'message': 'Removed from favorites'}), 200

    new_fav = Favorite(user_id=current_user.id, listing_id=listing.id)
    db.session.add(new_fav)
    db.session.commit()

    return jsonify({'success': True, 'action': 'added', 'message': 'Added to favorites', 'data': new_fav.to_dict()}), 201
