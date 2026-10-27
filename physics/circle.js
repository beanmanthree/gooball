export class Circle {
  /**
   * @param {number} x
   * @param {number} y
   * @param {number} radius
   */
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.vx = 0;
    this.vy = 0;
  }

  /**
   * @param {number} fx
   * @param {number} fy
   */
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