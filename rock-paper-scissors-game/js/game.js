import { GAME_MODES } from "./ui.config.js";
import { showResultState, showPickState, updateScore, displayResult, setChoiceHandler, applyModeUI } from "./ui.js";

let gameState = {
    mode: 'three',
    score: 0,
    currentChoices: [],
    userChoice: null,
    houseChoice: null
};

export function initGame(mode) {
    gameState.mode = mode;
    gameState.currentChoices = GAME_MODES[mode].choices;

    setChoiceHandler(makeChoice);
    setUpPlayAgainListener();
}


function setUpPlayAgainListener() {
    const playAgainBtn = document.querySelector('.play-again-btn');
    playAgainBtn.addEventListener('click', resetRound);
}


function makeChoice(choice) {
    gameState.userChoice = choice;
    gameState.houseChoice = getHouseChoice();

    showResultState();

    setTimeout(() => {
        const result = determineWinner();
        updateGameScore(result);
        displayResult(result, gameState.userChoice, gameState.houseChoice);
    }, 500);
}


function getHouseChoice() {
    const choices = gameState.currentChoices;
    return choices[Math.floor(Math.random() * choices.length)];

}


function determineWinner() {
    const { userChoice, houseChoice } = gameState;

    if (userChoice === houseChoice) return 'draw';

    const winConditions = {
        rock: ['scissors', 'lizard'],
        paper: ['rock', 'spock'],
        scissors: ['paper', 'lizard'],
        lizard: ['spock', 'paper'],
        spock: ['scissors', 'rock']
    };

    return winConditions[userChoice]?.includes(houseChoice) ? 'win' : 'lose';
}


function updateGameScore(result) {
    if (result === 'win') {
        gameState.score++;
        updateScore(gameState.score);
    } else if (result === 'lose') {
        gameState.score = Math.max(0, gameState.score - 1);
        updateScore(gameState.score);
    }
}


function resetRound() {
    gameState.userChoice = null;
    gameState.houseChoice = null;
    showPickState();
}


export function switchGameMode() {
    gameState.mode = gameState.mode === 'three' ? 'five' : 'three';
    applyModeUI(gameState.mode)
    initGame(gameState.mode);
    showPickState();
}


export function restartGame() {
    gameState.score = 0;
    updateScore(0);
    resetRound();
}
