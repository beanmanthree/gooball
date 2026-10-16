import * as Physics from "./physics.js";
import * as Graphics from "./graphics.js";

export const engine = { // HOLY SHIT IM GONNA IMPLEMENT std::hive!!!!
    gravity: 9.81,
    deltaTime: 1 / 60,
    drag: 0.1,

    circles: [],
    lineColliders: [],

    addCircle(mass, center, radius, ...properties) {
        this.circles.push(new Physics.Circle(mass, center, radius, ...properties));
    },
    
    addLineCollider(v0, v1, ...properties) {
        this.lineColliders.push(new Physics.LineCollider(v0, v1, ...properties));
    },

    simulateCircles() {
        for (const circle of this.circles) {
            circle.applyFriction(this.drag);
            circle.force(new Physics.Vector(0, this.gravity * circle.mass * this.deltaTime));
            circle.update(this.deltaTime);

            for (const lineCollider of this.lineColliders) {
                circle.collideLineCollider(lineCollider);
            }
        }
    },

    update() {
        this.simulateCircles();
    },

    drawDebug() {
        for (const circle of this.circles) {
            Graphics.strokeCircle(circle.collider.center, circle.collider.radius, "white", 2);
        }
        for (const lineCollider of this.lineColliders) {
            Graphics.strokeLine(lineCollider.v0, lineCollider.v1, "white", 2);
        }
    }
};