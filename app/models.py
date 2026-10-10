import json
import math
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from app import db, login_manager

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

class User(UserMixin, db.Model):
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    name = db.Column(db.String(100), nullable=True)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(20), default='student', nullable=False)  # 'student', 'owner', 'admin'
    user_type = db.Column(db.String(30), default='student', nullable=False)  # 'student', 'working'
    is_verified = db.Column(db.Boolean, default=False, nullable=False)
    otp_code = db.Column(db.String(10), nullable=True)
    otp_expires_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    # Existing legacy profile details
    full_name = db.Column(db.String(100))
    course = db.Column(db.String(100))
    location = db.Column(db.String(100))
    food_habit = db.Column(db.String(50))
    smoking_preference = db.Column(db.String(20))
    study_habit = db.Column(db.String(50))
    bio = db.Column(db.Text)

    # Relationships
    listings = db.relationship('Listing', backref='owner', lazy='dynamic')
    favorites = db.relationship('Favorite', backref='user', lazy='dynamic', cascade='all, delete-orphan')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'name': self.name or self.full_name or self.username,
            'email': self.email,
            'role': self.role,
            'user_type': self.user_type,
            'is_verified': self.is_verified,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class Listing(db.Model):
    __tablename__ = 'listing'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False, index=True)
    category = db.Column(db.String(50), nullable=False, index=True)  # 'stays', 'food', 'essentials'
    subcategory = db.Column(db.String(50), nullable=True)            # 'pg', 'hostel', 'room', 'mess', 'cafe', 'pharmacy', etc.
    description = db.Column(db.Text, nullable=True)
    address = db.Column(db.String(255), nullable=False)
    area = db.Column(db.String(100), nullable=False, index=True)     # 'Khandwa Road', 'Bhawarkua', 'Vijay Nagar', 'Rau'
    city = db.Column(db.String(100), default='Indore', nullable=False, index=True)
    latitude = db.Column(db.Float, nullable=True, index=True)
    longitude = db.Column(db.Float, nullable=True, index=True)
    price = db.Column(db.Float, nullable=False, index=True)
    price_period = db.Column(db.String(30), default='month', nullable=False)  # 'month', 'order', 'walk-in', 'meal'
    phone = db.Column(db.String(30), nullable=True)
    whatsapp = db.Column(db.String(30), nullable=True)
    photos = db.Column(db.Text, nullable=True)                       # JSON array string of image URLs
    amenities = db.Column(db.Text, nullable=True)                    # JSON array string of amenity tags
    available_units = db.Column(db.Integer, nullable=True)           # None = unknown, 0 = confirmed 0, >0 = count
    verification_status = db.Column(db.String(30), default='unverified', nullable=False, index=True)  # 'verified', 'pending', 'unverified'
    is_active = db.Column(db.Boolean, default=True, nullable=False, index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)

    # Relationships
    reviews = db.relationship('Review', backref='listing', cascade='all, delete-orphan', lazy='dynamic')
    favorites = db.relationship('Favorite', backref='listing', cascade='all, delete-orphan', lazy='dynamic')

    def get_photos(self):
        if not self.photos:
            return []
        try:
            return json.loads(self.photos)
        except Exception:
            return [p.strip() for p in self.photos.split(',') if p.strip()]

    def set_photos(self, photos_list):
        if isinstance(photos_list, list):
            self.photos = json.dumps(photos_list)
        elif isinstance(photos_list, str):
            self.photos = json.dumps([photos_list])

    def get_amenities(self):
        if not self.amenities:
            return []
        try:
            return json.loads(self.amenities)
        except Exception:
            return [a.strip() for a in self.amenities.split(',') if a.strip()]

    def set_amenities(self, amenities_list):
        if isinstance(amenities_list, list):
            self.amenities = json.dumps(amenities_list)
        elif isinstance(amenities_list, str):
            self.amenities = json.dumps([amenities_list])

    def get_average_rating(self):
        revs = self.reviews.all()
        if not revs:
            return None
        return round(sum(r.rating for r in revs) / len(revs), 1)

    def get_review_count(self):
        return self.reviews.count()

    def calculate_distance_km(self, target_lat, target_lng):
        """Calculate Haversine distance in km."""
        if self.latitude is None or self.longitude is None or target_lat is None or target_lng is None:
            return None
        # Radius of the earth in km
        r = 6371.0
        lat1 = math.radians(target_lat)
        lon1 = math.radians(target_lng)
        lat2 = math.radians(self.latitude)
        lon2 = math.radians(self.longitude)

        dlat = lat2 - lat1
        dlon = lon2 - lon1

        a = math.sin(dlat / 2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return round(r * c, 2)

    def to_dict(self, target_lat=None, target_lng=None):
        avg_rating = self.get_average_rating()
        rev_count = self.get_review_count()
        dist_km = self.calculate_distance_km(target_lat, target_lng) if (target_lat and target_lng) else None

        # Build distance text
        if dist_km is not None:
            if dist_km < 1.0:
                dist_str = f"{int(dist_km * 1000)}m away"
            else:
                dist_str = f"{dist_km}km away"
        else:
            dist_str = None

        return {
            'id': self.id,
            'name': self.name,
            'category': self.category,
            'subcategory': self.subcategory,
            'description': self.description,
            'address': self.address,
            'area': self.area,
            'city': self.city,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'price': self.price,
            'price_period': self.price_period,
            'phone': self.phone,
            'whatsapp': self.whatsapp,
            'photos': self.get_photos(),
            'amenities': self.get_amenities(),
            'available_units': self.available_units,
            'verification_status': self.verification_status,
            'is_verified': self.verification_status == 'verified',
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'rating': avg_rating,
            'review_count': rev_count,
            'distance_km': dist_km,
            'distance_text': dist_str,
            'owner_id': self.owner_id
        }


class Review(db.Model):
    __tablename__ = 'review'

    id = db.Column(db.Integer, primary_key=True)
    listing_id = db.Column(db.Integer, db.ForeignKey('listing.id'), nullable=False, index=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False, index=True)
    rating = db.Column(db.Integer, nullable=False)  # 1 to 5
    comment = db.Column(db.Text, nullable=False)
    visit_verified = db.Column(db.Boolean, default=False, nullable=False)
    upvotes = db.Column(db.Integer, default=0, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    user = db.relationship('User', backref=db.backref('reviews', lazy='dynamic'))

    def to_dict(self):
        return {
            'id': self.id,
            'listing_id': self.listing_id,
            'user_id': self.user_id,
            'author_name': self.user.name or self.user.username if self.user else 'Indore Student',
            'rating': self.rating,
            'comment': self.comment,
            'visit_verified': self.visit_verified,
            'upvotes': self.upvotes,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class Favorite(db.Model):
    __tablename__ = 'favorite'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False, index=True)
    listing_id = db.Column(db.Integer, db.ForeignKey('listing.id'), nullable=False, index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    __table_args__ = (
        db.UniqueConstraint('user_id', 'listing_id', name='uq_user_listing_favorite'),
    )

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'listing_id': self.listing_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'listing': self.listing.to_dict() if self.listing else None
        }


# ==========================================
# Legacy Models Preserved for Compatibility
# ==========================================

class Room(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    amenities = db.Column(db.String(200))
    mess_included = db.Column(db.Boolean, default=False)
    description = db.Column(db.Text)

class MessReview(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    mess_name = db.Column(db.String(100), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    hygiene_rating = db.Column(db.Integer, nullable=False)
    review_text = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class ForumPost(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    category = db.Column(db.String(50), default='Discussion')
    title = db.Column(db.String(150), nullable=False)
    content = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(20), default='Open')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user = db.relationship('User', backref='posts')

class RoommateFeedback(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    target_user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    feedback_text = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)