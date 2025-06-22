
const canvas = document.getElementById('chart');
const ctx = canvas.getContext('2d');

let data = [];
let currentIndex = 0;
let playing = false;
let cash = 1000;
let shares = 0;
let interval;

function generateData() {
  let price = 10;
  for (let i = 0; i < 100; i++) {
    const change = (Math.random() - 0.5) * 0.2;
    price = Math.max(1, price + change);
    const volume = Math.floor(Math.random() * 100 + 10);
    data.push({ price: parseFloat(price.toFixed(2)), volume });
  }
}

function drawChart() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.moveTo(0, canvas.height - data[0].price * 10);
  for (let i = 1; i < currentIndex; i++) {
    ctx.lineTo(i * 6, canvas.height - data[i].price * 10);
  }
  ctx.stroke();
}

function updateStats() {
  document.getElementById('price').textContent = "Price: $" + data[currentIndex].price;
  document.getElementById('cash').textContent = "Cash: $" + cash.toFixed(2);
  document.getElementById('shares').textContent = "Shares: " + shares;
  document.getElementById('pl').textContent = "P/L: $" + (shares * data[currentIndex].price).toFixed(2);
}

function step() {
  if (currentIndex < data.length - 1) {
    currentIndex++;
    drawChart();
    updateStats();
  } else {
    pause();
  }
}

function play() {
  if (!playing) {
    playing = true;
    interval = setInterval(step, 100);
  }
}

function pause() {
  playing = false;
  clearInterval(interval);
}

function buy() {
  let price = data[currentIndex].price;
  if (cash >= price) {
    shares++;
    cash -= price;
    updateStats();
  }
}

function sell() {
  let price = data[currentIndex].price;
  if (shares > 0) {
    shares--;
    cash += price;
    updateStats();
  }
}

generateData();
updateStats();
