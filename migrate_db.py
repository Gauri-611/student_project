import sqlite3
import os

def migrate_database(db_path='instance/hostel.db'):
    if not os.path.exists(db_path):
        print(f"Database {db_path} does not exist yet.")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Check columns in 'user'
    cursor.execute("PRAGMA table_info(user)")
    existing_cols = [row[1] for row in cursor.fetchall()]
    print("Existing user columns:", existing_cols)

    if 'name' not in existing_cols:
        print("Adding 'name' column to user table...")
        cursor.execute("ALTER TABLE user ADD COLUMN name VARCHAR(100)")

    if 'role' not in existing_cols:
        print("Adding 'role' column to user table...")
        cursor.execute("ALTER TABLE user ADD COLUMN role VARCHAR(20) DEFAULT 'student'")

    if 'created_at' not in existing_cols:
        print("Adding 'created_at' column to user table...")
        cursor.execute("ALTER TABLE user ADD COLUMN created_at DATETIME")
        cursor.execute("UPDATE user SET created_at = datetime('now') WHERE created_at IS NULL")

    # Also check if user has occupation / user_type (e.g. 'student', 'working')
    if 'user_type' not in existing_cols:
        print("Adding 'user_type' column to user table...")
        cursor.execute("ALTER TABLE user ADD COLUMN user_type VARCHAR(30) DEFAULT 'student'")

    conn.commit()
    conn.close()
    print("User table migration completed safely without data loss.")

if __name__ == '__main__':
    migrate_database()
