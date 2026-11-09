import { RigidBody } from './physics.js';
import { strokeLine, strokeCircle } from './graphics.js';
import { FILL_COLOR, STROKE_COLOR } from './constants.js';

export class Structure {
    // Stores a rigid body and visual information
    rigidBody: RigidBody;
    strokeColor: string;
    fillColor!: string;

    constructor(rigidBody: RigidBody, strokeColor = STROKE_COLOR, fillColor = FILL_COLOR) {
        this.rigidBody = rigidBody;
        this.strokeColor = strokeColor;
        this.fillColor = fillColor;
    }

    draw(): void {
        if (this.rigidBody.shape.type === 'circle') {
            strokeCircle(this.rigidBody.shape.center, this.rigidBody.shape.radius, this.strokeColor);
        } else if (this.rigidBody.shape.type === 'polygon') {
            for (let i = 0; i < this.rigidBody.shape.vertices.length - 1; i++) {
                strokeLine(this.rigidBody.shape.vertices[i], this.rigidBody.shape.vertices[i + 1], this.strokeColor);
            }
            strokeLine(this.rigidBody.shape.vertices[this.rigidBody.shape.vertices.length - 1], this.rigidBody.shape.vertices[0], this.strokeColor);
        } else if (this.rigidBody.shape.type === 'line') {
            strokeLine(this.rigidBody.shape.p0, this.rigidBody.shape.p1, this.strokeColor);
        }
    }
}