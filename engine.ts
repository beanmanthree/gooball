import { strokeLine } from './graphics.js';
import { Vector2 } from './mathutils.js';
import { Player } from './player.js';
import { RigidBody, PhysicsEngine } from './physics.js';
import { PLAYER_X, PLAYER_Y, PLAYER_WIDTH, PLAYER_HEIGHT } from './constants.js';

class Engine {
    player: Player;
    physicsEngine: PhysicsEngine;
    rigidBodies: Record<number, RigidBody> = {};

    constructor() {
        const playerBody = new RigidBody(new Vector2(PLAYER_X, PLAYER_Y), PLAYER_WIDTH, PLAYER_HEIGHT);
        this.player = new Player(playerBody);
        this.physicsEngine = new PhysicsEngine();
    }

    addRigidBody(rigidBody: RigidBody, id: number): void {
        this.rigidBodies[id] = rigidBody;
    }

    update(deltaTime: number): void {
        void
    }
}