'use strict';

function setParams() {
    setShipParams();
    setFpsParams();
    setExplosionParams();
    setShieldParams();
    setGameOverParams();

    function setShipParams() {
        ship.x = (canvas.width - I.ship.width) / 2;
        ship.y = (canvas.height - I.ship.height) / 2;
        
        ship.explosionScale = 3;
        
        {
            ship.lifesCount = 3;
            ship.lifes = [];
    
            const lifesBaseX = 5;
            const lifesBaseY = 5;
            const lifeWidth = 25;
            const lifeHeight = 25;
            const lifesGap = 5;
    
            for (let i = 0; i < ship.lifesCount; i++) {
                const x = lifesBaseX + i * (lifeWidth + lifesGap);
                const y = lifesBaseY;
    
                ship.lifes.push({ x, y, width: lifeWidth, height: lifeHeight });
            }
        }
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

    function setExplosionParams() {
        const spriteWidth = I.explosion.width;
        const spriteHeight = I.explosion.height;
    
        const framesX = Math.floor(spriteWidth / explosionParams.sWidth);
        const framesY = Math.floor(spriteHeight / explosionParams.sHeight);
    
        const framesTotal = framesX * framesY;
    
        explosionParams = { ...explosionParams, spriteWidth, spriteHeight, framesX, framesY, framesTotal };
    }
    
    function setShieldParams() {
        const isActive = true;
        const regenerationTime = 5000;

        const spriteWidth = I.shield.width;
        const spriteHeight = I.shield.height;
    
        const framesX = Math.floor(spriteWidth / shieldParams.sWidth);
        const framesY = Math.floor(spriteHeight / shieldParams.sHeight);
    
        const framesTotal = framesX * framesY;
    
        const width = I.ship.width * shieldParams.sizeX;
        const height = I.ship.height * shieldParams.sizeY;
    
        shieldParams = { ...shieldParams, isActive, regenerationTime, spriteWidth, spriteHeight, framesX, framesY, framesTotal, frame: 0, width, height };
    }

    function setGameOverParams() {
        gameOver.text = 'GAME OVER';

        gameOver.x = canvas.width / 2;
        gameOver.y = canvas.height / 2;

        gameOver.styles = {
            fillStyle: 'white',
            font: '40px sans-serif',
            textAlign: 'center',
            textBaseline: 'middle',
        };
    }
}