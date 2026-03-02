function isNumberInRange(number, min, max) {
    return number >= min && number <= max;
}

console.log(isNumberInRange(5, 1, 10));
console.log(isNumberInRange(1, 2, 10));

let isActive = true;
console.log("Початковий стан: ", isActive);

isActive = !isActive;
console.log("Після першої зміни стану:", isActive);

isActive = !isActive;
console.log("Після другої зміни стану:", isActive);