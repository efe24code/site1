console.log("main.js");

// Firebase imports !!!
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

// Firebase !!!
const firebaseConfig = {
  apiKey: "AIzaSyAQTfhjUZBeZsaDdaa3Uav3lHgaVLdQ-dQ",
  authDomain: "pixtax-3ece2.firebaseapp.com",
  databaseURL: "https://pixtax-3ece2-default-rtdb.firebaseio.com",
  projectId: "pixtax-3ece2",
  storageBucket: "pixtax-3ece2.appspot.com",
  messagingSenderId: "279190903158",
  appId: "1:279190903158:web:fc1c322baf53d264ab0257"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ayarlar
const canvas = document.getElementById("pixel-canvas");
const ctx = canvas.getContext("2d");
const CANVAS_SIZE = canvas.width;

let pendingPixel = null;
function redrawCanvas() {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  ctx.strokeStyle = "white";
  ctx.lineWidth = 0.5;

  // test dikey grid
  for (let x = 0; x <= CANVAS_SIZE; x++) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, CANVAS_SIZE);
    ctx.stroke();
  }

  // test yatay grid
  for (let y = 0; y <= CANVAS_SIZE; y++) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(CANVAS_SIZE, y);
    ctx.stroke();
  }
}

// pixel yerlestirr
function drawPixel(x, y, color) {
  if (x >= 0 && x < CANVAS_SIZE && y >= 0 && y < CANVAS_SIZE) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 1, 1);
  }
}

// canvas yenile
redrawCanvas();

// Canvas tıklamamamama
canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor(e.clientX - rect.left);
  const y = Math.floor(e.clientY - rect.top);

  if (x < 0 || x >= CANVAS_SIZE || y < 0 || y >= CANVAS_SIZE) return;

  // Koordinatı kontrol panelinde gostrrmek
  document.getElementById("coord-text").textContent = `(${x}, ${y})`;
  pendingPixel = { x, y };

  // Kontrol paneli
  document.getElementById("controls").classList.add("active");
});

// İptal butonu
document.getElementById("cancel-place").addEventListener("click", () => {
  document.getElementById("controls").classList.remove("active");
  pendingPixel = null;
});

// Pixel yerleştirme
document.getElementById("place-pixel").addEventListener("click", () => {
  if (!pendingPixel) return;
  
  const color = document.getElementById("color-picker").value;
  const { x, y } = pendingPixel;
  
  document.getElementById('placeSound').play();

  // Firebase'e gönder !!!
  push(ref(db, "pixels"), {
    x: x,
    y: y,
    color: color,
    timestamp: Date.now()
  });

  // Kontrol panelini kapat
  document.getElementById("controls").classList.remove("active");
  pendingPixel = null;
  });

// Gerçek zamanlı pixel alma
onValue(ref(db, "pixels"), (snapshot) => {
  redrawCanvas(); // Grid'i yeniden çiz
  snapshot.forEach(child => {
    const data = child.val();
    drawPixel(data.x, data.y, data.color);
  });
});