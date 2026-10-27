import { Vector } from '../mathutils.js';

export class Player {
  constructor(body) {
    this.body = body;
    this.speed = 1500;
    this.braking = 6000;
    this.score = 0;
  }

  handleInput(keys, dt) {
    let horizontalForce = 0;
    if (keys['ArrowLeft'] || keys['KeyA']) {
      horizontalForce -= this.speed;
    }
    if (keys['ArrowRight'] || keys['KeyD']) {
      horizontalForce += this.speed;
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
  }

  update(dt) {}
}