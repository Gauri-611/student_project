from app import create_app

def run_tests():
    app = create_app()
    client = app.test_client()

    print("--- 1. Testing GET /api/v1/health ---")
    res = client.get('/api/v1/health')
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    print("Health response:", res.get_json())

    print("\n--- 2. Testing GET /api/v1/destinations ---")
    res = client.get('/api/v1/destinations')
    assert res.status_code == 200
    print("Destinations count:", len(res.get_json()['data']))

    print("\n--- 3. Testing GET /api/v1/listings ---")
    res = client.get('/api/v1/listings')
    assert res.status_code == 200
    data = res.get_json()
    print("Listings count:", data['count'])
    assert data['count'] > 0, "Expected seeded listings"

    print("\n--- 4. Testing Category Filtering: 'food' ---")
    res = client.get('/api/v1/listings?category=food')
    assert res.status_code == 200
    food_data = res.get_json()['data']
    print("Food listings found:", [f['name'] for f in food_data])
    for f in food_data:
        assert f['category'] == 'food'

    print("\n--- 5. Testing Category Filtering: 'stays' (Hostels/PGs) ---")
    res = client.get('/api/v1/listings?category=stays')
    assert res.status_code == 200
    stay_data = res.get_json()['data']
    print("Stay listings found:", [s['name'] for s in stay_data])
    for s in stay_data:
        assert s['category'] == 'stays'

    print("\n--- 6. Testing Distance Calculation from IET-DAVV (22.6806, 75.8778) ---")
    res = client.get('/api/v1/listings?lat=22.6806&lng=75.8778&sort=distance_asc')
    assert res.status_code == 200
    dist_data = res.get_json()['data']
    print("Closest spot to IET-DAVV:", dist_data[0]['name'], "distance:", dist_data[0]['distance_text'])

    print("\n--- 7. Testing User Registration with user_type ('student') and Email OTP ---")
    test_email = 'indore_fresher_test@gmail.com'
    reg_res = client.post('/api/v1/auth/register', json={
        'email': test_email,
        'password': 'Password123!',
        'name': 'Pooja Sharma',
        'user_type': 'student'
    })
    if reg_res.status_code == 409:
        print("User already registered, sending OTP...")
        otp_res = client.post('/api/v1/auth/send-otp', json={'email': test_email})
        otp = otp_res.get_json()['otp']
    else:
        assert reg_res.status_code == 201
        otp = reg_res.get_json()['otp']
        print("Registration response:", reg_res.get_json()['message'], "OTP:", otp)

    print("\n--- 8. Testing Email OTP Verification ---")
    verify_res = client.post('/api/v1/auth/verify-otp', json={
        'email': test_email,
        'otp': otp
    })
    assert verify_res.status_code == 200
    verify_data = verify_res.get_json()
    print("OTP Verified successfully! User type:", verify_data['user']['user_type'])
    token = verify_data['token']

    print("\n--- 9. Testing Authenticated Review Submission ---")
    listing_id = dist_data[0]['id']
    rev_res = client.post(f'/api/v1/listings/{listing_id}/reviews', 
        headers={'Authorization': f'Bearer {token}'},
        json={
            'rating': 5,
            'comment': 'Awesome location, genuinely 2 mins from college gate!'
        }
    )
    assert rev_res.status_code == 201
    print("Review submitted successfully:", rev_res.get_json()['data']['comment'])

    print("\n>>> ALL BACKEND API TESTS PASSED SUCCESSFULLY! <<<")

if __name__ == '__main__':
    run_tests()
