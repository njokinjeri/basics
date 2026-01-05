const scrambledWordEl = document.getElementById('scrambled-word');
const wordInputWrapper = document.querySelector('.word-input');
const letterInput = document.getElementById('letter-input');
const triesCount = document.getElementById('tries-count');
const trialDots = document.querySelectorAll('.tries-dots .tries-dot');
const mistakeLetters = document.querySelector('.mistake-letters');
const randomizeBtn = document.getElementById('random-btn');
const resetBtn = document.getElementById('reset-btn');

const modal = document.getElementById('game_modal');
const modalMessage = document.querySelector('.modal-message');
const closeModal = document.querySelector('.close');
const modalOkBtn = document.getElementById('modalOkBtn');

let currentWord = 'SCRAMBLE';
let guessedLetters = [];
let wrongLetters = [];
let tries = 0;
const MAX_TRIES = 5;
let gameOver = false;


async function getRandomWord() {
    const url = 'https://random-word-api.herokuapp.com/word?number=10';
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
        }
        const words = await response.json();

        const validWords = words.filter(word =>  word.length <= 10);
        const index = Math.floor(Math.random() * validWords.length)
        return validWords[index].toUpperCase();

    } catch (error){
        console.error(error.message);
        return 'SCRAMBLE';
    }
}


function scrambledWord(word) {

    let letters = word.split('');
    for (let i = letters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    return letters.join('');
}


function displayWordProgress() {

    wordInputWrapper.innerHTML = '';

    currentWord.split('').forEach((letter, index) => {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'letter-box';
        input.maxLength = 1;
        input.dataset.index = index;
        input.value = guessedLetters[index] || '';
        input.placeholder = '_';

        input.addEventListener('input', (e) => handleLetterGuess(e, index));
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                submitGuess();
            }
        });

        wordInputWrapper.appendChild(input);

    });

    const firstEmpty = wordInputWrapper.querySelector('input[value=""]');
    if (firstEmpty) firstEmpty.focus();
}


function handleLetterGuess(e, index) {
    if (gameOver) return;

    const input = e.target;
    const letter = input.value.toUpperCase();

    if (!letter.match(/[A-Z]/)) {
        input.value = '';
        return;
    }

    guessedLetters[index] = letter;

    const nextInput = wordInputWrapper.querySelector(`input[data-index="${index + 1}"]`);
    if (nextInput) nextInput.focus();

}


function updateTriesCount() {
    triesCount.textContent = `${tries} / ${MAX_TRIES}`;

    trialDots.forEach((dot, index) => {
        if (index < tries) {
            dot.classList.add('filled');
        } else {
            dot.classList.remove('filled');
        }
    });

    if (tries >= MAX_TRIES) {
        setGameOver(false);
    }
}


function updateMistakes() {
    mistakeLetters.textContent = wrongLetters.join(', ')
}


function submitGuess() {

    if (gameOver) return;

    if (guessedLetters.includes(undefined)) return;

    const userGuess = guessedLetters.join('').toUpperCase();

    if (userGuess === currentWord) {
        setGameOver(true);
        return;
    }

    tries++;
    updateTriesCount();

    guessedLetters.forEach((letter, index) => {
        const input = wordInputWrapper.querySelector(`input[data-index="${index}"]`);
        if (letter !== currentWord[index]) {
            if (!wrongLetters.includes(letter)) wrongLetters.push(letter);
            input.classList.add('wrong');
        } else {
            input.classList.remove('wrong'); 
        }
    });

    updateMistakes();

    if (tries >= MAX_TRIES) {
        setGameOver(false);
    } else {
        showModal(`Try again! You have ${MAX_TRIES - tries} tries left.`);
    }
}


function checkWin() {
    if (guessedLetters.join('').toUpperCase() === currentWord.toUpperCase()) {
        setGameOver(true);
        return true;
    } 
    return false;
}

function setGameOver(won) {
    gameOver = true;

    wordInputWrapper
        .querySelectorAll('.letter-box')
        .forEach(input => input.disabled = true);

    randomizeBtn.disabled = true;

    if (won) {
        setTimeout(() => {
            showModal(
                `🎉 Congratulations! You guessed the word: "${currentWord.toUpperCase()}"!`
            )
        }, 200);
    } else {
        setTimeout(() => {
            showModal (
                `😔 Out of Tries! The word was: "${currentWord.toUpperCase()}". Try again!`
            )
        }, 200);
    }
}


async function startGame() {
    guessedLetters = [];
    wrongLetters = [];
    tries = 0;
    updateTriesCount();
    updateMistakes();

    currentWord = await getRandomWord();

    const scrambled = scrambledWord(currentWord);
    scrambledWordEl.textContent = scrambled;

    displayWordProgress();

    console.log('Word to guess', currentWord);
}


async function  resetGame() {
    gameOver = false
    guessedLetters = [];
    wrongLetters = [];
    tries = 0;
    updateTriesCount();
    updateMistakes();

    randomizeBtn.disabled = false;

    currentWord = await getRandomWord();

    const scrambled = scrambledWord(currentWord);
    scrambledWordEl.textContent = scrambled;

    displayWordProgress();
}


async function startNewWord() {
    guessedLetters = [];
    wrongLetters = [];

    clearInputFeedback();

    currentWord = await getRandomWord();

    const scrambled = scrambledWord(currentWord);
    scrambledWordEl.textContent = scrambled;

    displayWordProgress();
    console.log('Word to guess', currentWord);
}

function clearInputFeedback() {
    const inputs = wordInputWrapper.querySelectorAll('.letter-box');
    inputs.forEach(input => {
        input.classList.remove('wrong');
        input.value = '';
    });

    updateMistakes();
}



randomizeBtn.addEventListener('click', () => {
    if (gameOver) return;
    startNewWord();
});


resetBtn.addEventListener('click', resetGame);

function showModal(message) {
    modalMessage.textContent = message;
    modal.style.display = 'flex';
}

closeModal.onclick = () => modal.style.display = 'none';
modalOkBtn.onclick = () => modal.style.display = 'none';

window.onclick = (e) => {
    if (e.target === modal) modal.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', startGame);