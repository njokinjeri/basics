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
    scores: {
        three: 0,
        five: 0
    },
    currentChoices: [],
    userChoice: null,
    houseChoice: null
};


export function loadGameState() {
    const saved = localStorage.getItem('rpsGameState');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (!parsed.scores) {
                parsed.scores = { three: 0, five: 0 };
            }
            return parsed;
        } catch (e) {
            console.error('Failed to load game state:', e);
            return { mode: 'three', scores: { three: 0, five: 0 } };
        }
    }
    return { mode: 'three', scores: { three: 0, five: 0 } };
}


function saveGameState() {
    const stateToSave = {
        mode: gameState.mode,
        scores: gameState.scores
    };
    localStorage.setItem('rpsGameState', JSON.stringify(stateToSave));
}


export function initGame(mode, savedScores = null) {
    gameState.mode = mode;

    if (savedScores) {
        gameState.scores = savedScores;
    }
    
    gameState.currentChoices = GAME_MODES[mode].choices;
    
    updateScore(gameState.scores[mode]);
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
    const currentMode = gameState.mode;
    
    if (result === 'win') {
        gameState.scores[currentMode]++;
        updateScore(gameState.scores[currentMode]);
        saveGameState();
    } else if (result === 'lose') {
        gameState.scores[currentMode] = Math.max(0, gameState.scores[currentMode] - 1);
        updateScore(gameState.scores[currentMode]);
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
    initGame(gameState.mode, gameState.scores); 
    showPickState();
    saveGameState();
}

export function restartGame() {
    gameState.scores[gameState.mode] = 0;
    updateScore(0);
    resetRound();
    saveGameState();
}