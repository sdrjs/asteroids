'use strict';

const generate = (() => {
    const asteroidsSetup = {
        1: {
            lifes: 1,
            maxDx: 125,
            maxDy: 125,
            size: 40,
        },
        2: {
            lifes: 5,
            maxDx: 60,
            maxDy: 60,
            size: 57,
        },
        3: {
            lifes: 25,
            maxDx: 25,
            maxDy: 25,
            size: 85,
        },
    };

    function generateAsteroid({ size = 1 } = {}) {
        const setup = asteroidsSetup[size];

        const width = getRandomInteger({ min: setup.size, max: setup.size + 5 });
        const height = width;
    
        const x = getRandomInteger({ max: canvas.width - width });
        const y = -height;
    
        const dx = getRandomNumber({ max: setup.maxDx, withOppositeSign: true });
        const dy = getRandomNumber({ min: setup.maxDy * 0.7, max: setup.maxDy });
    
        const angle = getRandomNumber({ max: 250, withOppositeSign: true });
        const currentRotation = getRandomNumber({ max: 180, withOppositeSign: true });
    
        asteroids.push({ x, y, dx, dy, width, height, angle, currentRotation, lifes: setup.lifes });
    }
    
    function generateFires() {
        sounds.shot();

        const angles = getAngles(params.firesCount, params.angleBetweenFires);
    
        const x = ship.x + (I.ship.width - FIRE_SIZE) / 2;
        const y = ship.y + (I.ship.height - FIRE_SIZE) / 2;
    
        for (let angle of angles) {
            const dx = calcDx(params.firesSpeed, angle);
            const dy = calcDy(params.firesSpeed, dx) * -1;
    
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
    
    function generateAsteroidExplosion(asteroid) {
        sounds.explode();
        
        const explosionWidth = asteroid.width * explosionParams.scale;
        const explosionHeight = asteroid.height * explosionParams.scale;
    
        const explosionCenterX = asteroid.x + asteroid.width / 2;
        const explosionCenterY = asteroid.y + asteroid.height / 2;
    
        const explosionX = explosionCenterX - explosionWidth / 2;
        const explosionY = explosionCenterY - explosionHeight / 2;
    
        explosions.push({ x: explosionX, y: explosionY, width: explosionWidth, height: explosionHeight, frame: 0, sx: 0, sy: 0 });
    }

    function generateShipExplosion() {
        sounds.death();

        const explosionWidth = Math.max(I.ship.width, I.ship.height) * ship.explosionScale;
        const explosionHeight = Math.max(I.ship.width, I.ship.height) * ship.explosionScale;
    
        const explosionCenterX = ship.x + I.ship.width / 2;
        const explosionCenterY = ship.y + I.ship.height / 2;
    
        const explosionX = explosionCenterX - explosionWidth / 2;
        const explosionY = explosionCenterY - explosionHeight / 2;
    
        explosions.push({ x: explosionX, y: explosionY, width: explosionWidth, height: explosionHeight, frame: 0, sx: 0, sy: 0 });
    }

    return {
        asteroid: generateAsteroid,
        fires: generateFires,
        asteroidExplosion: generateAsteroidExplosion,
        shipExplosion: generateShipExplosion,
    }
})();