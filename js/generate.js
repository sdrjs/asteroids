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
    
    function generateAsteroidExplosion(asteroid) {
        const explosionWidth = asteroid.width * explosionParams.size;
        const explosionHeight = asteroid.height * explosionParams.size;
    
        const explosionCenterX = asteroid.x + asteroid.width / 2;
        const explosionCenterY = asteroid.y + asteroid.height / 2;
    
        const explosionX = explosionCenterX - explosionWidth / 2;
        const explosionY = explosionCenterY - explosionHeight / 2;
    
        explosions.push({ x: explosionX, y: explosionY, width: explosionWidth, height: explosionHeight, frame: 0, sx: 0, sy: 0 });
    }

    return {
        asteroid: generateAsteroid,
        fires: generateFires,
        asteroidExplosion: generateAsteroidExplosion,
    }
})();