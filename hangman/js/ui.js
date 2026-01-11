import { loadData, loadGameState } from './data.js';
import { createKeyboard } from './keyboard.js';
import { createCharacterDisplay } from './characterDisplay.js';
import { resetModals } from "./modals.js";
import { initGame } from "./game.js";

export function showScreen(screenName) {
    resetModals();

    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    document.querySelector(`.${screenName}`).classList.add('active');

    history.pushState({ screen: screenName }, '', `#${screenName}`);
    localStorage.setItem('currentScreen', screenName);
}

window.addEventListener('popstate', (event) => {
    if (event.state && event.state.screen) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active')
        });

        document.querySelector(`.${event.state.screen}`).classList.add('active');
        localStorage.setItem('currentScreen', event.state.screen)
    }
})


export async function initializeScreen() {
    let savedScreen;

    if (sessionStorage.getItem('activeSession') === 'true') {
        savedScreen = localStorage.getItem('currentScreen') || 'start-screen';
    } else {
        savedScreen = 'start-state';
        sessionStorage.setItem('activeSession', 'true');
    }


    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    document.querySelector(`.${savedScreen}`).classList.add('active');

    history.replaceState({ screen: savedScreen }, '', `#${savedScreen}`);

    if (savedScreen === 'game-state') {
        await restoreGame();
    }

}

async function restoreGame() {
    await loadData();
    const gameState = loadGameState();

    if (gameState) {
        document.querySelector('#selected-category').textContent = gameState.category;

        createKeyboard();
        createCharacterDisplay(gameState.word);
        initGame(gameState.word);
    }
}

export function resetScreenOnLogout() {
    localStorage.removeItem('currentScreen');
    sessionStorage.removeItem('activeSession');
}

