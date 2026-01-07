const goBackBtns = document.querySelectorAll('.go-back-btn');

export function showScreen(screenName) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    document.querySelector(`.${screenName}`).classList.add('active');
}

