import os
from app import create_app, db
from app.models import User, Listing, Review

app = create_app()

def seed_database():
    with app.app_context():
        # Ensure tables are created
        db.create_all()

        print("Checking existing listings in database...")
        existing_count = Listing.query.count()
        if existing_count > 0:
            print(f"Database already contains {existing_count} listings. Skipping seed or refreshing...")
            return

        print("Seeding initial users...")
        # Create users
        student_user = User.query.filter_by(username='ananya_iet').first()
        if not student_user:
            student_user = User(
                username='ananya_iet',
                email='ananya.iet@davv.ac.in',
                name='Ananya Sharma',
                role='student'
            )
            student_user.set_password('student123')
            db.session.add(student_user)

        rahul_user = User.query.filter_by(username='rahul_davv').first()
        if not rahul_user:
            rahul_user = User(
                username='rahul_davv',
                email='rahul.davv@gmail.com',
                name='Rahul Verma',
                role='student'
            )
            rahul_user.set_password('student123')
            db.session.add(rahul_user)

        priya_user = User.query.filter_by(username='priya_tech').first()
        if not priya_user:
            priya_user = User(
                username='priya_tech',
                email='priya.tech@gmail.com',
                name='Priya Patel',
                role='student'
            )
            priya_user.set_password('student123')
            db.session.add(priya_user)

        admin_user = User.query.filter_by(username='nearu_admin').first()
        if not admin_user:
            admin_user = User(
                username='nearu_admin',
                email='admin@nearu.in',
                name='NearU Indore Admin',
                role='admin'
            )
            admin_user.set_password('indoreAdmin2026!')
            db.session.add(admin_user)

        db.session.commit()

        print("Seeding verified Indore listings...")

        listings_data = [
            {
                'name': 'Campus View PG',
                'category': 'stays',
                'subcategory': 'pg',
                'description': 'Located right behind IET-DAVV Gate 2. Spacious 2-sharing rooms with study tables, high-speed fiber internet, and home-cooked meals by an Indore native aunty.',
                'address': 'Near Gate 2, Khandwa Road, Indore',
                'area': 'Khandwa Road',
                'city': 'Indore',
                'latitude': 22.6845,
                'longitude': 75.8792,
                'price': 6500.0,
                'price_period': 'month',
                'phone': '+91 98260 12345',
                'whatsapp': '919826012345',
                'available_units': 2,
                'verification_status': 'verified',
                'amenities': ["Wi-Fi 100Mbps", "3 Times Food", "RO Water", "CCTV", "Daily Cleaning", "AC Available"],
                'photos': [
                    "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80"
                ]
            },
            {
                'name': 'Maa’s Kitchen',
                'category': 'food',
                'subcategory': 'mess',
                'description': 'Authentic Indori ghar-ka-khana. Low oil, fresh rotis right from tawa, and daily rotating seasonal subzis. Highly rated by DAVV hostelites.',
                'address': 'Main Market, Khandwa Road, near IET Canteen',
                'area': 'Khandwa Road',
                'city': 'Indore',
                'latitude': 22.6820,
                'longitude': 75.8765,
                'price': 2500.0,
                'price_period': 'month',
                'phone': '+91 94250 88921',
                'whatsapp': '919425088921',
                'available_units': 15,
                'verification_status': 'verified',
                'amenities': ["Pure Veg", "Unlimited Lunch & Dinner", "Sunday Special Desserts", "Jain Food Option", "Trial Meal ₹70"],
                'photos': [
                    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=800&q=80"
                ]
            },
            {
                'name': 'Student Stay Hostel',
                'category': 'stays',
                'subcategory': 'hostel',
                'description': 'Budget-friendly student rooms with great cross-ventilation. Peaceful study atmosphere, regular cleaning, and flexible entry timings for coaching students.',
                'address': 'Bhawarkua Main Road, Rajiv Gandhi Square',
                'area': 'Bhawarkua',
                'city': 'Indore',
                'latitude': 22.6935,
                'longitude': 75.8650,
                'price': 5500.0,
                'price_period': 'month',
                'phone': '+91 97555 43210',
                'whatsapp': '919755543210',
                'available_units': 5,
                'verification_status': 'verified',
                'amenities': ["Power Backup", "Wi-Fi", "Geyser", "Bike Parking", "Warden Onsite"],
                'photos': [
                    "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80"
                ]
            },
            {
                'name': 'Apollo & MedPlus 24x7',
                'category': 'essentials',
                'subcategory': 'pharmacy',
                'description': 'Trusted 24-hour medical pharmacy right outside the main gate. Delivers prescribed medicines directly to campus hostels at odd hours.',
                'address': 'Opposite DAVV University Gate, Indore',
                'area': 'Khandwa Road',
                'city': 'Indore',
                'latitude': 22.6815,
                'longitude': 75.8780,
                'price': 0.0,
                'price_period': 'walk-in',
                'phone': '+91 98930 77112',
                'whatsapp': '919893077112',
                'available_units': None,
                'verification_status': 'verified',
                'amenities': ["24/7 Open", "Home Delivery to Hostel", "First Aid", "Doctor Consult", "Digital Payments"],
                'photos': [
                    "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=80"
                ]
            },
            {
                'name': 'Chai & Charcha Co-study Cafe',
                'category': 'food',
                'subcategory': 'cafe',
                'description': 'The unofficial engineering hangout of DAVV. Chill lo-fi music, great adrak tea, charging points on every desk, and open through midnight exam crunches.',
                'address': 'Near IET Ground Corner, Indore',
                'area': 'Khandwa Road',
                'city': 'Indore',
                'latitude': 22.6830,
                'longitude': 75.8810,
                'price': 80.0,
                'price_period': 'order',
                'phone': '+91 91110 54321',
                'whatsapp': '919111054321',
                'available_units': None,
                'verification_status': 'verified',
                'amenities': ["High-speed Wi-Fi 300Mbps", "Power Sockets at every table", "Quiet Study Zone", "Kullhad Chai", "Quick Sandwiches", "Open till 3:00 AM"],
                'photos': [
                    "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80"
                ]
            },
            {
                'name': 'The Hive Modern Residency',
                'category': 'stays',
                'subcategory': 'pg',
                'description': 'Designed for young professionals and design/tech students. Soundproof work pods, ergonomic chairs, super clean washrooms, and chef-curated meals.',
                'address': 'Plot 124, Scheme 54, Behind C21 Mall, Vijay Nagar',
                'area': 'Vijay Nagar',
                'city': 'Indore',
                'latitude': 22.7540,
                'longitude': 75.8945,
                'price': 8500.0,
                'price_period': 'month',
                'phone': '+91 93011 22334',
                'whatsapp': '919301122334',
                'available_units': 1,
                'verification_status': 'verified',
                'amenities': ["Air Conditioned", "Biometric Entry", "Housekeeping", "4 Meals Included", "Gaming Lounge", "Gym"],
                'photos': [
                    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80"
                ]
            }
        ]

        created_listings = []
        for l_data in listings_data:
            photos = l_data.pop('photos')
            amenities = l_data.pop('amenities')
            item = Listing(**l_data)
            item.set_photos(photos)
            item.set_amenities(amenities)
            db.session.add(item)
            created_listings.append(item)

        db.session.commit()

        print("Seeding authentic student reviews...")
        # Add authentic reviews
        rev1 = Review(
            listing_id=created_listings[0].id,
            user_id=student_user.id,
            rating=5,
            comment="Stayed here for 8 months. Food is actually decent 👀 Owner is chill too.",
            visit_verified=True,
            upvotes=42
        )
        rev2 = Review(
            listing_id=created_listings[2].id,
            user_id=rahul_user.id,
            rating=4,
            comment="Best thing is how close everything is. Mess, pharmacy and grocery are all within walking distance.",
            visit_verified=True,
            upvotes=38
        )
        rev3 = Review(
            listing_id=created_listings[5].id,
            user_id=priya_user.id,
            rating=5,
            comment="Room was exactly like the photos. No broker drama.",
            visit_verified=True,
            upvotes=56
        )
        rev4 = Review(
            listing_id=created_listings[1].id,
            user_id=student_user.id,
            rating=5,
            comment="Maa’s Kitchen literally saved my semester. Actual ghar ka khana without floating in 2 inches of oil. Sunday special kheer is top tier 🤌",
            visit_verified=True,
            upvotes=67
        )

        db.session.add_all([rev1, rev2, rev3, rev4])
        db.session.commit()
        print("Database seeded successfully with verified listings and student reviews!")

if __name__ == '__main__':
    seed_database()
