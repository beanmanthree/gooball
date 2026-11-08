import { Vector } from './mathutils.js';

export class Player {
    constructor(body) {
    this.body = body;
    this.acceleration = 6000;
    this.maxSpeed = 400;
    this.braking = 6000;
    this.score = 0;
    }

    handleInput(keys, dt) {
    let horizontalForce = 0;
    if (keys['ArrowLeft'] || keys['KeyA']) {
      horizontalForce -= this.acceleration;
    }
    if (keys['ArrowRight'] || keys['KeyD']) {
      horizontalForce += this.acceleration;
    }
    if (horizontalForce !== 0) {
      this.body.force(new Vector(horizontalForce * this.body.mass * dt, 0));
    } else {
      const velocityX = this.body.velocity.x;
      const velocityChange = this.braking * dt;
      this.body.velocity.x = Math.abs(velocityX) <= velocityChange
        ? 0
        : velocityX - Math.sign(velocityX) * velocityChange;
    }
    this.body.velocity.x = Math.max(-this.maxSpeed, Math.min(this.maxSpeed, this.body.velocity.x));
    }

    update(dt) {}
}