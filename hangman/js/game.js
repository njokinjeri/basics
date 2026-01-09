// game.js
import { revealLetter } from './characterDisplay.js';
import { showGameOutcome } from './modals.js';

let currentWord = '';
let guessedLetters = [];
let gameOver = false;
let health = 8;
const maxHealth = 8;

export function initGame(word) {
    currentWord = word.toUpperCase().replace(/ /g, '');
    guessedLetters = [];
    health = maxHealth;
    gameOver = false;
    updateHealthBar();
}

export function revealAllLetters() {
    const allLetters = [...new Set(currentWord.split(''))];
    allLetters.forEach(letter => {
        revealLetter(letter);
    });
}

export function guessLetter(letter) {
    if (gameOver) return;
    if (guessedLetters.includes(letter)) return;
    
    guessedLetters.push(letter);
    const isCorrect = revealLetter(letter);

    
    if (!isCorrect) {
        health--;
        updateHealthBar();
        
        if (health <= 0) {
            gameOver = true;
            revealAllLetters();
            setTimeout(() => {
                showGameOutcome(false);
            }, 2000);
        }
    } else {
        if (checkWin()) {
            gameOver = true;
            setTimeout(() => {
                showGameOutcome(true);
            }, 2000);
        }
    }
}

function updateHealthBar() {
    const heartsRange = document.querySelector('.hearts-range');
    
    if (!heartsRange) {
        return;
    }

    const widthInRem = (Math.max(health, 0) / maxHealth) * 7;
    heartsRange.style.width = `${widthInRem}rem`;
}

function checkWin() {
    const wordLetters = [...new Set(currentWord.split(''))];
    const won = wordLetters.every(letter => guessedLetters.includes(letter));
    return won;
}

export function resetHealth() {
    health = maxHealth;
    updateHealthBar();
}


export function getGameState() {
    return { gameOver, health };
}

export function getCurrentWord() {
    return currentWord;
}
