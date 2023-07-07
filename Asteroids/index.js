const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

const scoreEl = document.querySelector('#scoreEl')
const startGameBtn = document.querySelector('#startGameBtn')
const modalEl = document.querySelector('#modalEl')
const bigScore = document.querySelector('#bigScore')

class Player {
    constructor(x, y, radius, color) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
    }
    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = this.color
        c.fill()
    }
}

class Projectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }
    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = this.color
        c.fill()
    }
    update() {
        this.draw()
        this.x += this.velocity.x
        this.y += this.velocity.y
    }
}

class Asteroid {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }
    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = this.color
        c.fill()
    }
    update() {
        this.draw()
        this.x += this.velocity.x
        this.y += this.velocity.y
    }
}

const friction = 0.98
class Particle {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
        this.alpha = 1
    }
    draw() {
        c.save()
        c.globalAlpha = this.alpha
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = this.color
        c.fill()
        c.restore()
    }
    update() {
        this.draw()
        this.velocity.x *= friction
        this.velocity.y *= friction
        this.x += this.velocity.x
        this.y += this.velocity.y
        this.alpha -= 0.01
    }
}

const x = canvas.width / 2
const y = canvas.height / 2

let player = new Player(x, y, 10, 'white')
let projectiles = []
let asteroids = []
let particles = []

function init() {
    score = 0
    scoreEl.innerHTML = score
    player = new Player(x, y, 10, 'white')
    projectiles = []
    asteroids = []
    particles = []
}

let score = 0

function spawnEnemies() {
    setInterval( () => {
        // Gets a number between 4 and 30
        const radius = Math.random() * (30 - 4) + 4

        let x
        let y

        // Algorithm ensures asteroids come from all the edges of the screen
        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
            y = Math.random() * canvas.height
        } else {
            x = Math.random() * canvas.width
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
        }
        
        const color = `hsl(${Math.random() * 360}, 50%, 50%)`
        const angle = Math.atan2(
            canvas.height / 2 - y,
            canvas.width / 2 - x)
        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }
        asteroids.push(new Asteroid(x, y, radius, color, velocity))
    }, 1000)
}
 
addEventListener('click', (event) => {
    const angle = Math.atan2(
        event.clientY - canvas.height / 2,
        event.clientX - canvas.width / 2)
    const velocity = {
        x: Math.cos(angle) * 6,
        y: Math.sin(angle) * 6
    }
    projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, 5, 'white', velocity))
});

// Start game button
startGameBtn.addEventListener('click', () => {
    init()
    animate()
    spawnEnemies()
    modalEl.style.display = 'none'
})

// Animation loop
let animationId

function animate() {
    // Repeat
    animationId = requestAnimationFrame(animate);

    // Last argument of rgba is opacity, which makes the echo effect of all screen elements
    c.fillStyle = 'rgba(0, 0, 0, 0.2)'
    c.fillRect(0, 0, canvas.width, canvas.height)

    player.draw()

    // Handle explosions (particle array)
    particles.forEach((particle, index) => {
        if (particle.alpha <= 0) {
            particles.splice(index, 1)
        } else {
            particle.update()
        }
    })

    // Handle each bullet
    projectiles.forEach( (projectile, index) => {
        projectile.update()
        // Remove bullets that have come off the screen
        if (projectile.x + projectile.radius < 0 ||
            projectile.x - projectile.radius > canvas.width ||
            projectile.y + projectile.radius < 0 ||
            projectile.y + projectile.radius > canvas.height) {
                setTimeout(() => {
                    projectiles.splice(index, 1)
                })
        }
    })
 
    // Loop through the asteroids
    asteroids.forEach( (asteroid, index) => {
        asteroid.update()
        const dist = Math.hypot(player.x - asteroid.x, player.y - asteroid.y)

        // Collision with player ends the game
        if (dist - asteroid.radius - player.radius < 1) {
            cancelAnimationFrame(animationId)
            modalEl.style.display = 'flex'
            bigScore.innerHTML = score

        }
  
        // Projectile, asteroid collision detection
        projectiles.forEach( (projectile, projectileIndex) => {
            const dist = Math.hypot(projectile.x - asteroid.x, projectile.y - asteroid.y)
            if (dist - asteroid.radius - projectile.radius < 1) {
            
                // Create an explosion
                for (let i = 0; i < asteroid.radius * 2; i++) {
                    particles.push( 
                        new Particle(
                            projectile.x,
                            projectile.y,
                            Math.random() * 2,
                            asteroid.color, 
                            {   x: (Math.random() - 0.5) * 6, 
                                y: (Math.random() - 0.5) * 6
                            }
                        )
                    )
                }

                // Either shrink or remove an asteroid
                if (asteroid.radius - 10 > 5) {

                    // Increase the score
                    score += 100
                    scoreEl.innerHTML = score

                    // From the GSAP library that helps with animations
                    // This method smooths out the reduction of size rather than "snapping" to the smaller with 'asteroid.radius -= 10'
                    gsap.to(asteroid, {
                        radius: asteroid.radius - 10
                    })
                    setTimeout( () => { 
                        projectiles.splice(projectileIndex, 1)
                    }, 0)
                } else {
                    score += 250
                    scoreEl.innerHTML = score
                    setTimeout( () => {
                        asteroids.splice(index, 1)
                        projectiles.splice(projectileIndex, 1)
                    }, 0)
                }
               
                if (asteroid.radius < 3) {
                    // Timeout method makes an annoying flash go away when removing an asteroid and projectile off the screen
                    setTimeout( () => {
                        asteroids.splice(index, 1)
                    }, 0)
                }  
            }
        })

    })

    
}
