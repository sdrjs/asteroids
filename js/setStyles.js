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
            fillStyle: 'rgba(0, 0, 0, 0.4)',
            font: '65px sans-serif',
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
        this.x = canvas.width - 12;
        this.y = 15;

        this.styles = {
            fillStyle: 'yellow',
            font: '25px salmapro',
            textAlign: 'right',
            textBaseline: 'top',
        };
    }

    function NicknameStyles() {
        const font = '27px salmapro';
        ctx.font = font;
        const textWidth = ctx.measureText(user.nickname).width;

        const x = canvas.width / 2 - 24 - textWidth / 2;
        const y = 8;
        const width = textWidth + 48;
        const height = 39;
        const radius = 5;

        this.callback = () => {
            ctx.fillStyle = 'rgb(78, 78, 78)';
            ctx.fillRoundedRect(x - 2, y - 2, width + 4, height + 4, radius - 2);
    
            ctx.fillStyle = 'rgb(0, 52, 71)';
            ctx.fillRoundedRect(x, y, width, height, radius);
    
            ctx.strokeStyle = 'rgb(1, 120, 178)';
            ctx.lineWidth = 2;
            ctx.strokeRoundedRect(x + 2, y + 2, width - 4, height - 4, radius);

            ctx.fillStyle = '#cdc3d6';
            ctx.font = font;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            ctx.fillText(user.nickname, canvas.width / 2, y + height / 2 + 1);
        };
    }
}