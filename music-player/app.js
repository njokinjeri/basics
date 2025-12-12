const audio = new Audio();
const audioCover = document.getElementById('audio-cover');
const audioTitle = document.getElementById('audio-title');
const audioArtist = document.getElementById('audio-artist');
const audioSlider = document.getElementById('audio-slider');
const currentAudioTime = document.querySelector('.current-time')
const totalDuration = document.querySelector('.total-duration');
const playPauseBtn = document.querySelector('.pause-play-control');
const playPauseIcon = document.querySelector('.play-pause-icon');
const prevTrack = document.querySelector('.prev-track');
const nextTrack = document.querySelector('.next-track');


const playlist = [
    {
        title: "Lost in the City Lights", 
        artist: "Cosmo Sheldrake",
        src: "./audio/lost-in-city-lights.mp3",
        cover: "./assets/cover-1.webp"
    },
    {
        title: "Forest Lullaby", 
        artist: "Lesfm",
        src: "./audio/forest-lullaby.mp3",
        cover: "./assets/cover-2.webp"
    }
];

let currentIndex = 0;

function loadTrack(index) {
    const track = playlist[index];
    audio.src = track.src;

    audioCover.src = track.cover;
    audioTitle.textContent = track.title;
    audioArtist.textContent = track.artist;
};

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes < 10 ? "0" + minutes : minutes}:${secs < 10 ? "0" + secs : secs} `
};

audio.addEventListener('loadedmetadata', () => {
    audioSlider.max = Math.floor(audio.duration);
    totalDuration.textContent = formatTime(audio.duration); 
});


function togglePlay() {
    if (audio.paused) {
        audio.play();
        playPauseIcon.src = './assets/Pause_fill.svg';
    } else {
        audio.pause();
        playPauseIcon.src = './assets/Play_fill.svg';
    }
};

playPauseBtn.addEventListener('click', togglePlay);


audio.addEventListener('timeupdate', () => {
    audioSlider.value = audio.currentTime;
    currentAudioTime.textContent = formatTime(audio.currentTime);

    const percent = (audio.currentTime / audio.duration) * 100;
    audioSlider.style.background = `linear-gradient(to right, var(--pink) ${percent}%, var(--white) ${percent}%)`;
    });

audioSlider.addEventListener('input', () => {
    audio.currentTime = audioSlider.value;
});

prevTrack.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    loadTrack(currentIndex);
    audio.play();
    playPauseIcon.src = "./assets/Pause_fill.svg";

});

nextTrack.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % playlist.length;
    loadTrack(currentIndex);
    audio.play();
    playPauseIcon.src = "./assets/Pause_fill.svg";
});

audio.addEventListener("ended", () => {
    currentIndex = (currentIndex + 1) % playlist.length;
    loadTrack(currentIndex);
    audio.play();
    playPauseIcon.src = "./assets/Pause_fill.svg";
});


loadTrack(currentIndex);