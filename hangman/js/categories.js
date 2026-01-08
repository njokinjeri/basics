import { showScreen } from "./ui.js";
import { createKeyboard } from "./keyboard.js";

const categoriesBtns = document.querySelectorAll('.category');

categoriesBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        showScreen('game-state');
        createKeyboard();
    });
});

