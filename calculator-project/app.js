const toggleWrapper = document.querySelector('.toggle-wrapper');
const themeOptions = document.querySelectorAll('.theme-option');

const inputDisplay = document.getElementById('calculation-display');
const buttons = document.querySelectorAll('button');
const deleteBtn = document.querySelector('.delete-btn');
const resetBtn = document.querySelector('.reset-btn');
const equalBtn = document.querySelector('.equal-btn');

let currentInput = '';

function showResult() {
    inputDisplay.value = currentInput || '0';
}

function calculateResult() {
    try {
        const sanitizedInput = currentInput.replace(/x/g, '*');
        currentInput = String(eval(sanitizedInput));
    } catch(e) {
        currentInput = 'Error';
    }

    showResult();
}

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const number = button.getAttribute('data-element');
        const operator = button.getAttribute('data-operator');

        if (number !== null) {
            currentInput += number;
            showResult();
        } else if (operator !== null) {
            if (currentInput && !/[+\-*/]$/.test(currentInput)) {
                currentInput += operator;
                showResult();
            }
        } 
    });
});


deleteBtn.addEventListener('click', () => {
    currentInput = currentInput.slice(0, -1);
    showResult();
});

resetBtn.addEventListener('click', () => {
    currentInput = '';
    showResult();
});

equalBtn.addEventListener('click', calculateResult)

themeOptions.forEach(option => {
    option.addEventListener('click', (e) => {
        e.stopPropagation();
        const theme = option.dataset.theme;
        document.documentElement.setAttribute('data-theme', theme);
        toggleWrapper.className = `toggle-wrapper ${theme}`;
    });
});

toggleWrapper.addEventListener('click', (e) => {
    const rect = toggleWrapper.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const sectionWidth = rect.width / 3;

    let theme;
    if (clickX < sectionWidth) theme = 'theme-1';
    else if (clickX < sectionWidth * 2) theme = 'theme-2';
    else theme = 'theme-3';

    document.documentElement.setAttribute('data-theme', theme);
    toggleWrapper.className = `toggle-wrapper ${theme}`;
});

showResult();