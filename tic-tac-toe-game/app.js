const ui = {
    menu: document.querySelector('.menu-overlay'),
    menuButtons: {
        pickX: document.getElementById('pick_x'),
        pickO: document.getElementById('pick_o'),
        vsCpu: document.getElementById('vs_cpu'),
        vsPlayer: document.getElementById('vs_player')
    },

    playerTurnDisplay: document.querySelector('.player-turn-update'),
    restartBtn: document.querySelector('.restart-btn'),
    boardCells: document.querySelectorAll('.cell'),

    modal: document.querySelector('.modal-overlay'),
    winnerIcon: document.querySelector('.winner-icon'),
    modalMessage: document.querySelector('.modal-message'),
    roundHighlight: document.querySelector('.round-highlight'),
    quitBtn: document.getElementById('quit'),
    nextRoundBtn: document.getElementById('next_round'),
    scores: {
        you: document.getElementById('score_you'),
        ties: document.getElementById('score_ties'),
        cpu: document.getElementById('score_cpu')
    },

    scoreLabels: {
        you: document.getElementById('you_label'),
        opponent: document.getElementById('opponent_label')
    }
};

const gameState = {
    board: ['', '', '', '', '', '', '', '', ''],
    currentPlayer: 'X',
    playerSign: 'X',
    cpuSign: 'O',
    gameMode: null,
    isGameActive: false,
    gameStarted: false,
    scores: {
        you: 0,
        ties: 0,
        cpu: 0,
    }
};


const WIN_PATTERNS =  [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];


function init() {
    loadGameState();
    updateScoreDisplay();
    attachEventListeners()
    showMenu();
    showModal();
}


function showMenu() {
    if (ui.menu) {
        ui.menu.style.display = 'flex';
    }
}

function showModal() {
    if (ui.modal) {
        ui.modal.style.display = 'flex'
    }
}


function selectPlayerSign(sign) {
    gameState.playerSign = sign;
    gameState.cpuSign = sign === 'X' ? 'O' : 'X';

    if (ui.menuButtons.pickX && ui.menuButtons.pickO) {
        if (sign === 'X') {
            ui.menuButtons.pickX.classList.add('selected');
            ui.menuButtons.pickO.classList.remove('selected');
        } else {
            ui.menuButtons.pickO.classList.add('selected');
            ui.menuButtons.pickX.classList.remove('selected');
        }
    }
}

function updateTurnDisplay() {
  if (ui.playerTurnDisplay) {
    const icon = ui.playerTurnDisplay.querySelector('.player-icon');
    if (gameState.currentPlayer === 'X') {
      icon.setAttribute('viewBox', '83 11 32 32');
      icon.innerHTML = `<path fill-rule="evenodd" clip-rule="evenodd" d="M114.557 16.2897L109.71 11.4431C109.12 10.8523 108.162 10.8523 107.571 11.4431L99 20.014L90.429 11.4431C89.8383 10.8523 88.8805 10.8523 88.2897 11.4431L83.4431 16.2897C82.8523 16.8805 82.8523 17.8383 83.4431 18.429L92.014 27L83.4431 35.571C82.8523 36.1617 82.8523 37.1195 83.4431 37.7103L88.2897 42.5569C88.8805 43.1477 89.8383 43.1477 90.429 42.5569L99 33.986L107.571 42.5569C108.162 43.1477 109.12 43.1477 109.71 42.5569L114.557 37.7103C115.148 37.1195 115.148 36.1617 114.557 35.571L105.986 27L114.557 18.429C115.148 17.8383 115.148 16.8805 114.557 16.2897Z" fill="currentColor"/>`;
    } else {
      icon.setAttribute('viewBox', '83 11 32 32');
      icon.innerHTML = `<path fill-rule="evenodd" clip-rule="evenodd" d="M114.741 26.8706C114.741 18.1055 107.636 11 98.8706 11C90.1055 11 83 18.1055 83 26.8706C83 35.6357 90.1055 42.7412 98.8706 42.7412C107.636 42.7412 114.741 35.6357 114.741 26.8706ZM92.4048 26.8706C92.4048 23.2996 95.2996 20.4048 98.8706 20.4048C102.442 20.4048 105.336 23.2996 105.336 26.8706C105.336 30.4416 102.442 33.3364 98.8706 33.3364C95.2996 33.3364 92.4048 30.4416 92.4048 26.8706Z" fill="currentColor"/>`;
    }
  }
}

