'use strict';

function setState(newState) {
    switch (newState) {
        case 'loading':
            addEventListeners();
            break;

        case 'ready':
            if (state === 'loading' || state === 'gameOver') {
                prepareGame();
            }

            showMenuButtons();
            canvas.classList.add('inactive');
            break;
        
        case 'upgrade':
            buttons.back.show();
            hideMenuButtons();
            break;

        case 'leaderboard':
            buttons.back.show();
            hideMenuButtons();
            break;

        case 'settings':
            buttons.back.show();
            hideMenuButtons();
            break;

        case 'playing':
            if (state === 'gameOver') {
                prepareGame();
            }

            hideMenuButtons();
            canvas.classList.remove('inactive');
            break;

        case 'paused':
            canvas.classList.add('inactive');
            break;

        case 'gameOver':
            finishGame();
            
            buttons.gameOverBack.show();
            canvas.classList.add('inactive');
            break;

        default:
            console.error(`state ${newState} is not supporting`);
            return;
    }

    state = newState;

    function showMenuButtons() {
        buttons.startGame.show();
        buttons.upgrade.show();
        buttons.leaderboard.show();
        buttons.settings.show();
    }

    function hideMenuButtons() {
        buttons.startGame.hide();
        buttons.upgrade.hide();
        buttons.leaderboard.hide();
        buttons.settings.hide();
    }
}