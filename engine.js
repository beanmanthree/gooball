import { Player } from './player.js';
import { Circle, PhysicsEngine } from './physics.js';
import { strokeLine, canvas, Camera } from './graphics.js';
import { Vector } from './mathutils.js';

export class Engine {
  constructor() {
    this.physics = new PhysicsEngine();
    this.player = null;
    this.walls = [];
  }

  init() {
    const playerBody = new Circle(100, new Vector(100, 100), 20);
    this.physics.addBody(playerBody);
    this.player = new Player(playerBody);
    this.camera = new Camera(canvas.width, canvas.height);
  }

  update(dt, inputKeys) {
    if (this.player) {
      this.player.handleInput(inputKeys, dt);
      this.player.update(dt);
      this.camera.follow(this.player, 2000, 2000);
    }

    this.physics.update(dt);
  }

  render() {
    for (const wall of this.walls) {
      strokeLine(wall[0], wall[1], '#000000', 2);
    }
  }

  addWall(v0, v1) {
    this.physics.addLineCollider(v0, v1, [0, 0]);
    this.walls.push([v0, v1]);
  }
}