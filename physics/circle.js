export class Circle {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.vx = 0;
    this.vy = 0;
  }

  applyForce(fx, fy) {
    this.vx += fx;
    this.vy += fy;
  }

  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.vx *= 0.98; // Friction / Drag
    this.vy *= 0.98;
  }
}