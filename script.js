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
          if(LimitNumberOfDigits(currentInput + button.textContent)) {
            display.textContent = "can't enter more than 23 digits";
            return;
          }
          currentInput += button.textContent;
          if(/[+|-|/|*]/.test(currentInput) && !checkOperator(currentInput[currentInput.length-1])) {
            secondNumber = getSecondNumber(currentInput);
          }
      }
      updateDisplay();
  });
});

decimalBtn.addEventListener('click', () => {
  if (!currentInput.includes('.')) {
    if(/\D/.test(currentInput[currentInput.length -1])) {
      currentInput+= '0';
    }
    currentInput += '.';
    updateDisplay();
  }
  if(LimitNumberOfDigits(currentInput + decimalBtn.textContent)) {
    display.textContent = "can't enter more than 23 digits";
    return;
  }
});

clearBtn.addEventListener('click', () => {
  currentInput = "0";
  firstNumber = '';
  secondNumber = '';
  operator = '';
  updateDisplay();
});

backspaceBtn.addEventListener('click', () => {
  currentInput = currentInput.slice(0, -1);
  if(secondNumber === '') {
    operator = '';
  } else if(secondNumber !== '') {
    secondNumber = '';
  }
  if (currentInput === "") {
      currentInput = "0";
  }
  updateDisplay();
});

operatorBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    if (currentInput === '') {
      currentInput = '0';
      updateDisplay();
    }
    if(checkOperator(currentInput[currentInput.length-1])) {
      operator = btn.textContent;
      currentInput = currentInput.slice(0, currentInput.length-1)
      currentInput += operator;
      updateDisplay();
      return;
    }
    if(LimitNumberOfDigits(currentInput + btn.textContent)) {
      display.textContent = "can't enter more than 23 digits";
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



equalsBtn.addEventListener('click', () => {
  secondNumber = getSecondNumber(currentInput);
  if(secondNumber === '') {
    display.textContent = "enter second operand";
    return;
  }
  if (firstNumber !== '' && operator !== '' && currentInput !== '') {
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
      if(secondNumber === 0) {
        display.textContent = "Genius so u can divide by 0 ;)";
        currentInput = currentInput.slice(0, currentInput.length - 2);
        secondNumber = '';
        operator = '';
        return;
      }
      currentInput = divide(firstNumber, secondNumber).toString();
      break;
  }
  currentInput = roundLongDecimals(currentInput);
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

function roundLongDecimals(str) {
  if(str.includes('.')) {
    let check = 0;
    for(let i = str.length; i >= 0; i--) {
      if(str[i] === '.') {
        check = i;
      }
    }
    if(str.length - check >= 10) {
      str = parseFloat(str) * 10000000;
      str = Math.round(str) / 10000000;
      return str.toString();
    }
  }
  return str;
}

function LimitNumberOfDigits(str) {
  if(str.length >= 24) {
    return true;
  }
  return false;
}