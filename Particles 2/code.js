const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const particlesArray = [];
let hue = 0;

window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

const mouse = {
    x: undefined,
    y: undefined
}

canvas.addEventListener('mousedown', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
    for (let i = 0; i < 300; i++) {
        particlesArray.push(new Firework());
    }
});

// canvas.addEventListener('mousemove', function(event) {
//     mouse.x = event.x;
//     mouse.y = event.y;
//     for (let i = 0; i < 10; i++) {
//         particlesArray.push(new Particle());
//     }
// });

class Particle {
    constructor() {
        this.x = mouse.x;
        this.y = mouse.y;
        this.size = Math.random() * 15 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.color = 'hsl(' + hue + ', 100%, 50%)';
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.size > 0.2) this.size -= 0.1;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Firework {
    constructor() {
        this.x = mouse.x;
        this.y = mouse.y;
        this.size = 10;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.color = 'hsl(' + hue + ', 100%, 50%)';
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.size > 0.2) this.size -= 0.1;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// function init() {
//     for (let i = 0; i < 100; i++) {
//         particlesArray.push(new Particle());
//     }
// }

// init();

function handleParticles() {
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
        // If the particle shrinks enough, remove it from the array.
        // the splice method takes two arguments: the first is the index
        // to remove, the second is the number of elements to remove.
        if (particlesArray[i].size <= 0.3) {
            particlesArray.splice(i, 1);
            i--;
        }
    }
}

function animate() {
    // ctx.clearRect(canvas.width, canvas.height, 0, 0);
    ctx.fillStyle = 'rgba(0,0,0,0.02)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    handleParticles();
    hue += 2;
    requestAnimationFrame(animate);
    
}

animate();
