from flask import Flask, request, jsonify
import mysql.connector
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Database config
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': 'root',
    'database': 'eai_project'
}

# Inisialisasi database
def init_db():
    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor()
    
    # Buat tabel payment_history jika belum ada
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS payment_history (
            id INT AUTO_INCREMENT PRIMARY KEY,
            order_id INT NOT NULL,
            user_id INT NOT NULL,
            amount DECIMAL(15, 2) NOT NULL,
            payment_method VARCHAR(50) NOT NULL,
            payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    ''')
    conn.commit()
    conn.close()

@app.route('/history', methods=['GET'])
def get_payment_history_with_products():
    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor(dictionary=True)

    cursor.execute('''
        SELECT 
            ph.id AS payment_id,
            ph.order_id,
            ph.user_id,
            ph.amount,
            ph.payment_method,
            ph.payment_status,
            ph.created_at,
            p.id AS product_id,
            p.name AS product_name,
            p.description AS product_description,
            p.image AS product_image
        FROM payment_history ph
        JOIN order_items oi ON ph.order_id = oi.order_id
        JOIN products p ON oi.product_id = p.id
    ''')
    history = cursor.fetchall()
    conn.close()

    return jsonify(history)

# Endpoint untuk mencatat riwayat pembayaran
@app.route('/history', methods=['POST'])
def add_payment_history():
    data = request.get_json()
    required_fields = ['order_id', 'user_id', 'amount', 'payment_method', 'payment_status']

    # Validasi field yang diperlukan
    if not all(key in data for key in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400

    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor()

    # Masukkan data ke tabel payment_history
    cursor.execute(
        '''
        INSERT INTO payment_history (order_id, user_id, amount, payment_method, payment_status)
        VALUES (%s, %s, %s, %s, %s)
        ''',
        (
            data['order_id'],
            data['user_id'],
            data['amount'],
            data['payment_method'],
            data['payment_status']
        )
    )
    conn.commit()
    conn.close()

    return jsonify({'message': 'Payment history recorded successfully'}), 201

# Jalankan server
if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5005)