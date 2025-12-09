const totalBill = document.getElementById('total-bill');
const customTip = document.getElementById('custom-tip-percent');
const peopleCount = document.getElementById('people-count');
const tipPerPerson = document.getElementById('tip-per-person');
const totalPerPerson = document.getElementById('total-per-person');
const resetBtn = document.getElementById('reset-btn');
const tipButtons = document.querySelectorAll('#tip-options button[data-tip]')

let selectedTipPercent = 0;

tipButtons.forEach(button => {
    button.addEventListener('click', () => {
        tipButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        customTip.value = '';

        selectedTipPercent = parseFloat(button.dataset.tip);

        calculateTip();
    });
});

customTip.addEventListener('input', () => {
    tipButtons.forEach(btn => btn.classList.remove('active'));
    customTip.classList.add('active');
    
    selectedTipPercent = parseFloat(customTip.value) || 0;

    calculateTip();
});

totalBill.addEventListener('input', calculateTip);

peopleCount.addEventListener('input', calculateTip);


function calculateTip () {
    const billAmount = parseFloat(totalBill.value) || 0;
    const numPeople = parseFloat(peopleCount.value) || 1;

    const tipTotal = billAmount * (selectedTipPercent / 100);

    const tipAmount = numPeople > 0 ? tipTotal / numPeople : 0;
    const totalAmount = numPeople > 0 ? (billAmount + tipTotal) / numPeople : 0;

    tipPerPerson.textContent = `$${tipAmount.toFixed(2)}`;
    totalPerPerson.textContent = `$${totalAmount.toFixed(2)}`;

    if (billAmount > 0 || selectedTipPercent > 0 || numPeople > 1) {
        resetBtn.disabled = false;
    }
}

resetBtn.addEventListener('click', (e) => {
    e.preventDefault();

    totalBill.value = '';
    customTip.value = ''
    peopleCount.value = '';

    selectedTipPercent = 0;

    tipButtons.forEach(btn => btn.classList.remove('active'));
    customTip.classList.remove('active');

    tipPerPerson.textContent = '$0.00';
    totalPerPerson.textContent = '$0.00';

    resetBtn.disabled = true;
});