'use strict';

const API_URL = 'https://randomuser.me/api/?results=100&seed=lab10&nat=us,gb,fr,de,es,ua';
const PER_PAGE = 30;
const DEBOUNCE_DELAY = 300;
const STORAGE_USER = 'lab10_currentUser';
const STORAGE_USERS = 'lab10_users';
const STORAGE_FAVORITES = 'lab10_favorites';

const state = {
    allUsers: [],
    filteredUsers: [],
    currentPage: 1,
    favorites: [],
    filters: {
        search: '',
        gender: '',
        ageMin: '',
        ageMax: ''
    },
    sort: ''
};

function debounce(callback, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => callback(...args), delay);
    };
}

function loadFromStorage(key, defaultValue) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch {
        return defaultValue;
    }
}

function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function show(el) {
    el.classList.remove('hidden');
}

function hide(el) {
    el.classList.add('hidden');
}

function getCurrentUser() {
    return loadFromStorage(STORAGE_USER, null);
}

function setCurrentUser(user) {
    saveToStorage(STORAGE_USER, user);
}

function logout() {
    localStorage.removeItem(STORAGE_USER);
    showLoginView();
}

function findRegistered(username) {
    const users = loadFromStorage(STORAGE_USERS, []);
    return users.find(u => u.username === username);
}

function registerUser(username, password) {
    const users = loadFromStorage(STORAGE_USERS, []);
    users.push({username, password});
    saveToStorage(STORAGE_USERS, users);
}

function showLoginView() {
    show(document.getElementById('login-view'));
    hide(document.getElementById('app-view'));
}

function showAppView() {
    hide(document.getElementById('login-view'));
    show(document.getElementById('app-view'));

    const user = getCurrentUser();
    if (user) {
        document.getElementById('user-greeting').textContent = 'Привіт, ' + user.username + '!';
    }
}

function validateField(input, errorEl, isValid, message) {
    if (isValid) {
        input.classList.remove('invalid');
        errorEl.textContent = '';
    } else {
        input.classList.add('invalid');
        errorEl.textContent = message;
    }
    return isValid;
}

//  ТАБИ LOGIN/REGISTER
const tabsContainer = document.querySelector('.tabs');
const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.form-panel');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        panels.forEach(p => p.classList.remove('active'));
        document.getElementById('panel-' + target).classList.add('active');
        tabsContainer.dataset.active = target;
    });
});

//  REGISTER + LOGIN ФОРМИ
document.getElementById('form-register').addEventListener('submit', event => {
    event.preventDefault();

    const username = document.getElementById('reg-username');
    const password = document.getElementById('reg-password');

    const validUsername = validateField(
        username,
        document.getElementById('err-reg-username'),
        username.value.trim().length >= 3,
        'Мінімум 3 символи'
    );
    const validPassword = validateField(
        password,
        document.getElementById('err-reg-password'),
        password.value.length >= 6,
        'Мінімум 6 символів'
    );

    if (!validUsername || !validPassword) return;

    if (findRegistered(username.value.trim())) {
        validateField(username, document.getElementById('err-reg-username'),
            false, 'Цей username вже зайнятий');
        return;
    }

    registerUser(username.value.trim(), password.value);
    setCurrentUser({username: username.value.trim()});
    event.target.reset();
    startApp();
});

document.getElementById('form-login').addEventListener('submit', event => {
    event.preventDefault();

    const username = document.getElementById('login-username');
    const password = document.getElementById('login-password');

    const validUsername = validateField(
        username,
        document.getElementById('err-login-username'),
        username.value.trim().length > 0,
        "Поле обов'язкове"
    );
    const validPassword = validateField(
        password,
        document.getElementById('err-login-password'),
        password.value.length >= 6,
        'Мінімум 6 символів'
    );

    if (!validUsername || !validPassword) return;

    const registered = findRegistered(username.value.trim());
    if (!registered || registered.password !== password.value) {
        validateField(password, document.getElementById('err-login-password'),
            false, 'Невірний логін або пароль');
        return;
    }

    setCurrentUser({username: registered.username});
    event.target.reset();
    startApp();
});

//  FETCH API
async function fetchUsers() {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error('Сервер повернув статус ' + response.status);
    }
    const data = await response.json();
    return data.results;
}

