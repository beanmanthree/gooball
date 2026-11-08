import { Vector2 } from './mathutils.js';
import { RigidBody } from './physics.js';
import { PLAYER_ACCELERATION, PLAYER_MAX_SPEED } from './constants.js';

export class Player {
    body: RigidBody;

    constructor(body: RigidBody) {
        this.body = body;
    }

    inputMove(direction: number, friction: number): void {
        // direction is expected to be -1 for left, 1 for right, and 0 for no input
        if (direction === 0) {
            // Apply friction to slow down the player when no input is given
            this.body.applyForce(this.body.velocity.multiply(-1).multiply(friction)); // Adjust the friction factor as needed
        } else {
            // Apply acceleration in the direction of input
            this.body.applyForce(new Vector2(direction * PLAYER_ACCELERATION, 0));
            // Clamp the velocity to the maximum speed
            if (this.body.velocity.x > PLAYER_MAX_SPEED) {
                this.body.velocity.x = PLAYER_MAX_SPEED;
            } else if (this.body.velocity.x < -PLAYER_MAX_SPEED) {
                this.body.velocity.x = -PLAYER_MAX_SPEED;
            }
        }
}