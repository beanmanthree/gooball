import { ctx, canvas } from './graphics.js';

const keys: Record<string, boolean> = {};

window.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.code.startsWith('Arrow')) e.preventDefault();
    keys[e.code] = true;
});

window.addEventListener('keyup', (e: KeyboardEvent) => {
    keys[e.code] = false;
});

function tick(currentTime: number): void {
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.arc(100, 100, 50, 0, Math.PI * 2);
    ctx.fillStyle = '#f0f';
    ctx.fill();
    requestAnimationFrame(tick);
}

requestAnimationFrame(tick);