//  ОБРАНІ
function loadFavorites() {
    state.favorites = loadFromStorage(STORAGE_FAVORITES, []);
}

function isFavorite(userId) {
    return state.favorites.includes(userId);
}

function toggleFavorite(userId) {
    if (isFavorite(userId)) {
        state.favorites = state.favorites.filter(id => id !== userId);
    } else {
        state.favorites = [...state.favorites, userId];
    }
    saveToStorage(STORAGE_FAVORITES, state.favorites);
    document.getElementById('fav-count').textContent = state.favorites.length;
}


//  ФІЛЬТРАЦІЯ + СОРТУВАННЯ (pure functions)

function applyFilters(users, filters) {
    return users.filter(user => {
        if (filters.search) {
            const query = filters.search.toLowerCase();
            const fullName = (user.name.first + ' ' + user.name.last).toLowerCase();
            if (!fullName.includes(query) && !user.email.toLowerCase().includes(query)) {
                return false;
            }
        }
        if (filters.gender && user.gender !== filters.gender) return false;
        if (filters.ageMin && user.dob.age < Number(filters.ageMin)) return false;
        if (filters.ageMax && user.dob.age > Number(filters.ageMax)) return false;
        return true;
    });
}

function applySort(users, sortValue) {
    if (!sortValue) return users;

    const sorted = [...users];
    const [field, direction] = sortValue.split('-');
    const dir = direction === 'asc' ? 1 : -1;

    sorted.sort((a, b) => {
        let valA, valB;
        if (field === 'name') {
            valA = a.name.first.toLowerCase();
            valB = b.name.first.toLowerCase();
        } else if (field === 'age') {
            valA = a.dob.age;
            valB = b.dob.age;
        } else if (field === 'registered') {
            valA = new Date(a.registered.date).getTime();
            valB = new Date(b.registered.date).getTime();
        }
        if (valA < valB) return -1 * dir;
        if (valA > valB) return 1 * dir;
        return 0;
    });

    return sorted;
}


//  URL + HISTORY API

function loadStateFromURL() {
    const params = new URLSearchParams(window.location.search);
    state.filters.search = params.get('search') || '';
    state.filters.gender = params.get('gender') || '';
    state.filters.ageMin = params.get('ageMin') || '';
    state.filters.ageMax = params.get('ageMax') || '';
    state.sort = params.get('sort') || '';
    state.currentPage = Number(params.get('page')) || 1;
}

function updateURL() {
    const params = new URLSearchParams();
    if (state.filters.search) params.set('search', state.filters.search);
    if (state.filters.gender) params.set('gender', state.filters.gender);
    if (state.filters.ageMin) params.set('ageMin', state.filters.ageMin);
    if (state.filters.ageMax) params.set('ageMax', state.filters.ageMax);
    if (state.sort) params.set('sort', state.sort);
    if (state.currentPage > 1) params.set('page', state.currentPage);

    const queryString = params.toString();
    const newUrl = window.location.pathname + (queryString ? '?' + queryString : '');
    history.pushState(null, '', newUrl);
}

function syncInputsFromState() {
    document.getElementById('search-input').value = state.filters.search;
    document.getElementById('filter-gender').value = state.filters.gender;
    document.getElementById('filter-age-min').value = state.filters.ageMin;
    document.getElementById('filter-age-max').value = state.filters.ageMax;
    document.getElementById('sort-select').value = state.sort;
}

window.addEventListener('popstate', () => {
    loadStateFromURL();
    syncInputsFromState();
    refreshCards();
});


function renderCard(user) {
    const fullName = user.name.first + ' ' + user.name.last;
    const isFav = isFavorite(user.login.uuid);
    const favClass = isFav ? 'card-favorite active' : 'card-favorite';
    const favIcon = isFav ? '❤️' : '🤍';

    return `
        <div class="user-card">
            <button class="${favClass}" data-id="${user.login.uuid}">${favIcon}</button>
            <img class="card-avatar" src="${user.picture.large}" alt="${fullName}">
            <div class="card-name">${fullName}</div>
            <span class="card-age">${user.dob.age} років</span>
            <div class="card-info">
                <div class="card-info-row">📧 ${user.email}</div>
                <div class="card-info-row">📞 ${user.phone}</div>
                <div class="card-info-row">📍 ${user.location.country}</div>
            </div>
        </div>
    `;
}

