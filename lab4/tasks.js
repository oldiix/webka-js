function task1() {

    let fruits = ["яблуко", "банан", "груша", "апельсин"];

    console.log("Завдання 1");
    console.log("Початковий масив: ", fruits);

    fruits.pop();
    console.log("1) Після видалення останнього елемента:", fruits);

    fruits.unshift("ананас");
    console.log("2) Після додавання 'ананас' на початок:", fruits);

    fruits.sort().reverse();
    console.log("3) Масив у зворотньому алфавітному порядку:", fruits);

    let index = fruits.indexOf("яблуко");
    console.log("4) Індекс елемента 'яблуко':", index);

}

task1();


function task2() {

    console.log("\nЗавдання 2");

    let colors = ["жовтий", "синій", "темно-синій", "фіолетовий", "фісташковий", "тіфані"];
    let longest = colors[0];
    let shortest = colors[0];

    for (let i = 0; i < colors.length; i++) {

        if (colors[i].length > longest.length) {
            longest = colors[i];
        }

        if (colors[i].length < shortest.length) {
            shortest = colors[i];
        }
    }

    console.log("1) Найдовший елемент:", longest);
    console.log("Найкоротший елемент:", shortest);

    let blueColors = [];

    for (let i = 0; i < colors.length; i++) {
        if (colors[i].includes("синій")) {
            blueColors.push(colors[i]);
        }
    }

    console.log("2) Кольори, що містять 'синій':", blueColors);

    let resultString = blueColors.join(", ");
    console.log("3) Об'єднаний рядок:", resultString);
}

task2();


function task3() {

    console.log("\nЗавдання 3");
    let employees = [
        {name: "Анна", age: 28, position: "менеджер"},
        {name: "Богдан", age: 24, position: "розробник"},
        {name: "Катерина", age: 30, position: "дизайнер"},
        {name: "Дмитро", age: 35, position: "розробник"},
        {name: "Олена", age: 22, position: "тестувальник"}
    ];

    console.log("Початковий масив працівників:", employees);

    employees.sort(function (a, b) {
        return a.name.localeCompare(b.name, 'uk'); // 'uk' для української мови
    });

    console.log("1) Масив після сортування за іменами:", employees);

    let developers = [];
    for (let i = 0; i < employees.length; i++) {
        if (employees[i].position === "розробник") {
            developers.push(employees[i]);
        }
    }
    console.log("2) Працівники з посадою 'розробник':", developers);

    for (let i = 0; i < employees.length; i++) {
        if (employees[i].age > 30) {
            employees.splice(i, 1);
            i--;
        }
    }
    console.log("3) Масив після видалення працівників старше 30 років:", employees);


    employees.push({name: "Іван", age: 26, position: "розробник"});
    console.log("4) Оновлений масив після додавання нового працівника:", employees);
}

task3();


function task4() {

    console.log("\nЗавдання 4");
    let students = [
        {name: "Ірина", age: 20, course: 2},
        {name: "Олексій", age: 22, course: 3},
        {name: "Марія", age: 19, course: 1},
        {name: "Богдан", age: 21, course: 3},
        {name: "Катерина", age: 23, course: 4}
    ];

    console.log("Початковий масив студентів:", students);

    for (let i = 0; i < students.length; i++) {
        if (students[i].name === "Олексій") {
            students.splice(i, 1);
            i--;
        }
    }
    console.log("1) Масив після видалення студента 'Олексій':", students);

    students.push({name: "Анастасія", age: 20, course: 2});
    console.log("2) Масив після додавання нового студента:", students);

    students.sort(function (a, b) {
        return b.age - a.age;
    });
    console.log("3) Масив після сортування за віком (старший → молодший):", students);

    let thirdCourseStudents = [];
    for (let i = 0; i < students.length; i++) {
        if (students[i].course === 3) {
            thirdCourseStudents.push(students[i]);
        }
    }
    console.log("4) Студенти, які навчаються на 3-му курсі:", thirdCourseStudents);
}

task4();


