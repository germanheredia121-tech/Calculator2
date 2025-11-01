let runningTotal = 0;
let buffer = "0";
let previousOperator = null;
let shouldResetScreen = false;
let expression = "";

const screen = document.querySelector(".screen");

function buttonClick(value) {
    if (isNaN(value)) {
        handleSymbol(value);
    } else {
        handleNumber(value);
    }
    screen.innerText = expression || buffer;
}

function handleSymbol(symbol) {
    switch (symbol) {
        case "C":
            buffer = "0";
            runningTotal = 0;
            previousOperator = null;
            shouldResetScreen = false;
            expression = "";
            break;
        case "=":
            if (previousOperator === null) {
                return;
            }
            flushOperation(parseInt(buffer));
            previousOperator = null;
            buffer = runningTotal.toString();
            expression = buffer;
            runningTotal = 0;
            shouldResetScreen = true;
            break;
        case '←':
            if (shouldResetScreen) {
                buffer = "0";
                expression = "";
                shouldResetScreen = false;
                break;
            }
            if (buffer.length === 1) {
                buffer = "0";
            } else {
                buffer = buffer.substring(0, buffer.length - 1);
            }
            // sincronizar expression
            if (expression.length > 0) {
                expression = expression.substring(0, expression.length - 1);
            }
            break;
        case "+":
        case "-":
        case "−": // cubre el &minus; si aparece
        case "×":
        case "÷":
            handleMath(symbol === "−" ? "-" : symbol);
            break;
    }
}

function handleMath(symbol) {
    // si ya se pulsó una operación y no se escribió un nuevo número,
    // solo cambiamos el operador (evita mostrar 0 en pantalla y permite editar el operador)
    if (shouldResetScreen) {
        // reemplazar último operador en expression
        if (expression.length > 0) {
            expression = expression.slice(0, -1) + symbol;
        } else {
            expression = buffer + symbol;
        }
        previousOperator = symbol;
        return;
    }

    const intBuffer = parseInt(buffer);
    if (runningTotal === 0) {
        runningTotal = intBuffer;
    } else {
        flushOperation(intBuffer);
    }
    previousOperator = symbol;
    // añadir operador a la expresión
    if (expression === "" ) {
        expression = intBuffer.toString() + symbol;
    } else {
        expression += symbol;
    }
    shouldResetScreen = true;
}

function flushOperation(intBuffer) {
    if (previousOperator === "+") {
        runningTotal += intBuffer;
    } else if (previousOperator === "-" ) {
        runningTotal -= intBuffer;
    } else if (previousOperator === "×") {
        runningTotal *= intBuffer;
    } else if (previousOperator === "÷") {
        runningTotal /= intBuffer;
    }
}

function handleNumber(numberString) {
    if (buffer === "0" || shouldResetScreen) {
        // empezamos un nuevo número
        buffer = numberString;
        if (shouldResetScreen && previousOperator === null) {
            // después de =, reemplazamos la expresión
            expression = buffer;
        } else if (shouldResetScreen) {
            // había un operador al final de expression
            expression += buffer;
        } else {
            // caso inicial
            expression = buffer;
        }
        shouldResetScreen = false;
    } else {
        buffer += numberString;
        expression += numberString;
    }
}

function init() {
    document.querySelector(".calc-buttons").addEventListener("click", function(event) {
        buttonClick(event.target.innerText.trim());
    });
}
init();