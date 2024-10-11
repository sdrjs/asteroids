'use strict';

function render() {
    ctx.drawImage(I.bg, 0, 0, canvas.width, canvas.height);

    for (let expl of explosions) {
        ctx.drawImage(I.explosion, expl.sx, expl.sy, explosionParams.sWidth, explosionParams.sHeight, expl.x, expl.y, expl.width, expl.height);
    }

    for (let fire of fires) {
        ctx.drawImage(I.fire, fire.x, fire.y, FIRE_SIZE, FIRE_SIZE);
    }

    ctx.drawImage(I.ship, ship.x, ship.y);
    
    if (shieldParams.isActive) {
        ctx.drawImage(I.shield, shieldParams.sx, shieldParams.sy, shieldParams.sWidth, shieldParams.sHeight, shieldParams.x, shieldParams.y, shieldParams.width, shieldParams.height);
    }

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

    for (let life of ship.lifes) {
        const lifeIcon = life.isEmpty ? I.heartEmpty : I.heart;
        
        ctx.drawImage(lifeIcon, life.x, life.y, life.width, life.height);
    }
}