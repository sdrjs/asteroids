'use strict';

function update(dt) { /* dt - time in seconds */
    if (dt > 0) FPS.measurements.push(1 / dt);
    if (FPS.measurements.length && timers.now >= FPS.lastMeasurement + FPS.updateInterval) {
        const fps = FPS.measurements.reduce((acc, current) => acc + current, 0) / FPS.measurements.length;
        FPS.value = Math.round(fps);

        FPS.measurements.length = 0;
        FPS.lastMeasurement = timers.now;
    }

    if (timers.freezeDuration < timers.freezed) {
        if (state === 'playing') {
            let smallProbabilityDecrease = 0;
            if (params.asteroidsProbability > params.mediumDanger) smallProbabilityDecrease++;
            if (params.asteroidsProbability > params.largeDanger) smallProbabilityDecrease++;

            randomCall({ probability: (params.asteroidsProbability - smallProbabilityDecrease) * dt, fn: () => generate.asteroid({ size: 1 }) });
            if (params.asteroidsProbability > params.mediumDanger) randomCall({ probability: params.asteroidsProbability / 4 * dt, fn: () => generate.asteroid({ size: 2 }) });
            if (params.asteroidsProbability > params.largeDanger) randomCall({ probability: params.asteroidsProbability / 15 * dt, fn: () => generate.asteroid({ size: 3 }) });
            
            if (params.asteroidsProbability > 1.5) randomCall({ probability: 0.1 * dt, fn: () => generate.asteroid({ size: 1, isFrozen: true }) });
            if (params.asteroidsProbability > params.mediumDanger + 1) randomCall({ probability: 0.06 * dt, fn: () => generate.asteroid({ size: 2, isFrozen: true }) });
            if (params.asteroidsProbability > params.largeDanger + 1) randomCall({ probability: 0.035 * dt, fn: () => generate.asteroid({ size: 3, isFrozen: true }) });

            const currentIncrease = params.asteroidsIncrease * (0.6 * Math.floor(params.asteroidsProbability / 2.5) + 1);
            params.asteroidsProbability += currentIncrease * dt;
        }
    
        for (let i = 0; i < asteroids.length; i++) {
            const asteroid = asteroids[i];
    
            if (asteroid.y > canvas.height) {
                asteroids.splice(i, 1);
                i--;
                if (state === 'playing' && !asteroid.isFrozen) {
                    for (let k = 0; k < asteroid.lifes; k++) generate.asteroid({ size: 1 });
                }
                continue;
            }
    
            if (asteroid.x < 0 || asteroid.x > canvas.width - asteroid.width) asteroid.dx = -asteroid.dx;
    
            asteroid.x += asteroid.dx * dt;
            asteroid.y += asteroid.dy * dt;
            asteroid.currentRotation += asteroid.angle * dt;
            
            asteroid.centerX = asteroid.x + asteroid.width / 2;
            asteroid.centerY = asteroid.y + asteroid.height / 2;
        }
    }

    if (state === 'playing' && cursor.x) {
        let shipX = cursor.x - I.ship.width / 2;
        let shipY = cursor.y - I.ship.height / 2;

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

    if (params.shieldActive === false) {
        if (timers.shieldDestroyed >= params.shieldRegenerationTime) {
            params.shieldActive = true;
        } else {
            timers.shieldDestroyed += 1000 * dt;

            ship.shieldPanel.currentHeight = timers.shieldDestroyed / params.shieldRegenerationTime * ship.shieldPanel.height;
            ship.shieldPanel.currentY = ship.shieldPanel.baseY + ship.shieldPanel.height - ship.shieldPanel.currentHeight;
            ship.shieldPanel.text = (Math.abs(params.shieldRegenerationTime - timers.shieldDestroyed) / 1000).toFixed(1);
        }
    }
    if (params.shieldActive) {
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
                i--;
                asteroid.lifes--;

                if (asteroid.lifes <= 0) {
                    asteroids.splice(j, 1);
                    generate.asteroidExplosion(asteroid);

                    if (state === 'playing') {
                        ship.score += asteroid.score;
                    }
                }

                break;
            }
        }
    }

    if (state === 'playing') {
        for (let i = 0; i < asteroids.length; i++) {
            const asteroid = asteroids[i];
        
            if (checkIntersection({
                obj1: { x: ship.x, y: ship.y, width: I.ship.width, height: I.ship.height }, 
                obj2: { x: asteroid.x, y: asteroid.y, width: asteroid.width, height: asteroid.height },
            })) {
                asteroids.splice(i, 1);
                i--;
    
                generate.asteroidExplosion(asteroid);
    
                if (params.shieldActive) {
                    params.shieldActive = false;
                    timers.shieldDestroyed = 0;
                } else if (ship.lifesCount > 0) {
                    ship.lifesCount--;
                    ship.lifes[ship.lifesCount].isEmpty = true;
    
                    if (ship.lifesCount === 0) {
                        setState('gameOver');
                    }
                }

                if (state === 'playing') ship.score += asteroid.score;
            }
        }
    }

    if (state === 'playing') {
        timers.freezed += 1000 * dt;

        if (!timers.generatedFires) timers.generatedFires = 0;

        timers.generatedFires += 1000 * dt;

        if (timers.generatedFires >= params.firesInterval) {
            generate.fires();
            timers.generatedFires = 0;
        }
    }

    if (state === 'playing') ship.balance = Math.floor(ship.score / params.scoresPerGem);
}