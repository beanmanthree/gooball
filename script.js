const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

ctx.imageSmoothingEnabled = false;
ctx.lineCap = "round";
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const cRect = canvas.getBoundingClientRect();

var globalFriction = 0.98;
var globalSpinFriction = 0.9;
var gravity = 0.2;
var lineSegments = [];

addEventListener("resize", (evt) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

var pressedKeys = {};
window.onkeyup = function(e) {
    pressedKeys[e.keyCode] = false;
}

window.onkeydown = function(e) {
    pressedKeys[e.keyCode] = true;
}

class LineSegment {
    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
    draw() {
        ctx.strokeStyle = "#ccc";
        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.stroke();
    }
}

class OrbDude {
    constructor(x, y, radius, color, angle, speed, angularSpeed, chargeSpeed) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.radius = radius;
        this.color = color;
        this.angle = angle;
        this.angularVelocity = 0;
        this.lockedVx = 0;
        this.lockedVy = 0;
        this.lockedAngleV = 0;
        this.speed = speed;
        this.angularSpeed = angularSpeed;
        this.squishAmount = 0;
        this.chargeSpeed = chargeSpeed;
        this.touchingGround = false;
        this.timeSinceGround = 0;
        this.maxGroundLeave = 10;
    }
    getInput() {
        if (pressedKeys[87] && this.touchingGround) {
            this.angularVelocity = 0;
            this.timeSinceGround = 0;
            this.squishAmount += this.chargeSpeed;
            this.lockedVx = this.vx;
            this.lockedVy = this.vy;
            this.lockedAngleV = this.angularVelocity;
            this.vx = 0;
            this.vy = 0;
            if (this.squishAmount > 1) {
                this.squishAmount = 1;
            }
        } else if (this.squishAmount > 0) {
            this.touchingGround = false;
            this.vx = this.lockedVx;
            this.vy = this.lockedVy;
            this.angularVelocity = this.lockedAngleV;
            const addVelocity = Mathutils.rotate(0, 0, 0, -this.squishAmount * 10, this.angle);
            this.vx += addVelocity[0];
            this.vy += addVelocity[1];
            this.squishAmount = 0;
        } if (pressedKeys[65]) {
            this.angularVelocity -= this.angularSpeed;
        } if (pressedKeys[68]) {
            this.angularVelocity += this.angularSpeed;
        }
    }
    draw() {
        if (this.touchingGround) {
            ctx.strokeStyle = "#ccc";
        } else {
            ctx.strokeStyle = "#FF0000";
        }
        ctx.beginPath();
        ctx.ellipse(this.x, this.y, this.radius + (this.squishAmount * 10), this.radius ** 2 / (this.radius + (this.squishAmount * 10)), this.angle * Math.PI / 180, 0, 2 * Math.PI);
        ctx.stroke();
        const angleLine = Mathutils.rotate(this.x, this.y, this.x + this.radius + (this.squishAmount * 10), this.y, this.angle);
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(angleLine[0], angleLine[1]);
        ctx.stroke();
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += gravity;
        this.angle += this.angularVelocity;
        this.angle = this.angle % 360;
        if (this.touchingGround == false) {
            this.angularVelocity *= globalSpinFriction;
        }
        this.timeSinceGround++;
        if (this.timeSinceGround > this.maxGroundLeave) {
            this.touchingGround = false;
        }
    }
    isBottomHalfPointingTowardLine(line) {
        const lineAngle = Math.atan2(line.y2 - line.y1, line.x2 - line.x1) * (180 / Math.PI);

        let normalizedAngle = (this.angle % 360 + 360) % 360;

        let angleDifference = normalizedAngle - lineAngle;

        if (angleDifference >= 180) angleDifference -= 360;
        if (angleDifference < -180) angleDifference += 360;

        return angleDifference > -90 && angleDifference < 90;
    }
    collideWithLine(line) {
        const lineVec = { x: line.x2 - line.x1, y: line.y2 - line.y1 };
        const len = Math.sqrt(lineVec.x ** 2 + lineVec.y ** 2);
        const normLineVec = { x: lineVec.x / len, y: lineVec.y / len };

        const circleToLineStart = { x: this.x - line.x1, y: this.y - line.y1 };
        const projection = circleToLineStart.x * normLineVec.x + circleToLineStart.y * normLineVec.y;
        let closestPoint;

        if (projection < 0) {
            closestPoint = { x: line.x1, y: line.y1 };
        } else if (projection > len) {
            closestPoint = { x: line.x2, y: line.y2 };
        } else {
            closestPoint = { x: line.x1 + normLineVec.x * projection, y: line.y1 + normLineVec.y * projection };
        }

        const distToClosestPoint = Math.sqrt((this.x - closestPoint.x) ** 2 + (this.y - closestPoint.y) ** 2);

        if (distToClosestPoint < this.radius) {
            this.touchingGround = true;
            this.timeSinceGround = 0;
            const normal = { x: (this.x - closestPoint.x) / distToClosestPoint, y: (this.y - closestPoint.y) / distToClosestPoint };

            const dotProduct = this.vx * normal.x + this.vy * normal.y;
            this.vx -= dotProduct * normal.x;
            this.vy -= dotProduct * normal.y;
            
            const tangent = { x: -normal.y, y: normal.x };
            const tangentialSpeed = this.vx * tangent.x + this.vy * tangent.y;

            const rollingSpeed = this.angularVelocity * (Math.PI / 180) * this.radius;
            const speedDifference = (rollingSpeed - tangentialSpeed) / 2;

            this.vx += tangent.x * speedDifference;
            this.vy += tangent.y * speedDifference;
            this.angularVelocity -= speedDifference / this.radius * (180 / Math.PI);

            const overlap = this.radius - distToClosestPoint;
            this.x += normal.x * overlap;
            this.y += normal.y * overlap;
            this.vx *= globalFriction;
            this.vy *= globalFriction;
        }
    }
}

let player = new OrbDude(canvas.width / 2, canvas.height - 300, 20, "steelblue", 0, 20, 5, 0.02);
lineSegments.push(new LineSegment(100, canvas.height - 100, 90, canvas.height - 600));
lineSegments.push(new LineSegment(100, canvas.height - 100, canvas.width - 100, canvas.height - 100));
lineSegments.push(new LineSegment(canvas.width - 100, canvas.height - 100, canvas.width - 50, canvas.height - 150));
lineSegments.push(new LineSegment(canvas.width - 50, canvas.height - 150, canvas.width - 40, canvas.height - 300));
lineSegments.push(new LineSegment(canvas.width - 40, canvas.height - 300, canvas.width - 80, canvas.height - 350));

function drawLineSegments() {
    for (var i = 0; i < lineSegments.length; i++) {
        lineSegments[i].draw();
    }
}

function updateLineSegments() {
    for (var i = 0; i < lineSegments.length; i++) {
        player.collideWithLine(lineSegments[i]);
    }
}

function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.draw();
    player.update();
    player.getInput();
    drawLineSegments();
    updateLineSegments();
    window.requestAnimationFrame(tick);
}

window.requestAnimationFrame(tick);