export class Vector {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    
    copy() {
        return new Vector(this.x, this.y);
    }

    getLength() {
        return Math.hypot(this.x, this.y);
    }

    subtract(other) {
        this.x -= other.x;
        this.y -= other.y;
        return this;
    }

    add(other) {
        this.x += other.x;
        this.y += other.y;
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
        const length = this.getLength();
        if (!length) return new Vector(0, 0);
        const ratio = r / length;
        return new Vector(this.x * ratio, this.y * ratio);
    }

    rotate(radians) {
        const cosValue = Math.cos(radians);
        const sinValue = Math.sin(radians);
        const rotatedX = (cosValue * this.x) - (sinValue * this.y);
        const rotatedY = (sinValue * this.x) + (cosValue * this.y);
        return new Vector(rotatedX, rotatedY);
    }

    reflect(normal) {
        const dotProduct = this.x * normal.x + this.y * normal.y;
        const reflectedX = this.x - 2 * dotProduct * normal.x;
        const reflectedY = this.y - 2 * dotProduct * normal.y;
        return new Vector(reflectedX, reflectedY);
    }

    project(onTo) {
        const dotProduct = this.x * onTo.x + this.y * onTo.y;
        const magnitudeSquared = onTo.x * onTo.x + onTo.y * onTo.y;
        const scalar = dotProduct / magnitudeSquared;
        const projectedX = scalar * onTo.x;
        const projectedY = scalar * onTo.y;
        return new Vector(projectedX, projectedY);
    }
}