import * as Mathutils from "./mathutils.js";
import * as Physics from "./physics.js";
import * as Graphics from "./graphics.js";

// HOLY SHIT IM GONNA IMPLEMENT std::hive!!!!
const gravity = 1000;
const deltaTime = 1 / 60;
const drag = 0.00;

const circles = [];
const lineColliders = [];

export function addCircle(mass, center, radius, ...properties) {
    circles.push(new Physics.Circle(mass, center, radius, ...properties));
}

export function addLineCollider(v0, v1, ...properties) {
    lineColliders.push(new Physics.LineCollider(v0, v1, ...properties));
}

export function simulateCircles() {
    for (const circle of circles) {
        circle.applyFriction(drag);
        circle.force(new Mathutils.Vector(0, gravity * circle.mass * deltaTime));
        circle.update(deltaTime);

        for (const lineCollider of lineColliders) {
            circle.collideLineCollider(lineCollider);
        }
    }
}

export function update() {
    simulateCircles();
}

export function drawDebug() {
    for (const circle of circles) {
        Graphics.strokeCircle(circle.collider.center, circle.collider.radius, "white");
    }
    for (const lineCollider of lineColliders) {
        Graphics.strokeLine(lineCollider.v0, lineCollider.v1, "white");
    }
}