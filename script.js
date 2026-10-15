import * as Physics from "./physics.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

ctx.imageSmoothingEnabled = false;
ctx.lineCap = "round";
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const cRect = canvas.getBoundingClientRect();

addEventListener("resize", (evt) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

const pressedKeys = {};
window.onkeyup = function(e) {
    pressedKeys[e.code] = false;
}

window.onkeydown = function(e) {
    pressedKeys[e.code] = true;
}

function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 100, 0, Math.PI * 2);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 5;
    ctx.stroke();
    window.requestAnimationFrame(tick);
}

window.requestAnimationFrame(tick);