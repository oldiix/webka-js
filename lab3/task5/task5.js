// Створіть стрілкову функцію, яка приймає рядок як аргумент і повертає кількість голосних літер у цьому рядку
let vowel = ['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U'];
let word = "kateryna";

let countOfVowels = (vowel, word) => {
    let count = 0;
    for (let i = 0; i < word.length; i++) {
        for (let j = 0; j < vowel.length; j++) {
            if (word[i] === vowel[j]) {
                count++;
            }
        }
    }
    return count;
}
console.log("Завдання 5: кількість голосних літер у слові = ", countOfVowels(vowel, word));