import { showScreen } from "./ui.js";

const backToMenu = document.querySelector('.rules-check');

backToMenu.addEventListener('click', () => {
    showScreen('start-page');
});
