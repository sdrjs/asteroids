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
            this.hide();
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
}