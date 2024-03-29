// Canvas setup
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;

let score = 0;
let gameFrame = 0;
ctx.font = '50px Georgia';

// Mouse position
let canvasPosition = canvas.getBoundingClientRect();
const mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    click: false
}
canvas.addEventListener('mousedown', function(event) {
    mouse.click = true;
    mouse.x = event.x - canvasPosition.left;
    mouse.y = event.y - canvasPosition.top;
})
canvas.addEventListener('mouseup', function() {
    mouse.click = false;
})
// Player character
class Player {
    constructor() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.radius = 50;
        this.angle = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.frame = 0;
        this.spriteWidth = 498;
        this.spriteHeight = 327;
    }
    update() {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const playerSpeed = 20; // lower is faster
        if (mouse.x != this.x) {
            this.x -= dx / playerSpeed;

        }
        if (mouse.y != this.y) {
            this.y -= dy / playerSpeed;
        }
    }
    draw() {
        if (mouse.click) {
            ctx.lineWidth = 0.2;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
        }
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fill();
        ctx.closePath();
    }
}
const player = new Player();

// Bubbles
const bubblesArray = [];
class Bubble {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 100;
        this.radius = 50;
        this.speed = Math.random() * 5 + 1;
        this.distance;
        this.counted = false;
        this.sound = Math.random() <= 0.5 ? 'sound1' : 'sound2'; 
    }
    update() {
        this.y -= this.speed;
        const dx = this.x - player.x;
        const dy = this.y - player.y; 
        this.distance = Math.sqrt(dx * dx + dy * dy);
    }
    draw() {
        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.stroke();
    } 
}

// const bubblePop1 = document.createElement('audio');
// bubblePop1.src = 'Plog.ogg';
// const bubblePop2 = document.createElement('audio');
// bubblePop2.src = 'bubbles-single2.wav';


function handleBubbles() {
    if (gameFrame  % 50 == 0) {
        bubblesArray.push(new Bubble()); 
        console.log(bubblesArray.length);
    }
    for (let i = 0; i < bubblesArray.length; i++) {
        let bubble = bubblesArray[i];
        bubble.update();
        bubble.draw();
    }
    // Goes through the same loop and removes bubbles that have left the screen
    // The second loop somehow prevents an annoying flashing of all bubbles when one is removed
    for (let i = 0; i < bubblesArray.length; i++) {
        let bubble = bubblesArray[i];
        if (bubble.y < 0 - bubble.radius * 2) { 
            bubblesArray.splice(i, 1) 
        }
        if (bubble.distance < bubble.radius + player.radius) {
            if (!bubble.counted) {  
                // if (bubble.sound == 'sound1') {
                //     bubblePop1.play();
                // } else {
                //     bubblePop2.play();
                // }
                score++;  
                bubble.counted = true;
                bubblesArray.splice(i, 1);
            }

        }
    }
}
// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleBubbles();
    player.update();
    player.draw();
    ctx.fillStyle = 'block' 
    ctx.fillText('Score: ' + score, 10, 50);
    gameFrame++;  
    requestAnimationFrame(animate); 
}
animate();