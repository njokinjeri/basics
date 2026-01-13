const restartGameBtn = document.querySelector('.restart');
const playAgainBtn = document.querySelector('.play-again');

const playerTurnDisplay = document.querySelector('.player-turn-counter');
const playerTimer = document.getElementById('timer');
const playerTurnLabel = document.getElementById('player-turn-label');
const svgCounter = document.querySelector('.svg-counter');

const playerTwoIcon = document.querySelector('.tag-player-2');
const playerOneScore = document.querySelector('.player-one-score');
const playerTwoScore = document.querySelector('.player-two-score');
const playerTwoLabel = document.querySelector('.player-two-label');
const winStats = document.querySelector('.win-stats');

const slots = document.getElementById('slots');
const discs = document.getElementById('discs');

const winnerDisplay = document.querySelector('.winner-display');
const winnerLabel = document.querySelector('.winner-text');
const winnerHeading = document.querySelector('.winner-heading');
const winnerIndicator = document.querySelector('.winner-indicator');


const ROWS = 6;
const COLS = 7;
const PLAYER_ONE = 1;
const PLAYER_TWO = 2;
const TIMER_DURATION = 30;

let board = [];
let currentPlayer = PLAYER_ONE;
let timerInterval = null;
let timeRemaining = TIMER_DURATION
let scores = {
    playerOne: 0,
    playerTwo: 0
};

let gameMode = 'cpu';
let gameActive = false;
let isInitialized = false;


export function initGame(mode = 'cpu') {
    gameMode = mode;

    if (isInitialized) {
        restartGame();
        return;
    }

    createBoard();
    createSlots();
    attachEvenListeners();
    showPlayerCounter();
    restartGame();
    isInitialized = true;
}


function createBoard() {
    board = Array(ROWS).fill(null).map(() => Array(COLS).fill(0));
}


function createSlots() {
    slots.innerHTML = '';
    for (let col = 0; col < COLS; col++) {
        const slot = document.createElement('div');
        slot.className = 'slot';
        slot.dataset.col = col;
        slot.addEventListener('click', () =>  handleSlotClick(col));
        slot.addEventListener('mouseenter', () => handleSlotClick(col, true));
        slot.addEventListener('mouseleave', () => handleSlotClick(col, false))
        slots.appendChild(slot);
    }
}


function handleSlotClick(col) {
    if (!gameActive) return;

    if (gameMode === 'cpu' && currentPlayer === PLAYER_TWO) return;

    const row = getAvailableRow(col)
    if (row === -1) return 

    makeMove(row, col);
}


function makeMove(row, col) {
    board[row][col] = currentPlayer;
    dropDisc(row, col, currentPlayer);

    if (checkWin(row, col)) {
        handleWin();
    } else if (checkDraw()) {
        handleDraw();
    } else {
        switchPlayer();

        if (gameMode === 'cpu' && currentPlayer === PLAYER_TWO) {
            setTimeout(makeCPUMove, 800)
        }
    }
}





function dropDisc(row, col, player) {
    const disc = document.createElement('div');
    disc.className = `disc player-${player}`;
    disc.dataset.row = row;
    disc.dataset.col = col;

    disc.style.setProperty('--row', row);
    disc.style.setProperty('--col', col);

    discs.appendChild(disc);
}



function getAvailableRow(col) {
    for (let row = ROWS - 1; row >= 0; row--) {
        if (board[row][col] === 0) {
            return row
        }
    }
    return -1;
}


function checkWin(row, col) {
    const player = board[row][col];
    
    if (checkDirection(row, col, 0, 1, player)) return true;
    
    if (checkDirection(row, col, 1, 0, player)) return true;
    
    if (checkDirection(row, col, 1, 1, player)) return true;
    
    if (checkDirection(row, col, 1, -1, player)) return true;
    
    return false;
}


function checkDirection(row, col, rowDir, colDir, player) {
    let count = 1;
    
    count += countInDirection(row, col, rowDir, colDir, player);
    
    count += countInDirection(row, col, -rowDir, -colDir, player);
    
    return count >= 4;
}


function countInDirection(row, col, rowDir, colDir, player) {
    let count = 0;
    let r = row + rowDir;
    let c = col + colDir;
    
    while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
        count++;
        r += rowDir;
        c += colDir;
    }
    
    return count;
}


function checkDraw() {
    return board[0].every(cell => cell !== 0);
}


