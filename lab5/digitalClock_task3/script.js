const clock = document.getElementById("clock");
const countdownInput = document.getElementById("countdownInput");
const startTimerBtn = document.getElementById("startTimer");
const countdownText = document.getElementById("countdownText");

const monthInput = document.getElementById("monthInput");
const monthTitle = document.getElementById("monthTitle");
const calendar = document.getElementById("calendar");

const birthdayInput = document.getElementById("birthdayInput");
const birthdayText = document.getElementById("birthdayText");

let countdownInterval;
let birthdayInterval;

function updateClock() {
    const now = new Date();

    let hours = String(now.getHours()).padStart(2, "0");
    let minutes = String(now.getMinutes()).padStart(2, "0");
    let seconds = String(now.getSeconds()).padStart(2, "0");

    let separator = now.getSeconds() % 2 === 0 ? ":" : " ";

    clock.textContent = hours + separator + minutes + separator + seconds;
}

updateClock();
setInterval(updateClock, 1000);

startTimerBtn.onclick = function () {
    if (countdownInput.value === "") {
        alert("Оберіть дату і час");
        return;
    }

    const endDate = new Date(countdownInput.value).getTime();

    clearInterval(countdownInterval);

    countdownInterval = setInterval(function () {
        const now = new Date().getTime();
        const diff = endDate - now;

        if (diff <= 0) {
            clearInterval(countdownInterval);
            countdownText.textContent = "Час вийшов!";
            return;
        }

        let days = Math.floor(diff / (1000 * 60 * 60 * 24));
        let hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        let minutes = Math.floor((diff / (1000 * 60)) % 60);
        let seconds = Math.floor((diff / 1000) % 60);

        countdownText.textContent =
            "Залишилось: " +
            days + " дн. " +
            hours + " год. " +
            minutes + " хв. " +
            seconds + " сек.";
    }, 1000);
};

function renderCalendar(year, month) {
    calendar.innerHTML = "";

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    let startDay = firstDay.getDay();
    if (startDay === 0) startDay = 7;

    const daysInMonth = lastDay.getDate();

    const monthNames = [
        "Січень", "Лютий", "Березень", "Квітень",
        "Травень", "Червень", "Липень", "Серпень",
        "Вересень", "Жовтень", "Листопад", "Грудень"
    ];

    monthTitle.textContent = monthNames[month] + " " + year;

    for (let i = 1; i < startDay; i++) {
        const empty = document.createElement("div");
        empty.classList.add("empty");
        calendar.appendChild(empty);
    }

    const today = new Date();

    for (let day = 1; day <= daysInMonth; day++) {
        const cell = document.createElement("div");
        cell.textContent = day;

        if (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) {
            cell.classList.add("today");
        }

        calendar.appendChild(cell);
    }
}

const now = new Date();
const currentMonthValue =
    now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0");

monthInput.value = currentMonthValue;
renderCalendar(now.getFullYear(), now.getMonth());

monthInput.onchange = function () {
    const parts = monthInput.value.split("-");
    const year = Number(parts[0]);
    const month = Number(parts[1]) - 1;

    renderCalendar(year, month);
};

birthdayInput.onchange = function () {
    if (birthdayInput.value === "") {
        return;
    }

    clearInterval(birthdayInterval);

    function updateBirthdayCountdown() {
        const now = new Date();
        const birthDate = new Date(birthdayInput.value);

        let nextBirthday = new Date(
            now.getFullYear(),
            birthDate.getMonth(),
            birthDate.getDate(),
            0, 0, 0
        );

        if (nextBirthday < now) {
            nextBirthday.setFullYear(now.getFullYear() + 1);
        }

        let diff = nextBirthday - now;

        if (diff <= 0) {
            birthdayText.textContent = "Сьогодні день народження!";
            return;
        }

        let totalSeconds = Math.floor(diff / 1000);

        let months = Math.floor(totalSeconds / (30 * 24 * 60 * 60));
        totalSeconds %= 30 * 24 * 60 * 60;

        let days = Math.floor(totalSeconds / (24 * 60 * 60));
        totalSeconds %= 24 * 60 * 60;

        let hours = Math.floor(totalSeconds / (60 * 60));
        totalSeconds %= 60 * 60;

        let minutes = Math.floor(totalSeconds / 60);
        let seconds = totalSeconds % 60;

        birthdayText.textContent =
            "До дня народження залишилось: " +
            months + " міс. " +
            days + " дн. " +
            hours + " год. " +
            minutes + " хв. " +
            seconds + " сек.";
    }

    updateBirthdayCountdown();
    birthdayInterval = setInterval(updateBirthdayCountdown, 1000);
};