let gameData = null;

export async function loadData() {
    if (gameData) return gameData;

    try {
        const response = await fetch('./data/data.json');
        gameData = await response.json();
        return gameData;

    } catch (error) {
        console.error('Failed to load data:', error)
        return null;
    }
}

export function getRandomWord(category) {
    if (!gameData) return null;

    const categoryWords = gameData.categories[category];
    if (!categoryWords || categoryWords.length === 0) return null;

    const availableWords = categoryWords.filter(word => !word.selected);
    if (availableWords.length === 0) {
        categoryWords.forEach(word => word.selected = false);
        return categoryWords[Math.floor(Math.random() * categoryWords.length)];
    }

    const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)];
    randomWord.selected = true;
    return randomWord.name;
}

export function saveGameState(category, word) {
    localStorage.setItem('gameState', JSON.stringify({ category, word}));
}

export function loadGameState() {
    const saved = localStorage.getItem('gameState');
    return saved ? JSON.parse(saved) : null;
}

export function clearGameState() {
    localStorage.removeItem('gameState');
}