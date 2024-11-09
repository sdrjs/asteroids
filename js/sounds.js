'use strict';

const sounds = (() => {
    function createAudio({ src, volume = 1, collectionLength = 1 }) {
        const audioCollection = [];

        for (let i = 0; i < collectionLength; i++) {
            const audio = new Audio(`sounds/${src}`);
            audio.volume = volume;
            audioCollection.push(audio);
        }

        let currentAudio = 0;

        return function() {
            if (!params.playSounds) return;

            audioCollection[currentAudio].currentTime = 0;
            audioCollection[currentAudio].play();
            currentAudio++;
            if (currentAudio >= collectionLength) currentAudio = 0;
        }
    }

    return {
        shot: createAudio({ src: 'shot.mp3', volume: 0.15, collectionLength: 15 }),
        explode: createAudio({ src: 'explode.mp3', volume: 0.2, collectionLength: 50 }),
        death: createAudio({ src: 'death.mp3', volume: 0.25 }),
    }
})();