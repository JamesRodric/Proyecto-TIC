document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')
  const scoreDisplay = document.getElementById('score')
  const width = 8
  const squares = []
  let score = 0
  let currentRowMatrix = [];
  let currentColumnMatrix = [];

  const numbers = {
    "0": 56,
    "1": 48,
    "2": 40,
    "3": 32,
    "4": 24,
    "5": 16,
    "6": 8,
    "7": 0
  }

  const data = {
    'url("images/yellow-candy.png")': 0,
    'url("images/orange-candy.png")': 1,
    'url("images/blue-candy.png")': 2,
    'url("images/red-candy.png")': 3,
    'url("images/purple-candy.png")': 4,
    'url("images/green-candy.png")': 5
  }

  const candyColors = [
    'url(images/red-candy.png)',
    'url(images/yellow-candy.png)',
    'url(images/orange-candy.png)',
    'url(images/purple-candy.png)',
    'url(images/green-candy.png)',
    'url(images/blue-candy.png)'
  ]

  document.addEventListener("dragstart", function( event ) {
    var img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
    event.dataTransfer.setDragImage(img, 0, 0);
}, false);
  
  //create your board
  function createBoard() {
    for (let i = 0; i < width * width; i++) {
      const square = document.createElement('div')
      square.setAttribute('draggable', true)
      square.setAttribute('id', i)
      let randomColor = Math.floor(Math.random() * candyColors.length)
      square.style.backgroundImage = candyColors[randomColor]
      grid.appendChild(square)
      squares.push(square)
    }
  }
  createBoard()

  // Dragging the Candy
  let colorBeingDragged
  let colorBeingReplaced
  let squareIdBeingDragged
  let squareIdBeingReplaced

  squares.forEach(square => square.addEventListener('dragstart', dragStart))
  squares.forEach(square => square.addEventListener('dragend', dragEnd))
  squares.forEach(square => square.addEventListener('dragover', dragOver))
  squares.forEach(square => square.addEventListener('dragenter', dragEnter))
  squares.forEach(square => square.addEventListener('drageleave', dragLeave))
  squares.forEach(square => square.addEventListener('drop', dragDrop))

  let timeout = setTimeout(updateRowMatrix, 7000);

  function dragStart() {
    colorBeingDragged = this.style.backgroundImage
    squareIdBeingDragged = parseInt(this.id)
    // this.style.backgroundImage = ''
  }

  function dragOver(e) {
    e.preventDefault()
  }

  function dragEnter(e) {
    e.preventDefault()
  }

  function dragLeave() {
    this.style.backgroundImage = ''
  }

  function dragDrop() {
    colorBeingReplaced = this.style.backgroundImage
    squareIdBeingReplaced = parseInt(this.id)
    this.style.backgroundImage = colorBeingDragged
    squares[squareIdBeingDragged].style.backgroundImage = colorBeingReplaced
  }

  function dragEnd() {
    clearTimeout(timeout)
    timeout = setTimeout(updateRowMatrix, 7000);
    //What is a valid move?
    let validMoves = [squareIdBeingDragged - 1, squareIdBeingDragged - width, squareIdBeingDragged + 1, squareIdBeingDragged + width]
    let validMove = validMoves.includes(squareIdBeingReplaced)

    if (squareIdBeingReplaced && validMove) {
      squareIdBeingReplaced = null
    } else if (squareIdBeingReplaced && !validMove) {
      squares[squareIdBeingReplaced].style.backgroundImage = colorBeingReplaced
      squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged
    } else squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged
  }

  //drop candies once some have been cleared
  function moveIntoSquareBelow() {
    for (i = 0; i < 55; i++) {
      if (squares[i + width].style.backgroundImage === '') {
        squares[i + width].style.backgroundImage = squares[i].style.backgroundImage
        squares[i].style.backgroundImage = ''
        const firstRow = [0, 1, 2, 3, 4, 5, 6, 7]
        const isFirstRow = firstRow.includes(i)
        if (isFirstRow && (squares[i].style.backgroundImage === '')) {
          let randomColor = Math.floor(Math.random() * candyColors.length)
          squares[i].style.backgroundImage = candyColors[randomColor]
        }
      }
    }
  }


  ///Checking for Matches
  //for row of Four
  function checkRowForFour() {
    for (i = 0; i < 60; i++) {
      let rowOfFour = [i, i + 1, i + 2, i + 3]
      let decidedColor = squares[i].style.backgroundImage
      const isBlank = squares[i].style.backgroundImage === ''

      const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55]
      if (notValid.includes(i)) continue

      if (rowOfFour.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
        score += 4
        scoreDisplay.innerHTML = score
        rowOfFour.forEach(index => {
          squares[index].style.backgroundImage = ''
        })
      }
    }
  }
  checkRowForFour()

  //for column of Four
  function checkColumnForFour() {
    for (i = 0; i < 39; i++) {
      let columnOfFour = [i, i + width, i + width * 2, i + width * 3]
      let decidedColor = squares[i].style.backgroundImage
      const isBlank = squares[i].style.backgroundImage === ''

      if (columnOfFour.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
        score += 4
        scoreDisplay.innerHTML = score
        columnOfFour.forEach(index => {
          squares[index].style.backgroundImage = ''
        })
      }
    }
  }
  checkColumnForFour()

  //for row of Three
  function checkRowForThree() {
    for (i = 0; i < 61; i++) {
      let rowOfThree = [i, i + 1, i + 2]
      let decidedColor = squares[i].style.backgroundImage
      const isBlank = squares[i].style.backgroundImage === ''

      const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55]
      if (notValid.includes(i)) continue

      if (rowOfThree.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
        score += 3
        scoreDisplay.innerHTML = score
        rowOfThree.forEach(index => {
          squares[index].style.backgroundImage = ''
        })
      }
    }
  }
  checkRowForThree()

  //for column of Three
  function checkColumnForThree() {
    for (i = 0; i < 47; i++) {
      let columnOfThree = [i, i + width, i + width * 2]
      let decidedColor = squares[i].style.backgroundImage
      const isBlank = squares[i].style.backgroundImage === ''

      if (columnOfThree.every(index => squares[index].style.backgroundImage === decidedColor && !isBlank)) {
        score += 3
        scoreDisplay.innerHTML = score
        columnOfThree.forEach(index => {
          squares[index].style.backgroundImage = ''
        })
      }
    }
  }
  checkColumnForThree()

  function updateRowMatrix() {
    const rowArray = [];
    const newArray = [];
    squares.forEach(x => rowArray.push(data[x.style.backgroundImage]));
    for (let i = 0; i < 64; i += 8) {
      newArray.push(rowArray.slice(i, i + 8))
    }
    currentRowMatrix = [...newArray];
    const pairsCords = [];
    //x = fila;
    //i = columna;
    //1era fila: item 7, index 6; i * x - 1
    //2da fila: item 15, index 14; i * x
    //3ra fila: item 23, index 22; i * x + 1
    for (let x = 0; x < currentRowMatrix.length; x++) {
      for (let i = 0; i < 8; i++) {
        if (currentRowMatrix[x][i] === currentRowMatrix[x][i + 1]) {
          pairsCords.push([{
            x: x + 1,
            y: i,
            element: currentRowMatrix[x][i],
            number: 8 * (x) + i
          }, {
            x: x + 1,
            y: i + 1,
            number: 8 * (x) + i + 1
          }])
        }
      }
    }
    const possible = [];
    for (pair of pairsCords) {
      const row = pair[0].x;
      const y = pair[0].y;
      const upRow = currentRowMatrix[row - 2];
      const downRow = currentRowMatrix[row];
      const currentRow = currentRowMatrix[row - 1];
      if (pair[0].element === undefined) continue;
      if (upRow) {
        if (upRow[y - 1] === pair[0].element) {
          possible.push([pair[0].number - 9, pair[0].number, pair[1].number])
        }
        if (upRow[y + 2] === pair[0].element) {
          possible.push([pair[0].number - 6, pair[0].number, pair[1].number])
        }
      }
      if (downRow) {
        if (downRow[y - 1] === pair[0].element) {
          possible.push([pair[0].number + 7, pair[0].number, pair[1].number])
        }
        if (downRow[y + 2] === pair[0].element) {
          possible.push([pair[0].number + 10, pair[0].number, pair[1].number])
        }
      }
      if (currentRow[y - 2] === pair[0].element) {
        possible.push([pair[0].number - 2, pair[0].number, pair[1].number])
      }
      if (currentRow[y + 3] === pair[0].element) {
        possible.push([pair[0].number + 3, pair[0].number, pair[1].number])
      }
    }
    const newColumnArray = [];
    for (let i = 0; i < currentRowMatrix.length; i++) {
      const column = [];
      for (let x = 0; x < currentRowMatrix[i].length; x++) {
        column.push(currentRowMatrix[x][i]);
      }
      newColumnArray.push(column.reverse());
    }
    currentColumnMatrix = [...newColumnArray];

    const pairsCordsColumn = [];




    for (let x = 0; x < currentColumnMatrix.length; x++) {
      for (let i = 0; i < 8; i++) {
        if (currentColumnMatrix[x][i] === currentColumnMatrix[x][i + 1]) {
          pairsCordsColumn.push([{
            x: x + 1,
            y: i,
            element: currentColumnMatrix[x][i],
            number: 8 * (x) + i
          }, {
            x: x + 1,
            y: i + 1,
            number: 8 * (x) + i + 1
          }])
        }
      }
    }
    const possibleColumn = [];
    for (pair of pairsCordsColumn) {
      const row = pair[0].x;
      const y = pair[0].y;
      const upRow = currentColumnMatrix[row - 2];
      const downRow = currentColumnMatrix[row];
      const currentRow = currentColumnMatrix[row - 1];
      if (pair[0].element === undefined) continue;
      if (upRow) {
        if (upRow[y - 1] === pair[0].element) {
          possibleColumn.push([pair[0].number - 9, pair[0].number, pair[1].number])
        }
        if (upRow[y + 2] === pair[0].element) {
          possibleColumn.push([pair[0].number - 6, pair[0].number, pair[1].number])
        }
      }
      if (downRow) {
        if (downRow[y - 1] === pair[0].element) {
          possibleColumn.push([pair[0].number + 7, pair[0].number, pair[1].number])
        }
        if (downRow[y + 2] === pair[0].element) {
          possibleColumn.push([pair[0].number + 10, pair[0].number, pair[1].number])
        }
      }
      if (currentRow[y - 2] === pair[0].element) {
        possibleColumn.push([pair[0].number - 2, pair[0].number, pair[1].number])
      }
      if (currentRow[y + 3] === pair[0].element) {
        possibleColumn.push([pair[0].number + 3, pair[0].number, pair[1].number])
      }
    }

    // i = numbers[(n % 8).toString()] + Math.trunc(n / 8); 

    possibleColumn.forEach(x => {
      possible.push([columnConversion(x[0]), columnConversion(x[1]), columnConversion(x[2])])
    });


    const pairsBetween = [];

    for (let x = 0; x < currentRowMatrix.length; x++) {
      for (let i = 0; i < 8; i++) {
        if (currentRowMatrix[x][i] === currentRowMatrix[x][i + 2]) {
          pairsBetween.push([{
            x: x + 1,
            y: i,
            element: currentRowMatrix[x][i],
            number: 8 * (x) + i
          }, {
            x: x + 1,
            y: i + 2,
            number: 8 * (x) + i + 2
          }])
        }
      }
    }

    for (pair of pairsBetween) {
      const row = pair[0].x;
      const y = pair[0].y;
      const upRow = currentRowMatrix[row - 2];
      const downRow = currentRowMatrix[row];
      if (pair[0].element === undefined) continue;
      if (upRow && upRow[y + 1] === pair[0].element) {
        possible.push([pair[0].number - 7, pair[0].number, pair[1].number])
      }
      if (downRow && downRow[y + 1] === pair[0].element) {
        possible.push([pair[0].number + 9, pair[0].number, pair[1].number])
      }
    }



    const pairsBetweenColumn = [];




    for (let x = 0; x < currentColumnMatrix.length; x++) {
      for (let i = 0; i < 8; i++) {
        if (currentColumnMatrix[x][i] === currentColumnMatrix[x][i + 2]) {
          pairsBetweenColumn.push([{
            x: x + 1,
            y: i,
            element: currentColumnMatrix[x][i],
            number: 8 * (x) + i
          }, {
            x: x + 1,
            y: i + 2,
            number: 8 * (x) + i + 2
          }])
        }
      }
    }

    const possibleColumnBetween = [];

    for (pair of pairsBetweenColumn) {
      const row = pair[0].x;
      const y = pair[0].y;
      const upRow = currentColumnMatrix[row - 2];
      const downRow = currentColumnMatrix[row];
      if (pair[0].element === undefined) continue;
      if (upRow && upRow[y + 1] === pair[0].element) {
        possibleColumnBetween.push([pair[0].number - 7, pair[0].number, pair[1].number])
      }
      if (downRow && downRow[y + 1] === pair[0].element) {
        possibleColumnBetween.push([pair[0].number + 9, pair[0].number, pair[1].number])
      }
    }

    possibleColumnBetween.forEach(x => {
      possible.push([columnConversion(x[0]), columnConversion(x[1]), columnConversion(x[2])])
    });



    if (possible.length > 0) {
      const one = possible[Math.floor(Math.random() * possible.length)];
      squares[one[0]].classList.add("animate");
      squares[one[1]].classList.add("animate");
      squares[one[2]].classList.add("animate");
      setTimeout(() => {
        squares[one[0]].classList.remove("animate");
        squares[one[1]].classList.remove("animate");
        squares[one[2]].classList.remove("animate");
      }, 1000)
    }
  }

  function columnConversion(number) {
    return numbers[(number % 8).toString()] + Math.trunc(number / 8);
  }

  // Checks carried out indefintely - Add Button to clear interval for best practise, or clear on game over/game won. If you have this indefinite check you can get rid of calling the check functions above.
  window.setInterval(function () {
    checkRowForFour()
    checkColumnForFour()
    checkRowForThree()
    checkColumnForThree()
    moveIntoSquareBelow()
  }, 100)
})
