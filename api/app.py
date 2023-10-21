from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
import logging
from dotenv import load_dotenv
import os


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

if __name__ == '__main__':
    app.run(debug=True)
