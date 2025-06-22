
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
