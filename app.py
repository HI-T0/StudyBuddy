from flask import Flask, request, jsonify, session, render_template, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
from datetime import datetime, timedelta
import os
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)

# Get the absolute path of the current file's directory
base_dir = os.path.abspath(os.path.dirname(__file__))

# Set the correct path for the templates folder
template_dir = os.path.join(os.path.dirname(base_dir), 'frontend', 'templates')
static_dir = os.path.join(os.path.dirname(base_dir), 'frontend', 'static')

app = Flask(__name__, 
            template_folder=template_dir,
            static_folder=static_dir)

app.config['SECRET_KEY'] = os.urandom(24)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(base_dir, 'study_planner.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    account_type = db.Column(db.String(20), default='free')
    subscription_expiry = db.Column(db.DateTime, nullable=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def is_pro(self):
        return self.account_type == 'pro' and (self.subscription_expiry is None or self.subscription_expiry > datetime.utcnow())

def create_tables():
    with app.app_context():
        db.create_all()
        print("Database tables created successfully.")

#with app.app_context():
#    db.create_all()

def pro_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({"error": "Not logged in"}), 401
        user = User.query.get(session['user_id'])
        if not user or not user.is_pro():
            return jsonify({"error": "Pro subscription required"}), 403
        return f(*args, **kwargs)
    return decorated_function

@app.route('/')
def index():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = request.json
        app.logger.debug(f"Login attempt with data: {data}")
        user = User.query.filter_by(email=data['email']).first()
        if user and user.check_password(data['password']):
            session['user_id'] = user.id
            session['account_type'] = user.account_type
            app.logger.info(f"User {user.email} logged in successfully")
            return jsonify({"message": "Login successful", "account_type": user.account_type}), 200
        app.logger.warning(f"Failed login attempt for email: {data['email']}")
        return jsonify({"error": "Invalid email or password"}), 401
    return render_template('login.html')

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    app.logger.debug(f"Registration attempt with data: {data}")
    existing_user = User.query.filter_by(email=data['email']).first()
    if existing_user:
        app.logger.warning(f"Registration attempt with existing email: {data['email']}")
        return jsonify({"error": "Email already registered"}), 400
    new_user = User(name=data['name'], email=data['email'], account_type='free')
    new_user.set_password(data['password'])
    db.session.add(new_user)
    db.session.commit()
    session['user_id'] = new_user.id
    session['account_type'] = new_user.account_type
    app.logger.info(f"New user registered: {new_user.email}")
    return jsonify({"message": "User registered successfully", "account_type": new_user.account_type}), 201

@app.route('/logout')
def logout():
    session.pop('user_id', None)
    session.pop('account_type', None)
    return redirect(url_for('login'))

@app.route('/get_account_type')
def get_account_type():
    if 'user_id' not in session:
        return jsonify({"error": "Not logged in"}), 401
    user = User.query.get(session['user_id'])
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"account_type": user.account_type, "is_pro": user.is_pro()})

@app.route('/upgrade_account', methods=['POST'])
def upgrade_account():
    if 'user_id' not in session:
        return jsonify({"error": "Not logged in"}), 401
    
    user = User.query.get(session['user_id'])
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.json
    plan = data.get('plan')

    if plan not in ['pro']:
        return jsonify({"error": "Invalid plan selected"}), 400

    if user.account_type == plan and user.is_pro():
        return jsonify({"message": "Account is already pro"}), 200

    # In a real-world scenario, you would integrate with a payment system here
    # For this example, we'll just upgrade the account without any payment process

    user.account_type = plan
    user.subscription_expiry = datetime.utcnow() + timedelta(days=30)  # Set expiry to 30 days from now
    db.session.commit()

    session['account_type'] = plan  # Update the session

    app.logger.info(f"User {user.email} upgraded to {plan}")
    return jsonify({"message": f"Account upgraded to {plan} successfully", "account_type": plan}), 200

@app.route('/upgrade')
def upgrade_page():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    return render_template('upgrade.html')

# Pro-only routes
@app.route('/flashcards', methods=['GET', 'POST'])
@pro_required
def flashcards():
    # Implement flashcard functionality here
    return jsonify({"message": "Flashcards feature accessed"})

@app.route('/study_groups', methods=['GET', 'POST'])
@pro_required
def study_groups():
    # Implement study groups functionality here
    return jsonify({"message": "Study groups feature accessed"})

@app.route('/resources', methods=['GET', 'POST'])
@pro_required
def resources():
    # Implement resource library functionality here
    return jsonify({"message": "Resources feature accessed"})

@app.route('/progress', methods=['GET'])
@pro_required
def progress():
    # Implement progress tracking functionality here
    return jsonify({"message": "Progress tracking feature accessed"})

@app.route('/quiz', methods=['GET', 'POST'])
@pro_required
def quiz():
    # Implement quiz functionality here
    return jsonify({"message": "Quiz feature accessed"})

if __name__ == '__main__':
    create_tables()
    app.run(debug=True)