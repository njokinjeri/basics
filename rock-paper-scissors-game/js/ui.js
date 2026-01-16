import { GAME_MODES } from "./ui.config.js";

const ui = {
    gameModeLogo: document.querySelector('.page-logo'),
    rulesImg: document.querySelector('.rules-illustration'),
    menuLogo: document.querySelector('.modal-game-logo'),
    pickBoard: document.querySelector('.pick-board'),
    resultBoard: document.querySelector('.result-board'),
    userScore: document.querySelector('.user-score'),
    resultText: document.querySelector('.result-text'),
    userChoiceDiv: document.querySelector('.user-choice'),
    houseChoiceDiv: document.querySelector('.house-choice'),
    playAgainBtn: document.querySelector('.play-again-btn')
};

let makeChoiceHandler = null;

export function setChoiceHandler(handler) {
    makeChoiceHandler = handler;
}

export function showPickState() {
    ui.pickBoard.classList.add('active');
    ui.resultBoard.classList.remove('active');
}


export function showResultState() {
    ui.resultBoard.classList.add('active');
    ui.pickBoard.classList.remove('active');
}


export function applyModeUI(modeKey) {
    const mode = GAME_MODES[modeKey];

    ui.gameModeLogo.src = `./images/${mode.pageLogo}`;
    ui.rulesImg.src = `./images/${mode.rulesImage}`;
    ui.menuLogo.src = `./images/${mode.menuLogo}`;

    const anchor = ui.pickBoard.querySelector('.anchor');
    anchor.src = `./images/bg-${mode.anchor}.svg`;

    createChoiceButtons(mode.choices);
}


function createChoiceStructure(choice) {
    const ring = document.createElement('span');
    ring.className = `choice-ring ${choice}`;
    
    const img = document.createElement('img');
    img.src = `./images/icon-${choice}.svg`;
    img.alt = choice;
    
    ring.appendChild(img);
    return ring;
}


function createChoiceButtons(choices) {

    const existingButtons = ui.pickBoard.querySelectorAll('.choice');
    existingButtons.forEach(btn => btn.remove());


    choices.forEach((choice) => {
        const btn = document.createElement('button');
        btn.className = 'choice';
        btn.dataset.choice = choice;

        btn.appendChild(createChoiceStructure(choice));
        ui.pickBoard.appendChild(btn);

        btn.addEventListener('click', () => {
            if (makeChoiceHandler) {
                makeChoiceHandler(choice)
            }
        });
    });
}


export function updateScore(score) {
    ui.userScore.textContent = score;
}


export function displayResult(result, userChoice, houseChoice) {
    const resultTests = {
        win: 'YOU WIN',
        lose: 'YOU LOSE',
        draw: 'DRAW'
    };

    ui.resultText.textContent = resultTests[result];

    displayChoice(ui.userChoiceDiv, userChoice);
    displayChoice(ui.houseChoiceDiv, houseChoice);

    ui.userChoiceDiv.classList.remove('winner');
    ui.houseChoiceDiv.classList.remove('winner');

    if (result === 'win') {
        ui.userChoiceDiv.classList.add('winner');
    } else if (result === 'lose') {
        ui.houseChoiceDiv.classList.add('winner');
    }
}


function displayChoice(container, choice) {
    container.innerHTML = '';
    container.className = 'choice';
    container.appendChild(createChoiceStructure(choice));
}





