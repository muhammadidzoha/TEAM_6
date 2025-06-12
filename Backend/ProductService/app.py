from flask import Flask, request, jsonify
import mysql.connector
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Database config
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'eai_project'
}

def init_db():
    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS products (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            description TEXT,
            price DECIMAL(10,2) NOT NULL,
            stock INT NOT NULL DEFAULT 0,
            image VARCHAR(255),
            user_id INT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    ''')
    
    cursor.execute('SELECT COUNT(*) FROM products')
    if cursor.fetchone()[0] == 0:
        sample_products = [
            ('ASUS ROG STRIX G16 G614JU-I745J8G-O 16GB/512GB', 'High performance laptop', 23899000.00, 10, 'https://images.tokopedia.net/img/cache/900/VqbcmM/2024/6/19/3be38ed3-e687-41ac-a7b5-96f6fb52e5c6.jpg', 2),
            ('APPLE iPhone 15 128GB, Black', 'Latest model smartphone', 11499000.00, 20, 'https://images.tokopedia.net/img/cache/900/hDjmkQ/2024/12/6/7d6c1662-8135-4bce-822a-cbb706d8e80b.jpg', 3),
            ('Asus ROG Phone 8 12/256GB', 'ROG Phone Latest model', 8899000.00, 30, 'https://images.tokopedia.net/img/cache/900/VqbcmM/2024/4/27/0b1d84f0-acb7-4c9e-aeac-a699901e59ab.jpg', 4),
            ('Samsung Galaxy S25 Ultra 12/512GB, Titanium Black', 'High-end smartphone', 20349000.00, 15, 'https://images.tokopedia.net/img/cache/500-square/VqbcmM/2025/2/3/2b0fc79d-2d42-48d2-b3d3-76f2629e6cc2.jpg.webp?ect=4g', 2),
            ('Apple Macbook Pro M4 14 inch 16/512 GB, Space Black', 'Latest model chip', 26249000.00, 25, 'https://images.tokopedia.net/img/cache/900/VqbcmM/2025/2/14/3ad6f019-f951-4e27-97fa-4c7df6ceece0.jpg', 3),
            ('Razer Blade Advance 15 | I7 13800H RTX4070 16GB 1TB W11', 'Gaming Laptop', 35999000.00, 50, 'https://images.tokopedia.net/img/cache/900/VqbcmM/2025/2/14/591d4750-7a40-40a8-9301-695d486032c8.jpg', 4),
        ]
        cursor.executemany(
    'INSERT INTO products (name, description, price, stock, image, user_id) VALUES (%s, %s, %s, %s, %s, %s)',
    sample_products
)   
    conn.commit()
    conn.close()

# Product endpoints
@app.route('/products', methods=['GET'])
def get_products():
    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor(dictionary=True)
    cursor.execute('''
        SELECT p.*, u.username AS seller_name 
        FROM products p
        JOIN users u ON p.user_id = u.id
    ''')
    products = cursor.fetchall()
    conn.close()
    return jsonify(products)

@app.route('/products/<int:id>', methods=['GET'])
def get_product(id):
    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor(dictionary=True)
    cursor.execute('''
        SELECT p.*, u.username AS seller_name 
        FROM products p
        JOIN users u ON p.user_id = u.id
        WHERE p.id = %s
    ''', (id,))
    product = cursor.fetchone()
    conn.close()
    
    if product:
        return jsonify(product)
    return jsonify({'error': 'Product not found'}), 404

@app.route('/products', methods=['POST'])
def add_product():
    data = request.get_json()
    required_fields = ['name', 'price', 'stock', 'image', 'user_id']

    # Validasi field yang diperlukan
    if not all(key in data for key in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400

    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor(dictionary=True)

    # Periksa apakah user_id valid dan memiliki role seller
    cursor.execute('SELECT role FROM users WHERE id = %s', (data['user_id'],))
    user = cursor.fetchone()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    if user['role'] != 'seller':
        return jsonify({'error': 'Only sellers can create products'}), 403

    # Masukkan data produk ke tabel products
    cursor.execute(
        '''
        INSERT INTO products (name, description, price, stock, image, user_id) 
        VALUES (%s, %s, %s, %s, %s, %s)
        ''',
        (
            data['name'],
            data.get('description', ''),  # Default ke string kosong jika tidak ada
            data['price'],
            data['stock'],
            data['image'],
            data['user_id']
        )
    )
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Product added successfully'}), 201

# Ubah port untuk ProductService
if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5002)
