let inputSlider = document.getElementById('pricingRange');
let viewCount = document.getElementById('viewCount');
let pricing = document.getElementById('pricing');
let billingToggle = document.getElementById('toggle-input');

const pageViews = {
    10: "10k",
    20: "50k",
    30: "75k",
    40: "100k",
    50: "150k",
    60: "200k",
    70: "300k",
    80: "500k",
    90: "750k",
    100: "1M",
};

const updateSliderBackground = () => {
    const min = inputSlider.min;
    const max = inputSlider.max;
    const val = inputSlider.value;
    const percentage = ((val - min) / (max - min)) * 100;

    inputSlider.style.setProperty ('--slider-percentage', `${percentage}%`);
}

const updateValues = () => {
    const val = Number(inputSlider.value);

    viewCount.textContent = `${pageViews[val]} PAGEVIEWS`

    let price = val * 0.4;

    if (billingToggle.checked) {
        price = price * 0.75;
    }

    pricing.innerHTML = `$${price.toFixed(2)} <span>/month</span>`;
}

inputSlider.addEventListener('input', () => {
    updateSliderBackground();
    updateValues();
});

billingToggle.addEventListener('change', updateValues);

updateSliderBackground();
updateValues();
