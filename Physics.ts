import { Vector2, Transform, AABB } from './mathutils';

export enum ShapeType {
    CIRCLE = 0,
    POLYGON = 1,
    LINE = 2
}

export enum BodyType {
    STATIC = 0,
    DYNAMIC = 1,
    KINEMATIC = 2
}

abstract class Shape {
    restitution!: number;
    density!: number;
    type!: ShapeType;
    friction!: number;

    constructor(restitution: number, density: number, type: ShapeType, friction: number) {
        this.restitution = restitution;
        this.density = density
        this.type = type;
        this.friction = friction;
    }

    abstract clone(): Shape;

    abstract computeAABB(outAABB: AABB, transform: Transform): void;

    abstract computeMass(): number;

}

class CircleShape extends Shape {
    center!: Vector2;
    radius!: number;

    constructor(restitution: number, density: number, type: ShapeType, friction: number, center: Vector2, radius: number) {
        super(restitution, density, type, friction)
        this.center = center
        this.radius = radius
    }

    clone () {
        return new CircleShape(this.restitution, this.density, this.type, this.friction, this.center, this.radius);
    }
}

class PolygonShape extends Shape {
    vertices!: Vector2[];

    constructor(restitution: number, density: number, type: ShapeType, friction: number, ...vertices: Vector2[]) {
        super(restitution, density, type, friction)
        this.vertices = vertices
    }

    clone () {
        return new PolygonShape(this.restitution, this.density, this.type, this.friction, ...this.vertices);
    }
}

class LineShape extends Shape {
    p0!: Vector2;
    p1!: Vector2;

    constructor(restitution: number, density: number, type: ShapeType, friction: number, p0: Vector2, p1: Vector2) {
        super(restitution, density, type, friction)
        this.p0 = p0;
        this.p1 = p1;
    }

    clone () {
        return new PolygonShape(this.restitution, this.density, this.type, this.friction, this.p0, this.p1)
    }
}

class RigidBody {
    type!: BodyType;
    shape!: Shape;
}