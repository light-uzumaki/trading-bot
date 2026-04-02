# Trading Bot — Binance Futures Testnet

A full-stack algorithmic trading application that places and manages futures orders on the Binance Testnet. Built with a FastAPI backend and a React frontend featuring a real-time candlestick chart rendered on HTML5 Canvas.

> No real money is involved. This project runs entirely on Binance's free Futures Testnet.

---

## Live Demo

> Start the backend and frontend locally (see setup below), then visit `http://localhost:3000`

---

## Features

- Place MARKET, LIMIT, STOP, and STOP_MARKET futures orders
- Real-time candlestick chart with live price ticker from Binance Testnet
- View open positions and wallet balances
- Cancel open orders
- Input validation with meaningful error messages
- Interactive API docs via Swagger UI at `/docs`

---

## Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React                             |
| Backend   | FastAPI (Python)                  |
| Exchange  | Binance Futures Testnet           |
| Chart     | HTML5 Canvas (custom built)       |

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

## Getting Started

### Prerequisites

- Python 3.9+
- Node.js 16+
- A free Binance Testnet account and API keys → [testnet.binancefuture.com](https://testnet.binancefuture.com)

---

### 1. Clone the repo

```bash
git clone https://github.com/light-uzumaki/trading-bot.git
cd trading-bot
```

### 2. Backend setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate       # Windows
# source .venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
```

Create a `.env` file inside the `backend/` folder:

```
BINANCE_API_KEY=your_api_key_here
BINANCE_SECRET=your_secret_here
```

Start the server:

```bash
uvicorn main:app --reload
```

Backend runs at `http://127.0.0.1:8000`  
Swagger UI (interactive docs) at `http://127.0.0.1:8000/docs`

---

### 3. Frontend setup

Open a second terminal:

```bash
cd frontend
npm install
npm start
```

Frontend runs at `http://localhost:3000`

> Both terminals must be running simultaneously.

---

## API Endpoints

| Method   | Endpoint                    | Description                        |
|----------|-----------------------------|------------------------------------|
| GET      | `/`                         | Health check                       |
| GET      | `/ping`                     | Test Binance connection            |
| GET      | `/account`                  | Wallet and margin balances         |
| GET      | `/positions`                | Open futures positions             |
| GET      | `/price/{symbol}`           | Live price for a symbol            |
| POST     | `/order`                    | Place a new order                  |
| GET      | `/orders/{symbol}`          | Get open orders for a symbol       |
| DELETE   | `/order/{symbol}/{id}`      | Cancel an order                    |

---

## Example Orders

**Market order**
```json
{ "symbol": "BTCUSDT", "side": "BUY", "order_type": "MARKET", "quantity": 0.001 }
```

**Limit order**
```json
{ "symbol": "BTCUSDT", "side": "BUY", "order_type": "LIMIT", "quantity": 0.001, "price": 60000 }
```

**Stop market order**
```json
{ "symbol": "BTCUSDT", "side": "SELL", "order_type": "STOP_MARKET", "quantity": 0.001, "stopPrice": 58000 }
```

You can also test all endpoints interactively through Swagger UI at `http://127.0.0.1:8000/docs`.

---

## Notes

- **Testnet only** — connects to Binance Futures Testnet, not the live exchange
- **Quantity precision** — BTC quantity must be rounded to 3 decimal places (minimum 0.001 BTC)
- **Minimum order value** — LIMIT orders must have a total value of at least $20
- **API keys** — stored in `.env` and never committed to GitHub
- **CORS** — currently open (`*`) for local development; should be restricted in production
- **Chart** — candlestick chart uses simulated price movement locally; live price ticker pulls real testnet data

---

## Dependencies

**Backend**
```
fastapi
uvicorn
python-binance
pydantic
python-dotenv
```

**Frontend**
```
react
```

---

## Author

GitHub: [@light-uzumaki](https://github.com/light-uzumaki)
