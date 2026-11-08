import { ctx, canvas } from './graphics.js';
import './input.js';

function tick(currentTime: number): void {
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.arc(100, 100, 50, 0, Math.PI * 2);
    ctx.fillStyle = '#f0f';
    ctx.fill();
    requestAnimationFrame(tick);
}

requestAnimationFrame(tick);