import { useState, useEffect, useRef } from "react";

const BASE = "http://127.0.0.1:8000";

const COLORS = {
  bg: "#0b0f1a",
  panel: "#111827",
  card: "#1a2235",
  border: "#1e2d45",
  accent: "#3b82f6",
  green: "#10b981",
  red: "#ef4444",
  amber: "#f59e0b",
  text: "#f1f5f9",
  muted: "#64748b",
  input: "#0f172a",
};

function generateCandles(count = 60) {
  let price = 65000 + Math.random() * 5000;
  return Array.from({ length: count }, (_, i) => {
    const open = price;
    const change = (Math.random() - 0.48) * 800;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * 400;
    const low = Math.min(open, close) - Math.random() * 400;
    price = close;
    const time = new Date(Date.now() - (count - i) * 60000 * 15);
    return { open, close, high, low, time };
  });
}

function CandleChart({ symbol }) {
  const canvasRef = useRef(null);
  const [candles, setCandles] = useState(() => generateCandles(60));
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCandles(prev => {
        const last = prev[prev.length - 1];
        const change = (Math.random() - 0.48) * 600;
        const open = last.close;
        const close = open + change;
        const high = Math.max(open, close) + Math.random() * 300;
        const low = Math.min(open, close) - Math.random() * 300;
        return [...prev.slice(1), { open, close, high, low, time: new Date() }];
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    const H = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = COLORS.panel;
    ctx.fillRect(0, 0, w, h);

    const pad = { top: 20, bottom: 30, left: 10, right: 70 };
    const chartW = w - pad.left - pad.right;
    const chartH = h - pad.top - pad.bottom;

    const allPrices = candles.flatMap(c => [c.high, c.low]);
    const minP = Math.min(...allPrices) * 0.9995;
    const maxP = Math.max(...allPrices) * 1.0005;
    const priceRange = maxP - minP;

    const toY = p => pad.top + chartH - ((p - minP) / priceRange) * chartH;

    ctx.strokeStyle = "#1e2d45";
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 4; i++) {
      const y = pad.top + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(w - pad.right, y);
      ctx.stroke();
      const price = maxP - (priceRange / 4) * i;
      ctx.fillStyle = COLORS.muted;
      ctx.font = "11px monospace";
      ctx.textAlign = "left";
      ctx.fillText(price.toFixed(0), w - pad.right + 6, y + 4);
    }

    const candleW = Math.max(2, (chartW / candles.length) - 1.5);

    candles.forEach((c, i) => {
      const x = pad.left + (i / candles.length) * chartW + candleW / 2;
      const isGreen = c.close >= c.open;
      const color = isGreen ? COLORS.green : COLORS.red;

      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, toY(c.high));
      ctx.lineTo(x, toY(c.low));
      ctx.stroke();

      const bodyTop = toY(Math.max(c.open, c.close));
      const bodyBot = toY(Math.min(c.open, c.close));
      const bodyH = Math.max(1, bodyBot - bodyTop);

      ctx.fillStyle = color;
      ctx.fillRect(x - candleW / 2, bodyTop, candleW, bodyH);
    });

    if (hovered !== null && candles[hovered]) {
      const c = candles[hovered];
      const x = pad.left + (hovered / candles.length) * chartW + candleW / 2;
      ctx.strokeStyle = "#3b82f680";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(x, pad.top);
      ctx.lineTo(x, pad.top + chartH);
      ctx.stroke();
      ctx.setLineDash([]);

      const bx = Math.min(x + 8, w - 145);
      const by = pad.top + 4;
      ctx.fillStyle = "#1a2235ee";
      ctx.strokeStyle = COLORS.border;
      ctx.lineWidth = 1;
      roundRect(ctx, bx, by, 130, 72, 6);
      ctx.fill();
      ctx.stroke();

      ctx.font = "11px monospace";
      ctx.textAlign = "left";
      const isG = c.close >= c.open;
      [
        ["O", c.open.toFixed(1)],
        ["H", c.high.toFixed(1)],
        ["L", c.low.toFixed(1)],
        ["C", c.close.toFixed(1)],
      ].forEach(([label, val], idx) => {
        ctx.fillStyle = COLORS.muted;
        ctx.fillText(label, bx + 10, by + 16 + idx * 14);
        ctx.fillStyle = isG ? COLORS.green : COLORS.red;
        ctx.fillText(val, bx + 30, by + 16 + idx * 14);
      });
    }

    const last = candles[candles.length - 1];
    const lastY = toY(last.close);
    ctx.strokeStyle = last.close >= last.open ? COLORS.green : COLORS.red;
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(pad.left, lastY);
    ctx.lineTo(w - pad.right, lastY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = last.close >= last.open ? COLORS.green : COLORS.red;
    ctx.font = "bold 11px monospace";
    ctx.textAlign = "left";
    ctx.fillText(last.close.toFixed(1), w - pad.right + 6, lastY + 4);

  }, [candles, hovered]);

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function handleMouseMove(e) {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const pad = { left: 10, right: 70 };
    const chartW = canvas.offsetWidth - pad.left - pad.right;
    const idx = Math.floor(((mx - pad.left) / chartW) * candles.length);
    if (idx >= 0 && idx < candles.length) setHovered(idx);
    else setHovered(null);
  }

  const last = candles[candles.length - 1];
  const prev = candles[candles.length - 2];
  const pct = ((last.close - prev.close) / prev.close * 100).toFixed(2);
  const isUp = last.close >= prev.close;

  return (
    <div style={{ background: COLORS.panel, borderRadius: 12, border: `1px solid ${COLORS.border}`, overflow: "hidden" }}>
      <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 16, borderBottom: `1px solid ${COLORS.border}` }}>
        <span style={{ fontWeight: 700, fontSize: 15, color: COLORS.text }}>{symbol}/USDT</span>
        <span style={{ fontFamily: "monospace", fontSize: 20, fontWeight: 700, color: isUp ? COLORS.green : COLORS.red }}>
          ${last.close.toFixed(1)}
        </span>
        <span style={{ fontSize: 13, color: isUp ? COLORS.green : COLORS.red, background: isUp ? "#10b98120" : "#ef444420", padding: "2px 8px", borderRadius: 6 }}>
          {isUp ? "▲" : "▼"} {Math.abs(pct)}%
        </span>
        <span style={{ fontSize: 12, color: COLORS.muted, marginLeft: "auto" }}>15m · Live</span>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.green, boxShadow: "0 0 6px #10b981" }} />
      </div>
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHovered(null)}
        style={{ width: "100%", height: 260, display: "block", cursor: "crosshair" }}
      />
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div style={{ background: COLORS.card, borderRadius: 10, border: `1px solid ${COLORS.border}`, padding: "12px 16px" }}>
      <div style={{ fontSize: 11, color: COLORS.muted, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: color || COLORS.text, fontFamily: "monospace" }}>{value}</div>
    </div>
  );
}

