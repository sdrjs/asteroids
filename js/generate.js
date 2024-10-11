'use strict';

const generate = (() => {
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
        const explosionWidth = asteroid.width * explosionParams.scale;
        const explosionHeight = asteroid.height * explosionParams.scale;
    
        const explosionCenterX = asteroid.x + asteroid.width / 2;
        const explosionCenterY = asteroid.y + asteroid.height / 2;
    
        const explosionX = explosionCenterX - explosionWidth / 2;
        const explosionY = explosionCenterY - explosionHeight / 2;
    
        explosions.push({ x: explosionX, y: explosionY, width: explosionWidth, height: explosionHeight, frame: 0, sx: 0, sy: 0 });
    }

    function generateShipExplosion() {
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