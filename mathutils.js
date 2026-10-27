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
        if (!length) return;
        const ratio = r / length;
        this.x *= ratio;
        this.y *= ratio;
        return this
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