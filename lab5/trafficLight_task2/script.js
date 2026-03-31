const red = document.getElementById("red");
const yellow = document.getElementById("yellow");
const green = document.getElementById("green");
const statusText = document.getElementById("status");

const nextBtn = document.getElementById("next");
const settingsBtn = document.getElementById("settings");

let redTime = 5;
let yellowTime = 3;
let greenTime = 7;

let state = 0;
let timer;
let interval;

function clearLights() {
    red.className = "light";
    yellow.className = "light";
    green.className = "light";
}

function changeLight() {
    clearTimeout(timer);
    clearInterval(interval);
    clearLights();

    state = (state + 1) % 4;

    if (state === 0) {
        red.classList.add("red");
        statusText.textContent = "Стан: ЧЕРВОНИЙ";
        timer = setTimeout(changeLight, redTime * 1000);
    } else if (state === 1) {
        yellow.classList.add("yellow");
        statusText.textContent = "Стан: ЖОВТИЙ";
        timer = setTimeout(changeLight, yellowTime * 1000);
    } else if (state === 2) {
        green.classList.add("green");
        statusText.textContent = "Стан: ЗЕЛЕНИЙ";
        timer = setTimeout(changeLight, greenTime * 1000);
    } else if (state === 3) {
        statusText.textContent = "Стан: МИГАЄ ЖОВТИЙ";

        let count = 0;

        interval = setInterval(() => {
            yellow.classList.toggle("yellow");
            count++;

            if (count === 6) {
                clearInterval(interval);
                changeLight();
            }
        }, 500);
    }
}

nextBtn.onclick = () => {
    changeLight();
};

settingsBtn.onclick = () => {
    let r = Number(prompt("Червоний (сек):", redTime));
    let y = Number(prompt("Жовтий (сек):", yellowTime));
    let g = Number(prompt("Зелений (сек):", greenTime));

    if (!isNaN(r) && r > 0) redTime = r;
    if (!isNaN(y) && y > 0) yellowTime = y;
    if (!isNaN(g) && g > 0) greenTime = g;
};

changeLight();