let stage = [];

let width = 0;
let height = 0;
let running = false;
let G = 0.7;
let sun;
onmessage = function (e) {
    let msg = e.data;
    if (msg.type === 'dim') {
        width = msg.data[0];
        height = msg.data[1];
    } else if (msg.type === 'start' && !running) {
        generatePlanets(5, Math.min(width, height) / 3);
        setInterval(update, 1000 / 120);
        running = true;
    } else if (msg.type === 'mouse') {
        sun.x = msg.data.x;
        sun.y = msg.data.y;
    }
}

function generatePlanets(n, r) {
    let m1 = 10000;
    let m2 = 1;
    stage = [];
    let speed = Math.sqrt(G * m1 / r);
    for (let i = 0; i < n; i++) {
        let rad = i * 2 * Math.PI / n;
        let velRad = rad + Math.PI / 2;
        let x = r * Math.cos(rad) + width / 2;
        let y = r * Math.sin(rad) + height / 2;
        let velX = speed * Math.cos(velRad);
        let velY = speed * Math.sin(velRad);
        new Circle(x, y, 50, m2, velX, velY);
    }
    sun = new Sun(width / 2, height / 2, 100, m1, 0, 0, "white");
}

function ddist(dx, dy) {
    return Math.sqrt(dx * dx + dy * dy);
}

function dist(x1, y1, x2, y2) {
    let dx = x2 - x1;
    let dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

function grav(obj) { //Affects object with gravity with respect to all objects on stage *****IN PLACE*****

    obj.aX = 0;
    obj.aY = 0;
    for (let i = 0; i < stage.length; i++) {

        if (obj.index !== stage[i].index) {
            let dy = stage[i].y - obj.y;
            let dx = stage[i].x - obj.x;
            let distS = dx * dx + dy * dy;
            let angle = Math.atan2(dy, dx);
            let acc = G * stage[i].mass / distS;
            let accX = acc * Math.cos(angle);
            let accY = acc * Math.sin(angle);
            obj.aX += accX;
            obj.aY += accY;
        }
    }
}

function isColliding(obj1, obj2) {
    return (obj2.x - obj1.x)**2 + (obj2.y - obj1.y)**2 <= (obj1.r + obj2.r)**2;
}

function coll(obj) {

    for (let i = obj.index + 1; i < stage.length; i++) {
        let target = stage[i];
        if (isColliding(obj, target)) {

            let dy = target.y - obj.y;
            let dx = target.x - obj.x;
            let dist = ddist(dx, dy);
            let overlap = -(dist - obj.r - target.r);
            let angle = Math.atan2(dy, dx);

            let posX = overlap * Math.cos(angle);
            let posY = overlap * Math.sin(angle);

            let mR1;
            let mR2;

            if (obj.mass + target.mass == 0) {
                mR1 = 0.5;
                mR2 = 0.5;
            } else {
                mR1 = obj.mass / (obj.mass + target.mass);
                mR2 = target.mass / (obj.mass + target.mass);
            }

            obj.x -= mR2 * posX;
            obj.y -= mR2 * posY;
            target.x += mR1 * posX;
            target.y += mR1 * posY;

            let nx = (target.x - obj.x) / (dist + overlap);
            let ny = (target.y - obj.y) / (dist + overlap);
            let p = 2 * (obj.velX * nx + obj.velY * ny - target.velX * nx - target.velY * ny) /
                (obj.mass + target.mass);
            obj.velX = (obj.velX - p * target.mass * nx) * obj.elasticity;
            obj.velY = (obj.velY - p * target.mass * ny) * obj.elasticity;
            target.velX = (target.velX + p * obj.mass * nx) * target.elasticity;
            target.velY = (target.velY + p * obj.mass * ny) * target.elasticity;

        }
    }

}

class Circle {
    constructor(x, y, r, mass, velX, velY) {
        this.name = "circle";
        this.x = x;
        this.y = y;
        this.r = r;
        this.mass = mass;
        this.fk = 0.05;
        this.elasticity = 0.95;
        this.aX = 0;
        this.aY = 0;
        this.prevPoints = [];
        if (typeof velX === 'undefined') {
            this.velX = 0;
        } else {
            this.velX = velX;
        }
        if (typeof velY === 'undefined') {
            this.velY = 0;
        } else {
            this.velY = velY;
        }
        this.index = stage.length;
        stage.push(this);
    }
    update() {

        if (this.prevPoints.length >= Math.floor(this.r/2)) {
            this.prevPoints.splice(this.prevPoints.length - 1, 1);
        }
        this.prevPoints.unshift({ x: this.x, y: this.y });

        grav(this);
        coll(this);
        this.velX += this.aX;
        this.x += this.velX;

        this.velY += this.aY;
        this.y += this.velY;

        if (this.x + this.r >= width) {
            this.x = width - this.r;
            this.velX *= -this.elasticity;
        }
        if (this.x - this.r <= 0) {
            this.x = this.r;
            this.velX *= -this.elasticity;
        }

        if (this.y + this.r >= height) {
            this.y = height - this.r;
            this.velY *= -this.elasticity;
        }
        if (this.y - this.r <= 0) {
            this.y = this.r;
            this.velY *= -this.elasticity;
        }

    }

}


class Sun extends Circle {
    constructor(x, y, r, mass, velX, velY, color) {
        super(x, y, r, mass, velX, velY, color);
        this.color = color;
        this.sun = true;
        this.name = 'sun';
    }
    update() {
        grav(this);
        coll(this);
        this.velX += this.aX;
        this.x += this.velX;

        this.velY += this.aY;
        this.y += this.velY;

        if (this.x + this.r >= width) {
            this.x = width - this.r;
            this.velX *= -this.elasticity;
        }
        if (this.x - this.r <= 0) {
            this.x = this.r;
            this.velX *= -this.elasticity;
        }

        if (this.y + this.r >= height) {
            this.y = height - this.r;
            this.velY *= -this.elasticity;
        }
        if (this.y - this.r <= 0) {
            this.y = this.r;
            this.velY *= -this.elasticity;
        }
    }
}

let update = function () {
    for (let i = 0; i < stage.length; i++) {
        let obj = stage[i];
        if (typeof obj.update !== 'undefined') {
            obj.update();
        }
    }
    postMessage(stage);
}

