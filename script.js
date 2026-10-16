import * as Engine from "./engine.js";

const pressedKeys = {};
window.onkeyup = function(e) {
    pressedKeys[e.code] = false;
}

window.onkeydown = function(e) {
    pressedKeys[e.code] = true;
}

function tick() {
    clearScreen();
    Engine.update();
    Engine.drawDebug();

    if (pressedKeys["KeyW"]) {
        Engine.circles[0].force(new Engine.Vector(0, -100));
    }
    if (pressedKeys["KeyA"]) {
        Engine.circles[0].force(new Engine.Vector(-100, 0));
    }
    if (pressedKeys["KeyS"]) {
        Engine.circles[0].force(new Engine.Vector(0, 100));
    }
    if (pressedKeys["KeyD"]) {
        Engine.circles[0].force(new Engine.Vector(100, 0));
    }
    window.requestAnimationFrame(tick);
}

window.requestAnimationFrame(tick);