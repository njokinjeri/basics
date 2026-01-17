import { initGame, loadGameState } from "./game.js";
import { applyModeUI, showPickState } from "./ui.js";
import { setupModalListeners } from "./modal.js";


document.addEventListener('DOMContentLoaded', () => {

    const savedState = loadGameState();
    const currentMode =  savedState.mode || 'three';

    setupModalListeners();
    applyModeUI(currentMode);
    initGame(currentMode, savedState.score);
    showPickState();
});

