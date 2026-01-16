import { initGame } from "./game.js";
import { applyModeUI, showPickState } from "./ui.js";
import { setupModalListeners } from "./modal.js";


document.addEventListener('DOMContentLoaded', () => {
    const currentMode = 'three'

    setupModalListeners();
    applyModeUI(currentMode);
    initGame(currentMode);
    showPickState();
});

