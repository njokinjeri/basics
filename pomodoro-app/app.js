const root = document.documentElement;

const modeButtons = document.querySelectorAll('.count-display-text');

const timerDisplay = document.getElementById('timer_countdown')
const countDownLoop = document.querySelector('.countdown-loop');
const startControl = document.getElementById('timer_control')
const restartIcon = document.getElementById('restart_icon');
const ring = document.querySelector('.ring');

const pomodoroInput = document.getElementById('pomodoro_custom_timer');
const shortBreakInput = document.getElementById('shortbreak_custom_timer');
const longBreakInput = document.getElementById('longbreak_custom_timer');

const fontOptions = document.querySelectorAll('.custom-font');
const colorOptions = document.querySelectorAll('.custom-color');
const applySettings = document.querySelector('.apply-settings');

const settingsModal = document.querySelector('.settings-icon');
const dialog = document.getElementById('dialog');
const closeDialogBtn = document.getElementById('settings_close_icon');

const timer_config_min = {
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15
}

let currentMode = 'pomodoro';
let timeRemaining = timer_config_min.pomodoro * 60;
let totalTime = timer_config_min.pomodoro * 60;
let timerInterval = null;
let isRunning = false;

pomodoroInput.value = timer_config_min.pomodoro;
shortBreakInput.value = timer_config_min.shortBreak;
longBreakInput.value = timer_config_min.longBreak;

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function getTimeSettings(mode) {
    const pomodoro = clamp(Number(pomodoroInput.value), 1, 90);
    const short = clamp(Number(shortBreakInput.value), 1, 30);
    const long = clamp(Number(longBreakInput.value), 1, 60);
    
    switch (mode) {
        case 'pomodoro': return pomodoro;
        case 'short': return short;
        case 'long': return long;
        default: return pomodoro;
    }
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function updateDisplay() {
    timerDisplay.textContent = formatTime(timeRemaining);
    updateProgressRing(timeRemaining, totalTime);
}

/*timer progress ring animation loop*/
const radius = 166;
const circumference = 2 * Math.PI * radius;
ring.style.strokeDasharray = circumference;
ring.style.strokeDashoffset = circumference; 
ring.style.transition = 'stroke-dashoffset 0.3s linear';

function updateProgressRing(timeRemaining, totalTime) {
    const progress = 1 - (timeRemaining / totalTime); 
    ring.style.strokeDashoffset = circumference * (1 - progress); 
}


function setTimerMode(mode) {

    document.querySelector('.active-timer')?.classList.remove('active-timer');
    document.querySelector(`[data-mode="${mode}"]`)?.classList.add('active-timer');

    currentMode = mode;
    const settings = getTimeSettings(mode);
    timeRemaining = settings * 60;
    totalTime = settings * 60;
    isRunning = false;

    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    startControl.textContent = 'START';
    updateDisplay();
}

function toggleTimer() {
    console.log('Button clicked! isRunning', isRunning)
    if (isRunning) {
        clearInterval(timerInterval);
        timerInterval = null;
        isRunning = false;
        startControl.textContent = 'START';
    } else {
        isRunning = true;
        startControl.textContent = 'PAUSE';

        timerInterval = setInterval(() => {
            if (timeRemaining > 0) {
                timeRemaining--;
                updateDisplay();
            } else {
                clearInterval(timerInterval);
                timerInterval = null;
                isRunning = false;
                startControl.textContent = 'START';

                if (currentMode !== 'pomodoro') {
                    setTimerMode('pomodoro');
                }
            } 
        }, 1000);
    }
}

function restartTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    isRunning = false;
    setTimerMode(currentMode);
}

modeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const mode = button.dataset.mode;
        document.querySelector('.active-timer')?.classList.remove('active-timer');
        button.classList.add('active-timer');
        setTimerMode(mode);
    });
});

startControl.addEventListener('click', toggleTimer)

restartIcon.addEventListener('click', restartTimer);


settingsModal.addEventListener('click', () => {
    dialog.showModal();
});

closeDialogBtn.addEventListener('click', () => {
    dialog.close();
});

/* font & color theme-switch */
const colorMap = {
    red: {
        base: '--red',
        hover: '--red-hover'
    },
    cyan: {
        base: '--cyan',
        hover: '--cyan-hover'
    },
    purple: {
        base: '--purple',
        hover: '--purple-hover'
    },
};

const fontMap = {
    'kumbh-sans': '--kumbh-sans',
    'roboto-slab': '--roboto-slab',
    'space-mono': '--space-mono',
}

let tempFont = 'kumbh-sans';
let tempColor = 'red';

fontOptions.forEach(element => {
    element.addEventListener('click', () => {
        tempFont = element.dataset.font;
        document.querySelector('.active-font')?.classList.remove('active-font');
        element.classList.add('active-font');
    });
});

colorOptions.forEach(element => {
    element.addEventListener('click', () => {
        tempColor = element.dataset.color;
        document.querySelector('.active-color')?.classList.remove('active-color');
        element.classList.add('active-color');
    });
});


applySettings.addEventListener('click', (e) => {
    e.preventDefault();

    timer_config_min.pomodoro = clamp(Number(pomodoroInput.value), 1, 90);
    timer_config_min.shortBreak = clamp(Number(shortBreakInput.value), 1, 30);
    timer_config_min.longBreak = clamp(Number(longBreakInput.value), 1, 60);
    

    root.style.setProperty('--theme-font', `var(${fontMap[tempFont]})`);

        const { base, hover } = colorMap[tempColor];
        root.style.setProperty('--theme-color', `var(${base})`);
        root.style.setProperty('--theme-color-hover', `var(${hover})`);

    setTimerMode(currentMode);
    dialog.close();
});



updateDisplay();