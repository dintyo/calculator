"use script;";
console.log("hello world");

///////////////////////////////////////
// global variables

let currentScreen = "";
let calculatedValue = 0;
let calcArr = [];
let operatorFlag = false;

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
const btnModulo = document.querySelector("#btn-num-modulo");
const btnPlus = document.querySelector("#btn-plus");

const btnClear = document.querySelector("#btn-clear");
const btnDel = document.querySelector("#btn-del");
const btnEquals = document.querySelector("#btn-equals");

const output = document.querySelector(".output-screen");

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
  return Number(a) / Number(b);
};

const operate = function (operator, a, b) {
  // do calculation and return a string after the calc
  if (operator == "+") return add(a, b) + "";
  if (operator == "-") return subtract(a, b) + "";
  if (operator == "*") return multiply(a, b) + "";
  if (operator == "/") return divide(a, b) + "";

  console.log("operator was not valid");
};

///////////////////////////////////////
// function to update screen when buttons are pushed

const buttonPushed = function (e) {
  ///////////////////////////////////////
  // clear is pressed

  if (e.target.textContent === "AC") {
    output.textContent = "";
    currentScreen = "";
    calculatedValue = 0;
    calcArr = [];
    unToggleOperators();
    return null;
  }

  ///////////////////////////////////////
  // delete is pressed

  if (e.target.textContent === "C") {
    // remove the last letter of the string in the calculator
    currentScreen = 0;
    // if there is an element in the array, we already have a result stored for the next calculation, update the number in the calcArr when we hit the delete key
    if (calcArr.length == 1) {
      calcArr[0] = 0;
    }
    operatorFlag = true;
    updateScreen(currentScreen);
    // exit the function
    return null;
  }
  ///////////////////////////////////////
  // Equals is pressed

  if (e.target.textContent === "=") {
    // if there are two elements in the calcArray, we should run the calculation
    if (calcArr.length === 2) {
      calcArr.push(currentScreen);
      const result = operate(calcArr[1], calcArr[0], calcArr[2]);
      updateScreen(result);
      calcArr = [];
      calcArr.push(result);
    }
    operatorFlag = true;
    return null;
  }
  ///////////////////////////////////////
  // an operator is pressed
  if (
    e.target.textContent == "+" ||
    e.target.textContent == "-" ||
    e.target.textContent == "/" ||
    e.target.textContent == "*"
  ) {
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
  } else {
    // add whatever is pressed to the screen

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
  }

  console.log(calcArr);
};

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

const allButtons = document.querySelectorAll(".btn-calculator");
allButtons.forEach((button) => {
  button.addEventListener("click", buttonPushed);
});
