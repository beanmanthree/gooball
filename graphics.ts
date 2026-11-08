import { Vector2 } from "./mathutils.js";

export const canvas = document.getElementById("game") as HTMLCanvasElement;
export const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

ctx.imageSmoothingEnabled = false;
ctx.lineCap = "round";

export function clearScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

export function strokeCircle(center: Vector2, radius: number, color: string, width: number = 1): void {
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
}

export function fillCircle(center: Vector2, radius: number, color: string): void {
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
}

export function strokeLine(v0: Vector2, v1: Vector2, color: string, width: number = 1): void {
    ctx.beginPath();
    ctx.moveTo(v0.x, v0.y);
    ctx.lineTo(v1.x, v1.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
}

export function strokeRect(v0: Vector2, v1: Vector2, color: string, width: number = 1): void {
    ctx.beginPath();
    ctx.rect(v0.x, v0.y, v1.x - v0.x, v1.y - v0.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
}

export function fillRect(v0: Vector2, v1: Vector2, color: string): void {
    ctx.beginPath();
    ctx.rect(v0.x, v0.y, v1.x - v0.x, v1.y - v0.y);
    ctx.fillStyle = color;
    ctx.fill();
}