
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const color = document.getElementById("color");
const size = document.getElementById("size");
const brushType = document.getElementById("brushType");

let drawing = false;
let eraseMode = false;
let history = [];
let lastPoint = null;
let hue = 0;

const stickers = [
  "♡", "✿", "☆", "୨୧", "☁", "🦋", "🌷", "🍓"
];
let selectedStamp = "";

function whitePaper() {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function saveHistory() {
  history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  if (history.length > 30) history.shift();
}

whitePaper();
saveHistory();

function getPoint(e) {
  const r = canvas.getBoundingClientRect();
  return {
    x: (e.clientX - r.left) * canvas.width / r.width,
    y: (e.clientY - r.top) * canvas.height / r.height
  };
}

function sparkle(x, y) {
  for (let i = 0; i < 3; i++) {
    const a = Math.random() * Math.PI * 2;
    const d = Math.random() * Number(size.value) * 1.8;
    const sx = x + Math.cos(a) * d;
    const sy = y + Math.sin(a) * d;

    ctx.fillStyle = `hsl(${Math.random() * 360},80%,70%)`;
    ctx.beginPath();
    ctx.arc(sx, sy, Math.random() * 2.5 + 1, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawSegment(a, b) {
  const type = eraseMode ? "eraser" : brushType.value;
  const width = Number(size.value);

  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = width;

  if (type === "eraser") {
    ctx.strokeStyle = "#ffffff";
  } else if (type === "rainbow") {
    hue = (hue + 7) % 360;
    ctx.strokeStyle = `hsl(${hue},85%,65%)`;
  } else {
    ctx.strokeStyle = color.value;
  }

  if (type === "soft") {
    ctx.globalAlpha = 0.24;
    ctx.shadowColor = color.value;
    ctx.shadowBlur = width * 1.5;
  }

  if (type === "pencil") {
    ctx.globalAlpha = 0.65;
    ctx.lineWidth = Math.max(1, width * 0.45);
  }

  if (type === "marker") {
    ctx.globalAlpha = 0.48;
    ctx.lineWidth = width * 1.6;
  }

  if (type === "glitter") {
    ctx.globalAlpha = 1;
    ctx.shadowColor = color.value;
    ctx.shadowBlur = 5;
  }

  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.stroke();

  ctx.restore();

  if (type === "glitter") sparkle(b.x, b.y);
}

function dab(p) {
  const type = eraseMode ? "eraser" : brushType.value;

  if (type === "stamp") {
    ctx.save();
    ctx.font = `${Math.max(18, Number(size.value) * 2)}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(selectedStamp || "♡", p.x, p.y);
    ctx.restore();
    return;
  }

  drawSegment(p, { x: p.x + 0.1, y: p.y + 0.1 });
}

canvas.addEventListener("pointerdown", e => {
  e.preventDefault();
  const p = getPoint(e);

  if (brushType.value === "stamp" && !eraseMode) {
    saveHistory();
    dab(p);
    return;
  }

  saveHistory();
  drawing = true;
  lastPoint = p;
  canvas.setPointerCapture(e.pointerId);
  dab(p);
});

canvas.addEventListener("pointermove", e => {
  if (!drawing) return;
  e.preventDefault();

  const p = getPoint(e);
  drawSegment(lastPoint, p);
  lastPoint = p;
});

function stopDrawing() {
  drawing = false;
  lastPoint = null;
}

canvas.addEventListener("pointerup", stopDrawing);
canvas.addEventListener("pointercancel", stopDrawing);
canvas.addEventListener("lostpointercapture", stopDrawing);

document.getElementById("eraser").onclick = () => {
  eraseMode = !eraseMode;
  document.getElementById("eraser").textContent =
    eraseMode ? "eraser: on" : "⌫ eraser";
};

document.getElementById("undo").onclick = () => {
  if (history.length <= 1) return;
  history.pop();
  ctx.putImageData(history[history.length - 1], 0, 0);
};

document.getElementById("clear").onclick = () => {
  if (!confirm("Clear your canvas?")) return;
  whitePaper();
  saveHistory();
};

const paletteColors = [
  "#ed83ac", "#ffb7c9", "#f7b267", "#f6d875",
  "#a8c985", "#81c9bd", "#a5b8ed", "#c7a3df",
  "#755c69", "#604c43", "#ffffff", "#222222"
];

const palette = document.getElementById("palette");

paletteColors.forEach(hex => {
  const b = document.createElement("button");
  b.className = "swatch";
  b.style.backgroundColor = hex;
  b.title = hex;
  b.setAttribute("aria-label", "Choose " + hex);
  b.onclick = () => {
    color.value = hex;
    eraseMode = false;
  };
  palette.appendChild(b);
});

document.querySelectorAll("[data-stamp]").forEach(b => {
  b.onclick = () => {
    selectedStamp = b.dataset.stamp;
    brushType.value = "stamp";
    eraseMode = false;
  };
});

document.getElementById("save").onclick = () => {
  const link = document.createElement("a");
  link.download = "my-little-art.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
};
const Canvas = document.getElementById("canvas");
const Ctx = canvas.getContext("2d");
const Color = document.getElementById("color");
const Size = document.getElementById("size");
const BrushType = document.getElementById("brushType");
;

function whitePaper() {
  ctx.save();
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
}

function saveHistory() {
  history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  if (history.length > 30) history.shift();
}

whitePaper();
saveHistory();

function getPoint(e) {
  const r = canvas.getBoundingClientRect();

  return {
    x: (e.clientX - r.left) * canvas.width / r.width,
    y: (e.clientY - r.top) * canvas.height / r.height
  };
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function drawSparkles(x, y, amount = 4) {
  ctx.save();

  for (let i = 0; i < amount; i++) {
    const sx = x + randomBetween(-Number(size.value), Number(size.value));
    const sy = y + randomBetween(-Number(size.value), Number(size.value));

    ctx.fillStyle = color.value;
    ctx.globalAlpha = randomBetween(0.5, 1);
    ctx.beginPath();
    ctx.arc(sx, sy, randomBetween(1, 3), 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawPixel(x, y) {
  const pixelSize = Math.max(4, Number(size.value));

  ctx.save();
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;
  ctx.fillStyle = eraseMode ? "#ffffff" : color.value;

  const px = Math.floor(x / pixelSize) * pixelSize;
  const py = Math.floor(y / pixelSize) * pixelSize;

  ctx.fillRect(px, py, pixelSize, pixelSize);
  ctx.restore();
}

function drawDots(x, y) {
  const radius = Math.max(2, Number(size.value) / 3);

  ctx.save();
  ctx.fillStyle = eraseMode ? "#ffffff" : color.value;
  ctx.globalAlpha = 0.85;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawSpray(x, y) {
  const radius = Number(size.value) * 1.5;
  const amount = Math.min(100, Math.max(15, Number(size.value) * 2));

  ctx.save();
  ctx.fillStyle = eraseMode ? "#ffffff" : color.value;

  for (let i = 0; i < amount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.sqrt(Math.random()) * radius;

    ctx.globalAlpha = randomBetween(0.25, 0.9);
    ctx.fillRect(
      x + Math.cos(angle) * distance,
      y + Math.sin(angle) * distance,
      randomBetween(0.5, 2),
      randomBetween(0.5, 2)
    );
  }

  ctx.restore();
}

function drawSegment(a, b) {
  const type = eraseMode ? "eraser" : brushType.value;
  const width = Number(size.value);

  if (type === "pixel") {
    drawPixel(b.x, b.y);
    return;
  }

  if (type === "dot") {
    drawDots(b.x, b.y);
    return;
  }

  if (type === "sparkle") {
    drawSparkles(b.x, b.y, 5);
    return;
  }

  if (type === "spray") {
    drawSpray(b.x, b.y);
    return;
  }

  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = width;
  ctx.strokeStyle = eraseMode ? "#ffffff" : color.value;
  ctx.globalAlpha = 1;
  ctx.shadowBlur = 0;

  if (type === "rainbow" && !eraseMode) {
    hue = (hue + 5) % 360;
    ctx.strokeStyle = `hsl(${hue}, 85%, 65%)`;
  }

  if (type === "soft") {
    ctx.globalAlpha = 0.24;
    ctx.shadowColor = color.value;
    ctx.shadowBlur = width * 1.5;
  }

  if (type === "pencil") {
    ctx.globalAlpha = 0.65;
    ctx.lineWidth = Math.max(1, width * 0.45);
  }

  if (type === "marker") {
    ctx.globalAlpha = 0.48;
    ctx.lineWidth = width * 1.6;
  }

  if (type === "glitter") {
    ctx.shadowColor = color.value;
    ctx.shadowBlur = 5;
  }

  if (type === "watercolor") {
    ctx.globalAlpha = 0.13;
    ctx.lineWidth = width * 2.2;
    ctx.shadowColor = color.value;
    ctx.shadowBlur = width * 0.35;
  }

  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.stroke();
  ctx.restore();

  if (type === "glitter") {
    drawSparkles(b.x, b.y, 3);
  }
}

function dab(p) {
  drawSegment(p, { x: p.x + 0.1, y: p.y + 0.1 });
}

canvas.addEventListener("pointerdown", e => {
  e.preventDefault();

  const p = getPoint(e);
  saveHistory();

  drawing = true;
  lastPoint = p;

  canvas.setPointerCapture(e.pointerId);
  dab(p);
});

canvas.addEventListener("pointermove", e => {
  if (!drawing) return;
  e.preventDefault();

  const p = getPoint(e);
  drawSegment(lastPoint, p);
  lastPoint = p;
});

function stopDrawing() {
  drawing = false;
  lastPoint = null;
}

canvas.addEventListener("pointerup", stopDrawing);
canvas.addEventListener("pointercancel", stopDrawing);
canvas.addEventListener("lostpointercapture", stopDrawing);

document.getElementById("eraser").onclick = () => {
  eraseMode = !eraseMode;

  document.getElementById("eraser").textContent =
    eraseMode ? "eraser: on" : "⌫ eraser";
};

document.getElementById("undo").onclick = () => {
  if (history.length <= 1) return;

  history.pop();
  ctx.putImageData(history[history.length - 1], 0, 0);
};

document.getElementById("clear").onclick = () => {
  if (!confirm("Clear your canvas?")) return;

  whitePaper();
  saveHistory();
};

const palettecolors = [
  "#ed83ac", "#ffb7c9", "#f7b267", "#f6d875",
  "#a8c985", "#81c9bd", "#a5b8ed", "#c7a3df",
  "#755c69", "#604c43", "#ffffff", "#222222"
];

const Palette = document.getElementById("palette");

palette.innerHTML = "";

paletteColors.forEach(hex => {
  const b = document.createElement("button");

  b.className = "swatch";
  b.style.backgroundColor = hex;
  b.title = hex;
  b.setAttribute("aria-label", "Choose " + hex);

  b.onclick = () => {
    color.value = hex;
    eraseMode = false;
    document.getElementById("eraser").textContent = "⌫ eraser";
  };

  palette.appendChild(b);
});

document.getElementById("save").onclick = () => {
  const link = document.createElement("a");
  link.download = "my-little-art.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
};