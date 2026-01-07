const goBackBtns = document.querySelectorAll('.go-back-btn');

export function showScreen(screenName) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    document.querySelector(`.${screenName}`).classList.add('active');
    localStorage.setItem('currentScreen', screenName);
}


export function initializeScreen() {
    const savedScreen = localStorage.getItem('currentScreen');

    if (savedScreen) {
        showScreen(savedScreen)
    } else {
        showScreen('start-state');
    }
}
