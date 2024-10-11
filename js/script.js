'use strict';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const I = {}; // images
const asteroids = [];
const ship = {};
const fires = [];
const explosions = [];

const timers = {};
const FPS = {};

let explosionParams = { sWidth: 128, sHeight: 128, framesPerSecond: 42, size: 1.5 };
let shieldParams = { sWidth: 192, sHeight: 192, framesPerSecond: 60, offsetY: 7, sizeX: 2, sizeY: 2.5 };

const FIRE_SIZE = 30;

let cursorX;
let cursorY;

preload()
    .then(() => {
        ship.x = (canvas.width - I.ship.width) / 2;
        ship.y = (canvas.height - I.ship.height) / 2;

        setFpsParams();
        setExplosionParams();
        setShieldParams();

        canvas.addEventListener('pointermove', function(e) {
            cursorX = e.offsetX;
            cursorY = e.offsetY;
        });

        game();
    });

async function preload() {
    await loadImages([
        { name: 'bg', src: 'fon.png' },
        { name: 'asteroid', src: 'astero.png' },
        { name: 'ship', src: 'ship01.png' },
        { name: 'fire', src: 'fire.png' },
        { name: 'shield', src: 'shield.png' },
        { name: 'explosion', src: 'expl222.png' },
    ]);

    function loadImages(images) {
        const promises = [];
    
        for (const image of images) {
            I[image.name] = new Image();
            I[image.name].src = `img/${image.src}`;
    
            const promiseFn = new Promise(resolve => {
                I[image.name].onload = resolve;
            });
    
            promises.push(promiseFn);
        }
    
        return Promise.all(promises);
    }
}

function game() { // основной игровой цикл
    timers.now = Date.now();
    const dt = timers.last ? (timers.now - timers.last) / 1000 : 0;
    if (dt > 0) FPS.measurements.push(1 / dt);

    update(dt);
    render();

    timers.last = timers.now;
    requestAnimationFrame(game);
}

function update(dt) { /* dt - time in seconds */
    if (FPS.measurements.length && timers.now >= FPS.lastMeasurement + FPS.updateTime) {
        const fps = FPS.measurements.reduce((acc, current) => acc + current, 0) / FPS.measurements.length;
        FPS.value = Math.round(fps);

        FPS.measurements.length = 0;
        FPS.lastMeasurement = timers.now;
    }

    randomCall({ probability: 1.5 * dt, fn: generateAsteroid });

    for (let i = 0; i < asteroids.length; i++) {
        const asteroid = asteroids[i];

        if (asteroid.y > canvas.height) {
            asteroids.splice(i, 1);
            i--;
            continue;
        }

        if (asteroid.x < 0 || asteroid.x > canvas.width - asteroid.width) asteroid.dx = -asteroid.dx;

        asteroid.x += asteroid.dx * dt;
        asteroid.y += asteroid.dy * dt;
        asteroid.currentRotation += asteroid.angle * dt;
        
        asteroid.centerX = asteroid.x + asteroid.width / 2;
        asteroid.centerY = asteroid.y + asteroid.height / 2;
    }

    if (cursorX) {
        let shipX = cursorX - I.ship.width / 2;
        let shipY = cursorY - I.ship.height / 2;

        if (shipX < 0) shipX = 0;
        if (shipX > canvas.width - I.ship.width) shipX = canvas.width - I.ship.width;

        if (shipY < 0) shipY = 0;
        if (shipY > canvas.height - I.ship.height) shipY = canvas.height - I.ship.height;

        ship.x = shipX;
        ship.y = shipY;
    }

    for (let i = 0; i < explosions.length; i++) {
        const expl = explosions[i];

        expl.frame += explosionParams.framesPerSecond * dt;
        const currentFrame = Math.floor(expl.frame);

        if (currentFrame >= explosionParams.framesTotal) {
            explosions.splice(i, 1);
            i--;
            continue;
        }

        const frameX = currentFrame % explosionParams.framesX;
        const frameY = Math.floor(currentFrame / explosionParams.framesX);

        expl.sx = frameX * explosionParams.sWidth;
        expl.sy = frameY * explosionParams.sHeight;
    }

    {
        shieldParams.frame += shieldParams.framesPerSecond * dt;
        const shieldFrame = Math.floor(shieldParams.frame % shieldParams.framesTotal);
    
        const frameX = shieldFrame % shieldParams.framesX;
        const frameY = Math.floor(shieldFrame / shieldParams.framesX);
    
        shieldParams.sx = frameX * shieldParams.sWidth;
        shieldParams.sy = frameY * shieldParams.sHeight;

        const shieldCenterX = ship.x + I.ship.width / 2;
        const shieldCenterY = ship.y + I.ship.height / 2 + shieldParams.offsetY;

        const x = shieldCenterX - shieldParams.width / 2;
        const y = shieldCenterY - shieldParams.height / 2;

        shieldParams = { ...shieldParams, x, y };
    }

    for (let i = 0; i < fires.length; i++) {
        const fire = fires[i];

        if (fire.y + FIRE_SIZE <= 0 || fire.x + FIRE_SIZE <= 0 || fire.x >= canvas.width) {
            fires.splice(i, 1);
            i--;
            continue;
        }

        fire.x += fire.dx * dt;
        fire.y += fire.dy * dt;
    }

    for (let i = 0; i < fires.length; i++) {
        const fire = fires[i];

        for (let j = 0; j < asteroids.length; j++) {
            const asteroid = asteroids[j];
    
            if (checkIntersection({
                obj1: { x: fire.x, y: fire.y, width: FIRE_SIZE, height: FIRE_SIZE }, 
                obj2: { x: asteroid.x, y: asteroid.y, width: asteroid.width, height: asteroid.height },
                contactArea: asteroid.width / 5,
            })) {
                fires.splice(i, 1);
                asteroids.splice(j, 1);
                i--;

                const explosionWidth = asteroid.width * explosionParams.size;
                const explosionHeight = asteroid.height * explosionParams.size;

                const explosionCenterX = asteroid.x + asteroid.width / 2;
                const explosionCenterY = asteroid.y + asteroid.height / 2;

                const explosionX = explosionCenterX - explosionWidth / 2;
                const explosionY = explosionCenterY - explosionHeight / 2;

                explosions.push({ x: explosionX, y: explosionY, width: explosionWidth, height: explosionHeight, frame: 0, sx: 0, sy: 0 });
                break;
            }
        }
    }

    if (!timers.generatedFires) timers.generatedFires = timers.now;
    if (timers.now - timers.generatedFires > 670) {
        generateFires();
        timers.generatedFires = timers.now;
    }
}

