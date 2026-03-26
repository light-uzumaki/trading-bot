from bot.orders import place_market_order

try:
    res = place_market_order()
    print("✅ Order placed!")
    print(res)
except Exception as e:
    print("❌ Failed:", e)

