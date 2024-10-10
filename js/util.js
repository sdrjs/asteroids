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