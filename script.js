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
updateUI();
