const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const colors = [
    '#ff0000', '#f02393', '#2ea8b3', '#00ff00', '#0000ff'
];
const shapesArray = [];

let colorIndex = 0;

canvas.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// const mouse = {
//     x: undefined,
//     y: undefined
// };

class Shape {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.color = colors[colorIndex];
        this.sideLength = 100
    }
    update() {
        this.sideLength -= 1;
        ctx.fillRect(this.x - this.sideLength / 2, this.y - this.sideLength / 2, this.sideLength, this.sideLength);
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.sideLength / 2, this.y - this.sideLength / 2, this.sideLength, this.sideLength);
    }
}

canvas.addEventListener('mousedown', function(event) {
    const shape = new Shape(event.x, event.y);
    shapesArray.push(shape);
    nextColor();
});

function drawShapes() {
    for (let i = 0; i > shapesArray.length; i++) {
        shapesArray[i].draw();
        console.log('drawing a shape');
    }
}

function nextColor() {
    colorIndex += 1;
    if (colorIndex == colors.length) colorIndex = 0;
}

function animate() {
    // ctx.clearRect(canvas.width, canvas.height, 0, 0);
    ctx.fillStyle = 'rgba(0,0,0,0.9)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < shapesArray.length; i++) {
        shapesArray[i].update();
        shapesArray[i].draw();
        if (shapesArray[i].sideLength == 0) {
            shapesArray.splice(i, 1);
            i--;
        }
        
    }
    requestAnimationFrame(animate);
}
animate();



