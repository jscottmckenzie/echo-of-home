const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const frequencyOfSquares = 1;
let count = 0;
const colors = [
    '#ff0000', '#f02393', '#2ea8b3', '#00ff00', '#0000ff'
];

let shapesArray = [];
let colorIndex = 0;

canvas.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

const mouse = {
    x: undefined,
    y: undefined
};

class Circle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.color = colors[colorIndex];
        this.size = 50;
    }
    update() {
        this.size -= 1;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

canvas.addEventListener('mousedown', function(event) {
    const shape = new Square(event.x, event.y);
    shapesArray.push(shape);
    nextColor();
});

function drawShapes() {
    for (let i = 0; i > shapesArray.length; i++) {
        shapesArray[i].draw();
    }
}

function nextColor() {
    colorIndex += 1;
    if (colorIndex == colors.length) colorIndex = 0;
}

function animate() {
    ctx.clearRect(canvas.width, canvas.height, 0, 0);
    
    count += 1;
    console.log(count);
    if (count >= frequencyOfSquares) {
        count = 0;
        shapesArray.push(new Circle(Math.random() * canvas.width, Math.random() * canvas.height));
        nextColor();
    }

    ctx.fillStyle = 'rgba(0,0,0,0.01)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < shapesArray.length; i++) {
        setTimeout( () => {
            shapesArray[i].update();
            shapesArray[i].draw();
            if (shapesArray[i].size == 0) {
                shapesArray.splice(i, 1);
                i--;
            }
        }, 0)
        
        
    }
    requestAnimationFrame(animate);
}
animate();



