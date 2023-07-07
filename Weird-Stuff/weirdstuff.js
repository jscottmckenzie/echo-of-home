const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
canvas.width = innerWidth
canvas.height = innerHeight

const circles = []
const numberOfCircles = 500
const colors = ['red', 'white', 'green', 'blue', 'purple', 'yellow']

class Circle {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }
    update() {
        this.x += this.velocity.x
        this.y += this.velocity.y
        if (this.x + this.radius > canvas.width ||
            this.x - this.radius < 0) {
            this.velocity.x = -this.velocity.x
        }
        if (this.y + this.radius > canvas.height ||
            this.y - this.radius < 0) {
            this.velocity.y = -this.velocity.y
        }
        this.draw()
    }
    draw() {
        c.beginPath()
        c.fillStyle = this.color
        c.arc(this.x, this.y , this.radius, 0, Math.PI * 2)
        c.fill()
        c.closePath()
    }
}

let animationId

addEventListener('keydown', (event) => {
    if (event.key == " ") {
        if (animationId) {
            cancelAnimationFrame(animationId)
        } else {
            requestAnimationFrame(animationId)
        }
        
    }
})


 
for (let i = 0; i < numberOfCircles; i++) {
    const x = Math.random() * canvas.width
    const y = Math.random() * canvas.height
    const randomColor = colors[Math.floor(Math.random() * colors.length)]
    const velocity = {
        x: Math.random() * 5 - 10,
        y: Math.random() * 5 - 10
    } 
    circles.push((new Circle(x, y, 4, randomColor, velocity)))
      
}

function animate() {
    animationId = requestAnimationFrame(animate)

    // Last argument of rgba is opacity, which creates the echo effect of all screen elements
    c.fillStyle = 'rgba(0, 0, 0, 0.002)'
    c.fillRect(0, 0, canvas.width, canvas.height)

    circles.forEach((circle) => {
        circle.update()
    })

}
animate()








