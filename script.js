"use script;";
console.log("hello world");

///////////////////////////////////////
// global variables

let currentScreen = "";
let calculatedValue = 0;
let calcArr = [0];
let operatorFlag = false;
const maxNumberDigits = 11;

///////////////////////////////////////
// DOM elements

const btn7 = document.querySelector("#btn-num-7");
const btn8 = document.querySelector("#btn-num-8");
const btn9 = document.querySelector("#btn-num-9");
const btnDivide = document.querySelector("#btn-divide");

const btn4 = document.querySelector("#btn-num-4");
const btn5 = document.querySelector("#btn-num-5");
const btn6 = document.querySelector("#btn-num-6");
const btnMultiply = document.querySelector("#btn-multiply");

const btn1 = document.querySelector("#btn-num-4");
const btn2 = document.querySelector("#btn-num-5");
const btn3 = document.querySelector("#btn-num-6");
const btnMinus = document.querySelector("#btn-minus");

const btn0 = document.querySelector("#btn-num-0");
const btnPoint = document.querySelector("#btn-num-point");
const btnPercentage = document.querySelector("#btn-num-percentage");
const btnPlus = document.querySelector("#btn-plus");

const btnClearAll = document.querySelector("#btn-clear-all");
const btnDel = document.querySelector("#btn-del");
const btnEquals = document.querySelector("#btn-equals");
const btnPlusMinus = document.querySelector("#btn-plus-minus");

const output = document.querySelector(".output-screen");
const divideZero = document.querySelector(".divide-zero");

///////////////////////////////////////
// calculation functions

const add = function (a, b) {
  return Number(a) + Number(b);
};

const subtract = function (a, b) {
  return Number(a) - Number(b);
};

const multiply = function (a, b) {
  return Number(a) * Number(b);
};

const divide = function (a, b) {
  if (b == 0) {
    divideByZero();
    return "";
  }

  return Number(a) / Number(b);
};

const operate = function (operator, a, b) {
  console.log(`operator: ${operator}, a: ${a}, b: ${b}`);
  let result = 0;
  // do calculation and return a string after the calc
  if (operator == "+") result = add(a, b);
  if (operator == "-") result = subtract(a, b);
  if (operator == "*") result = multiply(a, b);
  if (operator == "/") result = divide(a, b);

  console.log(`result: ${result}`);

  //convert to string so we can use .length
  result += "";
  // if the result is too big for the screen, we need to
  // do some calculations to fit the number
  if (result.length > maxNumberDigits) return fitNumber(result);
  return result;
};

const fitNumber = function (result) {
  // if the result is a number with a decimal point
  // and doesn't include an exponent (eg. 0.333333 or 523.1919191)
  if (result.includes(".") && !result.includes("e")) {
    // this regex gets all the digits before the decimal point
    const wholeNumber = result.match(/\d*(?=[.])/) + "";
    // this regex gets everything after the decimal point
    let decimalNumber = result.match(/[^.]*$/) + "";

    // we want to find how many decimals we are allowed
    // based on the number of wholeNumber digits
    const numOfDecimalsAllowed = maxNumberDigits - wholeNumber.length;

    // in this case, the wholeNumber is already too big
    // just return the whole number as an exponential
    if (numOfDecimalsAllowed <= 0) {
      result = Number(wholeNumber).toExponential(2);
      return result + "";
    }

    // here we cut off the number of allowed decimals, and round the last decimal
    // after our maximum allowed numbers and convert back to string
    decimalNumber =
      Math.round(Number(decimalNumber.slice(0, numOfDecimalsAllowed)) / 10) +
      "";

    // we need to account for the case that the wholeNumber is already
    // the maximum allowed digits check for the case that
    // numOfDecimalsAllowed is zero - in this case, we want to round
    // the whole number based on the decimal
    // note here:  the decimal number calculated above
    // will either be 0 or 1 in this case
    console.log(`number of decimals allowed: ${numOfDecimalsAllowed}`);
    if (!numOfDecimalsAllowed) {
      console.log(
        `whole number is ${wholeNumber} and decimal number is ${decimalNumber}`
      );
      return Number(wholeNumber) + Number(decimalNumber) + "";
    }
    console.log(
      `whole number is ${wholeNumber} and decimal number is ${decimalNumber}`
    );
    return wholeNumber + "." + decimalNumber;
  }
  result = Number(result).toExponential(2);
  return result + "";
};

///////////////////////////////////////
// button functions

///////////////////////////////////////
// all clear
const allClearPushed = function () {
  updateScreen(0);
  calculatedValue = 0;
  calcArr = [0];
  unToggleOperators();
  operatorFlag = 1;
  return null;
};

///////////////////////////////////////
// clear
const clearPushed = function () {
  if (btnClearAll.textContent == "C") {
    // remove the last letter of the string in the calculator
    currentScreen = 0;
    // if there is an element in the array, we already have a result stored for the next calculation, update the number in the calcArr when we hit the delete key
    if (calcArr.length == 1) {
      calcArr[0] = 0;
    }
    operatorFlag = true;
    updateScreen(currentScreen);
    toggleClear(false);
    btnClearAll.textContent = "AC";
    console.log("did we get here?");
  } else {
    // all clear
    allClearPushed();
  }
};

///////////////////////////////////////
// Equals is pressed

const equalsPushed = function (e) {
  // if there are two elements in the calcArray, we should run the calculation
  if (calcArr.length === 2) {
    calcArr.push(currentScreen);
    const result = operate(calcArr[1], calcArr[0], calcArr[2]);
    updateScreen(result);
    calcArr = [];
    calcArr.push(result);
  }
  unToggleOperators();
  operatorFlag = true;
};

