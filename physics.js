import * as Mathutils from "./mathutils.js";

export class LineCollider {
    constructor(v0, v1, frictionCoefficient = 0, restitutionCoefficient = 1) {
        this.v0 = v0;
        this.v1 = v1;
        this.frictionCoefficient = frictionCoefficient;
        this.restitutionCoefficient = restitutionCoefficient;
    }
}

export class CircleCollider {
    constructor(center, radius, frictionCoefficient = 0, restitutionCoefficient = 1) {
        this.center = center;
        this.radius = radius;
        this.frictionCoefficient = frictionCoefficient;
        this.restitutionCoefficient = restitutionCoefficient;
    }
}

function resolveCircleContact(circle, contact, collider, penetration = null, contactNormal = null) {
    const center = circle.collider.center;
    const centerToContact = center.copy().subtract(contact);
    const distance = centerToContact.getLength();
    let normal = contactNormal ?? centerToContact.normalize(1);

    if (normal.getLength() === 0) {
        normal = circle.velocity.getLength() === 0
            ? new Mathutils.Vector(1, 0)
            : circle.velocity.copy().multiply(-1).normalize(1);
    }

    const overlap = penetration ?? circle.collider.radius - distance;
    if (overlap < 0) {
        return false;
    }

    center.add(normal.copy().multiply(overlap));

    const normalSpeed = circle.velocity.x * normal.x + circle.velocity.y * normal.y;
    if (normalSpeed >= 0) {
        return true;
    }

    const restitution = Math.min(
        circle.collider.restitutionCoefficient,
        collider.restitutionCoefficient
    );
    const normalImpulse = -(1 + restitution) * normalSpeed * circle.mass;
    circle.velocity.add(normal.copy().multiply(-(1 + restitution) * normalSpeed));

    if (circle.mass <= 0) {
        return true;
    }

    const tangentVelocity = circle.velocity.copy().subtract(
        normal.copy().multiply(circle.velocity.x * normal.x + circle.velocity.y * normal.y)
    );
    const tangentSpeed = tangentVelocity.getLength();
    if (tangentSpeed === 0) {
        return true;
    }

    const friction = Math.sqrt(
        Math.max(0, circle.collider.frictionCoefficient) *
        Math.max(0, collider.frictionCoefficient)
    );
    const frictionImpulse = Math.min(tangentSpeed * circle.mass, friction * normalImpulse);
    circle.velocity.subtract(tangentVelocity.normalize(frictionImpulse / circle.mass));
    return true;
}

export class Circle {
    constructor(mass, center, radius, frictionCoefficient = 0, restitutionCoefficient = 1) {
        this.collider = new CircleCollider(center, radius, frictionCoefficient, restitutionCoefficient);
        this.mass = mass;
        this.velocity = new Mathutils.Vector(0, 0);
    }

    force(forceVector) {
        this.velocity.add(forceVector);
    }

    applyFriction(frictionCoefficient) {
        const frictionForce = this.velocity.copy().multiply(-frictionCoefficient);
        this.velocity.add(frictionForce);
    }

    update(deltaTime) {
        this.collider.center.x += this.velocity.x * deltaTime;
        this.collider.center.y += this.velocity.y * deltaTime;
    }

    collideLineCollider(collider) {
        const lineVector = collider.v1.copy().subtract(collider.v0);
        const lineLength = lineVector.getLength();

        if (lineLength === 0) {
            return resolveCircleContact(this, collider.v0, collider);
        }

        const offsetCenter = this.collider.center.copy().subtract(collider.v0);
        const projectedCenter = offsetCenter.copy().project(lineVector);
        const projection = lineVector.x != 0
            ? projectedCenter.x / lineVector.x
            : projectedCenter.y / lineVector.y;

        if (projection <= 0) {
            return resolveCircleContact(this, collider.v0, collider);
        }
        if (projection >= 1) {
            return resolveCircleContact(this, collider.v1, collider);
        }

        const contact = collider.v0.copy().add(lineVector.multiply(projection));
        return resolveCircleContact(this, contact, collider);
    }

    collideCircleCollider(collider) {
        const centerOffset = this.collider.center.copy().subtract(collider.center);
        const centerDistance = centerOffset.getLength();
        const combinedRadius = this.collider.radius + collider.radius;

        if (centerDistance > combinedRadius) {
            return false;
        }

        const normal = centerOffset.normalize(1);
        const contactNormal = normal.getLength() === 0
            ? (this.velocity.getLength() === 0
                ? new Mathutils.Vector(1, 0)
                : this.velocity.copy().multiply(-1).normalize(1))
            : normal;
        const contact = collider.center.copy().add(
            contactNormal.copy().multiply(collider.radius)
        );

        return resolveCircleContact(
            this,
            contact,
            collider,
            combinedRadius - centerDistance,
            contactNormal
        );
    }
}