from binance.client import Client

api_key = "YOUR_API_KEY"
api_secret = "YOUR_SECRET"

client = Client(api_key, api_secret)

client.FUTURES_URL = "https://testnet.binancefuture.com/fapi"

print("Testing connection...")

try:
    print(client.futures_ping())
    print("✅ API Working")
except Exception as e:
    print("❌ Error:", e)