function selectGameMode(mode) {
    gameState.gameMode = mode;

    if (ui.scoreLabels.opponent) {
        if (mode === 'cpu') {
            ui.scoreLabels.you.textContent = `${gameState.playerSign} (YOU)`;
            ui.scoreLabels.opponent.textContent = `${gameState.cpuSign} (CPU)`;
        } else {
            ui.scoreLabels.you.textContent = `${gameState.playerSign} (P1)`;
            ui.scoreLabels.opponent.textContent = `${gameState.cpuSign} (P2)`;
        }
    }
    
    if (ui.menu) {
        ui.menu.style.display = 'none';
    }

    if (ui.modal) {
        ui.modal.style.display = 'none';
    }

    gameState.gameStarted = true;
    gameState.isGameActive = true;
    gameState.currentPlayer = 'X';

    if (gameState.gameMode === 'cpu' && gameState.cpuSign === 'X') {
        setTimeout(() =>{
            cpuMove();
        }, 500);
    }
}


function cpuMove() {
    const bestMove = getBestMove();
    makeMove(bestMove, gameState.cpuSign);

    const result = checkGameResult();
    if (result) {
        handleGameEnd(result);
        return;
    }

    gameState.currentPlayer = gameState.playerSign;
    updateTurnDisplay();
}


function getBestMove() {
  let bestScore = -Infinity;
  let bestMove = null;
  
  for (let i = 0; i < 9; i++) {
    if (gameState.board[i] === '') {
      gameState.board[i] = gameState.cpuSign;
      let score = minimax(gameState.board, 0, false);
      gameState.board[i] = '';
      
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }
  
  return bestMove;
}


function minimax(board, depth, isMaximizing) {
  const result = checkGameResult(board);
  
  if (result) {
    if (result.winner === gameState.cpuSign) return 10 - depth;
    if (result.winner === gameState.playerSign) return depth - 10;
    return 0;
  }
  
  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === '') {
        board[i] = gameState.cpuSign;
        let score = minimax(board, depth + 1, false);
        board[i] = '';
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === '') {
        board[i] = gameState.playerSign;
        let score = minimax(board, depth + 1, true);
        board[i] = '';
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}


function attachEventListeners() {
    if (ui.menuButtons.pickX) {
        ui.menuButtons.pickX.addEventListener('click', () => selectPlayerSign('X'));
    }

    if (ui.menuButtons.pickO) {
        ui.menuButtons.pickO.addEventListener('click', () => selectPlayerSign('O'));
    }

    if (ui.menuButtons.vsCpu) {
        ui.menuButtons.vsCpu.addEventListener('click', () => selectGameMode('cpu'));
    }

    if (ui.menuButtons.vsPlayer) {
        ui.menuButtons.vsPlayer.addEventListener('click', () => selectGameMode('multiplayer'));
    }


    ui.boardCells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });

    ui.restartBtn.addEventListener('click', restartGame);
    ui.quitBtn.addEventListener('click', quitGame);
    ui.nextRoundBtn.addEventListener('click', nextRound)
}


function handleCellClick(e) {
     const index = parseInt(e.target.dataset.index);

    if (!gameState.gameStarted || gameState.board[index] !== '' || !gameState.isGameActive) {
        return;
    }

    if (gameState.gameMode === 'cpu' && gameState.currentPlayer === gameState.cpuSign) {
        return;
    }

    makeMove(index, gameState.currentPlayer);

    const result = checkGameResult();
    if (result) {
        handleGameEnd(result);
        return;
    }

    gameState.currentPlayer = gameState.currentPlayer === 'X' ? 'O' : 'X';
    updateTurnDisplay();

    if (gameState.gameMode === 'cpu' && gameState.currentPlayer === gameState.cpuSign && gameState.isGameActive) {
        setTimeout(() => {
            cpuMove();
        }, 500)
    }
}


