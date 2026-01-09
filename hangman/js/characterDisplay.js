export function createCharacterDisplay(word) {
    const characterContainer = document.querySelector('.category-character');
    characterContainer.innerHTML = '';
    
    const characters = word.toUpperCase().replace(/ /g, '').split('');
    
    characters.forEach(char => {
        const letterBox = document.createElement('div');
        letterBox.className = 'letter-box';
        letterBox.dataset.letter = char;
        letterBox.textContent = '';
        
        characterContainer.appendChild(letterBox);
    });
}

export function revealLetter(letter) {
    const letterBoxes = document.querySelectorAll(`.letter-box[data-letter="${letter}"]`);
    
    let found = letterBoxes.length > 0; 
    
    letterBoxes.forEach(box => {
        box.textContent = letter;
        box.classList.add('revealed');
    });
    
    return found;
}