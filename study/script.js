var canvas = document.getElementById("canvas");

var canvasWidth = 300;
var canvasHeight = 300;
canvas.width = canvasWidth;
canvas.height = canvasHeight;
var canvasContext = canvas.getContext("2d");

canvasContext.fillStyle = "blue";
canvasContext.fillRect(0, 0, canvasWidth, canvasHeight);

// canvasContext.fillStyle = "red";
// canvasContext.beginPath();
// canvasContext.arc(150, 100, 75, 0, 2 * Math.PI);

// canvasContext.closePath();
// canvasContext.fill();
// canvasContext.fillStyle = "green";
// canvasContext.beginPath();
// canvasContext.arc(150, 100, 60, 0, 2 * Math.PI);

// canvasContext.closePath();
// canvasContext.fill();

// canvasContext.closePath();
// canvasContext.fill();
// canvasContext.fillStyle = "pink";
// canvasContext.beginPath();
// canvasContext.arc(150, 100, 45, 0, 2 * Math.PI);

// canvasContext.closePath();
// canvasContext.fill();

// canvasContext.closePath();
// canvasContext.fill();
// canvasContext.fillStyle = "purple";
// canvasContext.beginPath();
// canvasContext.arc(150, 100, 30, 0, 2 * Math.PI);

// canvasContext.closePath();
// canvasContext.fill();


function drawCircle(ctx, x, y, radius, b, fillColor) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * b);
    ctx.closePath();
    ctx.fillStyle = fillColor;
    console.log(fillColor);
    ctx.fill();
}

drawCircle(canvasContext, 50, 50, 30, 4, "white")
var l = ['white', 'blue', 'green', 'pink', 'black']
for (let i = 1; i < 6; i++) {
    console.log(l[i-1]);
    drawCircle(canvasContext, 100, 100, 100 - i * 10,2, l[i - 1]);
    
}