function makeMove(index, player) {
  gameState.board[index] = player;
  const cell = ui.boardCells[index];
  
  if (player === 'X') {
    cell.innerHTML = `<svg viewBox="83 11 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M114.557 16.2897L109.71 11.4431C109.12 10.8523 108.162 10.8523 107.571 11.4431L99 20.014L90.429 11.4431C89.8383 10.8523 88.8805 10.8523 88.2897 11.4431L83.4431 16.2897C82.8523 16.8805 82.8523 17.8383 83.4431 18.429L92.014 27L83.4431 35.571C82.8523 36.1617 82.8523 37.1195 83.4431 37.7103L88.2897 42.5569C88.8805 43.1477 89.8383 43.1477 90.429 42.5569L99 33.986L107.571 42.5569C108.162 43.1477 109.12 43.1477 109.71 42.5569L114.557 37.7103C115.148 37.1195 115.148 36.1617 114.557 35.571L105.986 27L114.557 18.429C115.148 17.8383 115.148 16.8805 114.557 16.2897Z" 
                                    fill="currentColor"/>
                        </svg>`;           
    cell.classList.add('x-mark');

  } else {
    cell.innerHTML = `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                            <path d="M32 0c17.673 0 32 14.327 32 32 0 17.673-14.327 32-32 32C14.327 64 0 49.673 0 32 0 14.327 14.327 0 32 0Zm0 18.963c-7.2 0-13.037 5.837-13.037 13.037 0 7.2 5.837 13.037 13.037 13.037 7.2 0 13.037-5.837 13.037-13.037 0-7.2-5.837-13.037-13.037-13.037Z" 
                                    fill="currentColor"/>
                        </svg>`;
    cell.classList.add('o-mark');
  }
  
  cell.disabled = true;
}


function checkGameResult(board = gameState.board) {
    for (let pattern of WIN_PATTERNS) {
        const [a, b, c] = pattern;
        if (gameState.board[a] && 
            gameState.board[a] === gameState.board[b] &&
            gameState.board[a] === gameState.board[c]) {
                return {
                    winner:gameState.board[a], line: pattern
                };
            }
    }

    if (!gameState.board.includes('')) {
        return { winner: 'tie' }
    }

    return null;
}


function handleGameEnd(result) {
  gameState.isGameActive = false;
  
  if (ui.winnerIcon) {
    ui.winnerIcon.classList.remove('x-winner', 'o-winner');
  }
  
  if (ui.roundHighlight) {
    ui.roundHighlight.classList.remove('x-winner', 'o-winner', 'tie-result');
  }

  if (ui.roundHighlight) {
    ui.roundHighlight.classList.remove('tie-result');
  }
  
  if (result.winner === 'tie') {
    gameState.scores.ties++;
    ui.modalMessage.textContent = '';
    if (ui.winnerIcon) {
      ui.winnerIcon.style.display = 'none';
    }
    if (ui.roundHighlight) {
      ui.roundHighlight.textContent = 'ROUND TIED!';
      ui.roundHighlight.classList.add('tie-result');
    }
  } else {
    if (ui.winnerIcon) {
      ui.winnerIcon.style.display = 'block';
      updateWinnerIcon(result.winner);
    }
    
      if (ui.roundHighlight) {
      ui.roundHighlight.textContent = 'TAKES THE ROUND';
      if (result.winner === 'X') {
        ui.roundHighlight.classList.add('x-winner');
      } else {
        ui.roundHighlight.classList.add('o-winner');
      }
    }
    
    if (gameState.gameMode === 'cpu') {
      if (result.winner === gameState.playerSign) {
        gameState.scores.you++;
        ui.modalMessage.textContent = 'YOU WON!';
      } else {
        gameState.scores.cpu++;
        ui.modalMessage.textContent = 'OH NO, YOU LOST…';
      }
    } else {
      if (result.winner === gameState.playerSign) {
        gameState.scores.you++;
        ui.modalMessage.textContent = 'PLAYER 1 WINS!';
      } else {
        gameState.scores.cpu++;
        ui.modalMessage.textContent = 'PLAYER 2 WINS!';
      }
    }
  }
  
  updateScoreDisplay();
  saveGameState();
  
  setTimeout(() => {
    if (ui.modal) {
      ui.modal.style.display = 'flex';
    }
  }, 1000);
}



