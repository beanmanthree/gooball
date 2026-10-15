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

export function subtractVectors(v0, v1) {
    return v0.copy().subtract(v1);
}

export function addVectors(v0, v1) {
    return v0.copy().add(v1);
}

export function multiplyVector(v, scalar) {
    return v.copy().multiply(scalar);
}

export function divideVector(v, scalar) {
    return v.copy().divide(scalar);
}

export function normalizeVector(v, r) {
    return v.copy().normalize(r);
}

export function rotateVector(v, radians) {
    return v.copy().rotate(radians);
}

export function reflectVector(v, normal) {
    return v.copy().reflect(normal);
}

export function projectVector(v, onTo) {
    return v.copy().project(onTo);
}

export function dotProductVectors(v0, v1) {
    return v0.x * v1.x + v0.y * v1.y;
}