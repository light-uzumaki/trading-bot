def place_order(client, symbol, side, order_type, quantity, price=None, stopPrice=None ):

    print("🚀 Placing order...")

    try:
        params = {
            "symbol": symbol,
            "side": side,
            "type": order_type,
            "quantity": quantity
        }

        if order_type == "LIMIT":
            if price is None:
                raise ValueError("Price required for LIMIT order")

            params["price"] = price
            params["timeInForce"] = "GTC"
        elif order_type in ["STOP", "STOP_MARKET"]:
            if stopPrice is None:
                raise ValueError("stopPrice required")

            params["stopPrice"] = stopPrice

            # STOP-LIMIT
            if order_type == "STOP":
                if price is None:
                    raise ValueError("Price required for STOP-LIMIT")

                params["price"] = price
                params["timeInForce"] = "GTC"

        print("📦 Params:", params)

        response = client.place_order(**params)

        print("\n✅ Order Response:")
        print(response)

        return response

    except Exception as e:
        print("❌ Failed:", str(e))
        raise e