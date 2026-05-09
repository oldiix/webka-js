let draggedTask = null;
let placeholder = null;

// Створює placeholder-плашку, що показує куди впаде картка
const createPlaceholder = () => {
    const ph = document.createElement('div');
    ph.className = 'task-placeholder';
    return ph;
};

// Визначає елемент після якого треба вставити картку (на основі координати курсору)
const getInsertAfterElement = (container, y) => {
    const tasks = [...container.querySelectorAll('.task:not(.dragging)')];
    return tasks.reduce((closest, task) => {
        const box = task.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return {offset, element: task};
        }
        return closest;
    }, {offset: Number.NEGATIVE_INFINITY, element: null}).element;
};

// dragstart на самій картці
document.querySelectorAll('.task').forEach(task => {
    task.addEventListener('dragstart', (e) => {
        draggedTask = task;
        task.classList.add('dragging');
        placeholder = createPlaceholder();
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', task.dataset.id);
    });

    task.addEventListener('dragend', () => {
        task.classList.remove('dragging');
        if (placeholder && placeholder.parentNode) {
            placeholder.parentNode.removeChild(placeholder);
        }
        document.querySelectorAll('.column-body').forEach(c => {
            c.classList.remove('drop-target');
        });
        draggedTask = null;
        placeholder = null;
    });
});

// Обробка drop-зон
document.querySelectorAll('.column-body').forEach(zone => {
    zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        zone.classList.add('drop-target');

        const afterEl = getInsertAfterElement(zone, e.clientY);
        if (!placeholder) return;

        if (afterEl == null) {
            zone.appendChild(placeholder);
        } else {
            zone.insertBefore(placeholder, afterEl);
        }
    });

    zone.addEventListener('dragleave', (e) => {
        // Знімаємо підсвітку, тільки якщо курсор справді покинув колонку
        if (!zone.contains(e.relatedTarget)) {
            zone.classList.remove('drop-target');
        }
    });

    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('drop-target');
        if (!draggedTask || !placeholder) return;
        zone.insertBefore(draggedTask, placeholder);
    });
});