///////////////////////////////////////
// an operator is pressed

const operatorPushed = function (e) {
  // if a second operator is pressed twice
  if (operatorFlag) {
    unToggleOperators();
    calcArr[1] = e.target.textContent;
    e.target.classList.add("operator-pressed");
    return;
  }

  operatorFlag = true;
  if (calcArr.length == 2) {
    calcArr.push(output.textContent);
    console.log(calcArr);
    const result = operate(calcArr[1], calcArr[0], calcArr[2]);
    updateScreen(result);
    calcArr = [];
    console.log("did this happen twice?");
    calcArr.push(result);
    calcArr.push(e.target.textContent);
    console.log(calcArr);
  } else if (calcArr.length == 1) {
    calcArr[0] = currentScreen;
    calcArr.push(e.target.textContent);
  } else {
    calcArr.push(currentScreen);
    calcArr.push(e.target.textContent);
  }
  e.target.classList.add("operator-pressed");
};

const numButtonPushed = function (e) {
  // make sure we can't use two decimal points in a single line
  // unless operator button is pressed, then allow
  if (
    (currentScreen + "").includes(".") &&
    e.target.textContent === "." &&
    !operatorFlag
  )
    return;

  // account for the case that the user presses "." first or after using an operator
  if (
    (e.target.textContent === "." && currentScreen == 0) ||
    (e.target.textContent === "." && operatorFlag)
  ) {
    currentScreen = "0";
    console.log(`current screen ${currentScreen}`);
    currentScreen += ".";
    console.log(`current screen ${currentScreen}`);
    updateScreen(currentScreen);
    console.log("got here");
    operatorFlag = false;
    toggleClear(1);
    return;
  }

  //if we have filled the screen and we don't have an
  //operator selected, do nothing
  if (currentScreen.length >= maxNumberDigits && !operatorFlag) return;
  // we toggle the clear on any time a number is pushed
  toggleClear(1);
  if (!operatorFlag) {
    // if we don't have an operator selected
    currentScreen += e.target.textContent;
    updateScreen(currentScreen);
    operatorFlag = false;
    unToggleOperators();
  } else {
    // we have an operator selected, so clear the screen
    // by setting the new number to be the button pressed
    currentScreen = e.target.textContent;
    updateScreen(currentScreen);
    operatorFlag = false;
    unToggleOperators();
  }
};

///////////////////////////////////////
// plus/minus button pressed

const plusMinusPushed = function () {
  let invertedNum = Number(currentScreen) * -1;
  console.log(invertedNum > 9e8);
  console.log(`invertedNum length = ${invertedNum.length}`);
  if ((invertedNum + "").length > maxNumberDigits + 1) {
    invertedNum = Number(invertedNum).toExponential(2);
    console.log(`invertedNum after checking length ${invertedNum}`);
  }
  updateScreen(invertedNum);
  if (calcArr.length === 1) calcArr[0] = invertedNum;
  console.log("calcArr after plusminus");
  console.log(calcArr);
};

///////////////////////////////////////
// percentage sign pressed

///////////////////////////////////////
// helper functions

const unToggleOperators = function () {
  btnDivide.classList.remove("operator-pressed");
  btnMultiply.classList.remove("operator-pressed");
  btnPlus.classList.remove("operator-pressed");
  btnMinus.classList.remove("operator-pressed");
};

const updateScreen = function (str) {
  currentScreen = str;
  output.textContent = currentScreen;
};

const toggleClear = function (bool) {
  bool ? (btnClearAll.textContent = "C") : (btnClearAll.textContent = "AC");
  console.log(btnClearAll.textContent);
};

const divideByZero = function () {
  let counter = 30;
  let meaningOfLifeCounter = 0;
  const meaningOfLifeMessage =
    "epstein didn't kill himself doge coin to the moon";
  output.textContent = "";
  output.style.fontSize = "10px";
  const meaningOfLifeInterval = setInterval(() => {
    output.textContent += meaningOfLifeMessage.slice(
      meaningOfLifeCounter,
      meaningOfLifeCounter + 1
    );
    meaningOfLifeCounter++;
    if (meaningOfLifeCounter > meaningOfLifeMessage.length) {
      output.style.fontSize = "150%";
      output.textContent = "0";
      clearInterval(meaningOfLifeInterval);
    }
  }, 100);

  let divideZeroInterval = setInterval(() => {
    if (counter == 30) {
      divideZero.style.display = "block";
    }
    counter--;
    console.log(divideZero.textContent);
    if (counter % 2 == 0) divideZero.textContent = "🔥";
    else divideZero.textContent = "💥";
    if (counter < 1) {
      divideZero.style.display = "none";
      clearInterval(divideZeroInterval);
    }
  }, 100);
};

///////////////////////////////////////
// button event listeners

const numButtons = document.querySelectorAll(".btn-num");
numButtons.forEach((button) => {
  button.addEventListener("click", numButtonPushed);
});

btnMinus.addEventListener("click", operatorPushed);
btnDivide.addEventListener("click", operatorPushed);
btnPlus.addEventListener("click", operatorPushed);
btnMultiply.addEventListener("click", operatorPushed);

btnEquals.addEventListener("click", equalsPushed);
btnClearAll.addEventListener("click", clearPushed);
btnPlusMinus.addEventListener("click", plusMinusPushed);
btnPercentage;
