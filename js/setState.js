'use strict';

function setState(newState) {
    switch (newState) {
        case 'loading':
            addEventListeners();
            break;

        case 'ready':
            if (state === 'loading') {
                prepareGame();
            }

            canvas.classList.add('inactive');
            break;
        
        case 'playing':
            if (state === 'gameOver') {
                prepareGame();
            }

            canvas.classList.remove('inactive');
            break;

        case 'paused':
            canvas.classList.add('inactive');
            break;

        case 'gameOver':
            finishGame();
            
            canvas.classList.add('inactive');
            break;

        default:
            console.error(`state ${newState} is not supporting`);
            return;
    }

    state = newState;
}