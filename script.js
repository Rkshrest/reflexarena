

const arena = document.getElementById("arena");
const targetText = document.getElementById("targetColor");
const scoreText = document.getElementById("score");
const timeText = document.getElementById("time");
const accuracyText = document.getElementById("accuracy");
const startBtn = document.getElementById("startBtn");


const colors = ["red", "green", "blue"];

let targetColor = "";
let score = 0;
let gameTime = 30;
let spawnSpeed = 1000; 

let totalCircles = 0;
let correctClicks = 0;

let spawnInterval = null;
let gameTimer = null;


startBtn.addEventListener("click", startGame);

function startGame() {
  clearInterval(spawnInterval);
  clearInterval(gameTimer);

  arena.innerHTML = "";

  score = 0;
  gameTime = 30;
  spawnSpeed = 1000;
  totalCircles = 0;
  correctClicks = 0;

  scoreText.textContent = score;
  timeText.textContent = gameTime;
  accuracyText.textContent = "0%";
  targetText.textContent = "—";
  arena.style.borderColor = "transparent";

  startBtn.style.display = "none";

  chooseNewTarget();
  startSpawning();

  gameTimer = setInterval(updateTime, 1000);
}


function chooseNewTarget() {
  targetColor = colors[Math.floor(Math.random() * colors.length)];
  targetText.textContent = targetColor.toUpperCase();
  targetText.style.color = targetColor;
  arena.style.borderColor = targetColor;
}


function startSpawning() {
  clearInterval(spawnInterval);
  spawnInterval = setInterval(spawnCircle, spawnSpeed);
}

function spawnCircle() {
  const circle = document.createElement("div");
  const color = colors[Math.floor(Math.random() * colors.length)];

  totalCircles++;

  circle.className = `circle ${color}`;
  circle.style.left = Math.random() * (window.innerWidth - 60) + "px";
  circle.style.top = Math.random() * (window.innerHeight - 60) + "px";

  arena.appendChild(circle);

  const timeout = setTimeout(() => {
    if (arena.contains(circle)) {
      arena.removeChild(circle);
      score -= 2;
      updateAccuracy();
      scoreText.textContent = score;
    }
  }, 1500);

  circle.addEventListener("click", () => {
    clearTimeout(timeout);

    if (color === targetColor) {
      score += 10;
      correctClicks++;
      chooseNewTarget();
    } else {
      score -= 5;
    }

    updateAccuracy();
    scoreText.textContent = score;
    circle.remove();
  });
}

function updateAccuracy() {
  const accuracy =
    totalCircles === 0
      ? 0
      : Math.round((correctClicks / totalCircles) * 100);

  accuracyText.textContent = accuracy + "%";
}


function updateTime() {
  gameTime--;
  timeText.textContent = gameTime;

  if (gameTime % 5 === 0 && spawnSpeed > 400) {
    spawnSpeed -= 100;
    startSpawning();
  }

  if (gameTime === 0) {
    endGame();
  }
}

function endGame() {
  clearInterval(spawnInterval);
  clearInterval(gameTimer);

  arena.innerHTML = "";

  const accuracy =
    totalCircles === 0
      ? 0
      : Math.round((correctClicks / totalCircles) * 100);

  const panel = document.createElement("div");
  panel.className = "game-over";

  let performance =
    accuracy >= 80 ? "Excellent" :
    accuracy >= 60 ? "Good" :
    "Needs Improvement";

  panel.innerHTML = `
    <h2>Game Over</h2>
    <p>Final Score: <b>${score}</b></p>
    <p>Accuracy: <b>${accuracy}%</b></p>
    <p>Performance: <b>${performance}</b></p>
    <button id="restartBtn">Play Again</button>
  `;

  arena.appendChild(panel);

  document.getElementById("restartBtn").addEventListener("click", () => {
    startGame();
  });
}
