//No Mice! >:( no why :(
//You are a shiny blue orb. You roll around with the A and D keys. The direction of the shine on the orb is the direction you are facing. When you press W, you launch in the direction you are facing. The longer you hold w, the more flattened the orb gets and the harder you will launch when you let go. You can charge in the air and cant land on your bottom or you bounce.
//Also pretty please with a cherry on top add ellipse physics when rolling with charge.
//If too hard then pause player position and zero velocity while charging.
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

Math.dist = function(x1, y1, x2, y2) {
    if (!x2) x2 = 0;
    if (!y2) y2 = 0;
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}

Math.rotate = function(cx, cy, x, y, angle) {
    var radians = (Math.PI / 180) * -angle,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
        ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return [nx, ny];
}

Math.normalize = function(cx, cy, x, y, r) {
    const ratio = r / Math.dist(cx, cy, x, y);
    const nx = (x - cx) * ratio;
    const ny = (y - cy) * ratio;
    if (nx && ny) {
        return [nx, ny];
    }
    return [0, 0];
}

Math.reflect = function(vx1, vy1, vx2, vy2) {
    const dotProduct = vx1 * vx2 + vy1 * vy2;
    const magnitudeSquared = vx2 * vx2 + vy2 * vy2;
    const reflectedX = vx1 - 2 * dotProduct * (vx2 / magnitudeSquared);
    const reflectedY = vy1 - 2 * dotProduct * (vy2 / magnitudeSquared);
    return [reflectedX, reflectedY];
}

Math.project = function(vx1, vy1, vx2, vy2) {
    const dotProduct = vx1 * vx2 + vy1 * vy2;
    const magnitudeSquared = vx2 * vx2 + vy2 * vy2;
    const scalar = dotProduct / magnitudeSquared;
    const projectedX = scalar * vx2;
    const projectedY = scalar * vy2;
    return [projectedX, projectedY];
}

const pSBC = (p, c0, c1, l) => {
    let r, g, b, P, f, t, h, i = parseInt, m = Math.round, a = typeof (c1) == "string";
    if (typeof (p) != "number" || p < -1 || p > 1 || typeof (c0) != "string" || (c0[0] != 'r' && c0[0] != '#') || (c1 && !a)) return null;
    if (!this.pSBCr) this.pSBCr = (d) => {
        let n = d.length, x = {};
        if (n > 9) {
            [r, g, b, a] = d = d.split(","), n = d.length;
            if (n < 3 || n > 4) return null;
            x.r = i(r[3] == "a" ? r.slice(5) : r.slice(4)), x.g = i(g), x.b = i(b), x.a = a ? parseFloat(a) : -1
        } else {
            if (n == 8 || n == 6 || n < 4) return null;
            if (n < 6) d = "#" + d[1] + d[1] + d[2] + d[2] + d[3] + d[3] + (n > 4 ? d[4] + d[4] : "");
            d = i(d.slice(1), 16);
            if (n == 9 || n == 5) x.r = d >> 24 & 255, x.g = d >> 16 & 255, x.b = d >> 8 & 255, x.a = m((d & 255) / 0.255) / 1000;
            else x.r = d >> 16, x.g = d >> 8 & 255, x.b = d & 255, x.a = -1
        } return x
    };
    h = c0.length > 9, h = a ? c1.length > 9 ? true : c1 == "c" ? !h : false : h, f = this.pSBCr(c0), P = p < 0, t = c1 && c1 != "c" ? this.pSBCr(c1) : P ? { r: 0, g: 0, b: 0, a: -1 } : { r: 255, g: 255, b: 255, a: -1 }, p = P ? p * -1 : p, P = 1 - p;
    if (!f || !t) return null;
    if (l) r = m(P * f.r + p * t.r), g = m(P * f.g + p * t.g), b = m(P * f.b + p * t.b);
    else r = m((P * f.r ** 2 + p * t.r ** 2) ** 0.5), g = m((P * f.g ** 2 + p * t.g ** 2) ** 0.5), b = m((P * f.b ** 2 + p * t.b ** 2) ** 0.5);
    a = f.a, t = t.a, f = a >= 0 || t >= 0, a = f ? a < 0 ? t : t < 0 ? a : a * P + t * p : 0;
    if (h) return "rgb" + (f ? "a(" : "(") + r + "," + g + "," + b + (f ? "," + m(a * 1000) / 1000 : "") + ")";
    else return "#" + (4294967296 + r * 16777216 + g * 65536 + b * 256 + (f ? m(a * 255) : 0)).toString(16).slice(1, f ? undefined : -2)
}

function generateColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function getRandomIntInclusive(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
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
            const addVelocity = Math.rotate(0, 0, 0, -this.squishAmount * 10, this.angle);
            this.vx += addVelocity[0];
            this.vy += addVelocity[1];
            this.squishAmount = 0;
        } if (pressedKeys[65]) {
            this.angularVelocity = (this.angularVelocity * 9 - this.angularSpeed) / 10;
        } if (pressedKeys[68]) {
            this.angularVelocity = (this.angularVelocity * 9 + this.angularSpeed) / 10;
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
        const angleLine = Math.rotate(this.x, this.y, this.x + this.radius + (this.squishAmount * 10), this.y, this.angle);
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
            //if (this.isBottomHalfPointingTowardLine(line) && Math.abs(dotProduct) > gravity * 2) {
            //    this.vx -= 2 * dotProduct * normal.x;
            //    this.vy -= 2 * dotProduct * normal.y;
            //} else {
            this.vx -= dotProduct * normal.x;
            this.vy -= dotProduct * normal.y;
            //}

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

let player = new OrbDude(canvas.width / 2, canvas.height - 300, 20, "steelblue", 0, 20, 50, 0.02);
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

/*
--Memorial--

simulateLineSegment(line) {
    const slope = (line.y2 - line.y1) / (line.x2 - line.x1);
    const lineNormal = -1 / slope;
    const intersectX = (line.y1 - this.y + line.x1 / -slope + this.x * lineNormal) / (lineNormal - slope);
    const intersectY = slope * (intersectX - line.x1) + line.y1;
    const distance = Math.dist(this.x, this.y, intersectX, intersectY) - this.radius;
    if (distance <= 0) {
        const updatePos = Math.normalize(intersectX, intersectY, this.x, this.y, this.radius);
        const updateVelocity = Math.reflect(this.vx, this.vy, 1, lineNormal);
        this.vx = updateVelocity[0];
        this.vy = updateVelocity[1];
        this.x = intersectX + updatePos[0];
        this.y = intersectY + updatePos[1];
        const relativeVelocity = Math.project(this.vx, this.vy, 1, slope);
        const relativeSpeed = Math.dist(relativeVelocity[0], relativeVelocity[1]);
        const surfaceVelocity = 2 * this.angularVelocity * this.radius * Math.PI / 360;
        const newSpeed = (relativeSpeed + surfaceVelocity) / 2;
        const velocityChangeX = relativeVelocity[0] * newSpeed / relativeSpeed - relativeVelocity[0];
        const velocityChangeY = relativeVelocity[1] * newSpeed / relativeSpeed - relativeVelocity[1];
        this.vx += velocityChangeX;
        this.vy += velocityChangeY;
        this.angularVelocity = 360 * newSpeed / 2 / this.radius / Math.PI;
    }
}
*/