function task5() {

    console.log("\nЗавдання 5");

    let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    console.log("1) Початковий масив чисел:", numbers);

    let squared = numbers.map(num => num ** 2);
    console.log("2) Масив чисел у квадраті:", squared);

    let evenNumbers = numbers.filter(num => num % 2 === 0);
    console.log("3) Парні числа з масиву:", evenNumbers);

    let sum = numbers.reduce((acc, num) => acc + num, 0);
    console.log("4) Сума всіх чисел:", sum);

    let moreNumbers = [11, 12, 13, 14, 15];
    numbers = numbers.concat(moreNumbers);
    console.log("5) Масив після додавання нових чисел:", numbers);

    numbers.splice(0, 3);
    console.log("6) Масив після видалення перших 3 елементів:", numbers);
}

task5();


function libraryManagement() {

    let books = [
        {title: "Гаррі Поттер", author: "Дж. К. Роулінг", genre: "Фентезі", pages: 500, isAvailable: true},
        {title: "1984", author: "Джордж Орвелл", genre: "Антиутопія", pages: 328, isAvailable: false},
        {title: "Маленький принц", author: "Антуан де Сент-Екзюпері", genre: "Фантастика", pages: 96, isAvailable: true}
    ];

    function addBook(title, author, genre, pages) {
        books.push({title, author, genre, pages, isAvailable: true});
        console.log(`Книга "${title}" додана до бібліотеки.`);
    }

    function removeBook(title) {
        for (let i = 0; i < books.length; i++) {
            if (books[i].title === title) {
                books.splice(i, 1);
                console.log(`Книга "${title}" видалена з бібліотеки.`);
                return;
            }
        }
        console.log(`Книга "${title}" не знайдена.`);
    }

    function findBooksByAuthor(author) {
        let result = [];
        for (let i = 0; i < books.length; i++) {
            if (books[i].author === author) {
                result.push(books[i]);
            }
        }
        return result;
    }

    function toggleBookAvailability(title, isBorrowed) {
        for (let i = 0; i < books.length; i++) {
            if (books[i].title === title) {
                books[i].isAvailable = !isBorrowed;
                console.log(`Книга "${title}" тепер ${books[i].isAvailable ? "доступна" : "взята"}.`);
                return;
            }
        }
        console.log(`Книга "${title}" не знайдена.`);
    }

    function sortBooksByPages() {
        books.sort((a, b) => a.pages - b.pages);
        console.log("Книги відсортовані за кількістю сторінок:", books);
    }

    function getBooksStatistics() {
        let totalBooks = books.length;
        let availableBooks = books.filter(book => book.isAvailable).length;
        let borrowedBooks = totalBooks - availableBooks;
        let averagePages = totalBooks === 0 ? 0 : books.reduce((acc, book) => acc + book.pages, 0) / totalBooks;

        return {
            totalBooks,
            availableBooks,
            borrowedBooks,
            averagePages: averagePages.toFixed(2)
        };
    }

    return {
        addBook,
        removeBook,
        findBooksByAuthor,
        toggleBookAvailability,
        sortBooksByPages,
        getBooksStatistics,
        books
    };
}

const library = libraryManagement();

console.log("\nПочатковий стан бібліотеки:", library.books);

library.addBook("Віднесені вітром", "Маргарет Мітчелл", "Роман", 1037);
library.removeBook("1984");
console.log("Книги Дж. К. Роулінг:", library.findBooksByAuthor("Дж. К. Роулінг"));
library.toggleBookAvailability("Гаррі Поттер", true);
library.sortBooksByPages();
console.log("Статистика бібліотеки:", library.getBooksStatistics());


function task7() {

    console.log("\nЗавдання 7");
    let student = {
        name: "Катерина",
        age: 19,
        course: 2
    };
    console.log("7.1 Початковий об'єкт студента:", student);

    student.subjects = ["Теорія ймовірності", "Веб-технології", "Англійська мова"];
    console.log("7.2 Об'єкт після додавання subjects:", student);

    delete student.age;
    console.log("7.3 Об'єкт після видалення age:", student);

    console.log("7.4 Остаточний об'єкт студента:", student);
}

task7();
