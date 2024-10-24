'use strict';

function setParams() {
    params.showFPS = false;

    params.lifesCount = 3;
    params.shieldRegenerationTime = 5000;
    params.shieldActive = true;

    params.angleBetweenFires = 5;
    params.firesCount = 3; // max: 90 / angleBetweenFires
    params.firesInterval = 670;
    params.firesSpeed = 300;
    
    params.asteroidsProbability = 0.5;
    params.asteroidsIncrease = 0.02;

    setShipParams();
    setFpsParams();
    setExplosionParams();
    setShieldParams();

    function setShipParams() {
        ship.x = (canvas.width - I.ship.width) / 2;
        ship.y = (canvas.height - I.ship.height) / 2;
        
        ship.explosionScale = 3;
        
        {
            ship.lifes = [];
            ship.lifesCount = params.lifesCount;
            ship.score = 0;
    
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

            ship.shieldPanel = new ShieldPanel();

            function ShieldPanel() {
                this.offsetX = 20;
                this.baseX = lifesBaseX + ship.lifesCount * (lifeWidth + lifesGap) - lifesGap + this.offsetX;
                this.baseY = lifesBaseY;
                this.width = 30;
                this.height = 22;

                this.centerX = this.baseX + this.width / 2;
                this.textY = this.baseY + this.height / 2 + 2;
                this.text = '';
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
        const spriteWidth = I.shield.width;
        const spriteHeight = I.shield.height;
    
        const framesX = Math.floor(spriteWidth / shieldParams.sWidth);
        const framesY = Math.floor(spriteHeight / shieldParams.sHeight);
    
        const framesTotal = framesX * framesY;
    
        const width = I.ship.width * shieldParams.scaleX;
        const height = I.ship.height * shieldParams.scaleY;
    
        shieldParams = { ...shieldParams, spriteWidth, spriteHeight, framesX, framesY, framesTotal, frame: 0, width, height };
    }
}