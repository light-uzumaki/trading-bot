# Trading Bot — Binance Futures Testnet

A full-stack algorithmic trading application built with FastAPI (Python) and React.
Places and manages futures orders on Binance Testnet via a live web interface
with a real-time candlestick chart.

---

## Screenshots

![Trading Bot]("C:\Users\Hp\OneDrive\Pictures\Screenshots\Screenshot 2026-03-26 183125.png")

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React |
| Backend | FastAPI (Python) |
| Exchange | Binance Futures Testnet |
| Chart | HTML5 Canvas (custom built) |

---

## Project Structure
```
trading-bot/
├── backend/
│   ├── main.py              # FastAPI app and all API routes
│   ├── requirements.txt     # Python dependencies
│   └── bot/
│       ├── client.py        # Binance client wrapper
│       ├── orders.py        # Order placement logic
│       ├── validators.py    # Input validation
│       └── __init__.py
└── frontend/
    ├── src/
    │   └── App.js           # React UI with live chart
    └── package.json
```

---

## Setup Steps

### Prerequisites
- Python 3.9 or above
- Node.js 16 or above
- A Binance Testnet account and API keys
  - Get them free at https://testnet.binancefuture.com

---

### 1. Clone the repository
```
git clone https://github.com/light-uzumaki/trading-bot.git
cd trading-bot
```

---

### 2. Backend Setup
```
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file inside the `backend` folder:
```
BINANCE_API_KEY=your_api_key_here
BINANCE_SECRET=your_secret_here
```

Start the backend server:
```
uvicorn main:app --reload
```

Backend runs at http://127.0.0.1:8000
Interactive API docs at http://127.0.0.1:8000/docs

---

### 3. Frontend Setup

Open a second terminal:
```
cd frontend
npm install
npm start
```

Frontend runs at http://localhost:3000

> Both terminals must be running at the same time for the app to work.

---

## How to Run Examples

### Place a Market Order
Go to http://localhost:3000
- Symbol: BTCUSDT
- Side: BUY
- Order Type: MARKET
- Quantity: 0.001
- Click Execute Trade

### Place a Limit Order
- Symbol: BTCUSDT
- Side: BUY
- Order Type: LIMIT
- Quantity: 0.001
- Price: 60000
- Click Execute Trade

### Place a Stop Market Order
- Symbol: BTCUSDT
- Side: SELL
- Order Type: STOP_MARKET
- Quantity: 0.001
- Stop Price: 58000
- Click Execute Trade

### Test API directly
Once backend is running, open:
```
http://127.0.0.1:8000/docs
```
This opens Swagger UI where you can test all endpoints interactively.

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Health check |
| GET | `/ping` | Test Binance connection |
| GET | `/account` | Wallet and margin balances |
| GET | `/positions` | Open futures positions |
| GET | `/price/{symbol}` | Live price for a symbol |
| POST | `/order` | Place a new order |
| GET | `/orders/{symbol}` | Get open orders for a symbol |
| DELETE | `/order/{symbol}/{id}` | Cancel an order |

---

## Assumptions

1. **Binance Testnet only** — this project connects to the Binance Futures
   Testnet, not the live exchange. No real money is involved.

2. **Quantity precision** — Binance requires BTC quantity to be rounded to
   3 decimal places. Minimum quantity is 0.001 BTC.

3. **Minimum order value** — For LIMIT orders, the total order value
   (quantity x price) must be at least $20 as required by Binance.

4. **API keys in .env** — API keys must be stored in a `.env` file and are
   never committed to GitHub.

5. **CORS is open** — The backend allows all origins (`*`) for development
   purposes. This should be restricted in production.

6. **Chart is simulated** — The candlestick chart generates realistic price
   movement locally. It does not pull live OHLC candle history from Binance.
   The live price ticker however does fetch real testnet prices.

7. **Python version** — Developed and tested on Python 3.11 on Windows.

---

## Dependencies

### Backend
```
fastapi
uvicorn
python-binance
pydantic
python-dotenv
```

### Frontend
```
react
```

---

## Author

GitHub: https://github.com/light-uzumaki
