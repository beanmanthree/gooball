// core/engine.js
import { Circle } from '../physics/circle.js';
import { Player } from '../entities/player.js';

export class Engine {
  constructor() {
    /** @type {Array<Circle>} */
    this.physicsBodies = [];
    /** @type {Player|null} */
    this.player = null;
  }

  init() {
    const playerBody = new Circle(100, 100, 20);
    this.physicsBodies.push(playerBody);
    
    this.player = new Player(playerBody);
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

    // Step physics for all bodies
    for (const body of this.physicsBodies) {
      body.update(dt);
    }
  }
}