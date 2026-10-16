import * as Mathutils from "./mathutils.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

ctx.imageSmoothingEnabled = false;
ctx.lineCap = "round";
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

addEventListener("resize", (evt) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

export function clearScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

export function strokeCircle(center, radius, color, width) {
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

export function strokeLine(v0, v1, color, width) {
    ctx.beginPath();
    ctx.moveTo(v0.x, v0.y);
    ctx.lineTo(v1.x, v1.y);
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