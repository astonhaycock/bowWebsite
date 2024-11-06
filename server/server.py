from flask import Flask, request
import sqlite3

app = Flask(__name__)

def get_db_connection():
    conn = sqlite3.connect('bows.db')
    conn.row_factory = sqlite3.Row
    return conn

# def create_users_table():
#         conn = get_db_connection()
#         conn.execute('''
#             CREATE TABLE IF NOT EXISTS users (
#                 id INTEGER PRIMARY KEY AUTOINCREMENT,
#                 username TEXT NOT NULL,
#                 password TEXT NOT NULL,
#                 email TEXT NOT NULL,
#                 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
#             )
#         ''')
#         conn.commit()
#         conn.close()

# create_users_table()

# Add a default admin user
# def add_default_admin():
#     conn = get_db_connection()
#     conn.execute('''
#         INSERT INTO users (username, password, email)
#         VALUES (?, ?, ?)
#     ''', ('admin', 'admin', 'admin'))
#     conn.commit()
#     conn.close()

# add_default_admin()

class Bows:
    def __init__(self, db):
        self.db = db
        self.cursor = self.db.cursor()

    def getBows(self):
        self.cursor.execute("SELECT * FROM bows;")
        return [dict(row) for row in self.cursor.fetchall()]

    def getBow(self, id):
        sql = "SELECT * FROM bows WHERE bow_id = ?"
        self.cursor.execute(sql, (id,))
        return dict(self.cursor.fetchone())

    def addBow(self, bow_name, bow_type, bow_weight, bow_length, bow_draw_length, bow_draw_weight, bow_price, bow_image_url):
        sql = """
            INSERT INTO bows (bow_name, bow_type, bow_weight, bow_length, bow_draw_length, bow_draw_weight, bow_price, bow_image_url) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """
        data = [bow_name, bow_type, bow_weight, bow_length, bow_draw_length, bow_draw_weight, bow_price, bow_image_url]
        self.cursor.execute(sql, data)
        self.db.commit()

    def deleteBow(self, id):
        sql = "DELETE FROM bows WHERE bow_id = ?"
        self.cursor.execute(sql, (id,))
        self.db.commit()

    def updateBow(self, id, bow_name, bow_type, bow_weight, bow_length, bow_draw_length, bow_draw_weight, bow_price, bow_image_url):
        sql = """
            UPDATE bows SET bow_name = ?, bow_type = ?, bow_weight = ?, bow_length = ?, bow_draw_length = ?, bow_draw_weight = ?, bow_price = ?, bow_image_url = ?
            WHERE bow_id = ?
        """
        data = [bow_name, bow_type, bow_weight, bow_length, bow_draw_length, bow_draw_weight, bow_price, bow_image_url, id]
        self.cursor.execute(sql, data)
        self.db.commit()

class Users:
    def __init__(self, db):
        self.db = db
        self.cursor = self.db.cursor()

    def getUser(self):
        self.cursor.execute("SELECT * FROM Users;")
        return [dict(row) for row in self.cursor.fetchall()]

@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS, PATCH'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    return response

@app.route("/bows", methods=['GET'])
def get_bows():
    try:
        db = get_db_connection()
        bows = Bows(db).getBows()
        db.close()
        return bows, 200
    except Exception as e:
        print(f"Error occurred: {e}")
        return {"error": "Internal server error"}, 500

@app.route("/bows/<int:id>", methods=['GET'])
def get_bow(id):
    try:
        db = get_db_connection()
        bow = Bows(db).getBow(id)
        db.close()
        if bow:
            return {"data": bow}, 200
        else:
            return {"error": "Bow not found"}, 404
    except Exception as e:
        print(f"Error occurred: {e}")
        return {"error": "Internal server error"}, 500

@app.route("/bows", methods=['POST'])
def insert_bow():
    try:
        data = request.json
        required_fields = ["bow_name", "bow_type", "bow_weight", "bow_length", "bow_draw_length", "bow_draw_weight", "bow_price", "bow_image_url"]
        for field in required_fields:
            if field not in data:
                return {"error": f"Missing field: {field}"}, 400
        
        db = get_db_connection()
        Bows(db).addBow(
            data["bow_name"], data["bow_type"], data["bow_weight"], data["bow_length"], 
            data["bow_draw_length"], data["bow_draw_weight"], data["bow_price"], data["bow_image_url"]
        )
        db.close()
        return {"message": "Bow created successfully"}, 201
    except Exception as e:
        print(f"Error occurred: {e}")
        return {"error": "Internal server error"}, 500

@app.route("/bows/<int:id>", methods=['DELETE'])
def delete_bow(id):
    try:
        db = get_db_connection()
        Bows(db).deleteBow(id)
        db.close()
        return {"message": "Bow deleted successfully"}, 200
    except Exception as e:
        print(f"Error occurred: {e}")
        return {"error": "Internal server error"}, 500

@app.route("/bows/<int:id>", methods=['PUT'])
def update_bow(id):
    try:
        data = request.json
        required_fields = ["bow_name", "bow_type", "bow_weight", "bow_length", "bow_draw_length", "bow_draw_weight", "bow_price", "bow_image_url"]
        for field in required_fields:
            if field not in data:
                return {"error": f"Missing field: {field}"}, 400
        
        db = get_db_connection()
        Bows(db).updateBow(
            id, data["bow_name"], data["bow_type"], data["bow_weight"], data["bow_length"], 
            data["bow_draw_length"], data["bow_draw_weight"], data["bow_price"], data["bow_image_url"]
        )
        db.close()
        return {"message": "Bow updated successfully"}, 200
    except Exception as e:
        print(f"Error occurred: {e}")
        return {"error": "Internal server error"}, 500

@app.route("/admins", methods=['POST'])
def check_admin():
    try:
        db = get_db_connection()
        users = Users(db).getUser()
        db.close()
        password = request.json['password']
        if users and users[0]['password'] == password:
            return {"message": "Admin authenticated"}, 200
        return {"error": "Authentication failed"}, 401
    except Exception as e:
        print(f"Error occurred: {e}")
        return {"error": "Internal server error"}, 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
