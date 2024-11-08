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
const buttons = {};

let explosionParams = { sWidth: 128, sHeight: 128, framesPerSecond: 42, scale: 1.5 };
let shieldParams = { sWidth: 192, sHeight: 192, framesPerSecond: 60, offsetY: 7, scaleX: 2, scaleY: 2.5 };

const FIRE_SIZE = 30;

let state;
const cursor = {};

const user = new User();

const tables = [];
const upgradeTableContent = [
    ['title', 'level', 'description', 'current', 'new', 'price', 'button'],
    [upgrades.shield.title, () => `${user.upgrades.shield}/${upgrades.shield.levelsCount}`, upgrades.shield.description, () => upgrades.shield[user.upgrades.shield].value, () => user.upgrades.shield < upgrades.shield.levelsCount ? upgrades.shield[user.upgrades.shield + 1].value : 'MAX', () => user.upgrades.shield < upgrades.shield.levelsCount ? upgrades.shield[user.upgrades.shield + 1].cost : '-', () => 'UP'],
    [upgrades.firesCount.title, () => `${user.upgrades.firesCount}/${upgrades.firesCount.levelsCount}`, upgrades.firesCount.description, () => upgrades.firesCount[user.upgrades.firesCount].value, () => user.upgrades.firesCount < upgrades.firesCount.levelsCount ? upgrades.firesCount[user.upgrades.firesCount + 1].value : 'MAX', () => user.upgrades.firesCount < upgrades.firesCount.levelsCount ? upgrades.firesCount[user.upgrades.firesCount + 1].cost : '-', () => 'UP'],
    [upgrades.firesInterval.title, () => `${user.upgrades.firesInterval}/${upgrades.firesInterval.levelsCount}`, upgrades.firesInterval.description, () => upgrades.firesInterval[user.upgrades.firesInterval].value, () => user.upgrades.firesInterval < upgrades.firesInterval.levelsCount ? upgrades.firesInterval[user.upgrades.firesInterval + 1].value : 'MAX', () => user.upgrades.firesInterval < upgrades.firesInterval.levelsCount ? upgrades.firesInterval[user.upgrades.firesInterval + 1].cost : '-', () => 'UP'],
];
const upgradeTableTemplateColumns = [0.8, 1, 2.2, 1.1, 1.1, 0.8];
const upgradeTable = new Table({ 
    x: 25, 
    y: 70, 
    width: 550, 
    height: 300, 
    state: 'upgrade', 
    content: upgradeTableContent,
    templateColumns: upgradeTableTemplateColumns,
    color: '#fff',
    fontSize: 19,
});
tables.push(upgradeTable);

setCssScale();

preload()
    .then(() => {
        setStyles();
        addButtons();
    })
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
        { name: 'bg_game', src: 'fon.png' },
        { name: 'bg_menu', src: 'menu.jpg' },
        { name: 'asteroid', src: 'astero.png' },
        { name: 'ship', src: 'ship01.png' },
        { name: 'fire', src: 'fire.png' },
        { name: 'shield', src: 'shield.png' },
        { name: 'explosion', src: 'expl222.png' },
        { name: 'heart', src: 'heart.png' },
        { name: 'heartEmpty', src: 'heart_empty.png' },
    ]);

    promises.push(user.loadData());

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

async function finishGame() {
    generate.shipExplosion();
    cursor.x = cursor.y = null;

    user.balance += ship.balance;
    await user.update('game');
}