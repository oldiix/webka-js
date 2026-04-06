'use strict';

let tasks = [
    {
        id: '1',
        text: 'Вивчити польську на середу',
        completed: false,
        createdAt: '2026-03-30T10:00:00.000Z',
        updatedAt: '2026-03-30T12:00:00.000Z'
    },
    {
        id: '2',
        text: 'Виконати щотижневе тренування',
        completed: true,
        createdAt: '2026-03-30T14:00:00.000Z',
        updatedAt: '2026-03-30T14:00:00.000Z'
    },
    {
        id: '3',
        text: 'Зробити 7 лабораторну по No-SQl-системах',
        completed: false,
        createdAt: '2026-03-29T14:00:00.000Z',
        updatedAt: '2026-04-02T14:00:00.000Z'
    }
];

let currentSort = 'dateCreated';
let editingTaskId = null;

const addTask = (list, text) => {
    const now = new Date().toISOString();
    return [...list, {id: Date.now().toString(), text, completed: false, createdAt: now, updatedAt: now}];
};

const deleteTask = (list, id) =>
    list.filter(t => t.id !== id);

const toggleTask = (list, id) =>
    list.map(t => t.id === id
        ? {...t, completed: !t.completed, updatedAt: new Date().toISOString()}
        : t
    );

const updateTaskText = (list, id, text) =>
    list.map(t => t.id === id
        ? {...t, text, updatedAt: new Date().toISOString()}
        : t
    );

const sortTasks = (list, by) => {
    const fns = {
        dateCreated: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        dateUpdated: (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
        status: (a, b) => Number(a.completed) - Number(b.completed)
    };
    return [...list].sort(fns[by] || fns.dateCreated);
};

const buildItem = (task) => {
    const li = document.createElement('li');
    li.className = `task-item anim-in${task.completed ? ' completed-item' : ''}`;
    li.dataset.id = task.id;

    // Чекбокс
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.className = 'task-check';
    cb.checked = task.completed;
    cb.setAttribute('aria-label', 'Змінити статус');
    cb.addEventListener('change', () => {
        tasks = toggleTask(tasks, task.id);
        renderTasks();
    });

    const isEditing = task.id === editingTaskId;

    let content;
    if (isEditing) {
        content = document.createElement('input');
        content.type = 'text';
        content.className = 'task-edit-input';
        content.value = task.text;
        content.minLength = 2;
        content.maxLength = 200;

        content.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') content.blur();
        });

        content.addEventListener('blur', () => {
            const newText = content.value.trim();
            if (newText && newText.length >= 2) {
                tasks = updateTaskText(tasks, task.id, newText);
            }
            editingTaskId = null;
            renderTasks();
        });
    } else {
        content = document.createElement('span');
        content.className = `task-label${task.completed ? ' done' : ''}`;
        content.appendChild(document.createTextNode(task.text));
        content.addEventListener('click', () => {
            tasks = toggleTask(tasks, task.id);
            renderTasks();
        });
    }

    const btns = document.createElement('div');
    btns.className = 'task-btns';

    if (!isEditing) {
        const editBtn = document.createElement('button');
        editBtn.className = 'btn-edit-task';
        editBtn.setAttribute('aria-label', 'Редагувати');
        editBtn.appendChild(document.createTextNode('✎'));
        editBtn.addEventListener('click', () => {
            editingTaskId = task.id;
            renderTasks();
        });
        btns.appendChild(editBtn);
    }

    const delBtn = document.createElement('button');
    delBtn.className = 'btn-delete-task';
    delBtn.setAttribute('aria-label', 'Видалити');
    delBtn.appendChild(document.createTextNode('✖'));
    delBtn.addEventListener('click', () => {
        li.classList.remove('anim-in');
        li.classList.add('anim-out');
        li.addEventListener('animationend', () => {
            tasks = deleteTask(tasks, task.id);
            renderTasks();
        }, {once: true});
    });

    btns.appendChild(delBtn);

    li.appendChild(cb);
    li.appendChild(content);
    li.appendChild(btns);

    return li;
};


const renderTasks = () => {
    const listEl = document.getElementById('task-list');
    const sorted = sortTasks(tasks, currentSort);

    listEl.innerHTML = '';

    if (sorted.length === 0) {
        const msg = document.createElement('li');
        msg.className = 'empty-msg';
        msg.appendChild(document.createTextNode('Немає завдань. Додайте перше!'));
        listEl.appendChild(msg);
    } else {
        sorted.forEach(task => listEl.appendChild(buildItem(task)));
    }

    const editInput = listEl.querySelector('.task-edit-input');
    if (editInput) {
        editInput.focus();
        editInput.selectionStart = editInput.selectionEnd = editInput.value.length;
    }
};

const updateSortBtns = () => {
    document.getElementById('sort-bar')
        .querySelectorAll('button')
        .forEach(btn => btn.classList.toggle('active', btn.dataset.sort === currentSort));
};

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('task-form');
    const input = document.getElementById('task-input');
    const sortBar = document.getElementById('sort-bar');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (!text || text.length < 2) return;
        tasks = addTask(tasks, text);
        input.value = '';
        renderTasks();
    });

    sortBar.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            currentSort = e.target.dataset.sort;
            updateSortBtns();
            renderTasks();
        }
    });

    renderTasks();
});