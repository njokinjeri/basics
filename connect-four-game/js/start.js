import { showScreen } from "./ui.js";

const gameRulesBtn = document.querySelector('.game-rules');
const cpuButton = document.querySelector('.cpu-option');
const multiplayerButton = document.querySelector('.multiplayer-option');


cpuButton.addEventListener('click', () => {
    showScreen('game-page', 'cpu')
})

multiplayerButton.addEventListener('click', () => {
    showScreen('game-page', 'pvp')
})

gameRulesBtn.addEventListener('click', () => {
    showScreen('rules-page')
});




