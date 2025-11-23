let currentInput = '0'; 
let firstOperand = null; 
let operator = null; 
let waitingForSecondOperand = false; 
let memoryValue = 0; 

let calculationHistory = []; 
const MAX_HISTORY = 5; 

const resultDisplay = document.getElementById('result');
const historyDisplay = document.getElementById('history');

function updateDisplay() {
    resultDisplay.innerText = currentInput;
    
    if (waitingForSecondOperand && firstOperand !== null) {
        historyDisplay.innerText = `${firstOperand} ${operator}`;
    } else if (firstOperand !== null && operator !== null) {
        historyDisplay.innerText = `${firstOperand} ${operator} ${currentInput}`;
    } else {
        historyDisplay.innerText = '';
    }
}

function appendNumber(number) {
    if (currentInput.length >= 15 && !waitingForSecondOperand) return;

    if (waitingForSecondOperand) {
        currentInput = number;
        waitingForSecondOperand = false;
    } else {
        if (currentInput === '0' || currentInput.includes('Error')) {
            currentInput = number;
        } else {
            currentInput += number;
        }
    }
    updateDisplay();
}

function appendDecimal() {
    if (currentInput.includes('Error')) {
        currentInput = '0.';
        waitingForSecondOperand = false;
        updateDisplay();
        return;
    }

    if (waitingForSecondOperand) {
        currentInput = '0.';
        waitingForSecondOperand = false;
        updateDisplay();
        return;
    }
    if (!currentInput.includes('.')) {
        currentInput += '.';
    }
    updateDisplay();
}

function setOperator(nextOperator) {
    const inputValue = parseFloat(currentInput);

    if (currentInput.includes('Error')) {
        return; 
    }

    if (operator && waitingForSecondOperand) {
        operator = nextOperator;
        updateDisplay();
        return;
    }

    if (firstOperand === null) {
        firstOperand = inputValue;
    } else if (operator) {
        calculate(); 
        firstOperand = parseFloat(resultDisplay.innerText);
    }

    waitingForSecondOperand = true;
    operator = nextOperator;
    updateDisplay();
}

function calculate() {
    if (operator === null || waitingForSecondOperand) {
        return;
    }

    const val1 = parseFloat(firstOperand);
    const val2 = parseFloat(currentInput);

    let result = 0;
    let calculationString = `${val1} ${operator} ${val2}`;
    
    if (operator === '/' && val2 === 0) {
        currentInput = 'Error: Dibagi 0'; 
        operator = null;
        firstOperand = null;
        updateDisplay();
        return; 
    }

    switch (operator) {
        case '+': result = val1 + val2; break;
        case '-': result = val1 - val2; break;
        case '*': result = val1 * val2; break;
        case '/': result = val1 / val2; break;
        default: return;
    }

    addToHistory(calculationString, result); 
    
    result = parseFloat(result.toFixed(10)); 

    currentInput = result.toString();
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = false;
    updateDisplay();
}

function clearAll() {
    currentInput = '0';
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = false;
    updateDisplay();
}

function clearEntry() {
    currentInput = '0';
    updateDisplay();
}

function backspace() {
    if (currentInput.includes('Error') || waitingForSecondOperand) {
        currentInput = '0';
        updateDisplay();
        return;
    }
    
    currentInput = currentInput.slice(0, -1);

    if (currentInput.length === 0 || currentInput === '-') {
        currentInput = '0';
    }
    
    updateDisplay();
}

function memoryPlus() {
    if (currentInput.includes('Error')) return;
    memoryValue += parseFloat(currentInput);
    updateDisplay();
}

function memoryMinus() {
    if (currentInput.includes('Error')) return;
    memoryValue -= parseFloat(currentInput);
    updateDisplay();
}

function memoryRecall() {
    currentInput = memoryValue.toString();
    waitingForSecondOperand = false;
    updateDisplay();
}

function memoryClear() {
    memoryValue = 0;
    updateDisplay();
}

function addToHistory(calculation, result) {
    const time = new Date().toLocaleTimeString();
    const historyItem = {
        calc: calculation,
        res: result,
        time: time
    };
    calculationHistory.unshift(historyItem); 
    if (calculationHistory.length > MAX_HISTORY) {
        calculationHistory.pop();
    }
}

function showHistory() {
    const modal = document.getElementById('historyModal');
    const historyList = document.getElementById('historyList');
    
    historyList.innerHTML = ''; 

    if (calculationHistory.length === 0) {
        historyList.innerHTML = '<li>Tidak ada riwayat perhitungan.</li>';
    } else {
        calculationHistory.forEach((item, index) => {
            const listItem = document.createElement('li');
            
            listItem.setAttribute('onclick', `useHistoryResult(${index})`);
            listItem.classList.add('history-item-clickable'); 
            
            listItem.innerHTML = `(${item.time}) <strong>${item.calc}</strong> = <strong>${item.res}</strong>`;
            historyList.appendChild(listItem);
        });
    }

    modal.style.display = 'block';
}

function useHistoryResult(index) {
    if (index >= 0 && index < calculationHistory.length) {
        const resultToUse = calculationHistory[index].res;
        
        currentInput = resultToUse.toString();
        firstOperand = null;
        operator = null;
        waitingForSecondOperand = false;
        
        updateDisplay();
        closeHistory(); 
    }
}

function closeHistory() {
    document.getElementById('historyModal').style.display = 'none';
}

window.onclick = function(event) {
    const modal = document.getElementById('historyModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

window.addEventListener('keydown', function(event) {
    const key = event.key;
    
    if (/[0-9]/.test(key)) {
        appendNumber(key);
    } 
    else if (key === '+' || key === '-' || key === '*' || key === '/') {
        setOperator(key);
    } 
    else if (key === 'Enter' || key === '=') {
        event.preventDefault(); 
        calculate();
    }
    else if (key === '.') {
        appendDecimal();
    }
    else if (key === 'Escape') {
        clearAll();
    }
    else if (key === 'Backspace') {
        backspace();
    }
});

updateDisplay();
