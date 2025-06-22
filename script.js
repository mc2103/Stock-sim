let playing = false;
let price = 10.00;
let cash = 1000;
let shares = 0;
let pl = 0;
let data = [];
let ctx;

const priceEl = document.getElementById("price");
const cashEl = document.getElementById("cash");
const sharesEl = document.getElementById("shares");
const plEl = document.getElementById("pl");
const canvas = document.getElementById("chart");

function updateUI() {
  priceEl.textContent = `Price: $${price.toFixed(2)}`;
  cashEl.textContent = `Cash: $${cash.toFixed(2)}`;
  sharesEl.textContent = `Shares: ${shares}`;
  pl = shares * price;
  plEl.textContent = `P/L: $${pl.toFixed(2)}`;
}

function drawChart() {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.moveTo(0, canvas.height - data[0]);

  for (let i = 1; i < data.length; i++) {
    ctx.lineTo(i * (canvas.width / data.length), canvas.height - data[i]);
  }

  ctx.strokeStyle = "#444";
  ctx.stroke();
}

function tick() {
  if (!playing) return;
  const change = (Math.random() - 0.5) * 0.5;
  price += change;
  data.push(price * 10);
  if (data.length > 100) data.shift();
  updateUI();
  drawChart();
}

document.getElementById("play").onclick = () => (playing = true);
document.getElementById("pause").onclick = () => (playing = false);
document.getElementById("buy").onclick = () => {
  if (cash >= price) {
    shares += 1;
    cash -= price;
    updateUI();
  }
};
document.getElementById("sell").onclick = () => {
  if (shares > 0) {
    shares -= 1;
    cash += price;
    updateUI();
  }
};

setInterval(tick, 500);
updateUI();body {
  font-family: Arial, sans-serif;
  background: #fff;
  color: #111;
  margin: 0;
  padding: 20px;
  text-align: center;
}

.container {
  max-width: 400px;
  margin: 0 auto;
}

.controls button {
  margin: 5px;
  padding: 10px 15px;
  font-weight: bold;
}

canvas {
  margin-top: 20px;
  border: 1px solid #ccc;
  width: 100%;
}
let prices = [10.5, 10.6, 10.7, 10.4, 10.55, 10.8, 10.75, 10.65];
let index = 0;
let cash = 1000;
let shares = 0;
let interval;

const priceDisplay = document.getElementById("price");
const cashDisplay = document.getElementById("cash");
const sharesDisplay = document.getElementById("shares");
const plDisplay = document.getElementById("pl");
const canvas = document.getElementById("chart");
const ctx = canvas.getContext("2d");

function updateChart() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.moveTo(0, 200 - prices[0] * 10);
  for (let i = 1; i <= index && i < prices.length; i++) {
    ctx.lineTo(i * 60, 200 - prices[i] * 10);
  }
  ctx.stroke();
}

function updateDisplay() {
  const price = prices[index] || prices[prices.length - 1];
  priceDisplay.textContent = "Price: $" + price.toFixed(2);
  cashDisplay.textContent = "Cash: $" + cash.toFixed(2);
  sharesDisplay.textContent = "Shares: " + shares;
  plDisplay.textContent = "P/L: $" + ((shares * price + cash) - 1000).toFixed(2);
  updateChart();
}

function play() {
  if (interval) return;
  interval = setInterval(() => {
    if (index < prices.length - 1) {
      index++;
      updateDisplay();
    } else {
      clearInterval(interval);
    }
  }, 1000);
}

function pause() {
  clearInterval(interval);
  interval = null;
}

function buy() {
  const price = prices[index];
  if (cash >= price) {
    cash -= price;
    shares += 1;
    updateDisplay();
  }
}

function sell() {
  const price = prices[index];
  if (shares > 0) {
    cash += price;
    shares -= 1;
    updateDisplay();
  }
}

updateDisplay();
