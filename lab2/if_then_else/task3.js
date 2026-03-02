function gradeRefactoring(grade) {
    if (grade >= 90 && grade <= 100) {
        return "Відмінно";
    } else if (grade >= 80 && grade < 90) {
        return "Добре";
    } else if (grade >= 60 && grade < 80) {
        return "Задовільно";
    } else {
        return "Незадовільно";
    }
}

console.log(gradeRefactoring(100));
console.log(gradeRefactoring(49));
console.log(gradeRefactoring(76));
console.log(gradeRefactoring(89));
console.log(gradeRefactoring(60));


function getSeason(month) {
    if (month >= 1 && month <= 12) {
        if (month === 12 || month === 1 || month === 2) {
            return "Зима!";
        } else if (month >= 3 && month <= 5) {
            return "Весна!";
        } else if (month >= 6 && month <= 8) {
            return "Літо!";
        } else {
            return "Осінь!";
        }
    }
}

console.log(getSeason(1));
console.log(getSeason(4));
console.log(getSeason(7));
console.log(getSeason(10));
console.log(getSeason(15));

function getSeasonTernary(month) {
    return (month < 1 || month > 12)
        ? "Некоректний номер місяця."
        : (month === 12 || month === 1 || month === 2)
            ? "Зима!"
            : month >= 3 && month <= 5
                ? "Весна!"
                : (month >= 6 && month <= 8)
                    ? "Літо!"
                    : "Осінь!"
}

console.log(getSeasonTernary(1));
console.log(getSeasonTernary(4));
console.log(getSeasonTernary(7));
console.log(getSeasonTernary(10));
console.log(getSeasonTernary(15));