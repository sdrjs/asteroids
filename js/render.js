'use strict';

function render() {
    ctx.drawImage(I.bg, 0, 0, canvas.width, canvas.height);

    for (let expl of explosions) {
        ctx.drawImage(I.explosion, expl.sx, expl.sy, explosionParams.sWidth, explosionParams.sHeight, expl.x, expl.y, expl.width, expl.height);
    }

    for (let fire of fires) {
        ctx.drawImage(I.fire, fire.x, fire.y, FIRE_SIZE, FIRE_SIZE);
    }

    for (let asteroid of asteroids) {
        ctx.save();
        ctx.translate(asteroid.centerX, asteroid.centerY);
        ctx.rotate(degToRad(asteroid.currentRotation));
        ctx.translate(-asteroid.centerX, -asteroid.centerY);
        ctx.drawImage(I.asteroid, asteroid.x, asteroid.y, asteroid.width, asteroid.height);
        ctx.restore();
    }

    if (state === 'playing' || state === 'paused') {
        ctx.drawImage(I.ship, ship.x, ship.y);

        if (params.shieldActive) {
            ctx.drawImage(I.shield, shieldParams.sx, shieldParams.sy, shieldParams.sWidth, shieldParams.sHeight, shieldParams.x, shieldParams.y, shieldParams.width, shieldParams.height);
        } else {
            ctx.strokeStyle = styles.shieldPanel.borderColor;
            ctx.strokeRect(ship.shieldPanel.baseX, ship.shieldPanel.baseY, ship.shieldPanel.width, ship.shieldPanel.height);
    
            ctx.fillStyle = styles.shieldPanel.bgColor;
            ctx.fillRect(ship.shieldPanel.baseX, ship.shieldPanel.currentY, ship.shieldPanel.width, ship.shieldPanel.currentHeight);
    
            for (let style in styles.shieldPanel.text) {
                ctx[style] = styles.shieldPanel.text[style];
            }
            ctx.fillText(ship.shieldPanel.text, ship.shieldPanel.centerX, ship.shieldPanel.textY);
        }
    }

    if (state === 'playing' || state === 'paused' || state === 'gameOver') {
        for (let life of ship.lifes) {
            const lifeIcon = life.isEmpty ? I.heartEmpty : I.heart;
            
            ctx.drawImage(lifeIcon, life.x, life.y, life.width, life.height);
        }
    }

    if (params.showFPS) {
        for (let style in FPS.styles) {
            ctx[style] = FPS.styles[style];
        }
        ctx.fillText(`FPS: ${FPS.value}`, FPS.x, FPS.y);
    }

    if (state === 'gameOver') {
        for (let style in styles.gameOver.styles) {
            ctx[style] = styles.gameOver.styles[style];
        }
        ctx.fillText(styles.gameOver.text, styles.gameOver.x, styles.gameOver.y);
    }

    if (state === 'paused') {
        for (let style in styles.pause.styles) {
            ctx[style] = styles.pause.styles[style];
        }
        ctx.fillText(styles.pause.text, styles.pause.x, styles.pause.y);
    }

    if (state === 'playing' || state === 'paused' || state === 'gameOver') {
        for (let style in styles.score.text) {
            ctx[style] = styles.score.text[style];
        }
        ctx.fillText(`Score: ${ship.score}`, styles.score.x, styles.score.y);
    }
}