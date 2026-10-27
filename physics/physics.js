import * as Mathutils from "../mathutils.js";

const GRAVITY = 900;

export class Properties {
    constructor(frictionCoefficient = 0, restitutionCoefficient = 1) {
        this.frictionCoefficient = frictionCoefficient;
        this.restitutionCoefficient = restitutionCoefficient;
    }
}

export class LineCollider {
    constructor(v0, v1, properties = new Properties()) {
        this.v0 = v0;
        this.v1 = v1;
        this.properties = properties;
    }
    getVector() {
        return Mathutils.subtractVectors(this.v1, this.v0);
    }
}

export class CircleCollider {
    constructor(center, radius, properties = new Properties()) {
        this.center = center;
        this.radius = radius;
        this.properties = properties;
    }
}

export class Circle {
    constructor(mass, center, radius, properties = new Properties()) {
        this.collider = new CircleCollider(center, radius, properties);
        this.mass = mass;
        this.velocity = new Mathutils.Vector(0, 0);
    }

    force(forceVector) {
        this.velocity.add(forceVector.divide(this.mass));
    }

    applyFriction(frictionCoefficient) {
        this.velocity.add(Mathutils.multiplyVector(this.velocity, -frictionCoefficient));
    }

    update(deltaTime) {
        this.collider.center.add(Mathutils.multiplyVector(this.velocity, deltaTime));
    }

    collideLineCollider(collider) {
        const lineVector = collider.getVector();
        const lineLength = lineVector.getLength();

        if (lineLength <= Number.EPSILON) {
            return this.collideCircleCollider(new CircleCollider(collider.v0, 0, collider.properties));
        }

        const offsetCenter = Mathutils.subtractVectors(this.collider.center, collider.v0);
        const projectedCenter = Mathutils.projectVector(offsetCenter, lineVector);
        const projection = Math.abs(lineVector.x) > Number.EPSILON ?
            projectedCenter.x / lineVector.x :
            projectedCenter.y / lineVector.y;

        if (projection <= 0) {
            return this.collideCircleCollider(new CircleCollider(collider.v0, 0, collider.properties));
        }
        if (projection >= 1) {
            return this.collideCircleCollider(new CircleCollider(collider.v1, 0, collider.properties));
        }

        const contact = Mathutils.addVectors(collider.v0, Mathutils.multiplyVector(lineVector, projection));
        return this.collideCircleCollider(new CircleCollider(contact, 0, collider.properties));
    }

    collideCircleCollider(collider) {
        const centerOffset = Mathutils.subtractVectors(this.collider.center, collider.center);
        const centerDistance = centerOffset.getLength();
        const combinedRadius = this.collider.radius + collider.radius;

        if (centerDistance > combinedRadius) {
            return false;
        }

        const normal = centerDistance <= Number.EPSILON ?
            (this.velocity.getLength() <= Number.EPSILON ?
                new Mathutils.Vector(1, 0) :
                Mathutils.normalizeVector(Mathutils.multiplyVector(this.velocity, -1), 1)
            ) :
            Mathutils.normalizeVector(centerOffset, 1);
        const penetration = combinedRadius - centerDistance;
        this.collider.center.add(Mathutils.multiplyVector(normal, penetration));

        const normalSpeed = Mathutils.dotProductVectors(this.velocity, normal);
        if (normalSpeed >= 0) {
            return true;
        }

        const restitution = Math.min(this.collider.properties.restitutionCoefficient, collider.properties.restitutionCoefficient);
        const normalImpulse = -(1 + restitution) * normalSpeed * this.mass;
        this.velocity.add(Mathutils.multiplyVector(normal, -(1 + restitution) * normalSpeed));

        const tangentVelocity = Mathutils.subtractVectors(this.velocity, Mathutils.multiplyVector(normal, normalSpeed));
        const tangentSpeed = tangentVelocity.getLength();
        if (tangentSpeed <= Number.EPSILON) {
            return true;
        }

        const friction = Math.sqrt(
            Math.max(0, this.collider.properties.frictionCoefficient) *
            Math.max(0, collider.properties.frictionCoefficient)
        );
        const frictionImpulse = Math.min(tangentSpeed * this.mass, friction * normalImpulse);
        this.velocity.subtract(Mathutils.normalizeVector(tangentVelocity, frictionImpulse / this.mass));
        return true;
    }
}

export class PhysicsEngine {
  constructor(gravity = GRAVITY, lineColliders = []) {
    this.gravity = gravity;
    this.bodies = [];
    this.lineColliders = lineColliders;
  }

  addBody(body) {
    this.bodies.push(body);
  }

  addLineCollider (p0, p1, properties) {
    this.lineColliders.push(new LineCollider(p0, p1, new properties(...properties)));
  }

  update(dt) {
    for (const body of this.bodies) {
      body.vy += this.gravity * dt;

      body.update(dt);
      for (const wall of this.lineColliders) {
        body.collideLineCollider(wall);
      }
    }
  }
}