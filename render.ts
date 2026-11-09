import { Vector2 } from "./mathutils.js";

class camera {
    position: Vector2;
    width: number; // ts should be vector2 cliv
    height: number;
    worldWidth: number;                     // ts should also be vector2 cliv
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
        const desiredPosition = target.clone().subtract(new Vector2(this.width / 2, this.height / 2));
        
        this.position.add(desiredPosition.subtract(this.position).multiply(smoothingFactor));

        this.clamp();
    }

    clamp(): void {
        this.position.clamp(new Vector2(0, 0), new Vector2(this.worldWidth - this.width, this.worldHeight - this.height));
    }
}