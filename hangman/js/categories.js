import { showScreen } from "./ui.js";

const categoriesBtns = document.querySelectorAll('.category');

categoriesBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        showScreen('game-state');
    });
});