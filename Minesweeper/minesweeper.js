document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let width = 10
    let squares = []
    let flags = 0
    let bombAmount = 20
    let isGameOver = false

    function createBoard() {
        // Get shuffled game array with random bombs
        const bombsArray = Array(bombAmount).fill('bomb')
        const emptyArray = Array(width * width - bombAmount).fill('valid')
        const gameArray = emptyArray.concat(bombsArray)

        shuffle(gameArray)
        console.log(gameArray)
        for(let i = 0; i < width * width; i++) {
            const square = document.createElement('div')
            square.setAttribute('id', i)
            square.classList.add(gameArray[i])
            grid.appendChild(square)
            squares.push(square)

            // Add normal click event listener
            square.addEventListener('click', function(e) {
                click(square)
            })
            // Add right click
            square.oncontextmenu = function(e) {
                e.preventDefault()
                addFlag(square)
            }
        }

        // Compute numbers for each square (number of adjacent squares with bombs)
        for (let i = 0; i < squares.length; i++) {
            let total = 0
            const isLeftEdge = (i % width === 0)
            const isRightEdge = (i % width === width - 1)

            if (squares[i].classList.contains('valid')) {
                if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb')) total++
                if (i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains('bomb')) total++
                if (i > 10 && squares[i - width].classList.contains('bomb')) total++
                if (i > 11 && !isLeftEdge && squares[i - 1 - width].classList.contains('bomb')) total++
                if (i < 98 && !isRightEdge && squares[i + 1].classList.contains('bomb')) total++
                if (i < 90 && !isLeftEdge && squares[i - 1 + width].classList.contains('bomb')) total++
                if (i < 88 && !isRightEdge && squares[i + 1 + width].classList.contains('bomb')) total++
                if (i < 89 && squares [i + width].classList.contains('bomb')) total++

                squares[i].setAttribute('data', total)
            }
        }
    }

    createBoard()

    function addFlag(square) {
        if (isGameOver) return
        if (!square.classList.contains('checked') && (flags < bombAmount)) {
            if (!square.classList.contains('flag')) {
                square.classList.add('flag')
                square.innerHTML = '🇺🇸'
                flags += 1
            } else {
                square.classList.remove('flag')
                square.innerHTML = ''
                flags -= 1
            }
        }
    }

    function click(square) {
        if (isGameOver) return
        if (square.classList.contains('checked') || square.classList.contains('flag')) return

        let currentID = square.id
        
        if (square.classList.contains('bomb')) {
            gameOver(square)
        } else {
            let total = square.getAttribute('data')
            if (total != 0) {
                square.classList.add('checked')
                square.innerHTML = total
                checkForWin()
                return
            }
            checkSquare(square, currentID)
            checkForWin()
        }
        square.classList.add('checked')
        checkForWin()
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
          let j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function checkSquare(square, currentID) {
        const isLeftEdge = (currentID % width === 0)
        const isRightEdge = (currentID % width === width - 1)

        setTimeout(() => {
            if (currentID > 0 && !isLeftEdge) {
                const newID = squares[parseInt(currentID) - 1].id
                const newSquare = document.getElementById(newID)
                click(newSquare)
            }
            if (currentID > 9 && !isRightEdge) {
                const newID = squares[parseInt(currentID) + 1 - width].id
                const newSquare = document.getElementById(newID)
                click(newSquare)
            }
            if (currentID > 10) {
                const newID = squares[parseInt(currentID - width)].id
                const newSquare = document.getElementById(newID)
                click(newSquare)
            }
            if (currentID > 11 && !isLeftEdge) {
                const newID = squares[parseInt(currentID) - 1 - width].id
                const newSquare = document.getElementById(newID)
                click(newSquare)
            }
            if (currentID < 98 && !isRightEdge) {
                const newID = squares[parseInt(currentID) + 1].id
                const newSquare = document.getElementById(newID)
                click(newSquare)
            }
            if (currentID < 90 && !isLeftEdge) {
                const newID = squares[parseInt(currentID) - 1 + width].id
                const newSquare = document.getElementById(newID)
                click(newSquare)
            }
            if (currentID < 88 && !isRightEdge) {
                const newID = squares[parseInt(currentID) + 1 + width].id
                const newSquare = document.getElementById(newID)
                click(newSquare)
            }
            if (currentID < 89) {
                const newID = squares[parseInt(currentID) + width].id
                const newSquare = document.getElementById(newID)
                click(newSquare)
            }
        }, 10)
    }

    function gameOver(square) {
        isGameOver = true
        // Show all bomb locations
        squares.forEach(square => {
            if (square.classList.contains('bomb')) {
                square.innerHTML = 'POW'
            }
        })
        alert('Boom! Game over') 
    }

    function checkForWin() {
        let count = 0
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].classList.contains('checked')) count++
            console.log("The count is " + count)
        }
        if (count >= squares.length - bombAmount) {
            isGameOver = true
            setTimeout(() => { // Delay ensures the board is redrawn before the alert is presented
                alert("You're a winner!")
            }, 50)
            
        }
    }

})