import { showScreen } from "./ui.js";

const gameRulesBtn = document.querySelector('.game-rules');
const gameBoardBtns = document.querySelectorAll('.cpu-option, .multiplayer-option')

gameBoardBtns.forEach(btn => { 
    btn.addEventListener('click', () => {
        showScreen('game-page')
    });
});

gameRulesBtn.addEventListener('click', () => {
    showScreen('rules-page')
});




