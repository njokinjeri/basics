const synth = window.speechSynthesis;
const speechInput = document.getElementById('speech-textarea');
const languageControl = document.getElementById('language-select');
const voiceOption = document.getElementById('voice-select');
const speedBtn = document.querySelectorAll('.speed-settings button');
const submitBtn = document.getElementById('text-to-speech-btn');
let voices = [];

function populateLanguages() {
    const langs = [...new Set(voices.map(v => v.lang))]; 
    languageControl.innerHTML = "";
    langs.forEach(lang => {
        const option = document.createElement("option");
        option.value = lang;
        option.textContent = lang;
        languageControl.appendChild(option);
    });
    if (langs.includes('en-US')) {
        languageControl.value = 'en-US';
    } else {
        languageControl.selectedIndex = 0; 
    }
}

function populateVoices(selectedLang) {
    voiceOption.innerHTML = "";
    const filteredVoices = voices.filter(v => v.lang === selectedLang);
    filteredVoices.forEach(voice => {
        const option = document.createElement("option");
        option.value = voice.name;
        option.textContent = voice.name;
        voiceOption.appendChild(option);
    });
    let defaultVoice = filteredVoices.find(v => v.default) || filteredVoices[0];
    if (selectedLang === 'en-US') {
        defaultVoice = filteredVoices.find(v => v.name.includes('Google US English')) || defaultVoice;
    }
    if (defaultVoice) voiceOption.value = defaultVoice.name;
}

function loadVoices() {
    voices = synth.getVoices();
    if (!voices.length) {
        synth.onvoiceschanged = loadVoices;
        return;
    }
    populateLanguages();
    populateVoices(languageControl.value);
}

languageControl.addEventListener("change", () => {
    populateVoices(languageControl.value);
});

let currentUtterance = null;
let isPaused = false;
let speechRate = 1;

let fullText = "";
let currentCharIndex = 0;
const isFirefox = /firefox/i.test(navigator.userAgent);


// TODO(Firefox): Rework pause/resume handling.
// Firefox does not reliably support speechSynthesis.pause()/resume().

// Issues to fix:
// 1. Pause restarts speech
// 2. Double press required 

submitBtn.addEventListener("click", () => {
    const text = speechInput.value.trim();
    if (!text) {  
        alert("Please enter some text to convert to speech.");
        return;
    }


    if (synth.speaking && isPaused) {
        if (isFirefox) {
            const remainingText = fullText.substring(currentCharIndex);
            synth.cancel();
            isPaused = false;
            
            currentUtterance = new SpeechSynthesisUtterance(remainingText);
            currentUtterance.rate = speechRate;
            
            const voice = voices.find(v => v.name === voiceOption.value);
            if (voice) currentUtterance.voice = voice;
            
            currentUtterance.onboundary = (event) => {
                if (!isPaused) {
                    currentCharIndex += event.charIndex;
                }
            };
            
            currentUtterance.onend = () => {
                isPaused = false;
                fullText = "";
                currentCharIndex = 0;
                submitBtn.textContent = "Speak";
            };
            
            synth.speak(currentUtterance);
            submitBtn.textContent = "Pause";
        } else {
            synth.resume();
            isPaused = false;
            submitBtn.textContent = "Pause";
        }
        return;
    }

    if (synth.speaking && !isPaused) {
        if (isFirefox) {
            synth.cancel();
            isPaused = true;
            submitBtn.textContent = "Resume";
        } else {
            synth.pause();
            isPaused = true;
            submitBtn.textContent = "Resume";
        }
        return;
    }

    synth.cancel();
    isPaused = false;
    fullText = text;
    currentCharIndex = 0;
    
    currentUtterance = new SpeechSynthesisUtterance(text);
    currentUtterance.rate = speechRate;
    
    const voice = voices.find(v => v.name === voiceOption.value);
    if (voice) currentUtterance.voice = voice;
    
    if (isFirefox) {
        currentUtterance.onboundary = (event) => {
            if (!isPaused) {
                currentCharIndex = event.charIndex;
            }
        };
    }
    
    currentUtterance.onend = () => {
        isPaused = false;
        fullText = "";
        currentCharIndex = 0;
        submitBtn.textContent = "Speak";
    };
    
    synth.speak(currentUtterance);
    submitBtn.textContent = "Pause";
});

speedBtn.forEach(btn => {
    btn.addEventListener("click", () => {
        speedBtn.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        speechRate = parseFloat(btn.dataset.speed);
        if (synth.speaking) {
            synth.cancel();
            isPaused = false;
            fullText = "";
            currentCharIndex = 0;
            submitBtn.textContent = "Speak";
        }
    });
});

window.addEventListener("beforeunload", () => synth.cancel());

document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        synth.cancel();
        isPaused = false;
        fullText = "";
        currentCharIndex = 0;
        submitBtn.textContent = "Speak";
    }
});

loadVoices();