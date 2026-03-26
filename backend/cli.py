print("🔥 NEW CLI FILE LOADED")

import argparse
from bot.client import BinanceClient
from bot.orders import place_order

def main():
    parser = argparse.ArgumentParser()

    parser.add_argument("--symbol", required=True)
    parser.add_argument("--side", required=True, choices=["BUY", "SELL"])
    parser.add_argument(
        "--type",
        required=True,
        choices=["MARKET", "LIMIT", "STOP", "STOP_MARKET"]
    )
    parser.add_argument("--quantity", type=float, required=True)
    parser.add_argument("--price", type=float)
    parser.add_argument("--stopPrice", type=float)  # 🔥 THIS WAS MISSING

    args = parser.parse_args()

    client = BinanceClient()

    place_order(
        client=client,
        symbol=args.symbol,
        side=args.side,
        order_type=args.type,
        quantity=args.quantity,
        price=args.price,
        stopPrice=args.stopPrice
    )

if __name__ == "__main__":
    main()