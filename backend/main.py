

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator
from typing import Optional
from bot.client import BinanceClient
from bot.orders import place_order
from bot.validators import validate_notional

app = FastAPI(title="Trading Bot API", description="Binance Futures Testnet Trading API", version="1.0.0")

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

client = BinanceClient()

class OrderRequest(BaseModel):
    symbol: str
    side: str
    order_type: str
    quantity: float
    price: Optional[float] = None
    stopPrice: Optional[float] = None

    @field_validator("side")
    @classmethod
    def side_must_be_valid(cls, v):
        if v.upper() not in ["BUY", "SELL"]:
            raise ValueError("side must be BUY or SELL")
        return v.upper()

    @field_validator("order_type")
    @classmethod
    def type_must_be_valid(cls, v):
        valid = ["MARKET", "LIMIT", "STOP", "STOP_MARKET"]
        if v.upper() not in valid:
            raise ValueError(f"order_type must be one of {valid}")
        return v.upper()

    @field_validator("quantity")
    @classmethod
    def quantity_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError("quantity must be positive")
        return v
@app.get("/")
def root():
    return {"status": "ok", "message": "Trading Bot API is running 🚀"}

@app.get("/ping")
def ping():
    try:
        result = client.client.futures_ping()
        return {"status": "connected", "binance_response": result}
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Binance connection failed: {str(e)}")

@app.get("/account")
def get_account():
    try:
        data = client.client.futures_account()
        return {
            "totalWalletBalance": data.get("totalWalletBalance"),
            "totalUnrealizedProfit": data.get("totalUnrealizedProfit"),
            "totalMarginBalance": data.get("totalMarginBalance"),
            "availableBalance": data.get("availableBalance"),
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/positions")
def get_positions():
    try:
        positions = client.client.futures_position_information()
        open_positions = [p for p in positions if float(p.get("positionAmt", 0)) != 0]
        return {"positions": open_positions, "count": len(open_positions)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/price/{symbol}")
def get_price(symbol: str):
    try:
        ticker = client.client.futures_symbol_ticker(symbol=symbol.upper())
        return {"symbol": symbol.upper(), "price": ticker["price"]}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/order")
def create_order(order: OrderRequest):
    try:
        validate_notional(order.quantity, order.price, order.order_type)
        response = place_order(
            client=client,
            symbol=order.symbol.upper(),
            side=order.side,
            order_type=order.order_type,
            quantity=order.quantity,
            price=order.price,
            stopPrice=order.stopPrice,
        )
        return {"status": "success", "order": response}
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/orders/{symbol}")
def get_open_orders(symbol: str):
    try:
        orders = client.client.futures_get_open_orders(symbol=symbol.upper())
        return {"symbol": symbol.upper(), "orders": orders, "count": len(orders)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/order/{symbol}/{order_id}")
def cancel_order(symbol: str, order_id: int):
    try:
        result = client.client.futures_cancel_order(symbol=symbol.upper(), orderId=order_id)
        return {"status": "cancelled", "order": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
