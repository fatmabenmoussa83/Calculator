const display = document.getElementById('display');
const clearBtn = document.getElementById('clear');
const backspaceBtn = document.getElementById('backspace');
const operatorBtns = document.querySelectorAll('.operator');
const digitBtns = document.querySelectorAll('.digit');
const decimalBtn = document.getElementById('decimal');
const equalsBtn = document.getElementById('equals');

let currentInput = '';
let firstNumber = '';
let operator = '';
let secondNumber = '';

function updateDisplay() {
  display.textContent = currentInput;
}

digitBtns.forEach(button => {
  button.addEventListener('click', () => {
      if (currentInput === "0") {
          currentInput = button.textContent;
      } else {
          currentInput += button.textContent;
      }
      display.textContent = currentInput;
  });
});

decimalBtn.addEventListener('click', () => {
  if (!currentInput.includes('.')) {
    currentInput += '.';
    updateDisplay();
  }
});

clearBtn.addEventListener('click', () => {
  currentInput = "0";
  display.textContent = currentInput;
});

backspaceBtn.addEventListener('click', () => {
  currentInput = currentInput.slice(0, -1);
  if (currentInput === "") {
      currentInput = "0";
  }
  display.textContent = currentInput;
});

operatorBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    if (currentInput === '') {
      return;
    }
    if(checkOperator(currentInput[currentInput.length-1])) {
      operator = btn.textContent;
      currentInput = currentInput.slice(0, currentInput.length-1)
      currentInput += operator;
      updateDisplay();
      return;
    }
    if (firstNumber === '') {
      firstNumber = currentInput;
      operator = btn.textContent;
      currentInput += operator;
      updateDisplay();
    } else {
      secondNumber = getSecondNumber(currentInput);
      operate();
      operator = btn.textContent;
      currentInput += operator;
      updateDisplay();
    }
  });
});

function getSecondNumber(str) {
  for(let i = 0; i < str.length; i++) {
    if (checkOperator(str[i])) {
      return str.slice(i+1,str.length)
    }
  }
}
function checkOperator(str) {
  if(str === '+' || str === '-' ||str === '*' || str === '/') {
    return true;
  }
  return false;
}

equalsBtn.addEventListener('click', () => {
  if (firstNumber !== '' && operator !== '' && currentInput !== '') {
    secondNumber = getSecondNumber(currentInput);
    operate();
  }
});

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) {
    display.textContent = "Error: Cannot divide by zero!";
    currentInput = '';
    firstNumber = '';
    operator = '';
    secondNumber = '';
    return;
  }
  return a / b;
}

function operate() {
  firstNumber = parseFloat(firstNumber);
  secondNumber = parseFloat(secondNumber);
  switch (operator) {
    case '+':
      currentInput = add(firstNumber, secondNumber).toString();
      break;
    case '-':
      currentInput = subtract(firstNumber, secondNumber).toString();
      break;
    case '*':
      currentInput = multiply(firstNumber, secondNumber).toString();
      break;
    case '/':
      currentInput = divide(firstNumber, secondNumber).toString();
      break;
  }
  updateDisplay();
  firstNumber = currentInput;
  operator = '';
  secondNumber = '';
}

// Keyboard support
document.addEventListener('keydown', (event) => {
  const key = event.key;
  if (/\d/.test(key)) {
    document.getElementById(key).click();
  } else if (checkOperator(key)) {
    const operatorMap = {
      '+': 'add',
      '-': 'subtract',
      '*': 'multiply',
      '/': 'divide',
    };
    document.getElementById(operatorMap[key]).click();
  } else if (key === 'Enter') {
    equalsBtn.click();
  } else if (key === '.' && !currentInput.includes('.')) {
    decimalBtn.click();
  } else if (key === 'Backspace') {
    backspaceBtn.click();
  }
});