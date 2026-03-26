from binance.client import Client

class BinanceClient:
    def __init__(self):
        self.client = Client(
            api_key="4VFi9jkSF8W0UoFLueU3fRNkxL4VnfOTnqqKEQIccX660nY71AfUIEtRH1ha0fIK",
            api_secret="yucHYXQe8VyW3v0LjDrfmWw6uWkhXwF54WGaBm68IidZXCl6juaPcRdkNZQjP5oG"

        )


        self.client.FUTURES_URL = "https://testnet.binancefuture.com/fapi"

    def place_order(self, **params):
        print("📡 Sending request to Binance...")
        return self.client.futures_create_order(**params)