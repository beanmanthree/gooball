export class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    
    set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }

    set(other) {
        return set(other.x, other.y);
    }

    clone() {
        return new Vector2(this.x, this.y);
    }

    length() {
        return Math.hypot(this.x, this.y);
    }

    lengthSquared() {
        return this.x * this.x + this.y * this.y;
    }

    add(other) {
        this.x += other.x;
        this.y += other.y;
        return this;
    }

    subtract(other) {
        this.x -= other.x;
        this.y -= other.y;
        return this;
    }

    multiply(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    divide(scalar) {
        this.x /= scalar;
        this.y /= scalar;
        return this;
    }

    normalize(r) {
        const length = this.length();
        if (!length) return;
        const ratio = r / length;
        this.x *= ratio;
        this.y *= ratio;
        return this
    }

    dot(other) {
        return this.x * other.x + this.y * other.y;
    }

    cross(other) {
        return this.x * other.y - this.y * other.x;
    }

    perpendicular() {
        return new Vector(-this.y, this.x);
    }

    rotate(radians) {
        const cosValue = Math.cos(radians);
        const sinValue = Math.sin(radians);
        this.x = (cosValue * this.x) - (sinValue * this.y);
        this.y = (sinValue * this.x) + (cosValue * this.y);
        return this
    }

    reflect(normal) {
        const dotProduct = this.x * normal.x + this.y * normal.y;
        this.x = this.x - 2 * dotProduct * normal.x;
        this.y = this.y - 2 * dotProduct * normal.y;
        return this
    }

    project(onTo) {
        const dotProduct = this.x * onTo.x + this.y * onTo.y;
        const magnitudeSquared = onTo.x * onTo.x + onTo.y * onTo.y;
        const scalar = dotProduct / magnitudeSquared;
        this.x = scalar * onTo.x;
        this.y = scalar * onTo.y;
        return this
    }
}

export class Transform {
    constructor(position = new Vector2(), rotation = 0) {
        this.set(position, rotation);
    }
    
    set(position, rotation) {
        this.position = position;
        this.rotation = rotation;
        this.updateTrig();
        return this;
    }

    clone() {
        return new Transform(this.position.clone(), this.rotation);
    }

    updateTrig() {
        this.cos = Math.cos(this.rotation);
        this.sin = Math.sin(this.rotation);
    }
}

export class AABB {
    constructor(min = new Vector2(), max = new Vector2()) {
        this.min = min;
        this.max = max;
    }

    set(min, max) {
        this.min.set(min);
        this.max.set(max);
        return this;
    }

    clone() {
        return new AABB(this.min.clone(), this.max.clone());
    }

    contains(point) {
        return point.x >= this.min.x && point.x <= this.max.x &&
            point.y >= this.min.y && point.y <= this.max.y;
    }

    intersects(other) {
        return this.min.x <= other.max.x && this.max.x >= other.min.x &&
            this.min.y <= other.max.y && this.max.y >= other.min.y;
    }

    expand(margin) {
        this.min.x -= margin.x;
        this.min.y -= margin.y;
        this.max.x += margin.x;
        this.max.y += margin.y;
        return this;
    }

    combine(other) {
        this.min.x = Math.min(this.min.x, other.min.x);
        this.min.y = Math.min(this.min.y, other.min.y);
        this.max.x = Math.max(this.max.x, other.max.x);
        this.max.y = Math.max(this.max.y, other.max.y);
        return this;
    }

    perimeter() {
        const width = this.max.x - this.min.x;
        const height = this.max.y - this.min.y;
        return 2 * (width + height);
    }
}