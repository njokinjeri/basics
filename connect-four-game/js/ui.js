function updateBodyTheme(screenName) {
    const state = screenName.replace('-page', '');
    document.body.setAttribute('data-state', state);
}

export function showScreen(screenName) {

    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    document.querySelector(`.${screenName}`).classList.add('active');

    updateBodyTheme(screenName)

    history.pushState({ screen: screenName }, '', `#${screenName}`);
    localStorage.setItem('currentScreen', screenName);
}


window.addEventListener('popstate', (event) => {
    if (event.state && event.state.screen) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active')
        });

        updateBodyTheme(event.state.screen);

        document.querySelector(`.${event.state.screen}`).classList.add('active');
        localStorage.setItem('currentScreen', event.state.screen)
    }
});


export async function initializeScreen() {
    let savedScreen;

    if (sessionStorage.getItem('activeSession') === 'true') {
        savedScreen = localStorage.getItem('currentScreen') || 'start-page';
    } else {
        savedScreen = 'start-page';
        sessionStorage.setItem('activeSession', 'true');
    }


    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    document.querySelector(`.${savedScreen}`).classList.add('active');

    updateBodyTheme(savedScreen);

    history.replaceState({ screen: savedScreen }, '', `#${savedScreen}`);
}


export function resetScreenOnLogout() {
    localStorage.removeItem('currentScreen');
    sessionStorage.removeItem('activeSession');
}
