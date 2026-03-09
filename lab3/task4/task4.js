// Напишіть функцію, яка приймає масив чисел і повертає суму всіх парних чисел у цьому масиві.

let i = [1, 2, 3, 53, 52, 13, 8];

function sumOfArray(arr) {
    let sum = 0;
    for (let j = 0; j < arr.length; j++) {
        if (arr[j] % 2 === 0) {
            sum += arr[j];
        }
    }
    return sum;
}

console.log("Завдання 4: сума всіх парних чисел масиву = ", sumOfArray(i))