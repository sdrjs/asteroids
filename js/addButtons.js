'use strict';

function addButtons() {
    buttons.startGame = new Button({ 
        x: canvas.width / 2,
        y: canvas.height / 2,
        width: 180,
        height: 70,
        radius: 35,
        text: 'START GAME',
        linearGradient: ["#252b31", "#4c545b"],
        fontFamily: 'salmapro',
        align: 'center',
        fontSize: 25,
        padding: 20,
        color: "#fff",
        onClick() {
            setState('playing');
        },
    });

    buttons.gameOverBack = new Button({ 
        x: canvas.width / 2,
        y: canvas.height - 100,
        width: 130,
        height: 50,
        radius: 20,
        text: '⤺ BACK',
        linearGradient: ["#252b31", "#4c545b"],
        fontFamily: 'salmapro',
        align: 'center',
        fontSize: 20,
        padding: 20,
        color: "#fff",
        onClick() {
            this.hide();
            setState('ready');
        },
    });

    buttons.upgrade = new Button({
        x: canvas.width / 2 - 10,
        y: canvas.height - 100,
        width: 150,
        height: 50,
        radius: 15,
        text: '📈 Upgrade',
        backgroundColor: 'green',
        backgroundColor: 'rgb(192,49,125)',
        align: 'left',
        fontSize: 18,
        color: "#ede",
        onClick() {
            setState('upgrade');
        },
    });

    buttons.leaderboard = new Button({
        x: canvas.width / 2 + 10,
        y: canvas.height - 100,
        width: 150,
        height: 50,
        radius: 15,
        text: '🏅 Leaderboard',
        backgroundColor: 'rgb(137,153,225)',
        align: 'right',
        color: "#112",
        onClick() {
            setState('leaderboard');
        },
    });

    buttons.back = new Button({
        x: 7,
        y: 7,
        width: 100,
        height: 40,
        radius: 10,
        text: '⮜ back',
        linearGradient: ['#333', '#222'],
        align: 'bottom right',
        padding: 8,
        color: "#fff",
        onClick() {
            this.hide();
            setState('ready');
        },
    });
}