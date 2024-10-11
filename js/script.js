'use strict';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const I = {}; // images
const asteroids = [];
const ship = {};
const fires = [];
const explosions = [];

const timers = {};
const FPS = {};

let explosionParams = { sWidth: 128, sHeight: 128, framesPerSecond: 42, size: 1.5 };
let shieldParams = { sWidth: 192, sHeight: 192, framesPerSecond: 60, offsetY: 7, sizeX: 2, sizeY: 2.5 };

const FIRE_SIZE = 30;

let cursorX;
let cursorY;

preload()
    .then(() => {
        setParams();

        canvas.addEventListener('pointermove', function(e) {
            cursorX = e.offsetX;
            cursorY = e.offsetY;
        });

        game();
    });

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

function game() { // основной игровой цикл
    timers.now = Date.now();
    const dt = timers.last ? (timers.now - timers.last) / 1000 : 0;
    if (dt > 0) FPS.measurements.push(1 / dt);

    update(dt);
    render();

    timers.last = timers.now;
    requestAnimationFrame(game);
}