const forms = {
  cardForm: document.getElementById('card-form'),
  successForm: document.getElementById('success-form')
};

const displays = {
  number: document.getElementById('display-number'),
  name: document.getElementById('display-name'),
  month: document.getElementById('display-month'),
  year: document.getElementById('display-year'),
  cvc: document.getElementById('display-cvc')
};

const inputs = {
  number: document.getElementById('cnumber'),
  name: document.getElementById('cname'),
  month: document.getElementById('exp-month'),
  year: document.getElementById('exp-year'),
  cvc: document.getElementById('cvc-details')
};

const restrictToDigits = (input, display, maxLength, defaultValue) => {
  input.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    e.target.value = value;
    display.textContent = value.slice(0, maxLength) || defaultValue;
  });
};

const resetDisplays = () => {
  displays.number.textContent = '0000 0000 0000 0000';
  displays.name.textContent = 'JANE APPLESEED';
  displays.month.textContent = '00';
  displays.year.textContent = '00';
  displays.cvc.textContent = '000';
};

inputs.number.addEventListener('input', (e) => {
  const value = e.target.value.replace(/\D/g, '').slice(0, 16);
  const formatted = value.replace(/(.{4})/g, '$1 ').trim();
  
  e.target.value = formatted;
  
  const display = (value + '0000000000000000').slice(0, 16);
  displays.number.textContent = display.replace(/(.{4})/g, '$1 ').trim();
});

inputs.name.addEventListener('input', () => {
  displays.name.textContent = inputs.name.value.toUpperCase() || "JANE APPLESEED";
});

restrictToDigits(inputs.month, displays.month, 2, '00');
restrictToDigits(inputs.year, displays.year, 2, '00');
restrictToDigits(inputs.cvc, displays.cvc, 3, '000');

forms.cardForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  forms.cardForm.style.display = 'none';
  forms.successForm.style.display = 'flex';
});

forms.successForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  forms.cardForm.reset();
  forms.successForm.style.display = 'none';
  
  resetDisplays();
  
  forms.cardForm.style.display = 'flex'; 
  forms.successForm.reset();
});