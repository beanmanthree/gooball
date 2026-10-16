import * as Engine from "./engine.js";
import * as Mathutils from "./mathutils.js";
import * as Graphics from "./graphics.js";

const engine = Engine.engine;
engine.addCircle(1, new Mathutils.Vector(window.innerWidth / 2, window.innerHeight / 2), 20);

const pressedKeys = {};
window.onkeyup = function(e) {
    pressedKeys[e.code] = false;
}

window.onkeydown = function(e) {
    pressedKeys[e.code] = true;
}

function tick() {
    Graphics.clearScreen();
    engine.update();
    engine.drawDebug();

    if (pressedKeys["KeyW"]) {
        engine.circles[0].force(new Mathutils.Vector(0, -100));
    }
    if (pressedKeys["KeyA"]) {
        engine.circles[0].force(new Mathutils.Vector(-100, 0));
    }
    if (pressedKeys["KeyS"]) {
        engine.circles[0].force(new Mathutils.Vector(0, 100));
    }
    if (pressedKeys["KeyD"]) {
        engine.circles[0].force(new Mathutils.Vector(100, 0));
    }
    window.requestAnimationFrame(tick);
}

window.requestAnimationFrame(tick);