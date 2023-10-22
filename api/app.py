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
bids_collection = mongo.db.bids

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
        created_user = user_collection.find_one({"_id":ObjectId(user_id)})
        created_user['_id'] = str(created_user['_id'])

        return jsonify({'message': 'User registered successfully', 'user_data': created_user})

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

         # Update the user's bid reference document
        user_bid_reference = bids_collection.find_one({"user_id": user_info.get("user_id")})
        if user_bid_reference:
            user_bid_reference["bids"].append(ObjectId(product_id))
            bids_collection.update_one(
                {"user_id": user_info.get("user_id")},
                {"$set": {"bids": user_bid_reference["bids"]}}
            )
        else:
            # Create a new user bid reference document
            new_user_bid_reference = {
                "user_id": user_info.get("user_id"),
                "bids": [ObjectId(product_id)]
            }
            bids_collection.insert_one(new_user_bid_reference)

        product = product_collection.find_one({"_id": ObjectId(product_id)})

        if "bids_history" not in product:
            product["bids_history"] = []

        product["bids_history"].insert(0, new_bid)

        product["highest_bid"] = bid_amount

        product_collection.update_one(
            {"_id": ObjectId(product_id)}, 
            {"$set": {
                "bids_history": product["bids_history"],
                "highest_bid": product["highest_bid"]
            }})
        return jsonify({'message': 'Bid added successfully','bids_history': product["bids_history"]})

    except Exception as e:
        logger.error(f"Error adding bid: {str(e)}")
        return jsonify({'error': 'Failed to add bid'}), 500
    
@app.route('/get_user_info', methods=['GET'])
def get_user_info():
    try:
        email = request.args.get('email')

        if email is None:
            return jsonify({'error': 'Email is missing'}), 400

        user_info = user_collection.find_one({"email": email})

        if user_info is None:
            return jsonify({'error': 'User not found'}), 404

        user_info['_id'] = str(user_info['_id'])

        return jsonify({'message': 'User information retrieved successfully', 'user_data': user_info})

    except Exception as e:
        logger.error(f"Error retrieving user information: {str(e)}")
        return jsonify({'error': 'Failed to retrieve user information'}), 500

@app.route('/get_user_bids', methods=['GET'])
def get_user_bids():
    try:
        user_id = request.args.get('user_id')

        if user_id is None:
            return jsonify({'error': 'User ID is missing'}), 400

        # Find the user's bid reference document in the bids collection
        user_bid_reference = bids_collection.find_one({"user_id": user_id})

        if user_bid_reference is None or "bids" not in user_bid_reference:
            return jsonify({'message': 'User has no bids', 'user_bids': []})

        # Retrieve the list of product IDs from the user's bid reference
        product_ids = user_bid_reference["bids"]

         # Fetch additional details for each product
        user_bids = []
        for product_id in product_ids:
            product = product_collection.find_one({"_id": product_id})
            if product:
                # Extract relevant information from the product document
                product_info = {
                    'product_name': product['product_name'],
                    'seller_name': product['seller_name'],
                    'unit': product['unit'],
                    'quantity': product['quantity'],
                    'product_picture':product['product_picture']
                }

                user_bids.append(product_info)

        return jsonify({'message': 'User bids retrieved successfully', 'user_bids': user_bids})

    except Exception as e:
        logger.error(f"Error retrieving user bids: {str(e)}")
        return jsonify({'error': 'Failed to retrieve user bids'}), 500

if __name__ == '__main__':
    app.run(debug=True)
