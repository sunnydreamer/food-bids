from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
import logging
from dotenv import load_dotenv
import os
from datetime import datetime
from bson import ObjectId


from data.seed import products
from data.data_class import Product

load_dotenv()

app = Flask(__name__)

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Set up CORS
CORS(app, origins="*")

# Set up Mongo DB
try:
    app.config["MONGO_URI"] = os.getenv("MONGO_URI")
    mongo = PyMongo(app)
    logger.info("Connected to MongoDB successfully")
except Exception as e:
    logger.error(f"Error connecting to MongoDB: {str(e)}")

product_collection = mongo.db.products
user_collection = mongo.db.users

# Routes
@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/seed_products', methods=['POST'])
def seed_product():
    data = products
    

    if not isinstance(data, list):
        return jsonify({'error': 'Input data must be a list of products'}), 400

    product_collection.insert_many(data)
    return jsonify({'message':"sucess"})

@app.route('/get_products', methods=['GET'])
def get_products():
    all_products = list(product_collection.find())
    
    # Convert ObjectId to string for each product
    for product in all_products:
        product['_id'] = str(product['_id'])

    return jsonify(all_products)

@app.route('/create_user', methods=['POST'])
def create_user():
    try:
        data = request.json

        # Extract user data (email, password, profile picture, and username)
        email = data.get("email")
        profile_picture = data.get("profile_picture")
        username = data.get("username")

        # Check if the email is already registered
        existing_user = user_collection.find_one({"email": email})

        if existing_user:
            return jsonify({'error': 'Email already in use'}), 400
        
        # Create a new user document
        new_user = {
            "email": email,
            "profile_picture": profile_picture,
            "username": username,
        }

        user_id = user_collection.insert_one(new_user).inserted_id

        return jsonify({'message': 'User registered successfully', 'user_id': str(user_id)})

    except Exception as e:
        logger.error(f"Error creating user: {str(e)}")
        return jsonify({'error': 'Failed to create user'}), 500

@app.route('/add_bid', methods=['POST'])
def add_bid():
    try:
        data = request.json

        user_info = data.get("user_info")
        bid_amount = data.get("bid_amount")
        product_id = data.get("product_id")


        current_time = datetime.now().isoformat()

        new_bid = {
            "user_id": user_info.get("user_id"),
            "user_name": user_info.get("user_name"),
            "user_image": user_info.get("user_image"),
            "price": bid_amount,
            "timestamp": current_time, 
        }

        product = product_collection.find_one({"_id": ObjectId(product_id)})

        if "bids_history" not in product:
            product["bids_history"] = []

        product["bids_history"].insert(0, new_bid)
        product_collection.update_one({"_id": ObjectId(product_id)}, {"$set": {"bids_history": product["bids_history"]}})
        return jsonify({'message': 'Bid added successfully','bids_history': product["bids_history"]})

    except Exception as e:
        logger.error(f"Error adding bid: {str(e)}")
        return jsonify({'error': 'Failed to add bid'}), 500

if __name__ == '__main__':
    app.run(debug=True)
