'use strict';

function addEventListeners() {
    window.addEventListener('resize', setCssScale);

    document.addEventListener('keydown', function(e) {
        if (e.code === 'KeyF') {
            params.showFPS = !params.showFPS;
        }
    
        if (e.code === 'KeyP') {
            if (state === 'playing') {
                setState('paused');
            } else if (state === 'paused' && checkCursorOnShip()) {
                setState('playing');
            }
        }
    });
    
    document.addEventListener('visibilitychange', function() {
        if (state === 'playing' && document.hidden) {
            setState('paused');
        }
    });
    
    canvas.addEventListener('click', function(e) {
        if (state === 'ready' || state === 'paused' && checkCursorOnShip() || state === 'gameOver') {
            setState('playing');
        }
    });

    canvas.addEventListener('pointermove', function updateCursorPosition(e) {
        cursor.x = e.offsetX;
        cursor.y = e.offsetY;
    });

    function checkCursorOnShip() {
        const isInRangeX = cursor.x >= ship.x && cursor.x <= ship.x + I.ship.width;
        const isInRangeY = cursor.y >= ship.y && cursor.y <= ship.y + I.ship.height;
        
        return isInRangeX && isInRangeY;
    }
}