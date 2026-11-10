import { EPSILON } from './constants';
import { MathUtil, Vector2, Transform, AABB } from './mathutils';

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

    constructor(type: ShapeType, density: number = 1, friction: number = 0.5, restitution: number = 0.5) {
        this.type = type;
        this.density = density;
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

    clone(): Shape {
        const ctor = this.constructor as new () => this;
        return new ctor().copy(this);
    }

    abstract computeAABB(transform: Transform, outAABB: AABB): void;

    abstract computeMassData(outMassData: MassData): void;
}

export class CircleShape extends Shape {
    radius: number;

    constructor(radius: number = 1) {
        super(ShapeType.CIRCLE);
        this.radius = radius;
    }

    override copy(other: CircleShape): CircleShape {
        super.copy(other);
        this.radius = other.radius;
        return this;
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

export class PolygonShape extends Shape {
    vertices: Vector2[] = [];
    normals: Vector2[] = [];
    
    constructor(vertices: Vector2[]);
    constructor(width: number, height: number);
    constructor();
    constructor(widthOrVertices?: Vector2[] | number, height?: number) {
        super(ShapeType.POLYGON);
        if (Array.isArray(widthOrVertices)) this.setVertices(widthOrVertices);
        else if (typeof widthOrVertices === 'number' && typeof height == 'number') this.setBox(widthOrVertices, height);
    }

    override copy(other: PolygonShape): PolygonShape {
        super.copy(other);
        this.vertices = other.vertices.map(v => v.clone());
        this.normals = other.normals.map(n => n.clone());
        return this;
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

    getSupport(direction: Vector2, transform: Transform): Vector2 {
        let bestProjection = -Infinity;
        let bestVertex = this.vertices[0];
        const cos = transform.cos;
        const sin = transform.sin;
        const dir = transform.transformLocal(direction.clone());
        for (const v of this.vertices) {
            const projection = v.dot(dir);
            if (projection > bestProjection) {
                bestProjection = projection;
                bestVertex = v;
            }
        }
        return transform.transform(bestVertex.clone());
    }

    computeAABB(transform: Transform, outAABB: AABB): void {
        let minX = Infinity, minY = Infinity;
        let maxX = -Infinity, maxY = -Infinity;
        for (const v of this.vertices) {
            const worldV = transform.transform(v.clone());
            if (worldV.x < minX) minX = worldV.x;
            if (worldV.y < minY) minY = worldV.y;
            if (worldV.x > maxX) maxX = worldV.x;
            if (worldV.y > maxY) maxY = worldV.y;
        }
        outAABB.min.set(minX, minY);
        outAABB.max.set(maxX, maxY);
    }

    computeMassData(outMassData: MassData): void {
        let area = 0;
        let center = new Vector2(0, 0);
        let inertia = 0;
        const k_inv3 = 1 / 3;
        for (let i = 0; i < this.vertices.length; i++) {
            const p0 = this.vertices[i];
            const p1 = this.vertices[(i + 1) % this.vertices.length];
            const cross = p0.cross(p1);
            const triangleArea = cross / 2;
            area += triangleArea;
            center.add(p0.clone().add(p1).multiply(triangleArea * k_inv3));
            const intv = p0.clone().dot(p0) + p0.clone().dot(p1) + p1.clone().dot(p1);
            inertia += (0.25 * k_inv3 * cross) * intv;
        }
        outMassData.mass = this.density * area;
        if (area > 0) outMassData.center = center.clone().divide(area);
        else outMassData.center.set(0, 0);
        outMassData.inertia = inertia * this.density;
    }
}

export class LineShape extends Shape {
    p0: Vector2;
    p1: Vector2;
    normal!: Vector2;

    constructor(p0: Vector2, p1: Vector2) {
        super(ShapeType.LINE);
        this.p0 = p0;
        this.p1 = p1;
        this.calculateNormal();
    }

    override copy(other: LineShape): LineShape {
        super.copy(other);
        this.p0.copy(other.p0);
        this.p1.copy(other.p1);
        this.normal.copy(other.normal);
        return this;
    }

    calculateNormal() {
        const dv = this.p1.clone().subtract(this.p0);
        this.normal.copy(dv.perpendicularCCW().normalize());
    }

    getLength() {
        return this.p1.clone().subtract(this.p0).length();
    }

    getClosestPoint(point: Vector2): Vector2 {
        const dv = this.p1.clone().subtract(this.p0);
        const lengthSquared = dv.lengthSquared();
        if (lengthSquared == 0) return this.p0.clone();
        const t = MathUtil.clamp(point.clone().subtract(this.p0).dot(dv) / lengthSquared, 0, 1);
        return this.p0.clone().add(dv.multiply(t));
    }

    computeAABB(transform: Transform, outAABB: AABB): void {
        const worldP0 = transform.transform(this.p0.clone());
        const worldP1 = transform.transform(this.p1.clone());
        outAABB.min.set(Math.min(worldP0.x, worldP1.x), Math.min(worldP0.y, worldP1.y));
        outAABB.max.set(Math.max(worldP0.x, worldP1.x), Math.max(worldP0.y, worldP1.y));
        outAABB.expandUniform(EPSILON);
    }

    computeMassData(outMassData: MassData): void {
        outMassData.mass = 0;
        outMassData.inertia = 0;
        outMassData.center.copy(this.p0.clone().add(this.p1).divide(2));
    }
}

export enum BodyType {
    STATIC = 0,
    DYNAMIC = 1,
    KINEMATIC = 2
}

export class RigidBody {
    id: number;
    type: BodyType;

    transform: Transform;
    previousTransform: Transform;

    shape: Shape;
    mass: number = 0;
    invMass: number = 0;
    inertia: number = 0;
    invInertia: number = 0;

    linearVelocity: Vector2 = new Vector2();
    angularVelocity: number = 0;

    force: Vector2 = new Vector2();
    torque: number = 0;

    lockPositionX: boolean = false;
    lockPositionY: boolean = false
    lockRotation: boolean = false;

    ccdEnabled: boolean = false;
    isAwake: boolean = true;

    static nextId: number = 0;

    constructor(type: BodyType, shape: Shape, transform: Transform) {
        this.id = RigidBody.nextId++;
        this.type = type;
        this.shape = shape;
        this.transform = transform.clone();
        this.previousTransform = transform.clone();
    }

    setProperties(restitution: number, density: number, friction: number): void {
        this.shape.restitution = restitution;
        this.shape.density = density;
        this.shape.friction = friction;
    } // doesn't include precomputation adjustments
}