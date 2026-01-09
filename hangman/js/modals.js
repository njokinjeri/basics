import { showScreen } from "./ui.js";
import { saveGameState, clearGameState, loadData, getRandomWord, loadGameState } from "./data.js";
import { createKeyboard } from "./keyboard.js";
import { createCharacterDisplay } from "./characterDisplay.js";
import { initGame } from "./game.js";

const hamburgerMenu = document.querySelector('.hamburger-control');
const menuModal = document.querySelector('.menu-overlay');
const outcomeModal = document.querySelector('.outcome-overlay');

const modalMessage = document.querySelector('.outcome-message')
const continueBtn = document.querySelector('.continue');
const playAgainBtn = document.querySelector('.play-again');
const quitGameBtns = document.querySelectorAll('.quit-game');
const newCategoryBtns = document.querySelectorAll('.new-category');


export function showPauseMenu() {
    menuModal.classList.add('active');
}


export function hidePauseMenu() {
    menuModal.classList.remove('active');
}


export function showGameOutcome(didWin) {
    modalMessage.textContent = didWin ? 'YOU WIN' : 'YOU LOSE'
    outcomeModal.classList.add('active');
}


export function hideGameOutcome() {
    outcomeModal.classList.remove('active');
}

export function resetModals() {
    menuModal.classList.remove('active');
    outcomeModal.classList.remove('active');
}

const categoryMap = {
    'MOVIES': 'Movies',
    'TV SHOWS': 'TV Shows',
    'COUNTRIES': 'Countries',
    'CAPITAL CITIES': 'Capital Cities',
    'ANIMALS': 'Animals',
    'SPORTS': 'Sports'
};


export function setupModalListeners() {
    hamburgerMenu.addEventListener('click', (e) => {
        e.stopPropagation();
        showPauseMenu();
    });
    continueBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        hidePauseMenu();    
    });

    playAgainBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        hideGameOutcome();

        const gameState = loadGameState();
        if (gameState) {
            await loadData();
            const categoryKey = categoryMap[gameState.category];
            const newWord = getRandomWord(categoryKey);

            if (newWord) {
                saveGameState(gameState.category, newWord);
                document.querySelector('#selected-category').textContent = gameState.category;
                
                createKeyboard();
                createCharacterDisplay(newWord);
                initGame(newWord);
            }
        }
    })

    newCategoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            clearGameState();
            resetModals();
            showScreen('categories-state')
        });
    });

    quitGameBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            clearGameState();
            resetModals()
            showScreen('start-state');
        });
    });
}
