const squares = document.querySelectorAll('.square')
const mole = document.querySelector('.mole')
const startStopButton = document.querySelector('.start-button')
const timeLeftDisplay = document.querySelector('#time-left')
const scoreDisplay = document.querySelector('#score')
const gameTimeLength = 30

let gamePlayActive
let score = 0
let timerId = null
let countDownTimerId = null
let currentTime
let gameSpeed = 1000
let hitPosition

function setUpBoard() {
    squares.forEach(square => {
        square.classList.remove('mole')
    })
    gamePlayActive = false
    currentTime = gameTimeLength
    timeLeftDisplay.textContent = currentTime
    score = 0
    scoreDisplay.textContent = score
}

function randomSquare() {
    // Remove the mole and start with a clean grid
    squares.forEach(square => {
        square.classList.remove('mole')
    })
    let randomNumber
    // Choose a random square and add the 'mole' class to it
    do { // repeat until the random number isn't the current hit position
        randomNumber = Math.floor(Math.random() * 9)
        
    } while (randomNumber == hitPosition)
    let randomSquare = squares[randomNumber]
    randomSquare.classList.add('mole')
    hitPosition = randomSquare.id
}

function startStopGame() {
    console.log("start button pressed")
    gamePlayActive = !gamePlayActive
    if (gamePlayActive) {
        console.log('game play is active')
        timerId = setInterval(randomSquare, gameSpeed)
        countDownTimerId = setInterval(countDown, 1000)
    } else {
        timerId = null
        countDownTimerId = null
        squares.forEach(square => {
            square.classList.remove('mole')
        })
    }
}

function countDown() {
    currentTime -= 1
    timeLeftDisplay.textContent = currentTime

    if (currentTime <= 0) {
        clearInterval(countDownTimerId)
        clearInterval(timerId)
        alert('GAME OVER! Your final score is ' + score)
        setUpBoard()
    }
}

setUpBoard()

squares.forEach(square => {
    square.addEventListener('mousedown', () => {
        if (!gamePlayActive) { return }
        if (square.id == hitPosition) {
            score += 1
            scoreDisplay.textContent = score
            hitPosition = null
        }
    })
})

startStopButton.onclick = startStopGame





