import React, { useState, useEffect, useRef } from 'react';
import {
  ResponsiveContainer, ComposedChart, XAxis, YAxis,
  Tooltip, CartesianGrid, Bar, Line, Layer
} from 'recharts';

// === Simulated OHLC generator ===
const generateOHLC = (prevClose) => {
  const open = prevClose;
  const close = +(open + (Math.random() - 0.5)).toFixed(2);
  const high = +Math.max(open, close, open + Math.random()).toFixed(2);
  const low = +Math.min(open, close, open - Math.random()).toFixed(2);
  const volume = Math.floor(Math.random() * 5000 + 1000);
  return { open, high, low, close, volume, time: new Date().toLocaleTimeString() };
};

// === EMA calculator ===
const calculateEMA = (data, period, key = 'close') => {
  const k = 2 / (period + 1);
  let emaPrev = data[0]?.[key] || 0;
  return data.map((point, i) => {
    const val = point[key];
    const ema = i === 0 ? emaPrev : val * k + emaPrev * (1 - k);
    emaPrev = ema;
    return { ...point, [`ema${period}`]: +ema.toFixed(2) };
  });
};

// === Candlestick SVG rendering ===
const Candle = ({ x, y, width, height, payload }) => {
  const color = payload.close > payload.open ? '#4caf50' : '#f44336';
  const lineX = x + width / 2;
  const top = Math.min(payload.open, payload.close);
  const bottom = Math.max(payload.open, payload.close);
  const rectHeight = Math.max(1, y(bottom) - y(top));

  return (
    <Layer>
      <line x1={lineX} x2={lineX} y1={y(payload.high)} y2={y(payload.low)} stroke={color} />
      <rect
        x={x}
        y={y(top)}
        width={width}
        height={rectHeight}
        fill={color}
      />
    </Layer>
  );
};

// === Main App ===
export default function App() {
  const [data, setData] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    // Seed with 20 initial candles
    let candles = [];
    let prevClose = 100;
    for (let i = 0; i < 20; i++) {
      const next = generateOHLC(prevClose);
      candles.push(next);
      prevClose = next.close;
    }
    setData(calculateEMA(calculateEMA(candles, 9), 20));
  }, []);

  useEffect(() => {
    if (playing) {
      const id = setInterval(() => {
        setData(prev => {
          const next = generateOHLC(prev[prev.length - 1].close);
          const updated = [...prev.slice(-49), next]; // Keep last 50
          return calculateEMA(calculateEMA(updated, 9), 20);
        });
      }, 1000); // simulate every 1s = 5-min bar
      setIntervalId(id);
    } else {
      clearInterval(intervalId);
    }
    return () => clearInterval(intervalId);
  }, [playing]);

  return (
    <div style={{ padding: 10, fontFamily: 'sans-serif' }}>
      <h2>📈 Trading Simulator</h2>
      <button onClick={() => setPlaying(!playing)} style={{ marginBottom: 10 }}>
        {playing ? 'Pause' : 'Play'}
      </button>
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={data} ref={chartRef}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="time" hide />
          <YAxis domain={['auto', 'auto']} />
          <Tooltip />
          <Bar dataKey="volume" yAxisId="volume" barSize={4} fill="#8884d8" />
          <Line type="monotone" dataKey="ema9" stroke="#ff9800" dot={false} strokeWidth={1.5} />
          <Line type="monotone" dataKey="ema20" stroke="#2196f3" dot={false} strokeWidth={1.5} />
          {data.map((entry, index) => (
            <Candle
              key={`candle-${index}`}
              x={index * 10}
              y={(val) => chartRef.current?.state?.yAxisMap?.['0']?.scale(val)}
              width={6}
              height={300}
              payload={entry}
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