function render() {
    ctx.drawImage(I.bg, 0, 0, 600, 600);

    for (let expl of explosions) {
        ctx.drawImage(I.explosion, expl.sx, expl.sy, explosionParams.sWidth, explosionParams.sHeight, expl.x, expl.y, expl.width, expl.height);
    }

    for (let fire of fires) {
        ctx.drawImage(I.fire, fire.x, fire.y, FIRE_SIZE, FIRE_SIZE);
    }

    ctx.drawImage(I.ship, ship.x, ship.y);
    ctx.drawImage(I.shield, shieldParams.sx, shieldParams.sy, shieldParams.sWidth, shieldParams.sHeight, shieldParams.x, shieldParams.y, shieldParams.width, shieldParams.height);

    for (let asteroid of asteroids) {
        ctx.save();
        ctx.translate(asteroid.centerX, asteroid.centerY);
        ctx.rotate(degToRad(asteroid.currentRotation));
        ctx.translate(-asteroid.centerX, -asteroid.centerY);
        ctx.drawImage(I.asteroid, asteroid.x, asteroid.y, asteroid.width, asteroid.height);
        ctx.restore();
    }

    for (let style in FPS.styles) {
        ctx[style] = FPS.styles[style];
    }
    ctx.fillText(`FPS: ${FPS.value}`, FPS.x, FPS.y);
}

function generateAsteroid() {
    const width = getRandomInteger({ min: 40, max: 60 });
    const height = width;

    const x = getRandomInteger({ max: canvas.width - width });
    const y = -height;

    const dx = getRandomNumber({ max: 90, withOppositeSign: true });
    const dy = getRandomNumber({ min: 42, max: 132 });

    const angle = getRandomNumber({ max: 250, withOppositeSign: true });
    const currentRotation = getRandomNumber({ max: 180, withOppositeSign: true });

    asteroids.push({ x, y, dx, dy, width, height, angle, currentRotation });
}

function generateFires() {
    const angleBetweenFires = 5;
    const firesCount = 3; // max: 90 / angleBetweenFires
    const maxDy = 300;

    const angles = getAngles(firesCount, angleBetweenFires);

    const x = ship.x + (I.ship.width - FIRE_SIZE) / 2;
    const y = ship.y + (I.ship.height - FIRE_SIZE) / 2;

    for (let angle of angles) {
        const dx = calcDx(maxDy, angle);
        const dy = calcDy(maxDy, dx) * -1;

        fires.push({ x, y, dx, dy });
    }

    function getAngles(count, angle) {
        const result = [];

        const angleBetweenFirstAndLast = (count - 1) * angle;
        const startAngle = -angleBetweenFirstAndLast / 2;

        for (let i = 0; i < count; i++) {
            const currentAngle = startAngle + angle * i;

            result.push(currentAngle);
        }

        return result;
    }

    function calcDx(side, angle) {
        const rad = degToRad(angle);

        return side / cotan(rad);
    }

    function calcDy(side, dx) {
        return Math.sqrt(side ** 2 - dx ** 2);
    }
}

function checkIntersection({ obj1, obj2, contactArea = 0 /* minimum number of intersecting px */ }) {
    const isXIntersects = obj1.x + obj1.width >= obj2.x + contactArea && obj1.x + contactArea <= obj2.x + obj2.width;
    const isYIntersects = obj1.y + obj1.height >= obj2.y + contactArea && obj1.y + contactArea <= obj2.y + obj2.height;

    return isXIntersects && isYIntersects;
}

function setExplosionParams() {
    const spriteWidth = I.explosion.width;
    const spriteHeight = I.explosion.height;

    const framesX = Math.floor(spriteWidth / explosionParams.sWidth);
    const framesY = Math.floor(spriteHeight / explosionParams.sHeight);

    const framesTotal = framesX * framesY;

    explosionParams = { ...explosionParams, spriteWidth, spriteHeight, framesX, framesY, framesTotal };
}

function setShieldParams() {
    const spriteWidth = I.shield.width;
    const spriteHeight = I.shield.height;

    const framesX = Math.floor(spriteWidth / shieldParams.sWidth);
    const framesY = Math.floor(spriteHeight / shieldParams.sHeight);

    const framesTotal = framesX * framesY;

    const width = I.ship.width * shieldParams.sizeX;
    const height = I.ship.height * shieldParams.sizeY;

    shieldParams = { ...shieldParams, spriteWidth, spriteHeight, framesX, framesY, framesTotal, frame: 0, width, height };
}

function setFpsParams() {
    FPS.lastMeasurement = null;
    FPS.measurements = [];
    FPS.value = 'xx';
    FPS.updateTime = 700;
    FPS.x = canvas.width - 5;
    FPS.y = 5;
    FPS.styles = {
        fillStyle: 'white',
        font: '15px sans-serif',
        textAlign: 'right',
        textBaseline: 'top',
    };
}