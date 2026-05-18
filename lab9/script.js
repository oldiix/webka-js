'use strict';

const CITIES = {
    ukraine: ['Київ', 'Львів', 'Одеса', 'Харків', 'Дніпро', 'Чернівці'],
    poland: ['Варшава', 'Краків', 'Вроцлав', 'Гданськ'],
    germany: ['Берлін', 'Мюнхен', 'Гамбург', 'Франкфурт'],
    usa: ['Нью-Йорк', 'Лос-Анджелес', 'Чикаго', 'Х’юстон']
};

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const REGEX_PHONE = /^\+380\d{9}$/;

const eyeOpenSVG = `<svg class="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
const eyeClosedSVG = `<svg class="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path><line x1="2" y1="2" x2="22" y2="22"></line></svg>`;

function validateName(value) {
    if (!value.trim()) return {valid: false, message: "Поле обов'язкове"};
    if (value.trim().length < 3) return {valid: false, message: 'Мінімум 3 символи'};
    if (value.trim().length > 15) return {valid: false, message: 'Максимум 15 символів'};
    return {valid: true, message: ''};
}

function validateEmail(value) {
    if (!value.trim()) return {valid: false, message: "Поле обов'язкове"};
    if (!REGEX_EMAIL.test(value)) return {valid: false, message: 'Невалідний email'};
    return {valid: true, message: ''};
}

function validatePassword(value) {
    if (!value) return {valid: false, message: "Поле обов'язкове"};
    if (value.length < 6) return {valid: false, message: 'Мінімум 6 символів'};
    return {valid: true, message: ''};
}

function validateConfirm(value, password) {
    if (!value) return {valid: false, message: "Поле обов'язкове"};
    if (value !== password) return {valid: false, message: 'Паролі не збігаються'};
    return {valid: true, message: ''};
}

function validatePhone(value) {
    if (!value.trim()) return {valid: false, message: "Поле обов'язкове"};
    if (!REGEX_PHONE.test(value)) return {valid: false, message: 'Формат: +380XXXXXXXXX'};
    return {valid: true, message: ''};
}

function validateBirth(value) {
    if (!value) return {valid: false, message: "Поле обов'язкове"};

    const birth = new Date(value);
    const today = new Date();

    if (birth > today) return {valid: false, message: 'Дата не може бути у майбутньому'};

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    if (age < 12) return {valid: false, message: 'Реєстрація доступна з 12 років'};
    return {valid: true, message: ''};
}

function validateRequired(value, message) {
    if (!value) return {valid: false, message: message};
    return {valid: true, message: ''};
}

function setFieldState(input, errorEl, result) {
    if (result.valid) {
        input.classList.add('valid');
        input.classList.remove('invalid');
    } else {
        input.classList.add('invalid');
        input.classList.remove('valid');
    }
    if (errorEl) errorEl.textContent = result.message;
}

function clearFieldState(input, errorEl) {
    input.classList.remove('valid', 'invalid');
    if (errorEl) errorEl.textContent = '';
}

const tabsEl = document.querySelector('.tabs');
const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.form-panel');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = tab.dataset.tab;

        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        panels.forEach(p => p.classList.remove('active'));
        document.getElementById('panel-' + target).classList.add('active');

        tabsEl.dataset.active = target;
    });
});

const eyeButtons = document.querySelectorAll('.eye-btn');

eyeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const input = document.getElementById(btn.dataset.target);
        if (input.type === 'password') {
            input.type = 'text';
            btn.innerHTML = eyeClosedSVG;
        } else {
            input.type = 'password';
            btn.innerHTML = eyeOpenSVG;
        }
    });
});

const countryEl = document.getElementById('reg-country');
const cityEl = document.getElementById('reg-city');

countryEl.addEventListener('change', () => {
    const country = countryEl.value;
    cityEl.innerHTML = '';

    if (!country) {
        cityEl.disabled = true;
        cityEl.innerHTML = '<option value="">— Спочатку оберіть країну —</option>';
        return;
    }

    cityEl.disabled = false;
    cityEl.innerHTML = '<option value="">— Оберіть місто —</option>';

    const cities = CITIES[country];
    for (let i = 0; i < cities.length; i++) {
        const option = document.createElement('option');
        option.value = cities[i];
        option.textContent = cities[i];
        cityEl.appendChild(option);
    }
});

const formRegister = document.getElementById('form-register');

