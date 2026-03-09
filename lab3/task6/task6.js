// Напишіть функцію, яка приймає два аргументи - числа base та exponent,
// і повертає результат піднесення числа base до степеня exponent.

let base = 5;
let exponent = 3;
let result = 1;

function power(base, exponent) {
    for (let i = 1; i <= exponent; i++) {
        result *= base;
    }
    return result;
}

console.log("Завдання 6: піднесення числа base до степеня exponent = ", power(base, exponent));