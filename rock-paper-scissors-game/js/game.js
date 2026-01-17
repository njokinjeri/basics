import { GAME_MODES } from "./ui.config.js";
import { 
    showResultState, 
    showPickState, 
    updateScore, 
    displayResult, 
    setChoiceHandler, 
    applyModeUI, 
    displayUserChoice, 
    displayHouseChoice,
    showHousePicking,  
    showResult         
} from "./ui.js";

let gameState = {
    mode: 'three',
    score: 0,
    currentChoices: [],
    userChoice: null,
    houseChoice: null
};

export function loadGameState() {
    const saved = localStorage.getItem('rpsGameState');
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error('Failed to load game state:', e);
            return { mode: 'three', score: 0 };
        }
    }
    return { mode: 'three', score: 0 };
}

function saveGameState() {
    const stateToSave = {
        mode: gameState.mode,
        score: gameState.score
    };
    localStorage.setItem('rpsGameState', JSON.stringify(stateToSave));
}

export function initGame(mode, savedScore = 0) {
    gameState.mode = mode;
    gameState.score = savedScore;
    gameState.currentChoices = GAME_MODES[mode].choices;
    
    updateScore(gameState.score);
    setChoiceHandler(makeChoice);
    setUpPlayAgainListener();
    saveGameState();
}

function setUpPlayAgainListener() {
    const playAgainBtn = document.querySelector('.play-again-btn');
    playAgainBtn.addEventListener('click', resetRound);
}

function makeChoice(choice) {
    gameState.userChoice = choice;
    
    showResultState();
    displayUserChoice(gameState.userChoice);
    showHousePicking();
    
    setTimeout(() => {
        gameState.houseChoice = getHouseChoice();
        displayHouseChoice(gameState.houseChoice);
        
        setTimeout(() => {
            const result = determineWinner();
            updateGameScore(result);
            showResult(result); 
        }, 500);
    }, 1500);
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
        saveGameState();
    } else if (result === 'lose') {
        gameState.score = Math.max(0, gameState.score - 1);
        updateScore(gameState.score);
        saveGameState();
    }
}

function resetRound() {
    gameState.userChoice = null;
    gameState.houseChoice = null;
    showPickState();
}

export function switchGameMode() {
    gameState.mode = gameState.mode === 'three' ? 'five' : 'three';
    applyModeUI(gameState.mode);
    initGame(gameState.mode, gameState.score); 
    showPickState();
    saveGameState();
}

export function restartGame() {
    gameState.score = 0;
    updateScore(0);
    resetRound();
    saveGameState();
}