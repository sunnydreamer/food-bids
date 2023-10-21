
class Product:
    def __init__(self, product_name, description, seller_id, start_time, end_time, total_price, quantity, unit, start_price, end_price):
        self.product_name = product_name
        self.description = description
        self.seller_id = seller_id
        self.start_time = start_time
        self.end_time = end_time
        self.total_price = total_price
        self.quantity = quantity
        self.unit = unit
        self.start_price = start_price
        self.end_price = end_price
        self.bid_history = []  
        self.winner_id = None
        self.winner_price = None
