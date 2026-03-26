from binance.client import Client

class BinanceClient:
    def __init__(self):
        self.client = Client(
            api_key="YOUR_API_KEY",
            api_secret="YOUR_SECRET"
        )


        self.client.FUTURES_URL = "https://testnet.binancefuture.com/fapi"