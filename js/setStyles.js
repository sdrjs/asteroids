'use strict';

function setStyles() {
    styles.gameOver = new GameOverStyles();
    styles.pause = new PauseStyles();

    function GameOverStyles() {
        this.text = 'GAME OVER';

        this.x = canvas.width / 2;
        this.y = canvas.height / 2;

        this.styles = {
            fillStyle: 'white',
            font: '40px sans-serif',
            textAlign: 'center',
            textBaseline: 'middle',
        };
    }

    function PauseStyles() {
        this.text = '❚❚';

        this.x = canvas.width / 2;
        this.y = canvas.height / 2;

        this.styles = {
            fillStyle: '#a6c9cd',
            font: '70px sans-serif',
            textAlign: 'center',
            textBaseline: 'middle',
        };
    }
}