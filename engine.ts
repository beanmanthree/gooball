import { strokeLine, strokeCircle, strokeRect, fillCircle } from './graphics.js';
import { Vector2 } from './mathutils.js';
import { Player } from './player.js';
import { RigidBody, PhysicsEngine, ShapeType } from './physics.js';
import { PLAYER_X, PLAYER_Y, PLAYER_WIDTH, PLAYER_HEIGHT, STROKE_COLOR, FILL_COLOR } from './constants.js';
import { Structure } from './sructure.js';

class Engine {
    player: Player;
    physicsEngine: PhysicsEngine;
    structures: Record<number, Structure> = {};

    constructor() {
        const playerBody = new RigidBody(new Vector2(PLAYER_X, PLAYER_Y), PLAYER_WIDTH, PLAYER_HEIGHT);
        this.player = new Player(playerBody);
        this.physicsEngine = new PhysicsEngine();
    }

    addStructure(structure: Structure, id: number): void {
        this.structures[id] = structure;
    }

    update(deltaTime: number): void {
        for (const structure of Object.values(this.structures)) {
            structure.draw();
        }
    }
