import { Vector2, Transform, AABB } from './mathutils';

export enum ShapeType {
    CIRCLE = 0,
    POLYGON = 1,
    LINE = 2
}

export interface MassData {
    mass: number;
    inertia: number;
    center: Vector2;
}

abstract class Shape {
    type: ShapeType;
    density: number;
    friction: number;
    restitution: number;

    constructor(type: ShapeType, desnity: number = 1, friction: number = 0.5, restitution: number = 0.5) {
        this.type = type;
        this.density = desnity;
        this.friction = friction;
        this.restitution = restitution;
    }

    copy(other: Shape) : Shape {
        this.type = other.type;
        this.density = other.density;
        this.friction = other.friction;
        this.restitution = other.restitution;
        return this;
    }

    abstract clone(): Shape;

    abstract computeAABB(transform: Transform, outAABB: AABB): void;

    abstract computeMassData(outMassData: MassData): void;
}

export class CircleShape extends Shape {
    radius: number;

    constructor(radius: number) {
        super(ShapeType.CIRCLE);
        this.radius = radius;
    }

    clone() : CircleShape {
        const clone = new CircleShape(this.radius);
        clone.copy(this);
        return clone;
    }

    computeAABB(transform: Transform, outAABB: AABB): void {
        outAABB.min.set(transform.position.x - this.radius, transform.position.y - this.radius);
        outAABB.max.set(transform.position.x + this.radius, transform.position.y + this.radius);
    }

    computeMassData(outMassData: MassData): void {
        const area = Math.PI * this.radius * this.radius;
        outMassData.mass = area * this.density;
        outMassData.inertia = outMassData.mass * this.radius * this.radius / 2;
        outMassData.center.set(0, 0);
    }
}

class PolygonShape extends Shape {
    vertices: Vector2[] = [];
    normals: Vector2[] = [];

    constructor() {
        super(ShapeType.POLYGON);
    }

    setVertices(vertices: Vector2[]): void {
        const count = vertices.length;
        this.vertices = vertices.map(v => v.clone());
        this.normals = new Array(count);
        for (let i = 0; i < count; i++) {
            const v0 = this.vertices[i];
            const v1 = this.vertices[(i + 1) % count];
            const edge = v1.clone().subtract(v0);
            const normal = edge.perpendicularCCW().normalize();
            this.normals[i] = normal;
        }
    }

    setBox(width: number, height: number): void {
        const hx = width / 2;
        const hy = height / 2;
        this.setVertices([
            new Vector2(-hx, -hy),
            new Vector2(hx, -hy),
            new Vector2(hx, hy),
            new Vector2(-hx, hy)
        ]);
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
}

export enum BodyType {
    STATIC = 0,
    DYNAMIC = 1,
    KINEMATIC = 2
}

class RigidBody {
    type: BodyType;
    shape: Shape;
}