import { Circle } from '../physics/circle.js';
import { Player } from '../entities/player.js';
import { PhysicsEngine } from '../physics/physics.js';
import { strokeLine } from '../graphics.js';

export class Engine {
  constructor() {
    /** @type {PhysicsEngine} */
    this.physics = new PhysicsEngine();
    
    /** @type {Player|null} */
    this.player = null;
  }

  init() {
    const playerBody = new Circle(100, 100, 20);
    
    this.physics.addBody(playerBody);

    this.player = new Player(playerBody);

    this.walls = [];
  }

  /**
   * @param {number} dt
   * @param {Object<string, boolean>} inputKeys
   */
  update(dt, inputKeys) {
    if (this.player) {
      this.player.handleInput(inputKeys);
      this.player.update(dt);
    }
    
    for (const wall of this.walls) {
      strokeLine(wall[0], wall[1], '#000000', 2);
    }

    this.physics.update(dt);
  }

  addWall (v0, v1) {
    this.physics.addLineCollider(v0, v1, [0, 0]);
    this.walls.push([v0, v1]);
  }
}