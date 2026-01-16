import { restartGame, switchGameMode } from "./game.js";

const rulesModal = document.querySelector('.rules-modal');
const menuModal = document.querySelector('.menu-modal');
const rulesBtn = document.querySelector('.rules-btn');
const menuBtn = document.querySelector('.menu-btn');
const closeModals = document.querySelectorAll('.close-icon');

const restartBtn = document.querySelector('.restart-game-btn');
const switchGameModeBtn = document.querySelector('.switch-mode-btn');

function openMenuModal() {
    resetModalState();
    menuModal.classList.add('active');
    menuBtn.classList.add('is-active');
}

function openRulesModal() {
    resetModalState();
    rulesModal.classList.add('active');
    rulesBtn.classList.add('is-active');
}

function resetModalState() {
    menuModal.classList.remove('active');
    rulesModal.classList.remove('active');

    menuBtn.classList.remove('is-active');
    rulesBtn.classList.remove('is-active');
}

export function setupModalListeners() {
    rulesBtn.addEventListener('click', openRulesModal);
    menuBtn.addEventListener('click', openMenuModal);

    closeModals.forEach(btn => {
        btn.addEventListener('click', resetModalState);
    });

    restartBtn.addEventListener('click', () => {
        restartGame();
        resetModalState();
    });

    switchGameModeBtn.addEventListener('click', () => {
        switchGameMode();
        resetModalState();
    });
}

