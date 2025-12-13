const uploaderLogo = document.querySelector('.uploader-logo')
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = document.querySelector('.theme-icon');

const dragDropPlaceholder = document.getElementById('drag-drop-img');

const placeholderWrapper = document.querySelector('.placeholder-container');
const fileInput = document.getElementById('fileUpload');

const dragDropArea = document.getElementById('img-placeholder-section');
const imgOutputSection = document.getElementById('img-output-section');

const imageContainer = document.getElementById('image-container');
const imageOutput = document.getElementById('output');

const imageCtaBtn = document.querySelector('.image-cta');
const shareBtn = document.getElementById('share-btn');
const downloadBtn = document.getElementById('download-btn');

const loadingMessage = document.getElementById('loading-message');

function handleImageUpload(file) {
    if (!file || !file.type.startsWith('image/')) {
        alert('Only image files are allowed.');
        return;
    }

    loadingMessage.style.display = 'block';
    dragDropArea.style.display = 'none';
    imgOutputSection.style.display = 'none';
    imageCtaBtn.style.display = 'none';

    const reader = new FileReader();

    reader.onload = (e) => {
        setTimeout(() => {
            loadingMessage.style.display = 'none';

            imageOutput.src = e.target.result;
            imageOutput.style.display = 'block';

            imgOutputSection.style.display = 'block';
            imageContainer.style.display = 'flex';
            imageCtaBtn.style.display = 'flex';
        }, 2000); 
    };

    reader.onerror = (err) => {
        console.error('Error reading file:', err);
        alert('An error occurred while reading the file.');
        loadingMessage.style.display = 'none';
    };

    reader.readAsDataURL(file);
}


fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    handleImageUpload(file);
});


dragDropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dragDropArea.classList.add('dragover');
});

dragDropArea.addEventListener('dragleave', () => {
    dragDropArea.classList.remove('dragover');
});

dragDropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dragDropArea.classList.remove('dragover');

    const file = e.dataTransfer.files[0];
    handleImageUpload(file);
});

themeToggle.addEventListener('click', () =>  {
    const darkMode = document.body.classList.toggle('dark');

    if(darkMode) {
        themeIcon.src = './assets/Sun_fill.svg';
        uploaderLogo.src = './assets/logo__dark.svg';
    } else {
        themeIcon.src = './assets/Moon_fill.svg';
        uploaderLogo.src = './assets/logo.svg';
    }
});