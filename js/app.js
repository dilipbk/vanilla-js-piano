let keyboard = document.querySelector('.piano-keyboard');
let controls = document.querySelectorAll('.control');
let playBtn = document.querySelector('.play-btn');
let speedSelect = document.querySelector('#speed');
let songSelect = document.querySelector('#songName');
let pianoNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
let keyboardMap = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N'];
let keys = [];

let happyBirthday = `G4,G4,A4,,G4,,C5,,B4,,,,
                     G4,G4,A4,,G4,,D5,,C5,,,,
                     G4,G4,G5,,E5,,C5,,B4,,A4,,
                     F5,F5,E5,,C5,,D5,,C5`;

let premGeet = `C5,D5,,E5,,D5,C5,,
                C5,D5,,E5,,D5,C5,,
                C5,D5,,E5,,D5,C5,,
                C5,,D5`;

let machhiMarana = `F#4,,G#4,F#4,F#4,,G#4,,A#4,,,,
                    F#4,G#4,,A#4,,,,
                    F#4,G#4,A#4,,G#4,,F#4,,G#4,,A#4,,,
                    G#4,G#4,,F#4,,G#4,,F#4,F#4,F#4`;

let merryChristmas = `C5,,F5,,F5,,G5,,F5,,E5,,D5,,D5,,,
                      D5,,G5,,G5,,A5,,G5,,F5,,E5,,C5,,,
                      C5,,A5,,A5,,A#5,,A5,,G5,,F5,,D5,,,
                      C5,,C5,,D5,,G5,,E5,,F5,,,
                      C5,,,F5,,F5,,F5,,E5,,E5,,F5,,E5,,D5,,C5,,,
                      G5,,,A5,G5,,F5,,,C5,,C4,,,
                      C5,,C5,,D5,,G5,,E5,,F5`;

let asaraiMahina = `A5,B5,A5,E5,D5,,,,,,B5,A5,G5,G5,,A5,B5,A5,,,,,,,,,,,,
                    A5,B5,A5,E5,D5,,,,,,B5,A5,G5,G5,,A5,B5,A5,,,,,,,,,,,,
                    A5,B5,A5,E5,D5,,,,,,B5,A5,G5,G5,,A5,B5,A5,,,,,,,,,,,
                    A5,B5,A5,E5,D5,,,,,,B5,A5,G5,G5,,A5,B5,A5,,,,,,,,,,,
                    E5,,A5,,,,B5,,C5,B5,A5,G5,E5,,,,
                    E5,,A5,,,,B5,,C5,B5,A5,G5,E5,,,,
                    E5,,A5,,,,B5,,C5,B5,A5,G5,E5,,,,
                    E5,,A5,,,,B5,,D5,B5,A5,G5,G5,,,,
                    E5,,A5,,,,B5,,C5,B5,A5,G5,E5,,,,
                    E5,,A5,,,,B5,,C5,B5,A5,G5,E5,,,,
                    E5,,A5,,,,B5,,C5,B5,A5,G5,E5,,,,
                    E5,,A5,,,,B5,,D5,B5,A5,G5,G5`;

let playSong = (noteString, speed, cb) => {
    let notes = noteString.split(',');
    let currentNote = 0;
    let mousedown = new Event('mousedown');
    let mouseup = new Event('mouseup');
    let btn;

    let interval = setInterval(() => {
        if (currentNote < notes.length) {
            if (notes[currentNote].trim() !== '') {
                if (btn) {
                    btn.dispatchEvent(mouseup);
                }
                btn = document.querySelector(`[data-letter-note="${notes[currentNote].trim()}"]`);
                btn.dispatchEvent(mousedown);
            }
            currentNote++;
        }
        else {
            btn.dispatchEvent(mouseup);
            clearInterval();
            cb();
        }
    }, 400 / speed);

}

playBtn.addEventListener('mousedown', () => {
    let speed = +speedSelect.value;
    let song = +songSelect.value;
    playBtn.disabled = true;

    let enableBtn = () => playBtn.disabled = false;

    switch (song) {
        case 1: playSong(happyBirthday, speed, enableBtn); break;
        case 2: playSong(premGeet, speed, enableBtn); break;
        case 3: playSong(machhiMarana, speed, enableBtn); break;
        case 4: playSong(merryChristmas, speed, enableBtn); break;
        case 5: playSong(asaraiMahina, speed, enableBtn); break;
    }

})
let init = () => {
    for (let i = 1; i <= 5; i++) {
        for (let j = 0; j < 7; j++) {
            let key = createKey('white', pianoNotes[j], i);
            key.dataset.keyboard = keyboardMap[j + (i - 1) * 7];
            keyboard.appendChild(key);

            if (j != 2 && j != 6) {
                key = createKey('black', pianoNotes[j], i);
                key.dataset.keyboard = '⇧+' + keyboardMap[j + (i - 1) * 7];
                let blackWrapper = document.createElement('div');
                blackWrapper.className = 'piano-black-wrapper';
                blackWrapper.appendChild(key);
                keyboard.appendChild(blackWrapper);

            }
        }
    }
}

let createKey = (type, note, octave) => {
    let key = document.createElement('button');
    key.className = `piano-key piano-key-${type}`;
    key.dataset.letterNote = type == 'white' ? note + octave : note + '#' + octave;
    key.dataset.letterNoteFileName = type == 'white' ? note + octave : note + 's' + octave;
    key.textContent = key.dataset.letterNote;
    keys.push(key);


    key.addEventListener('mousedown', () => {
        playSound(key);
        key.classList.add('key-playing');
    })

    key.addEventListener('mouseup', () => {
        key.classList.remove('key-playing');
    })

    key.addEventListener('mouseleave', () => {
        key.classList.remove('key-playing');
    })

    return key;
}

document.addEventListener('keydown', (e) => {
    if (e.repeat) {
        return;
    }

    pressKey('mousedown', e);
})

document.addEventListener('keyup', (e) => {

    pressKey('mouseup', e);

})

let pressKey = (mouseEvent, e) => {

    let lastLetter = e.code.substring(e.code.length - 1);
    let shiftPressed = e.shiftKey;
    let selector;

    if (shiftPressed) {
        selector = `[data-keyboard="⇧+${lastLetter}"]`;
    }
    else {
        selector = `[data-keyboard="${lastLetter}"]`;
    }

    let key = document.querySelector(selector);

    if (key != null) {
        let event = new Event(mouseEvent);
        key.dispatchEvent(event);
    }

}

let playSound = (key) => {
    let audio = document.createElement('audio');
    audio.src = `sounds/${key.dataset.letterNoteFileName}.mp3`;
    audio.play().then(() => audio.remove());
}

controls.forEach((input) => {
    input.addEventListener('input', () => {
        let value = input.value;

        keys.forEach((key) => {
            key.textContent = key.dataset[value];
        })

    })
})

init();