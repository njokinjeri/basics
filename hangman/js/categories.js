import { showScreen } from "./ui.js";
import { createKeyboard } from "./keyboard.js";
import { loadData, getRandomWord, saveGameState } from "./data.js";
import { createCharacterDisplay } from "./characterDisplay.js";
import { initGame } from "./game.js";

const categoriesBtns = document.querySelectorAll('.category');

const categoryMap = {
    'MOVIES': 'Movies',
    'TV SHOWS': 'TV Shows',
    'COUNTRIES': 'Countries',
    'CAPITAL CITIES': 'Capital Cities',
    'ANIMALS': 'Animals',
    'SPORTS': 'Sports'
};

categoriesBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
        const categoryName = btn.textContent.trim();
        const categoryKey = categoryMap[categoryName];
        
        showScreen('game-state');
        
        await loadData();
        const word = getRandomWord(categoryKey);
                
        if (word) {
            saveGameState(categoryName, word);
            document.querySelector('#selected-category').textContent = categoryName;
            
            setTimeout(() => {
                createKeyboard();
                createCharacterDisplay(word);
                initGame(word); 
            }, 50);
        } else {
            console.error('No word found!'); 
        }
    });
});