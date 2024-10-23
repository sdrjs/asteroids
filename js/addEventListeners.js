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
            } else if (state === 'paused') {
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
        if (state === 'ready' || state === 'paused' || state === 'gameOver') {
            setState('playing');
        }
    });

    canvas.addEventListener('pointermove', function updateCursorPosition(e) {
        cursorX = e.offsetX;
        cursorY = e.offsetY;
    });
}