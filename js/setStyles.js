'use strict';

function setStyles() {
    styles.gameOver = new GameOverStyles();
    styles.pause = new PauseStyles();
    styles.shieldPanel = new ShieldPanelStyles();
    styles.danger = new DangerStyles();
    styles.score = new ScoreStyles();
    styles.gameOverEarned = new GameOverEarnedStyles();
    styles.balance = new BalanceStyles();
    styles.nickname = new NicknameStyles();

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
            font: '18px salmapro',
            textAlign: 'center',
            textBaseline: 'middle',
        }

        this.bgColor = 'rgba(0, 127, 188)';
        this.borderColor = 'white';
    }

    function DangerStyles() {
        this.x = 5;
        this.y = 40;

        this.text = {
            fillStyle: '#c3c3c3',
            font: '14px madeCanvas',
            textAlign: 'left',
            textBaseline: 'top',
        }
    }

    function ScoreStyles() {
        this.x = styles.danger.x;
        this.y = styles.danger.y + 22;

        this.text = {
            fillStyle: 'white',
            font: '20px salmapro',
            textAlign: 'left',
            textBaseline: 'top',
        }
    }

    function GameOverEarnedStyles() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2 + 100;

        this.styles = {
            fillStyle: '#ffdd00',
            font: '30px salmapro',
            textAlign: 'center',
            textBaseline: 'middle',
        };
    }

    function BalanceStyles() {
        this.x = canvas.width - 7;
        this.y = 7;

        this.styles = {
            fillStyle: 'yellow',
            font: '22px salmapro',
            textAlign: 'right',
            textBaseline: 'top',
        };
    }

    function NicknameStyles() {
        this.x = canvas.width / 2;
        this.y = 7;

        this.styles = {
            fillStyle: '#9966cc',
            font: '27px salmapro',
            textAlign: 'center',
            textBaseline: 'top',
        };
    }
}