export default function App() {
  const [form, setForm] = useState({ symbol: "BTCUSDT", side: "BUY", order_type: "MARKET", quantity: "", price: "", stopPrice: "" });
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [ping, setPing] = useState(null);
  const [price, setPrice] = useState(null);

  useEffect(() => {
    fetch(`${BASE}/ping`).then(r => r.json()).then(() => setPing(true)).catch(() => setPing(false));
  }, []);

  useEffect(() => {
    const fetchPrice = () => {
      fetch(`${BASE}/price/${form.symbol}`).then(r => r.json()).then(d => setPrice(d.price)).catch(() => {});
    };
    fetchPrice();
    const iv = setInterval(fetchPrice, 5000);
    return () => clearInterval(iv);
  }, [form.symbol]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const placeOrder = async () => {
    setLoading(true);
    setResponse(null);
    try {
      const res = await fetch(`${BASE}/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, quantity: parseFloat(form.quantity), price: form.price ? parseFloat(form.price) : null, stopPrice: form.stopPrice ? parseFloat(form.stopPrice) : null }),
      });
      const data = await res.json();
      setResponse(data);
    } catch {
      setResponse({ error: "Backend not running" });
    }
    setLoading(false);
  };

  const isBuy = form.side === "BUY";

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, color: COLORS.text, fontFamily: "'Inter', sans-serif", padding: "24px 20px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⚡</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>TradingBot</div>
            <div style={{ fontSize: 12, color: COLORS.muted }}>Binance Futures Testnet</div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: ping === true ? COLORS.green : ping === false ? COLORS.red : COLORS.muted }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: ping === true ? COLORS.green : ping === false ? COLORS.red : COLORS.muted }} />
            {ping === true ? "Connected" : ping === false ? "Disconnected" : "Connecting..."}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
          <StatCard label="Symbol" value={form.symbol} />
          <StatCard label="Live Price" value={price ? `$${parseFloat(price).toLocaleString()}` : "—"} color={COLORS.accent} />
          <StatCard label="Side" value={form.side} color={isBuy ? COLORS.green : COLORS.red} />
        </div>

        <div style={{ marginBottom: 20 }}>
          <CandleChart symbol={form.symbol.replace("USDT", "")} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div style={{ background: COLORS.panel, borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 20 }}>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 16, color: COLORS.text }}>Place Order</div>

            {[
              { label: "Symbol", name: "symbol", type: "text" },
              { label: "Quantity", name: "quantity", type: "number" },
              ...(form.order_type !== "MARKET" ? [{ label: "Price", name: "price", type: "number" }] : []),
              ...((form.order_type === "STOP" || form.order_type === "STOP_MARKET") ? [{ label: "Stop Price", name: "stopPrice", type: "number" }] : []),
            ].map(f => (
              <div key={f.name} style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 11, color: COLORS.muted, display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.8 }}>{f.label}</label>
                <input
                  name={f.name}
                  type={f.type}
                  value={form[f.name]}
                  onChange={handleChange}
                  placeholder={f.label}
                  style={{ width: "100%", background: COLORS.input, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "9px 12px", color: COLORS.text, fontSize: 14, outline: "none", boxSizing: "border-box" }}
                />
              </div>
            ))}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
              {["BUY", "SELL"].map(s => (
                <button key={s} onClick={() => setForm({ ...form, side: s })} style={{ padding: "10px", borderRadius: 8, border: `1px solid ${form.side === s ? (s === "BUY" ? COLORS.green : COLORS.red) : COLORS.border}`, background: form.side === s ? (s === "BUY" ? "#10b98122" : "#ef444422") : "transparent", color: form.side === s ? (s === "BUY" ? COLORS.green : COLORS.red) : COLORS.muted, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                  {s}
                </button>
              ))}
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, color: COLORS.muted, display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.8 }}>Order Type</label>
              <select name="order_type" value={form.order_type} onChange={handleChange} style={{ width: "100%", background: COLORS.input, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "9px 12px", color: COLORS.text, fontSize: 14, outline: "none" }}>
                {["MARKET", "LIMIT", "STOP", "STOP_MARKET"].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <button onClick={placeOrder} disabled={loading} style={{ width: "100%", padding: "12px", borderRadius: 8, border: "none", background: isBuy ? "linear-gradient(135deg, #059669, #10b981)" : "linear-gradient(135deg, #dc2626, #ef4444)", color: "white", fontWeight: 700, fontSize: 14, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Executing..." : `${form.side} ${form.symbol}`}
            </button>
          </div>

          <div style={{ background: COLORS.panel, borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: 20 }}>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 16, color: COLORS.text }}>Order Response</div>
            {!response ? (
              <div style={{ color: COLORS.muted, fontSize: 13, textAlign: "center", marginTop: 60 }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>📋</div>
                No orders placed yet
              </div>
            ) : (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: response.error ? COLORS.red : COLORS.green }} />
                  <span style={{ fontSize: 13, color: response.error ? COLORS.red : COLORS.green, fontWeight: 600 }}>
                    {response.error ? "Failed" : "Success"}
                  </span>
                </div>
                <pre style={{ background: COLORS.input, borderRadius: 8, padding: 12, fontSize: 11, color: COLORS.text, overflow: "auto", maxHeight: 320, border: `1px solid ${COLORS.border}`, fontFamily: "monospace", lineHeight: 1.6 }}>
                  {JSON.stringify(response, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