function updateWinnerIcon(winner) {
  if (!ui.winnerIcon) return;
  
  if (winner === 'X') {
    ui.winnerIcon.setAttribute('viewBox', '0 0 64 64');
    ui.winnerIcon.innerHTML = `<path d="M15.002 1.147 32 18.145 48.998 1.147a3 3 0 0 1 4.243 0l9.612 9.612a3 3 0 0 1 0 4.243L45.855 32l16.998 16.998a3 3 0 0 1 0 4.243l-9.612 9.612a3 3 0 0 1-4.243 0L32 45.855 15.002 62.853a3 3 0 0 1-4.243 0L1.147 53.24a3 3 0 0 1 0-4.243L18.145 32 1.147 15.002a3 3 0 0 1 0-4.243l9.612-9.612a3 3 0 0 1 4.243 0Z" fill="currentColor" fill-rule="evenodd"/>`;
    ui.winnerIcon.classList.add('x-winner')
  } else {
    ui.winnerIcon.setAttribute('viewBox', '0 0 64 64');
    ui.winnerIcon.innerHTML = `<path d="M32 0c17.673 0 32 14.327 32 32 0 17.673-14.327 32-32 32C14.327 64 0 49.673 0 32 0 14.327 14.327 0 32 0Zm0 18.963c-7.2 0-13.037 5.837-13.037 13.037 0 7.2 5.837 13.037 13.037 13.037 7.2 0 13.037-5.837 13.037-13.037 0-7.2-5.837-13.037-13.037-13.037Z" fill="currentColor"/>`;
    ui.winnerIcon.classList.add('o-winner')
  }
}


function updateScoreDisplay() {
    ui.scores.you.textContent = gameState.scores.you;
    ui.scores.ties.textContent = gameState.scores.ties;
    ui.scores.cpu.textContent = gameState.scores.cpu
}


function restartGame() {
    gameState.board = ['', '', '', '', '', '', '', '', ''];
    gameState.currentPlayer = 'X';
    gameState.isGameActive = true;

    ui.boardCells.forEach(cell => {
        cell.innerHTML = '';
        cell.disabled = false;
        cell.classList.remove('x-mark', 'o-mark')
    });

    updateTurnDisplay();
}


function nextRound() {
  if (ui.modal) {
    ui.modal.style.display = 'none';

    restartGame();
    updateTurnDisplay();
    
    if (
        gameState.gameMode === 'cpu' &&
        gameState.cpuSign === 'X' &&
        gameState.isGameActive
    ) {
        setTimeout(cpuMove, 500);
    }
  }

}


function quitGame() {
    ui.modal.hidden = true;
    gameState.scores = { you: 0, ties: 0, cpu: 0 };
    gameState.gameStarted = false;
    gameState.gameMode = null;

    updateScoreDisplay();
    saveGameState();
    restartGame();
    showMenu();
}


function loadGameState() {
    const saved = localStorage.getItem('tictactoe');
    if (saved) {
        const data = JSON.parse(saved);
        gameState.scores = data.scores || gameState.scores;
    }
}

function saveGameState() {
    localStorage.setItem('tictactoe', JSON.stringify({
        scores: gameState.scores
    }))
}

init();