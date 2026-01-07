import { showScreen } from "./ui.js";

const pickCategoryBtn = document.querySelector('.play-btn');
const instructionsBtn = document.querySelector('.instructions-btn');

pickCategoryBtn.addEventListener('click', () => {
    showScreen('categories-state');
});

instructionsBtn.addEventListener('click', () => {
    showScreen('instructions-state');
});