# Trading Bot — Binance Futures Testnet

A full-stack algorithmic trading application built with **FastAPI** (Python) and **React**. Connects to the Binance Futures Testnet to place and manage orders via a live web interface with a real-time candlestick chart.

---

## Live Demo

| Service | URL |
|---|---|
| Frontend | https://your-app.vercel.app |
| Backend API | https://your-backend.up.railway.app |
| API Docs | https://your-backend.up.railway.app/docs |

---

## Features

- Live candlestick chart with OHLC hover tooltip
- Place MARKET, LIMIT, STOP, and STOP_MARKET orders
- Real-time price ticker (updates every 5 seconds)
- Account balance and open positions viewer
- Cancel open orders
- Input validation and notional value checks
- Binance Testnet connection status indicator

---

## Project Structure
trading_bot/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── bot/
│       ├── client.py
│       ├── orders.py
│       ├── validators.py
│       └── init.py
└── frontend/
├── src/
│   └── App.js
└── package.json

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React |
| Backend | FastAPI (Python) |
| Exchange | Binance Futures Testnet |
| Chart | HTML5 Canvas |
| Deployment (Frontend) | Vercel |
| Deployment (Backend) | Railway |

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
| GET | `/orders/{symbol}` | Get open orders |
| DELETE | `/order/{symbol}/{id}` | Cancel an order |

---

## Local Setup

### 1. Clone the repo

git clone https://github.com/your-username/trading-bot.git
cd trading-bot

### 2. Backend

cd backend
python -m venv .venv
.venv\Scripts\activate

pip install -r requirements.txt

Create a .env file in the backend folder:

BINANCE_API_KEY=your_api_key_here
BINANCE_SECRET=your_secret_here

Start the backend:

uvicorn main:app --reload

Backend runs at http://127.0.0.1:8000
Docs at http://127.0.0.1:8000/docs

### 3. Frontend

cd frontend
npm install
npm start

Frontend runs at http://localhost:3000

---

## Order Types Supported

| Type | Required Fields |
|---|---|
| MARKET | symbol, side, quantity |
| LIMIT | symbol, side, quantity, price |
| STOP | symbol, side, quantity, price, stopPrice |
| STOP_MARKET | symbol, side, quantity, stopPrice |

---

## Environment Variables

| Variable | Description |
|---|---|
| `BINANCE_API_KEY` | Your Binance Testnet API key |
| `BINANCE_SECRET` | Your Binance Testnet secret key |

Get testnet credentials at: https://testnet.binancefuture.com

---

## Deployment

### Backend → Railway
1. Go to railway.app → New Project → Deploy from GitHub
2. Set root directory to backend
3. Add environment variables
4. Railway auto-detects FastAPI and deploys

### Frontend → Vercel
1. Go to vercel.com → Import GitHub repo
2. Set root directory to frontend
3. Update BASE in App.js to your Railway URL
4. Deploy

---

## Notes

- Uses Binance Futures Testnet — no real money involved
- Minimum order value for BTCUSDT is $20
- Quantity precision for BTC is 3 decimal places (e.g. 0.001)
- Never commit real API keys — use .env and add to .gitignore
