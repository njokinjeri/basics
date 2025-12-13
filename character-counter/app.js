const headerLogo = document.querySelector('.header-logo')
const themeToggle = document.getElementById('theme-icon');
const themeIcon = document.getElementById('theme-icon');

const textInput = document.getElementById('text-input');
const excludeSpaces = document.getElementById('exclude-spaces');

const characterLimit = document.getElementById('character-limit');
const limitWarning = document.getElementById('limit-warning');
const characterCustomLimit = document.getElementById('character-custom-limit');
const limitValue = document.getElementById('limit-value');
const limitWrapper = document.querySelector('.limit-wrapper');
const readingTime = document.getElementById('reading-time');

const characterCountDisplay = document.getElementById('character-count');
const countText = document.getElementById('count-text');
const wordCountDisplay = document.getElementById('word-count');
const sentenceCountDisplay = document.getElementById('sentence-count');

const letterDensity = document.getElementById('letter-density');
const defaultText = document.getElementById('default-text');


function handleCharacterCount(str) {
    let charCount = 0;
    if (excludeSpaces.checked) {
        charCount = str.replace(/\s/g, '').length;
        countText.textContent = `Total Characters (no space)`;
    } else {
        charCount = str.length;
        countText.textContent = `Total Characters`;
    }
    characterCountDisplay.textContent = charCount;
    return charCount;
};


function handleWordCount(text) {
    const trimmed = text.trim();
    const wordCount = trimmed === '' ? 0 : trimmed.split(/\s+/).length;
    wordCountDisplay.textContent = wordCount;
}


function handleSentenceCount(text) {
    const regex = /[.!?](\s|$)/g;
    const matches = text.match(regex);
    const sentenceCount = matches ? matches.length : 0;

    sentenceCountDisplay.textContent = sentenceCount;
};


function checkCharacterLimit() {
    const text = textInput.value;
    const isLimitEnabled = characterLimit.checked;
    const limitAmount = parseInt(characterCustomLimit.value) || 0;

    const charCount = handleCharacterCount(text);

    if (isLimitEnabled && limitAmount > 0 && charCount > limitAmount) {
        limitWrapper.classList.add('show');
        limitValue.textContent = limitAmount;
        limitWarning.classList.remove('hidden');
        textInput.classList.add('limit-exceeded');
    } else {
        limitWrapper.classList.remove('show');
        limitWarning.classList.add('hidden');
        textInput.classList.remove('limit-exceeded');
    }
}


function adjustInputWidth() {
    const value = characterCustomLimit.value;
    const length = value.length || 1;
    characterCustomLimit.style.width = `${Math.max(length * 12 + 20, 60)}px`;
}


function updateReadingTime(text) {
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    const wordsPerMinute = 200;
    const time = Math.ceil(words / wordsPerMinute);
    readingTime.textContent = time > 0 ? time : '<1';
}


const INITIAL_DISPLAY = 5; 

function updateLetterDensity(text) {
    const letters = text.toUpperCase().replace(/[^A-Z]/g, '');
    const totalLetters = letters.length;

    const counts = {};
    for (let char of letters) {
        counts[char] = (counts[char] || 0) + 1;
    }
    const sortedLetters = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
    if (totalLetters === 0) {
        letterDensity.innerHTML = '<p id="default-text">No characters found. Start typing to see letter density.</p>';
        return;
    }
    
    const showAll = sortedLetters.length <= INITIAL_DISPLAY;
    
    let html = '<ul class="letter-list">';
    sortedLetters.forEach((char, index) => {
        const count = counts[char];
        const percentage = ((count / totalLetters) * 100).toFixed(2);
        const isHidden = !showAll && index >= INITIAL_DISPLAY;
        html += `
            <li class="letter-item${isHidden ? ' hidden-item' : ''}">
                <span class="letter">${char}</span>
                <div class="letter-bar-wrapper">
                    <div class="letter-bar" style="width: ${percentage}%;"></div>
                </div>
                <span class="letter-percentage">${count} (${percentage}%)</span>
            </li>
        `;
    });
    html += '</ul>';
    
    if (!showAll) {
        html += `
            <p class="toggle-text" onclick="toggleLetterList(this)" data-expanded="false">
                See More (${sortedLetters.length - INITIAL_DISPLAY} more)
                <span class="arrow">▼</span>
            </p>
        `;
    };
    
    letterDensity.innerHTML = html;
};


function toggleLetterList(toggleText) {
    const allItems = document.querySelectorAll('.letter-item');
    const isExpanded = toggleText.dataset.expanded === 'true';
    
    if (isExpanded) {
        allItems.forEach((item, index) => {
            if (index >= INITIAL_DISPLAY) {
                item.classList.add('hidden-item');
            }
        });
        const hiddenCount = allItems.length - INITIAL_DISPLAY;
        toggleText.innerHTML = `See More (${hiddenCount} more) <span class="arrow">▼</span>`;
        toggleText.dataset.expanded = 'false';
    } else {
        allItems.forEach(item => {
            item.classList.remove('hidden-item');
        });
        toggleText.innerHTML = `See Less <span class="arrow">▲</span>`;
        toggleText.dataset.expanded = 'true';
    };
};

textInput.addEventListener('input', () => { 
    const text = textInput.value;
    handleCharacterCount(text);
    handleWordCount(text);
    handleSentenceCount(text);
    checkCharacterLimit();
    updateReadingTime(text)
    updateLetterDensity(text);
});

excludeSpaces.addEventListener('change', () => {
    handleCharacterCount(textInput.value);
    checkCharacterLimit();
});

characterLimit.addEventListener('change', function() {
    if (this.checked) {
        characterCustomLimit.style.display = 'inline-block';
        characterCustomLimit.disabled = false;
        characterCustomLimit.focus();
    } else {
        characterCustomLimit.style.display = 'none';
        characterCustomLimit.disabled = true;
        limitWrapper.classList.remove('show');
        limitWarning.classList.add('hidden');
        textInput.classList.remove('limit-exceeded');
    }
    checkCharacterLimit();
});

characterCustomLimit.addEventListener('input', function() {
    this.value = this.value.replace(/[^0-9]/g, '');
    
    let value = parseInt(this.value) || 0;
    
    if (value > 1000000) {
        this.value = 1000000;
    }
    
    adjustInputWidth();
    checkCharacterLimit();
});

themeToggle.addEventListener('click', () => {
    const lightMode = document.body.classList.toggle('light');

    if(lightMode) {
        themeIcon.src = './assets/icon-moon.svg';
        headerLogo.src = './assets/logo-light-theme.svg';
    } else {
        themeIcon.src = './assets/icon-sun.svg';
        headerLogo.src = './assets/logo-dark-theme.svg';
    }
});

characterCustomLimit.disabled = true;
characterCustomLimit.style.display = 'none';
adjustInputWidth();