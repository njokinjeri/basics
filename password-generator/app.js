const passwordDisplay = document.getElementById('password-display');
const charRangeLength = document.getElementById('character-range-length');
const charRangeSlider = document.getElementById('character-range-slider');
const copyPassword = document.querySelector('.copy-icon');


const upperCaseInput = document.getElementById('upper-case-char');
const lowerCaseInput = document.getElementById('lower-case-char');
const NumberInput = document.getElementById('number-char');
const symbolInput = document.getElementById('symbol-char');

const strengthBars = document.querySelectorAll('.strength-bar');
const strengthLabel = document.getElementById('strength-label');
const generateBtn = document.querySelector('button');

passwordDisplay.value = '';

function generatePassword(charLength) {
    const types = {
        upperCase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        lowerCase: "abcdefghijklmnopqrstuvwxyz",
        numbers: "0123456789",
        symbols: "!@#$%^&*()_+~`|}{[]:;?><,./-="
    }

    let characters = '';
    if(upperCaseInput.checked) characters += types.upperCase;
    if(lowerCaseInput.checked) characters += types.lowerCase;
    if(NumberInput.checked) characters += types.numbers;
    if(symbolInput.checked) characters += types.symbols;


    if (!characters) {
        alert("Please select at least one character type.");
        return;
    }

    let password = '';
    for (let i = 0; i < charLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters[randomIndex];
    }

    password = password.split('').sort(() => Math.random() - 0.5).join('');

    passwordDisplay.value = password;
    return password;
}

function checkPasswordStrength(password) {

    let length = password.length;

    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);

    const charDiversity = [hasLower, hasUpper, hasNumber, hasSymbol].filter(Boolean).length;

    let barsToFill = 1;
    let color = 'var(--sunset-crimson)';
    let label = 'TOO WEAK';

    if (length >= 16 && charDiversity === 4) {
        barsToFill = 4;
        color = 'var(--electric-mint)';
        label = 'STRONG';
    } else if (length >= 12 && charDiversity >= 3) {
        barsToFill = 3;
        color = 'var(--golden-sunbeam)';
        label = 'MEDIUM';
    } else if (length >= 6 && charDiversity >= 2) {
        barsToFill = 2;
        color = 'var(--tangerine-dream)';
        label = 'WEAK';
    }

    strengthBars.forEach((bar, index) => {
        if (index < barsToFill) {
            bar.classList.add('filled');
            bar.style.backgroundColor = color;
        } else {
            bar.classList.remove('filled');
            bar.style.backgroundColor = 'transparent';
        }
    });

    strengthLabel.textContent = label;
    strengthLabel.style.color = color;
}

async function copyToClipboard() {
    let copyPassword = passwordDisplay.value;

    if(!copyPassword) {
        alert("No password to copy!");
            return;
    }

    try {
        await navigator.clipboard.writeText(copyPassword);

        const wrapper = passwordDisplay.parentElement;
        const tooltip = document.createElement('div')
        tooltip.textContent = "Copied"
        tooltip.className = "tooltip";
        wrapper.appendChild(tooltip);

        setTimeout(() => tooltip.remove(), 1000);

    } catch (err) {
        console.error('Failed to copy password', err);
        alert("Failed to copy password");
    }
}

function updateSliderFill() {
    const value = charRangeSlider.value;
    const max = charRangeSlider.max;

    charRangeLength.textContent = value;

    const percentage = (value / max) * 100;

    charRangeSlider.style.background = `linear-gradient(
        to right,
        var(--electric-mint) 0%,
        var(--electric-mint) ${percentage}%,
        var(--abyss-black) ${percentage}%,
        var(--abyss-black) 0%
    )`;
}

copyPassword.addEventListener('click', copyToClipboard);

updateSliderFill();

charRangeSlider.addEventListener('input', updateSliderFill);

generateBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const password = generatePassword(charRangeSlider.value);
    if (password) checkPasswordStrength(password);
});

