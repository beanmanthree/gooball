export class Vector2 {
    x!: number;
    y!: number;

    constructor(x: number = 0, y: number = 0) {
        this.set(x, y);
    }
    
    set(x: number, y: number): this {
        this.x = x;
        this.y = y;
        return this;
    }
    
    copy(other: Vector2): this {
        return this.set(other.x, other.y);
    }

    clone(): Vector2 {
        return new Vector2(this.x, this.y);
    }

    length(): number {
        return Math.hypot(this.x, this.y);
    }

    lengthSquared(): number {
        return this.x * this.x + this.y * this.y;
    }

    add(other: Vector2): this {
        this.x += other.x;
        this.y += other.y;
        return this;
    }

    subtract(other: Vector2): this {
        this.x -= other.x;
        this.y -= other.y;
        return this;
    }

    multiply(scalar: number): this {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    divide(scalar: number): this {
        this.x /= scalar;
        this.y /= scalar;
        return this;
    }

    normalize(r: number = 1): this {
        const length = this.length();
        if (!length) return this.set(0, 1);
        const ratio = r / length;
        this.x *= ratio;
        this.y *= ratio;
        return this;
    }

    dot(other: Vector2): number {
        return this.x * other.x + this.y * other.y;
    }

    cross(other: Vector2): number {
        return this.x * other.y - this.y * other.x;
    }

    perpendicularCW(): Vector2 {
        return new Vector2(this.y, -this.x);
    }

    perpendicularCCW(): Vector2 {
        return new Vector2(-this.y, this.x);
    }

    rotate(radians: number): this {
        const cosValue = Math.cos(radians);
        const sinValue = Math.sin(radians);
        this.x = (cosValue * this.x) - (sinValue * this.y);
        this.y = (sinValue * this.x) + (cosValue * this.y);
        return this;
    }

    reflect(normal: Vector2): this {
        const dotProduct = this.x * normal.x + this.y * normal.y;
        this.x = this.x - 2 * dotProduct * normal.x;
        this.y = this.y - 2 * dotProduct * normal.y;
        return this;
    }

    project(onTo: Vector2): this {
        const dotProduct = this.x * onTo.x + this.y * onTo.y;
        const magnitudeSquared = onTo.x * onTo.x + onTo.y * onTo.y;
        const scalar = dotProduct / magnitudeSquared;
        this.x = scalar * onTo.x;
        this.y = scalar * onTo.y;
        return this;
    }
}

export class Transform {
    position!: Vector2;
    rotation!: number;
    cos!: number;
    sin!: number;

    constructor(position: Vector2 = new Vector2(), rotation: number = 0) {
        this.set(position, rotation);
    }
    
    set(position: Vector2, rotation: number): this {
        this.position = position;
        this.rotation = rotation;
        this.updateTrig();
        return this;
    }

    clone(): Transform {
        return new Transform(this.position.clone(), this.rotation);
    }

    updateTrig(): void {
        this.cos = Math.cos(this.rotation);
        this.sin = Math.sin(this.rotation);
    }
}

export class AABB {
    min!: Vector2;
    max!: Vector2;

    constructor(min: Vector2 = new Vector2(), max: Vector2 = new Vector2()) {
        this.set(min, max);
    }

    set(min: Vector2, max: Vector2): this {
        this.min.copy(min);
        this.max.copy(max);
        return this;
    }

    clone(): AABB {
        return new AABB(this.min.clone(), this.max.clone());
    }

    contains(point: Vector2): boolean {
        return point.x >= this.min.x && point.x <= this.max.x &&
            point.y >= this.min.y && point.y <= this.max.y;
    }

    intersects(other: AABB): boolean {
        return this.min.x <= other.max.x && this.max.x >= other.min.x &&
            this.min.y <= other.max.y && this.max.y >= other.min.y;
    }

    expand(margin: Vector2): this {
        this.min.x -= margin.x;
        this.min.y -= margin.y;
        this.max.x += margin.x;
        this.max.y += margin.y;
        return this;
    }

    combine(other: AABB): this {
        this.min.x = Math.min(this.min.x, other.min.x);
        this.min.y = Math.min(this.min.y, other.min.y);
        this.max.x = Math.max(this.max.x, other.max.x);
        this.max.y = Math.max(this.max.y, other.max.y);
        return this;
    }

    perimeter(): number {
        const width = this.max.x - this.min.x;
        const height = this.max.y - this.min.y;
        return 2 * (width + height);
    }
}