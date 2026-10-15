export function dist(x1, y1, x2, y2) {
    if (!x2) x2 = 0;
    if (!y2) y2 = 0;
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}

export function rotate(cx, cy, x, y, angle) {
    var radians = (Math.PI / 180) * -angle,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
        ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return [nx, ny];
}

export function normalize(cx, cy, x, y, r) {
    const ratio = r / dist(cx, cy, x, y);
    const nx = (x - cx) * ratio;
    const ny = (y - cy) * ratio;
    if (nx && ny) {
        return [nx, ny];
    }
    return [0, 0];
}

export function reflect(vx1, vy1, vx2, vy2) {
    const dotProduct = vx1 * vx2 + vy1 * vy2;
    const magnitudeSquared = vx2 * vx2 + vy2 * vy2;
    const reflectedX = vx1 - 2 * dotProduct * (vx2 / magnitudeSquared);
    const reflectedY = vy1 - 2 * dotProduct * (vy2 / magnitudeSquared);
    return [reflectedX, reflectedY];
}

export function project(vx1, vy1, vx2, vy2) {
    const dotProduct = vx1 * vx2 + vy1 * vy2;
    const magnitudeSquared = vx2 * vx2 + vy2 * vy2;
    const scalar = dotProduct / magnitudeSquared;
    const projectedX = scalar * vx2;
    const projectedY = scalar * vy2;
    return [projectedX, projectedY];
}

export function generateColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

export function getRandomIntInclusive(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}