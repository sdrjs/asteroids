'use strict';

const wrapper = document.querySelector('.wrapper');
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const I = {}; // images
const params = {};
const asteroids = [];
const ship = {};
const fires = [];
const explosions = [];

const timers = {};
const FPS = {};

let explosionParams = { sWidth: 128, sHeight: 128, framesPerSecond: 42, scale: 1.5 };
let shieldParams = { sWidth: 192, sHeight: 192, framesPerSecond: 60, offsetY: 7, scaleX: 2, scaleY: 2.5 };

const FIRE_SIZE = 30;

let isPaused = document.hidden;
let isGameOver = false;
let cursorX;
let cursorY;

const styles = {};

setCssScale();
window.addEventListener('resize', setCssScale);

document.addEventListener('keydown', function(e) {
    if (e.code === 'KeyF') {
        params.showFPS = !params.showFPS;
    }

    if (e.code === 'KeyP') {
        if (!isGameOver) {
            isPaused = !isPaused;
            canvas.classList.toggle('pause');
        }
    }
});

document.addEventListener('visibilitychange', function() {
    if (document.hidden && !isPaused) {
        isPaused = true;
        canvas.classList.add('pause');
    }
});

canvas.addEventListener('click', function(e) {
    if (isPaused) {
        isPaused = false;
        canvas.classList.remove('pause');
    }
});

preload()
    .then(setStyles)
    .then(startGame)
    .then(main);

async function preload() {
    await loadImages([
        { name: 'bg', src: 'fon.png' },
        { name: 'asteroid', src: 'astero.png' },
        { name: 'ship', src: 'ship01.png' },
        { name: 'fire', src: 'fire.png' },
        { name: 'shield', src: 'shield.png' },
        { name: 'explosion', src: 'expl222.png' },
        { name: 'heart', src: 'heart.png' },
        { name: 'heartEmpty', src: 'heart_empty.png' },
    ]);

    function loadImages(images) {
        const promises = [];
    
        for (const image of images) {
            I[image.name] = new Image();
            I[image.name].src = `img/${image.src}`;
    
            const promiseFn = new Promise(resolve => {
                I[image.name].onload = resolve;
            });
    
            promises.push(promiseFn);
        }
    
        return Promise.all(promises);
    }
}

function main() {
    timers.now = Date.now();
    if (isPaused) timers.last = null;
    const dt = timers.last ? (timers.now - timers.last) / 1000 : 0;
    if (dt > 0) FPS.measurements.push(1 / dt);

    update(dt);
    render();

    timers.last = timers.now;
    requestAnimationFrame(main);
}

function updateCursorPosition(e) {
    cursorX = e.offsetX;
    cursorY = e.offsetY;
}

function startGame() {
    setParams();

    isGameOver = false;

    timers.generatedFires = null;

    asteroids.length = 0;
    fires.length = 0;
    explosions.length = 0;

    canvas.addEventListener('pointermove', updateCursorPosition);
}

function finishGame() {
    generate.shipExplosion();
    
    isGameOver = true;

    canvas.removeEventListener('pointermove', updateCursorPosition);
    cursorX = cursorY = null;
    
    setTimeout(startGame, 5000);
}

function setCssScale(e) {
    const wrapperWidth = parseInt(getComputedStyle(wrapper).width);

    document.documentElement.style.setProperty('--scale', wrapperWidth / canvas.width);
}