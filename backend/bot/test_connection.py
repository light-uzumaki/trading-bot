from bot.client import BinanceClient

client = BinanceClient()

try:
    data = client.test_connection()
    print("✅ Connected to Binance Testnet!")
    print(data)
except Exception as e:
    print("❌ Connection failed:", e)