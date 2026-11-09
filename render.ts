import { Vector2 } from "./mathutils.js";

class camera {
    position: Vector2;
    width: number;
    height: number;
    worldWidth: number;
    worldHeight: number;

    constructor(position: Vector2, width: number, height: number, worldWidth: number, worldHeight: number) {
        this.position = position;
        this.width = width;
        this.height = height;
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;
    }

    setWorldSize(worldWidth: number, worldHeight: number): void {
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;
    }

    resize(width: number, height: number): void {
        this.width = width;
        this.height = height;
    }

    smoothFollow(target: Vector2, smoothingFactor: number): void {
        const desiredPosition = new Vector2(
            target.x - this.width / 2,
            target.y - this.height / 2
        );

        this.position.x += (desiredPosition.x - this.position.x) * smoothingFactor;
        this.position.y += (desiredPosition.y - this.position.y) * smoothingFactor;

        this.clamp();
    }

    clamp(): void {
        this.position.x = Math.max(0, Math.min(this.position.x, this.worldWidth - this.width));
        this.position.y = Math.max(0, Math.min(this.position.y, this.worldHeight - this.height));
    }
}