function handleWin() {
    gameActive = false;
    stopTimer();

    if (currentPlayer === PLAYER_ONE) {
        scores.playerOne++;
        updateScore(playerOneScore, scores.playerOne);
        winnerLabel.textContent = 'PLAYER 1';
        winnerIndicator.style.backgroundColor = '#FD6687';
    } else {
        scores.playerTwo++;
        updateScore(playerTwoScore, scores.playerTwo);
        if (gameMode === 'cpu') {
            winnerLabel.textContent = 'CPU';
            winnerIndicator.style.backgroundColor = '#FFCE67';
        } else {
            winnerLabel.textContent = 'PLAYER 2';
            winnerIndicator.style.backgroundColor = '#FFCE67';
        }
    }

    hidePlayerCounter();
    showWinnerDisplay();
}


function handleDraw() {
    gameActive = false;
    stopTimer();
    winnerLabel.textContent = "IT'S A"
    winnerHeading.textContent = 'TIE';
    hidePlayerCounter();
    showWinnerDisplay();
}


function showPlayerCounter() {
    playerTurnDisplay.classList.add('active');
}


function hidePlayerCounter() {
    playerTurnDisplay.classList.remove('active');
}


function showWinnerDisplay() {
    winnerDisplay.classList.add('active');
}


function hideWinnerDisplay() {
    winnerDisplay.classList.remove('active')
}


function updateScore(scoreElement, score) {
    if (scoreElement) {
        scoreElement.innerHTML = `<strong>${score}</strong>`;
    }
}


function switchPlayer() {
    currentPlayer = currentPlayer === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE;
    updatePlayerTurnLabel();
    resetTimer();
}


function updatePlayerTurnLabel() {
    if (playerTwoLabel) {
        if (gameMode === 'cpu' && currentPlayer === PLAYER_TWO) {
            playerTurnLabel.textContent = "CPU'S TURN";
            svgCounter.style.color = '#FFCE67';
        } else {
            playerTurnLabel.textContent = `PLAYER ${currentPlayer}'S TURN`;
            if (currentPlayer === PLAYER_TWO) {
                svgCounter.style.color = '#FFCE67';
                playerTurnLabel.style.color = '#000';
                playerTimer.style.color = '#000';
            } else {
                svgCounter.style.color = '#FD6687';
                playerTurnLabel.style.color = '#fff';
                playerTimer.style.color = '#fff';
            }
        }
    }
}

function updatePlayerTwoLabel() {
    if (gameMode === 'cpu') {
        playerTwoLabel.textContent = 'CPU';
        playerTwoIcon.src = './images/cpu.svg';
    } else {
        playerTwoLabel.textContent = 'PLAYER 2';
        playerTwoIcon.src = './images/player-two.svg'
    }
}


function startTimer() {
    stopTimer();
    timeRemaining = TIMER_DURATION;
    updateTimerDisplay();

    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();

        if (timeRemaining <= 0) {
            handleWinnerOnTimeOut();
        }
    }, 1000);
}


function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}


function resetTimer() {
    startTimer();
}


function updateTimerDisplay() {
    playerTimer.textContent = `${timeRemaining}s`;
}


function handleTimeOut() {
    stopTimer();
    switchPlayer();
}


function handleWinnerOnTimeOut() {
    gameActive = false;
    stopTimer();
    
    if (currentPlayer === PLAYER_ONE) {
        scores.playerTwo++;
        updateScore(playerTwoScore, scores.playerTwo);
        winnerLabel.textContent = 'PLAYER 2';
        winnerIndicator.style.backgroundColor = '#FFCE67';
    } else {
        scores.playerOne++;
        updateScore(playerOneScore, scores.playerOne);
        if (gameMode === 'cpu') {
            winnerLabel.textContent = 'CPU';
            winnerIndicator.style.backgroundColor = '#FFCE67';
        } else {
            winnerLabel.textContent = 'PLAYER 1';
            winnerIndicator.style.backgroundColor = '#FD6687';
        }
    }

    hidePlayerCounter();
    showWinnerDisplay();
}


export function restartGame() {
    createBoard();
    discs.innerHTML = '';
    currentPlayer = PLAYER_ONE
    gameActive = true;
    hideWinnerDisplay();
    updatePlayerTwoLabel();
    updatePlayerTurnLabel();
    showPlayerCounter();
    startTimer();
}


export function quitGame() {
    gameActive = false;
    stopTimer();
    createBoard();
    discs.innerHTML = '';
    scores.playerOne = 0;
    scores.playerTwo = 0;
    updateScore(playerOneScore, 0)
    updateScore(playerTwoScore, 0)
    updatePlayerTwoLabel();
    updatePlayerTurnLabel();
    hideWinnerDisplay();
    showPlayerCounter();
}


function attachEvenListeners() {
    restartGameBtn?.addEventListener('click', restartGame);
    playAgainBtn?.addEventListener('click', () => {
        winnerIndicator.style.backgroundColor = 'var(--dark-purple)';
        restartGame();
    });
}