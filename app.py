from flask import Flask, render_template, request, jsonify, send_file, session, redirect, url_for, flash
import json
import csv
import os
from datetime import datetime
from io import StringIO, BytesIO
from functools import wraps

app = Flask(__name__)
app.secret_key = 'gdg-aitr-secret-key-2025'  # Change this in production

DATA_FILE = 'registrations.json'

# Admin credentials
ADMIN_EMAIL = 'Admin@gdg'
ADMIN_PASSWORD = 'Gdg@1234'

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'logged_in' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

def load_registrations():
    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, 'r') as file:
                return json.load(file)
        except (json.JSONDecodeError, FileNotFoundError):
            return []
    return []

def save_registration(registration):
    registrations = load_registrations()
    
    for reg in registrations:
        if reg['email'].lower() == registration['email'].lower():
            return False
    
    registration['timestamp'] = datetime.now().isoformat()
    registrations.append(registration)
    
    try:
        with open(DATA_FILE, 'w') as file:
            json.dump(registrations, file, indent=2)
        return True
    except Exception as e:
        print(f"Error saving registration: {e}")
        return False

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        
        if email == ADMIN_EMAIL and password == ADMIN_PASSWORD:
            session['logged_in'] = True
            session['admin_email'] = email
            return redirect(url_for('admin'))
        else:
            flash('Invalid credentials. Please try again.')
    
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('home'))

@app.route('/admin')
@login_required
def admin():
    return render_template('admin.html')

@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'success': False, 'error': 'No data received'})
        
        required_fields = ['name', 'email', 'phone', 'year', 'branch']
        for field in required_fields:
            if field not in data or not str(data[field]).strip():
                return jsonify({'success': False, 'error': f'Missing or empty field: {field}'})
        
        registration = {
            'name': data['name'].strip(),
            'email': data['email'].strip().lower(),
            'phone': data['phone'].strip(),
            'year': data['year'],
            'branch': data['branch']
        }
        
        if save_registration(registration):
            return jsonify({'success': True})
        else:
            return jsonify({'success': False, 'error': 'Email already registered or save error'})
            
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/api/registrations', methods=['GET'])
@login_required
def get_registrations():
    try:
        registrations = load_registrations()
        return jsonify(registrations)
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/download-csv')
@login_required
def download_csv():
    try:
        registrations = load_registrations()
        
        if not registrations:
            return jsonify({'success': False, 'error': 'No registrations found'})
        
        string_output = StringIO()
        writer = csv.writer(string_output)
        
        writer.writerow(['Name', 'Email', 'Phone', 'Year', 'Branch', 'Registration Date'])
        
        for reg in registrations:
            writer.writerow([
                reg['name'],
                reg['email'],
                reg['phone'],
                reg['year'],
                reg['branch'],
                reg['timestamp']
            ])
        
        string_output.seek(0)
        byte_output = BytesIO()
        byte_output.write(string_output.getvalue().encode('utf-8'))
        byte_output.seek(0)
        
        return send_file(
            byte_output,
            mimetype='text/csv',
            as_attachment=True,
            download_name=f'gdg_registrations_{datetime.now().strftime("%Y%m%d_%H%M")}.csv'
        )
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

if __name__ == '__main__':
    if not os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'w') as file:
            json.dump([], file)
    
    print("Starting GDG AITR Registration System...")
    print("Access the registration form at: http://localhost:5000")
    print("Access the admin login at: http://localhost:5000/login")
    print("Admin Credentials - Email: Admin@gdg, Password: Gdg@2025")
    
    app.run(debug=True, host='0.0.0.0', port=5000)