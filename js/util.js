'use strict';

function getRandomInteger({ min = 0, max, withOppositeSign = false }) {
    let result = Math.floor(Math.random() * (max - min + 1)) + min;

    if (withOppositeSign) {
        result = Math.random() < 0.5 ? result : -result;
    }

    return result;
}

function getRandomNumber({ min = 0, max, withOppositeSign = false }) {
    let result = Math.random() * (max - min) + min;
    
    if (withOppositeSign) {
        result = Math.random() < 0.5 ? result : -result;
    }

    return result;
}

function cotan(x) { 
    return 1 / Math.tan(x); 
}
    
function degToRad(degrees) {
    return degrees * (Math.PI / 180);
}

function randomCall({ probability, fn }) {
    for (let i = 0; i < Math.floor(probability); i++) {
        fn();
    }

    if (Math.random() < probability % 1) fn();
}

function checkIntersection({ obj1, obj2, contactArea = 0 /* minimum number of intersecting px */ }) {
    const isXIntersects = obj1.x + obj1.width >= obj2.x + contactArea && obj1.x + contactArea <= obj2.x + obj2.width;
    const isYIntersects = obj1.y + obj1.height >= obj2.y + contactArea && obj1.y + contactArea <= obj2.y + obj2.height;

    return isXIntersects && isYIntersects;
}