export class Player {
  /**
   * @param {import('../physics/circle.js').Circle} circle
   */
  constructor(circle) {
    /** @type {import('../physics/circle.js').Circle} */
    this.body = circle;
    this.speed = 15;
    this.score = 0;
  }

  /**
   * @param {Object<string, boolean>} keys
   */
  handleInput(keys) {
    if (keys['ArrowLeft'] || keys['KeyA']) {
      this.body.applyForce(-this.speed, 0);
    }
    if (keys['ArrowRight'] || keys['KeyD']) {
      this.body.applyForce(this.speed, 0);
    }
  }

  update(dt) {
    
  }
}