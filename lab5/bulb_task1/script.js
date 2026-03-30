const lamp = document.getElementById("lamp");
const onBtn = document.getElementById("on");
const offBtn = document.getElementById("off");
const brightBtn = document.getElementById("bright");
const type = document.getElementById("type");

let timer;

function resetTimer() {
    clearTimeout(timer);

    timer = setTimeout(() => {
        lamp.classList.remove("on");
        alert("Авто вимкнення");
    }, 50000);
}


onBtn.onclick = () => {
    lamp.className = "lamp on " + type.value;
    resetTimer();
};

offBtn.onclick = () => {
    lamp.className = "lamp off";
};

type.onchange = () => {
    if (lamp.classList.contains("on")) {
        lamp.className = "lamp on " + type.value;
    }
};

brightBtn.onclick = () => {
    if (type.value === "normal") {
        alert("Не можна змінити яскравість");
        return;
    }

    let value = prompt("Введи яскравість (0-100):");

    if (value === null) return;

    let num = Number(value);

    if (isNaN(num)) {
        alert("Потрібно ввести число!");
        return;
    }

    if (num < 0 || num > 100) {
        alert("Число має бути від 0 до 100!");
        return;
    }

    lamp.style.opacity = num / 100;

    resetTimer();
};