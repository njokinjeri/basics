import { showScreen } from "./ui.js";

const goBackBtns = document.querySelectorAll('.go-back-btn');

goBackBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        showScreen('start-state');
    });
});