function validateRegisterForm() {
    let isValid = true;

    const firstname = document.getElementById('reg-firstname');
    const lastname = document.getElementById('reg-lastname');
    const email = document.getElementById('reg-email');
    const password = document.getElementById('reg-password');
    const confirm = document.getElementById('reg-confirm');
    const phone = document.getElementById('reg-phone');
    const birth = document.getElementById('reg-birth');
    const country = document.getElementById('reg-country');
    const city = document.getElementById('reg-city');

    const firstnameResult = validateName(firstname.value);
    setFieldState(firstname, document.getElementById('err-firstname'), firstnameResult);
    if (!firstnameResult.valid) isValid = false;

    const lastnameResult = validateName(lastname.value);
    setFieldState(lastname, document.getElementById('err-lastname'), lastnameResult);
    if (!lastnameResult.valid) isValid = false;

    const emailResult = validateEmail(email.value);
    setFieldState(email, document.getElementById('err-email'), emailResult);
    if (!emailResult.valid) isValid = false;

    const passwordResult = validatePassword(password.value);
    setFieldState(password, document.getElementById('err-password'), passwordResult);
    if (!passwordResult.valid) isValid = false;

    const confirmResult = validateConfirm(confirm.value, password.value);
    setFieldState(confirm, document.getElementById('err-confirm'), confirmResult);
    if (!confirmResult.valid) isValid = false;

    const phoneResult = validatePhone(phone.value);
    setFieldState(phone, document.getElementById('err-phone'), phoneResult);
    if (!phoneResult.valid) isValid = false;

    const birthResult = validateBirth(birth.value);
    setFieldState(birth, document.getElementById('err-birth'), birthResult);
    if (!birthResult.valid) isValid = false;

    const countryResult = validateRequired(country.value, 'Оберіть країну');
    setFieldState(country, document.getElementById('err-country'), countryResult);
    if (!countryResult.valid) isValid = false;

    const cityResult = validateRequired(city.value, 'Оберіть місто');
    setFieldState(city, document.getElementById('err-city'), cityResult);
    if (!cityResult.valid) isValid = false;

    const sexInputs = document.querySelectorAll('input[name="sex"]');
    let sexVal = '';
    sexInputs.forEach(radio => {
        if (radio.checked) sexVal = radio.value;
    });
    const sexResult = validateRequired(sexVal, 'Оберіть стать');
    document.getElementById('err-sex').textContent = sexResult.message;
    if (!sexResult.valid) isValid = false;

    return isValid;
}

const formLogin = document.getElementById('form-login');

function validateLoginForm() {
    let isValid = true;

    const username = document.getElementById('login-username');
    const password = document.getElementById('login-password');

    const usernameResult = validateRequired(username.value, "Поле обов'язкове");
    setFieldState(username, document.getElementById('err-username'), usernameResult);
    if (!usernameResult.valid) isValid = false;

    const passwordResult = validatePassword(password.value);
    setFieldState(password, document.getElementById('err-login-password'), passwordResult);
    if (!passwordResult.valid) isValid = false;

    return isValid;
}

formRegister.addEventListener('submit', event => {
    event.preventDefault();

    if (!validateRegisterForm()) return;

    const formData = new FormData(formRegister);

    console.log('Дані реєстрації:');
    for (const [key, value] of formData.entries()) {
        console.log('  ' + key + ': ' + value);
    }

    const successEl = document.getElementById('success-register');
    successEl.style.display = 'block';

    formRegister.reset();
    formRegister.querySelectorAll('input, select').forEach(el => {
        clearFieldState(el, null);
    });
    formRegister.querySelectorAll('.error-msg').forEach(el => {
        el.textContent = '';
    });
    cityEl.innerHTML = '<option value="">— Спочатку оберіть країну —</option>';
    cityEl.disabled = true;

    setTimeout(() => {
        successEl.style.display = 'none';
    }, 4000);
});

formLogin.addEventListener('submit', event => {
    event.preventDefault();

    if (!validateLoginForm()) return;

    const formData = new FormData(formLogin);

    console.log('Дані входу:');
    for (const [key, value] of formData.entries()) {
        console.log('  ' + key + ': ' + value);
    }

    const successEl = document.getElementById('success-login');
    successEl.style.display = 'block';

    formLogin.reset();
    formLogin.querySelectorAll('input').forEach(el => {
        clearFieldState(el, null);
    });
    formLogin.querySelectorAll('.error-msg').forEach(el => {
        el.textContent = '';
    });

    setTimeout(() => {
        successEl.style.display = 'none';
    }, 3000);
});