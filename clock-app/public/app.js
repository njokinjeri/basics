const appQuotes = document.getElementById('quote');
const refreshQuote = document.getElementById('refresh-icon');
const greeting = document.getElementById('greeting');
const greetingIcon = document.getElementById('greeting-icon');
const greetingText = document.getElementById('greeting-text');
const time = document.getElementById('time');
const gmt = document.getElementById('gmt');
const userLocation = document.getElementById('user-location');
const locationStatus = document.getElementById('location-status');
const retryButton = document.getElementById('retry-location');
const article = document.querySelector('article');
const timeDisplay = document.querySelector('.time-display');
const moreBtn = document.querySelector(".more-btn");
const moreSection = document.querySelector(".more-section");
const btnText = document.getElementById('btn-toggle');
const arrowIcon = document.getElementById('more-icon')
const timezone = document.getElementById('timezone');
const dayOfYear = document.getElementById('dayOfYear');
const dayOfWeek = document.getElementById('dayOfWeek');
const weekNumber = document.getElementById('weekNumber');

const lightWallpapers = [
    'url("./wallpaper/day/frieren-1.webp")',
    'url("./wallpaper/day/frieren-2.webp")',
    'url("./wallpaper/day/frieren-3.webp")',
    'url("./wallpaper/day/frieren-4.webp")',
    'url("./wallpaper/day/frieren-5.webp")',
    'url("./wallpaper/day/frieren-6.webp")',
]

const darkWallpapers = [
    'url("./wallpaper/night/frieren-1.webp")',
    'url("./wallpaper/night/frieren-2.webp")',
    'url("./wallpaper/night/frieren-3.webp")',
    'url("./wallpaper/night/frieren-4.webp")',
    'url("./wallpaper/night/frieren-5.webp")',
]


function backgroundShowSlide() {
    const now = new Date();
    const hour = now.getHours();

    let currentLightWallpaper = Math.floor(Math.random() * lightWallpapers.length);
    let currentDarkWallpaper = Math.floor(Math.random() * darkWallpapers.length);

    switch(true) {
        case (hour >= 5 && hour < 12):
            document.body.style.backgroundImage = lightWallpapers[currentLightWallpaper];
        break;
        case (hour >= 12 && hour < 18):
            document.body.style.backgroundImage = lightWallpapers[currentLightWallpaper];
        break;
        case (hour >= 18 && hour < 21):
            document.body.style.backgroundImage = darkWallpapers[currentDarkWallpaper];
        break;
        default:
            document.body.style.backgroundImage = darkWallpapers[currentDarkWallpaper];
        break;
    }
}

const quotes = [ 
    {author: "Heiter", text: "Even the greatest heroes are forgotten someday."},
    {author: "Eisen", text: "Being afraid isn’t a bad thing. It’s my fear that’s brought me this far."},
    {author: "Frieren", text: "The greatest joy of magic lies in searching for it."},
    {author: "Wirbel", text: "Death isn’t the only goodbye in this life."},
    {author: "Eisen", text: "I’ll tell you the secret to fighting strong enemies. It’s easy, keep getting up and attack them with your moves continuously."},
]

let currentQuote = Math.floor(Math.random() * quotes.length);

function displayQuotes() {
    const quote = quotes[currentQuote];
    appQuotes.innerHTML = `
    <p class="quote-text">${quote.text}</p>
    <p class="quote-author"><strong> ${quote.author}</strong></p>
    `;

    currentQuote = (currentQuote + 1) % quotes.length;
}

refreshQuote.addEventListener('click', displayQuotes);


function updateGreeting() {
    const now = new Date();
    const hour = now.getHours();

    switch (true) {
        case (hour >= 5 && hour < 12):
            greetingText.textContent = "Good Morning".toUpperCase();
            greetingIcon.src = "./assets/icon-sun.svg";
        break;
        case (hour >= 12 && hour < 18):
            greetingText.textContent = "Good Afternoon".toUpperCase();
            greetingIcon.src = "./assets/icon-sun.svg";
        break;
        case (hour >= 18 && hour < 21):
            greetingText.textContent = "Good Evening".toUpperCase();
            greetingIcon.src = "./assets/icon-moon.svg";
        break;
        default:
            greetingText.textContent = "Good night".toUpperCase();
            greetingIcon.src = "./assets/icon-moon.svg"
        break;
    }
}

function getUserTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');

    const weekday = now.getDay();

    const getDayOfYear = (date) => {

        const diff = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) 
                    - Date.UTC(date.getFullYear(), 0, 0);

        return diff / ( 24 * 60 * 60 * 1000);
    }

    const getWeekNumber = (date) => {
        const firstDay = new Date(date.getFullYear(), 0, 1);
        const days = Math.floor((date - firstDay) / (24 * 60 * 60 * 1000))
        return Math.ceil((days + firstDay.getDay() + 1) / 7);
    }


    const formattedTime = `${hours}:${minutes}`
    time.textContent = formattedTime;
    dayOfYear.textContent = getDayOfYear(now);
    dayOfWeek.textContent = weekday;
    weekNumber.textContent = getWeekNumber(now);
}

function getUserTimeZone() {
    const now = new Date();
    
    const dateFormat = new Intl.DateTimeFormat("en-US", {
        timeZoneName: "short"
    });

    const ianaZoneValue = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const parts = dateFormat.formatToParts(now);
    const gmtValue = parts.find(part => part.type === 'timeZoneName').value;

    gmt.textContent = gmtValue;
    timezone.textContent = ianaZoneValue;
}

async function getUserLocation() {
    if (!navigator.geolocation) {
        locationStatus.textContent = 'Geolocation is not supported by your browser.';
        return;
    }

    userLocation.textContent = '';
    locationStatus.textContent = '';
    retryButton.style.display = 'none';

    try {
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const { latitude, longitude } = position.coords;

        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const endpoint = isLocal ? '/api/geocode' : '/.netlify/functions/geocode';

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ latitude, longitude })
        });

        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            userLocation.textContent = 'Location not found';
            return;
        }

        const components = data.results[0].components;
        const city = components.city || components.town || components.village || 'Unknown';
        const country = components.country || 'Unknown';

        userLocation.textContent = `${city}, ${country}`;

    } catch (error) {
        console.error('Location error:', error);
        locationStatus.textContent = 'Location access denied. Please enable location in your browser settings.';
        retryButton.style.display = 'inline-block';
    }
}

function updateThemeByTime() {
    const hour = new Date().getHours();
    const isDay = hour >= 6 && hour < 18;

    if(isDay) {
        article.classList.add('dark-theme');
        article.classList.remove('light-theme');
        timeDisplay.classList.add('dark-theme');
        timeDisplay.classList.remove('light-theme');
        moreSection.classList.add('light-theme');
        moreSection.classList.remove('dark-theme');
    } else {
        article.classList.add('light-theme');
        article.classList.remove('dark-theme');
        timeDisplay.classList.add('light-theme');
        timeDisplay.classList.remove('dark-theme');
        moreSection.classList.add('dark-theme');
        moreSection.classList.remove('light-theme');
    }
}

retryButton.addEventListener('click', getUserLocation);

moreBtn.addEventListener('click', () => {
    const isOpen = moreSection.classList.toggle("show");

    btnText.textContent = isOpen ? "LESS" : "MORE";
    arrowIcon.style.transform = isOpen ? "rotate(180deg)" : "rotate(0deg)"

    article.style.display = isOpen ? "none" : "flex";
    timeDisplay.classList.toggle("move-top", isOpen);
});

backgroundShowSlide();
setInterval(backgroundShowSlide, 300000);

updateThemeByTime()
setInterval(updateThemeByTime, 60 * 60 * 1000);

displayQuotes()
setInterval(displayQuotes, 8000);

updateGreeting();
setInterval(updateGreeting, 60000);

getUserTimeZone();
getUserTime();
setInterval(getUserTime, 1000);

getUserLocation();
