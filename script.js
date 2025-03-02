const startButton = document.getElementById('start-button');
const resultDiv = document.getElementById('result');
const historyList = document.getElementById('history-list');
const clearHistoryButton = document.querySelector('.clear-history');
const usernameDisplay = document.getElementById('username-display'); 

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.interimResults = false;
recognition.lang = 'en-US';

function displayUsername() {
    const username = sessionStorage.getItem('sessionUser');
    if (username) {
        usernameDisplay.textContent = `Welcome, ${username}!`;
    } else {
        usernameDisplay.textContent = ''; 
    }
}

window.onload = () => {
    displayUsername(); 
};

startButton.addEventListener('click', () => {
    recognition.start();
    updateResult('', 'Listening...');
    startButton.disabled = true;
    updateButtonState(true);
});

recognition.addEventListener('result', (event) => {
    const transcript = event.results[0][0].transcript;
    updateResult(`You said: ${transcript}`, '');
    calculateResult(transcript);
});

recognition.addEventListener('end', () => {
    const currentResult = resultDiv.querySelector('.result-text')?.textContent || '';
    updateResult(currentResult, '(Stopped listening)');
    updateButtonState(false);
    startButton.disabled = false;
});

recognition.addEventListener('start', () => {
    updateButtonState(true);
});

function updateButtonState(isListening) {
    startButton.innerHTML = isListening
        ? `<span class="listening-indicator"></span>Listening...`
        : `<i class="fas fa-microphone"></i>Start Listening`;
}

function updateResult(mainText, statusText) {
    resultDiv.innerHTML = `
        ${mainText ? `<div class="result-text ${mainText.startsWith('Error:') ? 'error' : ''}">${mainText}</div>` : ''}
        ${statusText ? `<div class="result-status">${statusText}</div>` : ''}
    `;
}

function calculateResult(input) {
    try {
        const lowerInput = input.toLowerCase().replace(/what is|calculate|find|tell me/g, '').trim();

        if (lowerInput.includes('percent of') || lowerInput.includes('% of')) {
            calculatePercentOf(lowerInput);
            return;
        }

        if (lowerInput.includes('square root of')) {
            calculateSquareRoot(lowerInput);
            return;
        }

        if (lowerInput.includes('square of')) {
            calculateSquare(lowerInput);
            return;
        }

        if (lowerInput.includes('celsius to fahrenheit')) {
            convertCelsiusToFahrenheit(lowerInput);
            return;
        }

        if (lowerInput.includes('fahrenheit to celsius')) {
            convertFahrenheitToCelsius(lowerInput);
            return;
        }

        evaluateExpression(lowerInput, input);
    } catch (error) {
        updateResult(`Error: ${error.message}`, '');
    }
}

function calculatePercentOf(input) {
    let parts;
    if (input.includes('percent of')) {
        parts = input.split('percent of');
    } else if (input.includes('% of')) {
        parts = input.split('% of');
    } else {
        return;
    }
    
    const value = extractNumber(parts[0]);
    const total = extractNumber(parts[1]);
    const result = (value / 100) * total;
    displayResult(`${value} percent of ${total} = ${result}`, result);
}

function calculateSquareRoot(input) {
    const value = extractNumber(input);
    const result = Math.sqrt(value);
    displayResult(`Square root of ${value} = ${result}`, result);
}

function calculateSquare(input) {
    const value = extractNumber(input);
    const result = Math.pow(value, 2);
    displayResult(`Square of ${value} = ${result}`, result);
}

function convertCelsiusToFahrenheit(input) {
    const value = extractNumber(input);
    const result = (value * 9 / 5) + 32;
    displayResult(`${value} Celsius to Fahrenheit = ${result}`, result);
}

function convertFahrenheitToCelsius(input) {
    const value = extractNumber(input);
    const result = (value - 32) * 5 / 9;
    displayResult(`${value} Fahrenheit to Celsius = ${result}`, result);
}

function evaluateExpression(lowerInput, originalInput) {
    const formattedInput = lowerInput
        .replace(/plus/g, '+')
        .replace(/minus/g, '-')
        .replace(/times/g, '*')
        .replace(/multiplied by/g, '*')
        .replace(/divided by/g, '/')
        .replace(/x/g, '*');

    const result = eval(formattedInput);
    displayResult(`${originalInput} = ${result}`, result);
}

function extractNumber(input) {
    const matches = input.match(/-?\d+(\.\d+)?/);
    return matches ? parseFloat(matches[0]) : 0;
}

function displayResult(resultText, result) {
    updateResult(resultText, '');
    resultDiv.classList.remove('error');
    addToHistory(resultText);
}

function addToHistory(calculation) {
    const listItem = document.createElement('li');
    listItem.textContent = calculation;
    historyList.prepend(listItem);

    if (historyList.children.length > 10) {
        historyList.removeChild(historyList.lastChild);
    }
}

clearHistoryButton.addEventListener('click', () => {
    while (historyList.firstChild) {
        historyList.removeChild(historyList.firstChild);
    }
});