function renderCards(users) {
    document.getElementById('cards-grid').innerHTML = users.map(renderCard).join('');
}

function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / PER_PAGE);
    const pagination = document.getElementById('pagination');

    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }

    let html = '';
    for (let i = 1; i <= totalPages; i++) {
        const activeClass = i === state.currentPage ? 'page-btn active' : 'page-btn';
        html += `<button class="${activeClass}" data-page="${i}">${i}</button>`;
    }
    pagination.innerHTML = html;
}


function refreshCards() {
    const filtered = applyFilters(state.allUsers, state.filters);
    state.filteredUsers = applySort(filtered, state.sort);

    if (state.filteredUsers.length === 0) {
        document.getElementById('cards-grid').innerHTML = '';
        document.getElementById('pagination').innerHTML = '';
        show(document.getElementById('state-empty'));
        updateURL();
        return;
    }
    hide(document.getElementById('state-empty'));

    const totalPages = Math.ceil(state.filteredUsers.length / PER_PAGE);
    if (state.currentPage > totalPages) state.currentPage = 1;

    const startIndex = (state.currentPage - 1) * PER_PAGE;
    const pageUsers = state.filteredUsers.slice(startIndex, startIndex + PER_PAGE);
    renderCards(pageUsers);
    renderPagination(state.filteredUsers.length);
    updateURL();
}

document.getElementById('search-input').addEventListener('input', debounce(event => {
    state.filters.search = event.target.value;
    state.currentPage = 1;
    refreshCards();
}, DEBOUNCE_DELAY));

document.getElementById('sort-select').addEventListener('change', event => {
    state.sort = event.target.value;
    state.currentPage = 1;
    refreshCards();
});

document.getElementById('filter-gender').addEventListener('change', event => {
    state.filters.gender = event.target.value;
    state.currentPage = 1;
    refreshCards();
});

document.getElementById('filter-age-min').addEventListener('input', debounce(event => {
    state.filters.ageMin = event.target.value;
    state.currentPage = 1;
    refreshCards();
}, DEBOUNCE_DELAY));

document.getElementById('filter-age-max').addEventListener('input', debounce(event => {
    state.filters.ageMax = event.target.value;
    state.currentPage = 1;
    refreshCards();
}, DEBOUNCE_DELAY));

document.getElementById('btn-reset').addEventListener('click', () => {
    state.filters = {search: '', gender: '', ageMin: '', ageMax: ''};
    state.sort = '';
    state.currentPage = 1;
    syncInputsFromState();
    refreshCards();
});

// Пагінація (делегування)
document.getElementById('pagination').addEventListener('click', event => {
    const btn = event.target.closest('.page-btn');
    if (!btn) return;
    const page = Number(btn.dataset.page);
    if (page && page !== state.currentPage) {
        state.currentPage = page;
        refreshCards();
        window.scrollTo({top: 0, behavior: 'smooth'});
    }
});

document.getElementById('cards-grid').addEventListener('click', event => {
    const favBtn = event.target.closest('.card-favorite');
    if (!favBtn) return;
    const userId = favBtn.dataset.id;
    toggleFavorite(userId);
    favBtn.classList.toggle('active', isFavorite(userId));
    favBtn.textContent = isFavorite(userId) ? '❤️' : '🤍';
});

document.getElementById('btn-logout').addEventListener('click', logout);

document.getElementById('btn-retry').addEventListener('click', startApp);


async function startApp() {
    showAppView();
    loadFavorites();
    document.getElementById('fav-count').textContent = state.favorites.length;
    loadStateFromURL();
    syncInputsFromState();

    hide(document.getElementById('state-error'));
    hide(document.getElementById('state-empty'));
    hide(document.getElementById('cards-grid'));
    hide(document.getElementById('pagination'));
    show(document.getElementById('state-loading'));

    try {
        state.allUsers = await fetchUsers();
        hide(document.getElementById('state-loading'));
        show(document.getElementById('cards-grid'));
        show(document.getElementById('pagination'));
        refreshCards();
    } catch (error) {
        console.error('Помилка завантаження:', error);
        hide(document.getElementById('state-loading'));
        document.getElementById('error-text').textContent =
            'Не вдалося завантажити дані: ' + error.message;
        show(document.getElementById('state-error'));
    }
}

if (getCurrentUser()) {
    startApp();
} else {
    showLoginView();
}