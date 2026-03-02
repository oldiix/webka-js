function findMinAndMax(numberArray) {
    if (numberArray.length === 0) {
        console.log('No numbers found');
        return null;
    }

    let minValue = numberArray[0];
    let maxValue = numberArray[0];

    for (let i = 0; i < numberArray.length; i++) {
        if (numberArray[i] < minValue) {
            minValue = numberArray[i];
        }

        if (numberArray[i] > maxValue) {
            maxValue = numberArray[i];
        }
    }
    return {
        minimum: minValue,
        maximum: maxValue
    };
}

const phonePrices = [1303, 304, 455, 34432, 13];

const minMaxResult = findMinAndMax(phonePrices);

console.log("Prices' array:", phonePrices);
console.log("Minimum value:", minMaxResult.minimum);
console.log("Мaximum value:", minMaxResult.maximum);


function areObjectsEqual(firstObject, secondObject) {
    const firstObjectKeys = Object.keys(firstObject);
    const secondObjectKeys = Object.keys(secondObject);

    if (firstObjectKeys.length !== secondObjectKeys.length) {
        return false;
    }

    for (let key of firstObjectKeys) {
        if (firstObject[key] !== secondObject[key]) {
            return false;
        }
    }

    return true;
}

const firstStudent = {
    firstName: "Kate",
    age: 18,
    averageScore: 90
};

const secondStudent = {
    firstName: "Anna",
    age: 18,
    averageScore: 90
};

const thirdStudent = {
    firstName: "Simon",
    age: 21,
    averageScore: 100
};

console.log("firstStudent і secondStudent однакові:",
    areObjectsEqual(firstStudent, secondStudent));

console.log("firstStudent і thirdStudent однакові:",
    areObjectsEqual(firstStudent, thirdStudent));