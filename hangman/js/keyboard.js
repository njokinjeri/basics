import { guessLetter, getGameState } from './game.js';

export function createKeyboard() {
    const keyboardContainer = document.querySelector('.game-keyboard');

    if (!keyboardContainer) {
        console.error('Keyboard container not found!');
        return;
    }

    const keys = [
        ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
        ['J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R'],
        ['S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    ];

    keyboardContainer.innerHTML = '';

    keys.forEach( row => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'keyboard-row';

        row.forEach(letter => {
            const button = document.createElement('button');
            button.classList = 'key-btn';
            button.textContent = letter;
            button.dataset.letter = letter;

            button.addEventListener('click', handleKeyPress);
            rowDiv.appendChild(button)
        });
        keyboardContainer.appendChild(rowDiv);
    });
}

function handleKeyPress(e) {
    const { gameOver } = getGameState();
    if (gameOver) return;

    const letter = e.target.dataset.letter;
    const button = e.target;

    button.disabled = true;
    button.classList.add('used');

    guessLetter(letter);
}

export function disableAllKeys() {
    const buttons = document.querySelectorAll('.key-btn');
    buttons.forEach(btn => {
        btn.disabled = true;
    });
}

export function resetKeyboard() {
    const buttons = document.querySelectorAll('.key-btn');
    buttons.forEach(btn => {
        btn.disabled = false;
        btn.classList.remove('used', 'correct', 'incorrect');
    });
}