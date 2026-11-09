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

class Key {
    keys: Record<string, boolean> = {};

    constructor() {
        window.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.code.startsWith('Arrow')) event.preventDefault();
            this.keys[event.code] = true;
        });

        window.addEventListener('keyup', (event: KeyboardEvent) => {
            this.keys[event.code] = false;
        });

        window.addEventListener('blur', () => {
            for (const code of Object.keys(this.keys)) this.keys[code] = false;
        });
    }
}

class Mouse {
    buttons: Record<number, boolean> = {};
    position: Vector2 = new Vector2();

    constructor() {
        window.addEventListener('mousemove', (event: MouseEvent) => {
            this.updatePosition(event);
        });

        window.addEventListener('mousedown', (event: MouseEvent) => {
            this.updatePosition(event);
            this.buttons[event.button] = true;
        });

        window.addEventListener('mouseup', (event: MouseEvent) => {
            this.updatePosition(event);
            this.buttons[event.button] = false;
        });

        window.addEventListener('blur', () => {
            for (const button of Object.keys(this.buttons)) this.buttons[Number(button)] = false;
        });
    }

    private updatePosition(event: MouseEvent): void {
        this.position.set(
            (event.clientX - cRect.left) * canvas.width / cRect.width,
            (event.clientY - cRect.top) * canvas.height / cRect.height
        );
    }
}

export const key = new Key();
export const mouse = new Mouse();