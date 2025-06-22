// Built-in simulated 5-min candlestick data
const chartData = [
  { time: "09:30", open: 10.00, high: 10.20, low: 9.95, close: 10.10, volume: 8000 },
  { time: "09:35", open: 10.10, high: 10.40, low: 10.05, close: 10.35, volume: 10000 },
  { time: "09:40", open: 10.35, high: 10.50, low: 10.20, close: 10.30, volume: 12000 },
  { time: "09:45", open: 10.30, high: 10.60, low: 10.10, close: 10.50, volume: 14000 },
  { time: "09:50", open: 10.50, high: 10.70, low: 10.40, close: 10.65, volume: 16000 },
  // Add more bars here to expand the day
];

let index = 0;
let playing = false;
let cash = 1000;
let shares = 0;
let price = chartData[0].open;
let interval;

const chart = document.getElementById("chart");
const priceText = document.getElementById("price");
const cashText = document.getElementById("cash");
const sharesText = document.getElementById("shares");
const plText = document.getElementById("pl");

function updateChart() {
  chart.innerHTML = "";
  chartData.slice(0, index + 1).forEach(candle => {
    const bar = document.createElement("div");
    bar.className = "candle";
    bar.style.height = `${Math.abs(candle.close - candle.open) * 100}px`;
    bar.style.background = candle.close >= candle.open ? "green" : "red";
    chart.appendChild(bar);
  });
}

function updatePrice() {
  if (index < chartData.length) {
    price = chartData[index].close;
    updateText();
    updateChart();
    index++;
  } else {
    clearInterval(interval);
  }
}

function updateText() {
  priceText.innerText = `Price: $${price.toFixed(2)}`;
  cashText.innerText = `Cash: $${cash.toFixed(2)}`;
  sharesText.innerText = `Shares: ${shares}`;
  const pl = shares * price + cash - 1000;
  plText.innerText = `P/L: $${pl.toFixed(2)}`;
}

function togglePlay() {
  playing = !playing;
  if (playing) {
    interval = setInterval(updatePrice, 500); // simulate every 0.5 seconds
  } else {
    clearInterval(interval);
  }
}

function buy() {
  const count = Math.floor(cash / price);
  shares += count;
  cash -= count * price;
  updateText();
}

function sell() {
  cash += shares * price;
  shares = 0;
  updateText();
}

document.getElementById("play").addEventListener("click", togglePlay);
document.getElementById("pause").addEventListener("click", () => clearInterval(interval));
document.getElementById("buy").addEventListener("click", buy);
document.getElementById("sell").addEventListener("click", sell);

updateText();
