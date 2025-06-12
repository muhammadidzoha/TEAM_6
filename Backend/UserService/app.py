from flask import Flask, jsonify
from flask_cors import CORS  # Add this import
import mysql.connector

app = Flask(__name__)
CORS(app)  # Add this line

# Database config
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': '',  # ganti jika ada password
    'database': 'eai_project'
}

# Inisialisasi tabel user jika belum ada dan isi dengan satu user default
def init_db():
    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor()
    try:
        # Create users table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(100) NOT NULL UNIQUE,
                email VARCHAR(100),
                password VARCHAR(100) NOT NULL,
                role ENUM('seller', 'user') NOT NULL DEFAULT 'user'
            )
        ''')
        
        # Check if default user exists
        cursor.execute('SELECT id FROM users WHERE id = 1')
        if not cursor.fetchone():
            # Insert default user if not exists
            cursor.execute('''
    INSERT INTO users (id, username, email, password, role) 
    VALUES 
    (1, 'DefaultUser', 'default@example.com', 'password123', 'user'),
    (2, 'Seller 1', 'seller1@example.com', 'seller1', 'seller'),
    (3, 'Seller 2', 'seller2@example.com', 'seller2', 'seller'),
    (4, 'Seller 3', 'seller3@example.com', 'seller3', 'seller')              
''')
            conn.commit()
            print("Default user created successfully")
    except Exception as e:
        print(f"Error in init_db: {str(e)}")
    finally:
        cursor.close()
        conn.close()

@app.route('/users', methods=['GET'])
def get_users():
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute('SELECT id, username, email, role FROM users')
        users = cursor.fetchall()
        
        return jsonify(users) 
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/users/<int:id>', methods=['GET'])
def get_user(id):
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor(dictionary=True)
        
        cursor.execute('SELECT id, username, email, role FROM users WHERE id = %s', (id,))
        user = cursor.fetchone()
        
        if user:
            return jsonify(user)
        return jsonify({'error': 'User not found'}), 404
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5001)
