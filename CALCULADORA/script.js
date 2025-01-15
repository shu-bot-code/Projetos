// Seletores principais
const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');
const clearBtn = document.getElementById('clear');
const equalBtn = document.getElementById('equal');
const themeToggleBtn = document.getElementById('theme-toggle');
const historyList = document.getElementById('history-list');

// Variáveis de estado
let currentInput = '';
let previousInput = '';
let operator = '';

// ============ Funções de Histórico ============ //
function addToHistory(operation, result) {
  const li = document.createElement('li');
  li.textContent = `${operation} = ${result}`;
  historyList.appendChild(li);
}

// =========== Lógica de Clique nos Botões =========== //
buttons.forEach((button) => {
  button.addEventListener('click', () => {
    const value = button.getAttribute('data-value');

    // Botão "C"
    if (button.id === 'clear') {
      currentInput = '';
      previousInput = '';
      operator = '';
      display.textContent = '0';
      return;
    }

    // Botão "="
    if (button.id === 'equal') {
      if (currentInput && previousInput && operator) {
        // Evitar divisão por zero
        if (operator === '/' && currentInput === '0') {
          display.textContent = 'Erro';
          return;
        }
        const result = eval(`${previousInput} ${operator} ${currentInput}`);
        addToHistory(`${previousInput} ${operator} ${currentInput}`, result);
        display.textContent = result;
        previousInput = '';
        currentInput = '';
        operator = '';
      }
      return;
    }

    // Verifica se é operador
    if (['+', '-', '*', '/', '%', 'sqrt'].includes(value)) {
      // Raiz quadrada
      if (value === 'sqrt') {
        if (!currentInput) {
          currentInput = '0';
        }
        currentInput = Math.sqrt(parseFloat(currentInput)).toString();
        display.textContent = currentInput;
        return;
      }
      // Porcentagem
      if (value === '%') {
        if (!currentInput) {
          currentInput = '0';
        }
        currentInput = (parseFloat(currentInput) / 100).toString();
        display.textContent = currentInput;
        return;
      }
      // Se há um número já digitado, registra operador
      if (currentInput) {
        operator = value;
        previousInput = currentInput;
        currentInput = '';
      }
      return;
    }

    // Números e ponto
    currentInput += value;
    display.textContent = currentInput;
  });
});

// =========== Suporte a Teclado =========== //
document.addEventListener('keydown', (event) => {
  const key = event.key;

  // Teclas numéricas e ponto
  if ((!isNaN(key) && key !== ' ') || key === '.') {
    currentInput += key;
    display.textContent = currentInput;
  }
  // Operadores básicos
  else if (['+', '-', '*', '/'].includes(key)) {
    operator = key;
    previousInput = currentInput;
    currentInput = '';
  }
  // Tecla Enter para "="
  else if (key === 'Enter') {
    if (currentInput && previousInput && operator) {
      // Evitar divisão por zero
      if (operator === '/' && currentInput === '0') {
        display.textContent = 'Erro';
        return;
      }
      const result = eval(`${previousInput} ${operator} ${currentInput}`);
      addToHistory(`${previousInput} ${operator} ${currentInput}`, result);
      display.textContent = result;
      previousInput = '';
      currentInput = '';
      operator = '';
    }
  }
  // Backspace para apagar o último dígito
  else if (key === 'Backspace') {
    currentInput = currentInput.slice(0, -1);
    display.textContent = currentInput || '0';
  }
});

// =========== Alternar Tema Claro/Escuro =========== //
themeToggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});
