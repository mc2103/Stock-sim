const chart = document.getElementById('chart');
const ctx = chart.getContext('2d');

let index = 0;
let playing = false;
let cash = 1000;
let shares = 0;
let price = 0;

// Simulated APLD 5-min prices (Open, High, Low, Close)
const data = [
  { o: 10.5, h: 10.7, l: 10.4, c: 10.65 },
  { o: 10.65, h: 10.8, l: 10.6, c: 10.7 },
  { o: 10.7, h: 10.85, l: 10.6, c: 10.8 },
  { o: 10.8, h: 10.9, l: 10.7, c: 10.75 },
  { o: 10.75, h: 10.85, l: 10.6, c: 10.65 },
  { o: 10.65, h: 10.7, l: 10.5, c: 10.55 }
];

function drawCandle(i) {
  const { o, h, l, c } = data[i];
  const x = 50 + i * 30;
  const color = c >= o ? 'lime' : 'red';

  // Wick
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, 300 - h * 20);
  ctx.lineTo(x, 300 - l * 20);
  ctx.stroke();

  // Body
  ctx.fillStyle = color;
  const bodyHeight = Math.abs(c - o) * 20;
  const bodyY = 300 - Math.max(o, c) * 20;
  ctx.fillRect(x - 5, bodyY, 10, bodyHeight);
}

function update() {
  if (index >= data.length) return pause();
  price = data[index].c;
  document.getElementById('price').innerText = `Price: $${price.toFixed(2)}`;
  document.getElementById('cash').innerText = `Cash: $${cash.toFixed(2)}`;
  document.getElementById('shares').innerText = `Shares: ${shares}`;
  document.getElementById('pl').innerText = `P/L: $${(shares * price + cash - 1000).toFixed(2)}`;
  drawCandle(index);
  index++;
}

function play() {
  playing = true;
  loop();
}

function pause() {
  playing = false;
}

function loop() {
  if (playing) {
    update();
    setTimeout(loop, 1000); // 1 second per candle
  }
}

function buy() {
  if (cash >= price) {
    shares += 1;
    cash -= price;
  }
}

function sell() {
  if (shares > 0) {
    shares -= 1;
    cash += price;
  }
}
