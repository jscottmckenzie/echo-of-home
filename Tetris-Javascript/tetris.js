document.addEventListener('DOMContentLoaded', () => {

    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const startButton = document.querySelector('#start-button')
    const width = 10
    const intervalSpeed = 250

    let currentPosition = 4
    let currentRotation = 0
    let nextRandom = 0
    let timerID
    let score = 0

    const colors = [ // Need the same number as the shapes
        'orange',
        'red',
        'purple',
        'green',
        'blue'
    ]
   
    // Define the shapes

    const lShape = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width *2, width * 2 + 1, width * 2 + 2]
    ]

    const zShape = [
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1]
    ]

    const tShape = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
    ]

    const oShape = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
    ]

    const iShape = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3]
    ]

    const theShapes = [lShape, zShape, tShape, oShape, iShape]

    // Randomly choose a shape
    let randomNumber = Math.floor(Math.random() * theShapes.length)
    let currentShape = theShapes[randomNumber][0]
    
    // Draw the shape
    function draw() {
        currentShape.forEach(index => {
            squares[currentPosition + index].classList.add('shape')
            squares[currentPosition + index].style.backgroundColor = colors[randomNumber]
        })
    }
    
    // Undraw the shape
    function undraw() {
        currentShape.forEach(index => {
            squares[currentPosition + index].classList.remove('shape')
            squares[currentPosition + index].style.backgroundColor = ''
        })
    }

    // Assign functions to keyCodes
    function control(e) {
        if (e.keyCode === 37) {
            moveLeft()
        } else if (e.keyCode === 38) { // UpArrow
            rotate()
        } else if (e.keyCode === 39) {
            moveRight()
        } else if (e.keyCode === 40) {
            moveDown()
        }
    }
    document.addEventListener('keyup', control)
 
    // Make the shape move down
    function moveDown() {
        undraw()
        currentPosition += width // moves the shape down one row
        draw()
        freeze()
    }

    function freeze() {
        if (currentShape.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            currentShape.forEach(index => squares[currentPosition + index].classList.add('taken'))
            // Start a new shape falling
            randomNumber = nextRandom
            nextRandom = Math.floor(Math.random() * theShapes.length)
            currentShape = theShapes[randomNumber][currentRotation]
            currentPosition = 4
            draw()
            displayShape()
            addScore()
            gameOver()
        }    
            
    }

    // Move the shape left, unless it's at the edge or there's blockage
    function moveLeft() {
        undraw()
        const isAtLeftEdge = currentShape.some(index => (currentPosition + index) % width === 0)
        if (!isAtLeftEdge) currentPosition -= 1
        if (currentShape.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1
        }
        draw()
    }

    // Move the shape right, unless it's at the edge or there's blockage
    function moveRight() {
        undraw()
        const isAtRightEdge = currentShape.some(index => (currentPosition + index) % width === width - 1)
        if (!isAtRightEdge) currentPosition += 1
        if (currentShape.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1
        }
        draw()
    }

    // Rotate the shape
    function rotate() {
        undraw()
        currentRotation += 1
        if (currentRotation === currentShape.length) {
            currentRotation = 0
        }
        currentShape = theShapes[randomNumber][currentRotation]
        draw()
    }

    // Display the next shape in the mini-grid
    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    const displayIndex = 0

    // The shapes without rotations
    const upNextShapes = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2], // l
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], // z
        [1, displayWidth, displayWidth + 1, displayWidth + 2], // t
        [0, 1, displayWidth, displayWidth + 1], // o
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] // i
    ]
        
    // Display the next shape in the mini-grid display
    function displayShape() {
        // Remove any trace of a shape from the grid
        displaySquares.forEach(square => {
            square.classList.remove('shape')
            square.style.backgroundColor = '' 
        })
        // Then display the shape
        upNextShapes[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('shape')
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
        })
    }

    // Add Start/Pause functionality
    startButton.addEventListener('click', () => {
        if (timerID) {
            clearInterval(timerID)
            timerID = null
        } else {
            draw()
            timerID = setInterval(moveDown, intervalSpeed)
            nextRandom = Math.floor(Math.random() * theShapes.length)
            displayShape()
        }
    })

    // Add score
    function addScore() {
        for (let i = 0; i < 199; i += width) {
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

            if (row.every(index => squares[index].classList.contains('taken'))) {
                score += 10
                scoreDisplay.innerHTML = score
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('shape')
                    squares[index].style.backgroundColor = ''
                })
                const squaresRemoved = squares.splice(i, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }

    // Game over
    function gameOver() {
        if (currentShape.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = 'end'
            clearInterval(timerID)
        }
    }
})