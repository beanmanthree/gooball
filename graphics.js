import * as Mathutils from "./mathutils.js";

export const canvas = document.getElementById("gameCanvas");
export const ctx = canvas.getContext("2d");

ctx.imageSmoothingEnabled = false;
ctx.lineCap = "round";
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
export let cRect = canvas.getBoundingClientRect();

addEventListener("resize", (evt) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    cRect = canvas.getBoundingClientRect();
});

export function clearScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

export function strokeCircle(center, radius, color, width = 1) {
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
}

export function fillCircle(center, radius, color) {
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
}

export function strokeLine(v0, v1, color, width = 1) {
    ctx.beginPath();
    ctx.moveTo(v0.x, v0.y);
    ctx.lineTo(v1.x, v1.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
}

export function strokeRect(v0, v1, color, width = 1) {
    ctx.beginPath();
    ctx.rect(v0.x, v0.y, v1.x - v0.x, v1.y - v0.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
}

export function fillRect(v0, v1, color) {
    ctx.beginPath();
    ctx.rect(v0.x, v0.y, v1.x - v0.x, v1.y - v0.y);
    ctx.fillStyle = color;
    ctx.fill();
}

export class Camera {
  constructor(width, height) {
    this.x = 0;
    this.y = 0;
    this.width = width;
    this.height = height;
  }

  follow(target, mapWidth, mapHeight) {
    const targetX = target.x - this.width / 2;
    const targetY = target.y - this.height / 2;

    this.x += (targetX - this.x) * 0.1;
    this.y += (targetY - this.y) * 0.1;

    this.x = Math.max(0, Math.min(this.x, mapWidth - this.width));
    this.y = Math.max(0, Math.min(this.y, mapHeight - this.height));
  }
}