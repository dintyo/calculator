"use script;";
console.log("hello world");

///////////////////////////////////////
// global variables

let currentScreen = "";
let calculatedValue = 0;

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

const btnClear = document.querySelector("#btn-clear");
const btnDel = document.querySelector("#btn-del");
const btnEquals = document.querySelector("#btn-equals");

const output = document.querySelector(".output-screen");

const updateScreen = function (e) {
  if (e.target.textContent === "clear") {
    output.textContent = "";
    currentScreen = "";
    return null;
  }
  console.log(e.target);
  currentScreen += e.target.textContent;
  output.textContent = currentScreen;
};

const allButtons = document.querySelectorAll(".btn-calculator");
allButtons.forEach((button) => {
  button.addEventListener("click", updateScreen);
});
