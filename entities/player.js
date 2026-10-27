export class Player {
  constructor(circle) {
    this.body = circle;
    this.speed = 15;
    this.score = 0;
  }

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