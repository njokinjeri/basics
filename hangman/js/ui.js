export function showScreen(screenName) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    document.querySelector(`.${screenName}`).classList.add('active');

    history.pushState({ screen: screenName }, '', `#${screenName}`);
    localStorage.setItem('currentScreen', screenName);
}

window.addEventListener('popstate', (event) => {
    if (event.state && event.state.screen) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active')
        });

        document.querySelector(`.${event.state.screen}`).classList.add('active');
        localStorage.setItem('currentScreen', event.state.screen)
    }
})


export function initializeScreen() {
    const savedScreen = localStorage.getItem('currentScreen') || 'start-state';

    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.querySelector(`.${savedScreen}`).classList.add('active');
    
    history.replaceState({ screen: savedScreen }, '', `#${savedScreen}`);
}
