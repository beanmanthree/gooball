import { strokeLine, strokeCircle, strokeRect, fillCircle } from './graphics.js';
import { Vector2 } from './mathutils.js';
import { Player } from './player.js';
import { RigidBody, PhysicsEngine, ShapeType } from './physics.js';
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
        for (const body of Object.values(this.rigidBodies)) {
            if (body.shape.type === ShapeType.CIRCLE) {
                strokeCircle(body.position.x, body.position.y, body.shape.radius);
            }
            else if (body.shape.type === ShapeType.POLYGON) {
                for (let i = 0; i < body.shape.vertices.length - 1; i++) {
                    strokeLine(body.shape.vertices[i].x, body.shape.vertices[i].y, body.shape.vertices[i + 1].x, body.shape.vertices[i + 1].y);
                }
                strokeLine(body.shape.vertices[body.shape.vertices.length - 1].x, body.shape.vertices[body.shape.vertices.length - 1].y, body.shape.vertices[0].x, body.shape.vertices[0].y);
            }
            else if (body.shape.type === ShapeType.LINE) {
                strokeLine(body.shape.p0.x, body.shape.p0.y, body.shape.p1.x, body.shape.p1.y);
            }
        }
    }
    