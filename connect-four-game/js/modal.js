import { showScreen } from "./ui.js";
import { restartGame, quitGame } from "./game.js";

const menuBtn = document.querySelector('.menu')
const menuModal = document.querySelector('.menu-overlay');
const continueBtn = document.querySelector('.continue-game-btn');
const restartBtn = document.querySelector('.restart-game-btn');
const quitGameBtn = document.querySelector('.quit-game-btn');


export function showPauseMenu() {
    menuModal.classList.add('active');
}


export function hidePauseMenu() {
    menuModal.classList.remove('active');
}


export function resetModals() {
    menuModal.classList.remove('active');
}


export function setupModalListeners() {
    menuBtn.addEventListener('click', () => {
        showPauseMenu();
    })
    
    continueBtn.addEventListener('click', () => {
        hidePauseMenu()
    });

    restartBtn.addEventListener('click', () => {
        restartGame();
        resetModals();

    });

    quitGameBtn.addEventListener('click', () => {
        quitGame();
        resetModals();
        showScreen('start-page')
    });
}