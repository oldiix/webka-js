'use strict';

let itemsData = [
    {
        id: '1',
        name: 'Гаррі Поттер і Філософський камінь',
        price: 320,
        category: 'Книги',
        image: 'https://upload.wikimedia.org/wikipedia/en/6/6b/Harry_Potter_and_the_Philosopher%27s_Stone_Book_Cover.jpg',
        createdAt: '2026-01-10T10:00:00.000Z',
        updatedAt: '2026-01-10T10:00:00.000Z'
    },
    {
        id: '2',
        name: 'Маленький принц',
        price: 180,
        category: 'Книги',
        image: 'https://upload.wikimedia.org/wikipedia/en/0/05/Littleprince.JPG',
        createdAt: '2026-01-15T10:00:00.000Z',
        updatedAt: '2026-01-15T10:00:00.000Z'
    },
    {
        id: '3',
        name: 'Бездротові навушники Sony WH-1000XM5',
        price: 8999,
        category: 'Гаджети',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
        createdAt: '2026-02-05T14:00:00.000Z',
        updatedAt: '2026-02-06T09:00:00.000Z'
    },
    {
        id: '4',
        name: 'Смарт-годинник Xiaomi Band 8',
        price: 1599,
        category: 'Гаджети',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
        createdAt: '2026-02-10T11:00:00.000Z',
        updatedAt: '2026-02-10T11:00:00.000Z'
    },
    {
        id: '5',
        name: 'Настільна гра "Каркасон"',
        price: 750,
        category: 'Іграшки та ігри',
        image: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=400',
        createdAt: '2026-03-01T08:00:00.000Z',
        updatedAt: '2026-03-01T08:00:00.000Z'
    },
    {
        id: '6',
        name: 'Кубик Рубіка 3x3 Speed Cube',
        price: 290,
        category: 'Іграшки та ігри',
        image: 'https://images.unsplash.com/photo-1640958899763-9b5b4d9e4b6c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        createdAt: '2026-03-12T16:00:00.000Z',
        updatedAt: '2026-03-14T10:00:00.000Z'
    }
];


let activeFilter = 'Всі';
let activeSortKey = 'none';
let editingId = null;

const addItem = (list, item) => [...list, item];
const removeItem = (list, id) => list.filter(item => item.id !== id);
const modifyItem = (list, id, patch) => list.map(item => item.id === id ? {...item, ...patch} : item);
const applyFilter = (list, cat) => cat === 'Всі' ? list : list.filter(item => item.category === cat);
const calcTotal = (list) => list.reduce((acc, item) => acc + Number(item.price), 0);
const getCategories = (list) => ['Всі', ...new Set(list.map(item => item.category))];

const formatCurrency = (amount) =>
    new Intl.NumberFormat('uk-UA', {style: 'currency', currency: 'UAH'}).format(amount);

