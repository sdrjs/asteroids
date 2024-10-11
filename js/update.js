'use strict';

function update(dt) { /* dt - time in seconds */
    if (FPS.measurements.length && timers.now >= FPS.lastMeasurement + FPS.updateTime) {
        const fps = FPS.measurements.reduce((acc, current) => acc + current, 0) / FPS.measurements.length;
        FPS.value = Math.round(fps);

        FPS.measurements.length = 0;
        FPS.lastMeasurement = timers.now;
    }

    if (!flags.isGameOver) randomCall({ probability: 1.5 * dt, fn: generate.asteroid });

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

    if (!flags.isGameOver && cursorX) {
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

    if (shieldParams.isActive === false && timers.now > shieldParams.destructionTime + shieldParams.regenerationTime) {
        shieldParams.isActive = true;
    }
    if (shieldParams.isActive) {
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

                generate.asteroidExplosion(asteroid);
                break;
            }
        }
    }

    if (!flags.isGameOver) {
        for (let i = 0; i < asteroids.length; i++) {
            const asteroid = asteroids[i];
        
            if (checkIntersection({
                obj1: { x: ship.x, y: ship.y, width: I.ship.width, height: I.ship.height }, 
                obj2: { x: asteroid.x, y: asteroid.y, width: asteroid.width, height: asteroid.height },
            })) {
                asteroids.splice(i, 1);
                i--;
    
                generate.asteroidExplosion(asteroid);
    
                if (shieldParams.isActive) {
                    shieldParams.isActive = false;
                    shieldParams.destructionTime = timers.now;
                } else if (ship.lifesCount > 0) {
                    ship.lifesCount--;
                    ship.lifes[ship.lifesCount].isEmpty = true;
    
                    if (ship.lifesCount === 0) {
                        finishGame();
                    }
                }
            }
        }
    }

    if (!flags.isGameOver) {
        if (!timers.generatedFires) timers.generatedFires = timers.now;
        if (timers.now - timers.generatedFires > 670) {
            generate.fires();
            timers.generatedFires = timers.now;
        }
    }
}