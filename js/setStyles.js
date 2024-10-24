'use strict';

function setStyles() {
    styles.gameOver = new GameOverStyles();
    styles.pause = new PauseStyles();
    styles.shieldPanel = new ShieldPanelStyles();
    styles.score = new ScoreStyles();

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

    function ShieldPanelStyles() {
        this.text = {
            fillStyle: 'white',
            font: '15px sans-serif',
            textAlign: 'center',
            textBaseline: 'middle',
        }

        this.bgColor = 'rgba(0, 127, 188)';
        this.borderColor = 'white';
    }

    function ScoreStyles() {
        this.x = 5;
        this.y = 40;

        this.text = {
            fillStyle: 'white',
            font: '15px salmapro',
            textAlign: 'left',
            textBaseline: 'top',
        }
    }
}