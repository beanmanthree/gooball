import { canvas } from './graphics.js';
import { Vector2 } from './mathutils.js';

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let cRect = canvas.getBoundingClientRect();
addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    cRect = canvas.getBoundingClientRect();
});



export const Keyboard = {
    keys: {} as Record<string, boolean>
};

window.addEventListener('keydown', (event: KeyboardEvent) => {
    Keyboard.keys[event.code] = true;
});

window.addEventListener('keyup', (event: KeyboardEvent) => {
    Keyboard.keys[event.code] = false;
});

window.addEventListener('blur', () => {
    for (const code of Object.keys(Keyboard.keys)) Keyboard.keys[code] = false;
});



export const Mouse = {
    buttons: {} as Record<number, boolean>,
    position: new Vector2() as Vector2
}

window.addEventListener('mousemove', (event: MouseEvent) => {
    updateMousePosition(event);
});

window.addEventListener('mousedown', (event: MouseEvent) => {
    updateMousePosition(event);
    Mouse.buttons[event.button] = true;
});

window.addEventListener('mouseup', (event: MouseEvent) => {
    updateMousePosition(event);
    Mouse.buttons[event.button] = false;
});

window.addEventListener('blur', () => {
    for (const button of Object.keys(Mouse.buttons)) Mouse.buttons[Number(button)] = false;
});

function updateMousePosition(event: MouseEvent): void {
    Mouse.position.set(
        (event.clientX - cRect.left) * canvas.width / cRect.width,
        (event.clientY - cRect.top) * canvas.height / cRect.height
    );
}