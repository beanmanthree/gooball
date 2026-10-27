import { Engine } from './core/engine.js';
import { ctx, canvas } from './graphics.js';

canvas.width = 800;
canvas.height = 600;

const keys = {};

window.addEventListener('keydown', (e) => {
  keys[e.code] = true;
});

window.addEventListener('keyup', (e) => {
  keys[e.code] = false;
});

const engine = new Engine();
engine.init();

let lastTime = performance.now();

function gameLoop(currentTime) {
  const dt = (currentTime - lastTime) / 1000;
  lastTime = currentTime;


  const safeDt = Math.min(dt, 0.1);
  engine.update(safeDt, keys);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = '#1e1e24';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (engine.player) {
    const body = engine.player.body;
    ctx.beginPath();
    ctx.arc(body.x, body.y, body.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#4ea8de';
    ctx.fill();
    ctx.strokeStyle = '#5390d9';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.closePath();
  }

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);