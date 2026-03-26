def validate_notional(quantity, price, order_type):
    if order_type == "LIMIT":
        if price is None:
            raise ValueError("Price required for LIMIT order")

        if quantity * price < 20:
            raise ValueError("Order value must be at least $20")