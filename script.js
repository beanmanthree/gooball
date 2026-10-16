import * as Engine from "./engine.js";
import * as Mathutils from "./mathutils.js";
import * as Graphics from "./graphics.js";

Engine.addCircle(1, new Mathutils.Vector(window.innerWidth / 2, window.innerHeight / 2), 20);
Engine.addLineCollider(new Mathutils.Vector(Graphics.cRect.left, Graphics.cRect.bottom), new Mathutils.Vector(Graphics.cRect.right, Graphics.cRect.bottom));
Engine.addLineCollider(new Mathutils.Vector(Graphics.cRect.left, Graphics.cRect.top), new Mathutils.Vector(Graphics.cRect.right, Graphics.cRect.top));
Engine.addLineCollider(new Mathutils.Vector(Graphics.cRect.left, Graphics.cRect.top), new Mathutils.Vector(Graphics.cRect.left, Graphics.cRect.bottom));
Engine.addLineCollider(new Mathutils.Vector(Graphics.cRect.right, Graphics.cRect.top), new Mathutils.Vector(Graphics.cRect.right, Graphics.cRect.bottom));

const pressedKeys = {};
window.onkeyup = function(e) {
    pressedKeys[e.code] = false;
}

window.onkeydown = function(e) {
    pressedKeys[e.code] = true;
}

function tick() {
    Graphics.clearScreen();
    Engine.update();
    Engine.drawDebug();
    window.requestAnimationFrame(tick);
}

window.requestAnimationFrame(tick);