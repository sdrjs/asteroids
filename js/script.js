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
const styles = {};

let explosionParams = { sWidth: 128, sHeight: 128, framesPerSecond: 42, scale: 1.5 };
let shieldParams = { sWidth: 192, sHeight: 192, framesPerSecond: 60, offsetY: 7, scaleX: 2, scaleY: 2.5 };

const FIRE_SIZE = 30;

let state;
let cursorX;
let cursorY;

setCssScale();

preload()
    .then(setStyles)
    .then(() => setState('ready'))
    .then(main);


/* functions */

function setCssScale() {
    const wrapperWidth = parseInt(getComputedStyle(wrapper).width);
    
    document.documentElement.style.setProperty('--scale', wrapperWidth / canvas.width);
}

async function preload() {
    setState('loading');

    const promises = [];

    loadFonts([
        'madeCanvas.otf',
        'salmapro.otf',
    ]);

    loadImages([
        { name: 'bg', src: 'fon.png' },
        { name: 'asteroid', src: 'astero.png' },
        { name: 'ship', src: 'ship01.png' },
        { name: 'fire', src: 'fire.png' },
        { name: 'shield', src: 'shield.png' },
        { name: 'explosion', src: 'expl222.png' },
        { name: 'heart', src: 'heart.png' },
        { name: 'heartEmpty', src: 'heart_empty.png' },
    ]);

    await Promise.all(promises);

    function loadImages(images) {
        for (const image of images) {
            I[image.name] = new Image();
            I[image.name].src = `img/${image.src}`;
    
            const promiseFn = new Promise(resolve => {
                I[image.name].onload = resolve;
            });
    
            promises.push(promiseFn);
        }
    }

    function loadFonts(urls) {
        for (const url of urls) { 
            const name = url.match(/.+(?=\.)/g);
            const font = new FontFace(name, `url(fonts/${url})`);

            const promiseFn = new Promise(resolve => {
                font.load().then(font => {
                    document.fonts.add(font);
                    resolve();
                });
            });
    
            promises.push(promiseFn);
        }
    }
}

function main() {
    timers.now = Date.now();
    if (state === 'paused') timers.last = null;
    const dt = timers.last ? (timers.now - timers.last) / 1000 : 0;
    if (dt > 0) FPS.measurements.push(1 / dt);

    update(dt);
    render();

    timers.last = timers.now;
    requestAnimationFrame(main);
}

function prepareGame() {
    setParams();

    timers.generatedFires = null;

    asteroids.length = 0;
    fires.length = 0;
    explosions.length = 0;
}

function finishGame() {
    generate.shipExplosion();
    
    cursorX = cursorY = null;
}