const applySort = (list, key) => {
    const comparators = {
        price: (a, b) => a.price - b.price,
        dateCreated: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        dateUpdated: (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
    };
    return comparators[key] ? [...list].sort(comparators[key]) : list;
};


const dom = {
    itemsList: document.getElementById('items-list'),
    totalCost: document.getElementById('total-cost'),
    filterBtns: document.getElementById('filter-btns'),
    sortBtns: document.getElementById('sort-btns'),
    modal: document.getElementById('item-modal'),
    form: document.getElementById('item-form'),
    modalHeading: document.getElementById('modal-heading'),
    toast: document.getElementById('toast-msg')
};


const buildImage = (item) => {
    const img = document.createElement('img');
    img.src = item.image;
    img.alt = item.name;
    return img;
};

const buildCardBody = (item) => {
    const body = document.createElement('div');
    body.className = 'card-body';

    const idEl = document.createElement('small');
    idEl.className = 'card-id';
    idEl.appendChild(document.createTextNode(`ID: ${item.id}`));

    const nameEl = document.createElement('h3');
    nameEl.className = 'card-name';
    nameEl.appendChild(document.createTextNode(item.name));

    const catEl = document.createElement('p');
    catEl.className = 'card-category';
    catEl.appendChild(document.createTextNode(item.category));

    const priceEl = document.createElement('p');
    priceEl.className = 'card-price';
    priceEl.appendChild(document.createTextNode(formatCurrency(item.price)));

    const actions = document.createElement('div');
    actions.className = 'card-actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'btn-edit';
    editBtn.dataset.id = item.id;
    editBtn.appendChild(document.createTextNode('Редагувати'));

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn-delete';
    deleteBtn.dataset.id = item.id;
    deleteBtn.appendChild(document.createTextNode('Видалити'));

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    body.appendChild(idEl);
    body.appendChild(nameEl);
    body.appendChild(catEl);
    body.appendChild(priceEl);
    body.appendChild(actions);

    return body;
};

const buildCard = (item) => {
    const card = document.createElement('article');
    card.className = 'item-card anim-in';
    card.dataset.id = item.id;

    card.appendChild(buildImage(item));
    card.appendChild(buildCardBody(item));

    return card;
};

const renderItems = () => {
    const visibleList = applySort(applyFilter(itemsData, activeFilter), activeSortKey);

    dom.itemsList.innerHTML = '';

    if (visibleList.length === 0) {
        const msg = document.createElement('p');
        msg.className = 'empty-msg';
        msg.appendChild(document.createTextNode('Наразі список товарів пустий. Додайте новий товар.'));
        dom.itemsList.appendChild(msg);
    } else {
        visibleList.forEach(item => dom.itemsList.appendChild(buildCard(item)));
    }

    dom.totalCost.textContent = `Сума: ${formatCurrency(calcTotal(visibleList))}`;
};

const renderFilterBtns = () => {
    dom.filterBtns.innerHTML = '';
    getCategories(itemsData).forEach(cat => {
        const btn = document.createElement('button');
        btn.dataset.category = cat;
        if (cat === activeFilter) btn.classList.add('active');
        btn.appendChild(document.createTextNode(cat));
        dom.filterBtns.appendChild(btn);
    });
};

const refreshUI = () => {
    renderFilterBtns();
    renderItems();
};

const toggleModal = (item = null) => {
    dom.form.reset();
    editingId = item ? item.id : null;
    dom.modalHeading.textContent = item ? 'Редагувати товар' : 'Додати новий товар';

    const imgInput = dom.form.querySelector('#inp-image');
    if (item) {
        imgInput.required = false;
        imgInput.placeholder = '(залиште порожнім, щоб не змінювати)';
        dom.form.querySelector('#inp-name').value = item.name;
        dom.form.querySelector('#inp-price').value = item.price;
        dom.form.querySelector('#inp-category').value = item.category;
    } else {
        imgInput.required = true;
        imgInput.placeholder = 'https://...';
    }

    dom.modal.classList.toggle('show');
};


const showToast = (text) => {
    dom.toast.textContent = text;
    dom.toast.classList.add('show');
    setTimeout(() => dom.toast.classList.remove('show'), 5000);
};


dom.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const now = new Date().toISOString();

    const name = dom.form.querySelector('#inp-name').value.trim();
    const price = Number(dom.form.querySelector('#inp-price').value);
    const category = dom.form.querySelector('#inp-category').value.trim();
    const imageVal = dom.form.querySelector('#inp-image').value.trim();

    const patch = {name, price, category};

    if (editingId) {
        const current = itemsData.find(p => p.id === editingId);
        patch.image = imageVal || current.image;
        patch.updatedAt = now;
        itemsData = modifyItem(itemsData, editingId, patch);
        showToast(`Оновлено: [${editingId}] ${name}`);
    } else {
        const newItem = {
            id: Date.now().toString(),
            ...patch,
            image: imageVal,
            createdAt: now,
            updatedAt: now
        };
        itemsData = addItem(itemsData, newItem);
        showToast('Товар успішно додано!');
    }

    refreshUI();
    toggleModal();
});

dom.itemsList.addEventListener('click', (e) => {
    const id = e.target.dataset.id;
    if (!id) return;

    if (e.target.classList.contains('btn-delete')) {
        itemsData = removeItem(itemsData, id);
        refreshUI();
        showToast('Товар успішно видалено зі списку');
    }

    if (e.target.classList.contains('btn-edit')) {
        const found = itemsData.find(p => p.id === id);
        if (found) toggleModal(found);
    }
});

dom.filterBtns.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        activeFilter = e.target.dataset.category;
        refreshUI();
    }
});

dom.sortBtns.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        activeSortKey = e.target.dataset.sort;
        renderItems();
    }
});

document.getElementById('btn-reset-filter').addEventListener('click', () => {
    activeFilter = 'Всі';
    refreshUI();
});

document.getElementById('btn-reset-sort').addEventListener('click', () => {
    activeSortKey = 'none';
    renderItems();
});

document.getElementById('btn-open-form').addEventListener('click', () => toggleModal());
document.getElementById('btn-close-form').addEventListener('click', () => toggleModal());
window.addEventListener('click', (e) => {
    if (e.target === dom.modal) toggleModal();
});

document.addEventListener('DOMContentLoaded', refreshUI);