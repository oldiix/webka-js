const initialLanguages = [
    {id: 'js', emoji: '🟧', bg: '#fff3cd', name: 'JavaScript', desc: 'веб / скрипти'},
    {id: 'py', emoji: '🐍', bg: '#d4edda', name: 'Python', desc: 'дані / AI'},
    {id: 'java', emoji: '☕', bg: '#f8d7da', name: 'Java', desc: 'бекенд / ентерпрайз'},
    {id: 'ts', emoji: '🔷', bg: '#cce5ff', name: 'TypeScript', desc: 'типізований JS'},
    {id: 'rust', emoji: '🦀', bg: '#ffd6d6', name: 'Rust', desc: 'системи / швидкість'},
    {id: 'go', emoji: '🐹', bg: '#d1f0e8', name: 'Go', desc: 'хмара / мікросервіси'},
    {id: 'kt', emoji: '💜', bg: '#e8d5ff', name: 'Kotlin', desc: 'Android / JVM'},
    {id: 'sw', emoji: '🍎', bg: '#ffe0e0', name: 'Swift', desc: 'iOS / macOS'},
    {id: 'cpp', emoji: '⚡', bg: '#fff4cc', name: 'C++', desc: 'ігри / системи'},
    {id: 'php', emoji: '🐘', bg: '#e0e0e0', name: 'PHP', desc: 'веб / сервер'}
];

let languages = [...initialLanguages];
let isEditMode = false;
let draggedCard = null;


const renderCards = () => {
    const grid = document.getElementById('cards-grid');
    grid.innerHTML = '';
    languages.forEach(lang => {
        const card = document.createElement('div');
        card.className = 'lang-card';
        card.dataset.id = lang.id;
        card.draggable = isEditMode;
        card.innerHTML = `
            <button class="delete-btn" data-action="delete" aria-label="Видалити">✕</button>
            <div class="lang-icon" style="background: ${lang.bg}">${lang.emoji}</div>
            <div class="lang-name">${lang.name}</div>
            <div class="lang-desc">${lang.desc}</div>
        `;
        grid.appendChild(card);
    });
};

const updateUIForMode = () => {
    const app = document.querySelector('.app');
    const editBtn = document.getElementById('edit-btn');
    const hint = document.getElementById('hint-text');

    if (isEditMode) {
        app.classList.add('edit-mode');
        editBtn.textContent = 'Готово';
        editBtn.classList.add('active');
        hint.textContent = 'Перетягуйте картки або натискайте ✕ щоб видалити';
    } else {
        app.classList.remove('edit-mode');
        editBtn.textContent = 'Редагувати';
        editBtn.classList.remove('active');
        hint.textContent = 'Натисніть «Редагувати» для керування картками';
    }

    document.querySelectorAll('.lang-card').forEach(card => {
        card.draggable = isEditMode;
    });
};


document.getElementById('edit-btn').addEventListener('click', () => {
    isEditMode = !isEditMode;
    updateUIForMode();
});


document.getElementById('cards-grid').addEventListener('click', (e) => {
    if (!isEditMode) return;
    const deleteBtn = e.target.closest('[data-action="delete"]');
    if (!deleteBtn) return;
    const card = deleteBtn.closest('.lang-card');
    const id = card.dataset.id;
    languages = languages.filter(l => l.id !== id);
    renderCards();
});


const grid = document.getElementById('cards-grid');

grid.addEventListener('dragstart', (e) => {
    if (!isEditMode) {
        e.preventDefault();
        return;
    }
    const card = e.target.closest('.lang-card');
    if (!card) return;
    draggedCard = card;
    card.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', card.dataset.id);
});

grid.addEventListener('dragend', (e) => {
    const card = e.target.closest('.lang-card');
    if (card) card.classList.remove('dragging');
    draggedCard = null;
});

const getCardUnderCursor = (x, y) => {
    const cards = [...grid.querySelectorAll('.lang-card:not(.dragging)')];
    return cards.find(card => {
        const rect = card.getBoundingClientRect();
        return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    });
};

grid.addEventListener('dragover', (e) => {
    if (!isEditMode || !draggedCard) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    const targetCard = getCardUnderCursor(e.clientX, e.clientY);
    if (!targetCard || targetCard === draggedCard) return;

    const rect = targetCard.getBoundingClientRect();
    const isAfter = (e.clientX - rect.left) > rect.width / 2;

    if (isAfter) {
        targetCard.after(draggedCard);
    } else {
        targetCard.before(draggedCard);
    }
});

grid.addEventListener('drop', (e) => {
    if (!isEditMode) return;
    e.preventDefault();
    const newOrder = [...grid.querySelectorAll('.lang-card')].map(c => c.dataset.id);
    languages = newOrder.map(id => languages.find(l => l.id === id)).filter(Boolean);
});


renderCards();