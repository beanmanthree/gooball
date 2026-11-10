import { strokeLine, strokeCircle, strokeRect, fillCircle } from './graphics.js';
import { Vector2, Transform } from './mathutils.js';
import { Player } from './player.js';
import { RigidBody, ShapeType, CircleShape, LineShape, PolygonShape } from './physics.js';
import { PLAYER_X, PLAYER_Y, PLAYER_WIDTH, PLAYER_HEIGHT, STROKE_COLOR, FILL_COLOR } from './constants.js';
import { Structure } from './sructure.js';
import { Keyboard } from './input.js';

class Engine {
    player: Player;
    structures: Record<number, Structure> = {};

    constructor() {
        const playerBody = new RigidBody(2, new PolygonShape(PLAYER_WIDTH, PLAYER_HEIGHT), new Transform(new Vector2(PLAYER_X, PLAYER_Y)));
        this.player = new Player(playerBody);
    }

    addStructure(structure: Structure, id: number): void {
        this.structures[id] = structure;
    }

    update(deltaTime: number): void {
        for (const structure of Object.values(this.structures)) {
            structure.draw();
        }
        this.player.inputMove(+Keyboard.keys['ArrowRight'] - +Keyboard.keys['ArrowLeft'], 0.1); // 0.1 is an arbitrary friction choice
    }
}