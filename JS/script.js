const canvas = document.getElementById('calculatorCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 362;
    canvas.height = 510;

    // Calculator properties
    const buttonWidth = 70;
    const buttonHeight = 70;
    const buttonSpacing = 2;
    const textColor = '#ffffff';
    const fontSize = 30;

    const buttons = ['','','','%','/','(','7','8','9','*',')','4','5','6','-','Back','1','2','3','+','0','0','0','.','='];


    let expression = '';
    let result = '';

    // Function to draw a button
    function drawButton(x, y, text, i) {
        let buttonColor = (i < 4) ? '#606464' : '#807c7c'; 
        if (i == 4 ||  i == 9 ||  i == 14 ||  i == 19 ||  i == 24) {
            buttonColor = '#ff9c0c'; 
        }
        ctx.fillStyle = buttonColor;
        ctx.fillRect(x, y, buttonWidth, buttonHeight);
        ctx.fillStyle = textColor;
        ctx.font = `${fontSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, x + buttonWidth / 2, y + buttonHeight / 2);
    }

    // Function to draw the calculator buttons
    function drawButtons() {
        let x = 2;
        let y = 150;
    
        for (let i = 0; i < buttons.length; i++) {
            if (buttons[i] === '0') {
                // Create the combined "0" button
                ctx.fillStyle = '#807c7c';
                ctx.fillRect(x, y, (buttonWidth + buttonSpacing) * 3 - buttonSpacing, buttonHeight);
    
                ctx.fillStyle = textColor;
                ctx.font = `${fontSize}px Arial`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('0', x + ((buttonWidth + buttonSpacing) * 3 - buttonSpacing) / 2, y + buttonHeight / 2);
    
                // Skip the next two empty buttons
                i += 2;
                x += (buttonWidth + buttonSpacing) * 3;
            } else {
                drawButton(x, y, buttons[i], i);
                x += buttonWidth + buttonSpacing;
    
                if ((i + 1) % 5 === 0) {
                    x = buttonSpacing;
                    y += buttonHeight + buttonSpacing;
                }
            }
        }
    }
    

    // Function to update the display values
    function updateDisplay() {
      ctx.fillStyle = 'rgb(80,76,84)';
      ctx.fillRect(buttonSpacing , buttonSpacing + 25, 5 * buttonWidth + 3 * buttonSpacing, buttonHeight);
      ctx.fillStyle = 'white';
      ctx.font = `${fontSize}px Arial`;
      ctx.textAlign = 'right'; 
      ctx.textBaseline = 'middle';
      ctx.fillText(expression, 5 * buttonWidth + 3 * buttonSpacing - buttonSpacing, 5 + buttonSpacing + buttonHeight / 2);
  
      ctx.fillStyle = 'rgb(80,76,84)';
      ctx.fillRect(buttonSpacing, 2 * buttonSpacing + buttonHeight, 5 * buttonWidth + 3 * buttonSpacing, buttonHeight);
      ctx.fillStyle = 'white';
      ctx.font = `38px Arial`;
      ctx.textAlign = 'right'; 
      ctx.textBaseline = 'middle';
      ctx.fillText(result, 5 * buttonWidth + 3 * buttonSpacing - buttonSpacing, 2 * buttonSpacing + 1.5 * buttonHeight);
  }

    // Initial button drawing
    drawButtons();
    updateDisplay();
    function drawCircles() {
      const circleRadius = 8;
      const margin = 10;
      
      // Draw the first circle
      ctx.fillStyle = '#ff5f58'; // Change the color as needed
      ctx.beginPath();
      ctx.arc(margin + circleRadius, margin + circleRadius, circleRadius, 0, Math.PI * 2);
      ctx.fill();
  
      // Draw the second circle
      ctx.fillStyle = '#febc2e'; // Change the color as needed
      ctx.beginPath();
      ctx.arc(2 * margin + 3 * circleRadius, margin + circleRadius, circleRadius, 0, Math.PI * 2);
      ctx.fill();
  
      // Draw the third circle
      ctx.fillStyle = '#29c83f'; // Change the color as needed
      ctx.beginPath();
      ctx.arc(3 * margin + 5 * circleRadius, margin + circleRadius, circleRadius, 0, Math.PI * 2);
      ctx.fill();
  }
  
  // Call the function to draw the circles
  drawCircles();

  
    // Add a click event listener to the canvas
    canvas.addEventListener('click', function(event) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Determine which button was clicked
        for (let i = 0; i < buttons.length; i++) {
            const buttonX = buttonSpacing + (i % 5) * (buttonWidth + buttonSpacing);
            const buttonY = 150 + buttonSpacing + Math.floor(i / 5) * (buttonHeight + buttonSpacing);

            if (x >= buttonX && x <= buttonX + buttonWidth && y >= buttonY && y <= buttonY + buttonHeight) {
                handleButtonClick(buttons[i]);
                break;
            }
        }
    });

    // Function to parse and evaluate a mathematical expression
function evaluateExpression(expression) {
  try {
      const tokens = tokenize(expression);
      const result = parse(tokens);
      return result.toString();
  } catch (error) {
      return 'Invalid Expression';
  }
}

// Tokenize the expression
function tokenize(expression) {
  return expression.match(/(\d+(\.\d+)?|[+\-*/%()])/g);
}

// Recursive descent parser for basic operations
function parse(tokens) {
  let index = 0;

  function parseExpression() {
      let left = parseTerm();

      while (index < tokens.length && (tokens[index] === '+' || tokens[index] === '-')) {
          const operator = tokens[index++];
          const right = parseTerm();
          if (operator === '+') {
              left += right;
          } else {
              left -= right;
          }
      }

      return left;
  }

  function parseTerm() {
      let left = parseFactor();

      while (index < tokens.length && (tokens[index] === '*' || tokens[index] === '/' || tokens[index] === '%')) {
          const operator = tokens[index++];
          const right = parseFactor();
          if (operator === '*') {
              left *= right;
          } else if (operator === '/') {
              if (right === 0) {
                  throw 'Division by zero';
              }
              left /= right;
          } else if (operator === '%') {
              left = left % right;
          }
      }

      return left;
  }

  function parseFactor() {
      if (tokens[index] === '(') {
          index++;
          const result = parseExpression();
          if (tokens[index] !== ')') {
              throw 'Mismatched parentheses';
          }
          index++;
          return result;
      } else if (/^\d+(\.\d+)?$/.test(tokens[index])) {
          return parseFloat(tokens[index++]);
      } else {
          throw 'Invalid token';
      }
  }

  return parseExpression();
}

// Function to handle button clicks
function handleButtonClick(button) {
  if (button === '=') {
      result = evaluateExpression(expression);
  } else if (button === 'Back') {
      expression = expression.slice(0, -1);
  } else {
      expression += button;
  }
  updateDisplay();
}
