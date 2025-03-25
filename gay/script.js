var canvas = document.getElementById("canvas");
var canvasWidth = 1000;
var canvasHeight = 500;
canvas.width = canvasWidth;
canvas.height = canvasHeight;
var canvasContext = canvas.getContext("2d");


var BALL_1 = {
    x: 100,
    y: 80,
    radius: 20,
    color: 'black',
    speedX: 3,
    speedY: 3
};
var BALL_2 = {
    x: 200,
    y: 120,
    radius: 44,
    color: 'red',
    speedX: 15,
    speedY: 7
};
var BALL_3 = {
    x: 200,
    y: 120,
    radius: 30,
    color: 'green',
    speedX: 20,
    speedY: 5
}

var balls = [BALL_1, BALL_2,BALL_3];


var backgroundColor = 'blue';


function updateBall(ball) {

    ball.x += ball.speedX;
    ball.y += ball.speedY;

    if (ball.y + ball.radius > canvasHeight) {
        ball.y = canvasHeight - ball.radius;
        ball.speedY = -ball.speedY; 
    } else if (ball.y - ball.radius < 0) {
        ball.y = ball.radius;
        ball.speedY = -ball.speedY;
    }

    if (ball.x + ball.radius > canvasWidth) {
        ball.x = canvasWidth - ball.radius;
        ball.speedX = -ball.speedX;
    } else if (ball.x - ball.radius < 0) {
        ball.x = ball.radius;
        ball.speedX = -ball.speedX;
    }
}


function drawBall(ball) {
    canvasContext.fillStyle = ball.color;
    canvasContext.beginPath();
    canvasContext.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
    canvasContext.closePath();
    canvasContext.fill();
}


function update() {

    canvasContext.clearRect(0, 0, canvasWidth, canvasHeight)
    canvasContext.fillStyle = backgroundColor;
    canvasContext.fillRect(0, 0, canvasWidth, canvasHeight);

    for (var i = 0; i < balls.length; i++) {
        updateBall(balls[i]);
        drawBall(balls[i]);
    }

    requestAnimationFrame(update);
}

update();
