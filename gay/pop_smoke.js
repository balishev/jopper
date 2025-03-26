// Canvas и настройки игры
var GAME = { 
    width: 500,
    height: 500,
    background: '#F5F0E1',
    gameOver: false
};
var burgerImage = new Image();
burgerImage.src = 'aboba.jpg'; // убедитесь, что у вас есть изображение burger.png

var burgers = [];
var BURGER_SIZE = 50; // размер бургера
function spawnBurger() {
    let x = Math.random() * (GAME.width - BURGER_SIZE);
    let y = Math.random() * (GAME.height - BURGER_SIZE - RACKET.height - 30) + 30; // чтобы не появлялись на ракетке и возле счётчика
    burgers.push({ x, y, size: BURGER_SIZE });
}

// создавайте бургер каждые 3 секунды
setInterval(spawnBurger, 3000);
var superGrowth = false;  // флаг начала супер роста
var rotationAngle = 0;    // угол вращения

var racketImage = new Image();
racketImage.src = 'racket.jpg';
var ballImage = new Image();
ballImage.src = 'child.webp';


var canvas = document.getElementById('canvas');
canvas.width = GAME.width;
canvas.height = GAME.height;
var canvasContext = canvas.getContext('2d');

// Начальные состояния объектов
var initialBallState = {
    color: '#FF6E40',
    x: 100,
    y: 80,
    radius: 20,
    xDirection: 4,
    yDirection: 4,
};

var initialRacketState = {
    x: 200,
    y: 450,
    width: 200,
    height: 40,
    color: '#1E3D59',
    speed: 10,
    leftPressed: false,
    rightPressed: false
};

// Текущее состояние объектов
var BALL = {...initialBallState};
var RACKET = {...initialRacketState};

// Счётчик отбитий
var score = 0;

// Слушатели событий клавиатуры
document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

function onKeyDown(event) {
    if (event.key === 'ArrowLeft') RACKET.leftPressed = true;
    if (event.key === 'ArrowRight') RACKET.rightPressed = true;
    
    // Рестарт игры по нажатию клавиши R
    if (event.key === 'r' || event.key === 'R'||event.key === 'к' || event.key === 'К') {
        if (GAME.gameOver) restartGame();
    }
}

function onKeyUp(event) {
    if (event.key === 'ArrowLeft') RACKET.leftPressed = false;
    if (event.key === 'ArrowRight') RACKET.rightPressed = false;
}

// Генератор случайного цвета
function randomHexColor() {
    let color = "#";
    const letters = "0123456789ABCDEF";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Отрисовка фона
function drawBackground() {
    canvasContext.fillStyle = GAME.background;
    canvasContext.fillRect(0, 0, GAME.width, GAME.height);
}

// Отрисовка шара
function drawBall() {
    if (superGrowth) {
        canvasContext.rotate(rotationAngle);
    }
    if (ballImage.complete) {
        canvasContext.save();
        canvasContext.beginPath();
        canvasContext.arc(BALL.x, BALL.y, BALL.radius, 0, 2 * Math.PI);
        canvasContext.closePath();
        canvasContext.clip(); // Обрезаем изображение по форме круга
        canvasContext.drawImage(
            ballImage,
            BALL.x - BALL.radius,
            BALL.y - BALL.radius,
            BALL.radius * 2,
            BALL.radius * 2
        );
        canvasContext.restore();
    } else {
        // Пока изображение не загружено, рисуем обычный шар
        canvasContext.fillStyle = BALL.color;
        canvasContext.beginPath();
        canvasContext.arc(BALL.x, BALL.y, BALL.radius, 0, 2 * Math.PI);
        canvasContext.closePath();
        canvasContext.fill();
    }
}


// Отрисовка ракетки
function drawRacket() {
    if (racketImage.complete) {
        canvasContext.drawImage(racketImage, RACKET.x, RACKET.y, RACKET.width, RACKET.height);
    } else {
        // Если изображение еще не загрузилось, рисуем обычный прямоугольник
        canvasContext.fillStyle = RACKET.color;
        canvasContext.fillRect(RACKET.x, RACKET.y, RACKET.width, RACKET.height);
    }
}


// Отрисовка счётчика отбитий
function drawScore() {
    canvasContext.textAlign = "start"; 
    canvasContext.fillStyle = "#000";
    canvasContext.font = "20px Arial";
    canvasContext.fillText("Отбито: " + score, 10, 30);
}
function drawBurgers() {
    burgers.forEach(burger => {
        if (burgerImage.complete) {
            canvasContext.drawImage(burgerImage, burger.x, burger.y, burger.size, burger.size);
        } else {
            // пока изображение грузится, можно нарисовать простой квадрат
            canvasContext.fillStyle = 'green';
            canvasContext.fillRect(burger.x, burger.y, burger.size, burger.size);
        }
    });
}

function checkBurgerCollision() {
    burgers = burgers.filter(burger => {
        let dx = (BALL.x - burger.x - burger.size / 2);
        let dy = (BALL.y - burger.y - burger.size / 2);
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < BALL.radius + burger.size / 2) {
            BALL.radius += 30;
            console.log(BALL.radius);

            if (BALL.radius > 100 && !superGrowth) {
                superGrowth = true; // включаем супер рост
            }

            return false;
        }
        return true;
    });
}
function superGrowBall() {
    if (superGrowth) {
        BALL.radius += 1.5;  // скорость роста шара
        rotationAngle += 0.05; // скорость вращения шара
        BALL.x = GAME.width / 2;  // центрируем по центру экрана
        BALL.y = GAME.height / 2;

        if (BALL.radius > GAME.width && BALL.radius > GAME.height) {
            GAME.gameOver = true;
        }
    }
}

// Обновление состояния мяча
function updateBall() {
    if (superGrowth) {
        superGrowBall();
        return; // выходим, чтобы шар не двигался обычно
    }
    let prevX = BALL.x;
    let prevY = BALL.y;

    BALL.x += BALL.xDirection;
    BALL.y += BALL.yDirection;

    // Проверка на столкновение с бургерами
    checkBurgerCollision();

    if ((BALL.x + BALL.radius > GAME.width) || (BALL.x - BALL.radius < 0)) {
        BALL.xDirection = -BALL.xDirection;
        BALL.color = randomHexColor();
    }

    if (BALL.y - BALL.radius < 0) {
        BALL.yDirection = -BALL.yDirection;
        BALL.color = randomHexColor();
    }

    if (BALL.y + BALL.radius > GAME.height) {
        GAME.gameOver = true;
    }

    if (BALL.x + BALL.radius > RACKET.x &&
        BALL.x - BALL.radius < RACKET.x + RACKET.width &&
        BALL.y + BALL.radius > RACKET.y &&
        BALL.y - BALL.radius < RACKET.y + RACKET.height) {
        
        if (prevY + BALL.radius <= RACKET.y) {
            BALL.y = RACKET.y - BALL.radius;
            BALL.yDirection = -BALL.yDirection;
        } 
        else if (prevY - BALL.radius >= RACKET.y + RACKET.height) {
            BALL.y = RACKET.y + RACKET.height + BALL.radius;
            BALL.yDirection = -BALL.yDirection;
        }
        else if (prevX + BALL.radius <= RACKET.x) {
            BALL.x = RACKET.x - BALL.radius;
            BALL.xDirection = -BALL.xDirection;
        }
        else if (prevX - BALL.radius >= RACKET.x + RACKET.width) {
            BALL.x = RACKET.x + RACKET.width + BALL.radius;
            BALL.xDirection = -BALL.xDirection;
        }

        BALL.color = randomHexColor();
        score++;
    }
}

// Обновление положения ракетки
function updateRacket() {
    if (RACKET.leftPressed) RACKET.x -= RACKET.speed;
    if (RACKET.rightPressed) RACKET.x += RACKET.speed;

    if (RACKET.x < 0) RACKET.x = 0;
    if (RACKET.x + RACKET.width > GAME.width) RACKET.x = GAME.width - RACKET.width;
}

// Отрисовка сообщения о проигрыше
function drawGameOver() {
    canvasContext.fillStyle = "rgba(0, 0, 0, 0.9)";
    canvasContext.fillRect(0, 0, GAME.width, GAME.height);

    if (BALL.radius > GAME.width && BALL.radius > GAME.height) {
        canvasContext.fillStyle = "red";
        canvasContext.font = "50px Arial";
        canvasContext.textAlign = "center";
        canvasContext.fillText("ОН РОДИЛСЯ!", GAME.width / 2, GAME.height / 2);
    } else {
        canvasContext.fillStyle = "#FFFFFF";
        canvasContext.font = "25px Arial";
        canvasContext.textAlign = "center";
        canvasContext.fillText("Вы проиграли!", GAME.width / 2, GAME.height / 2 - 20);
        canvasContext.fillText("Отбито мячей: " + score, GAME.width / 2, GAME.height / 2 + 10);
        canvasContext.font = "18px Arial";
        canvasContext.fillText("Нажмите R для рестарта", GAME.width / 2, GAME.height / 2 + 40);
    }
}

// Отрисовка одного кадра игры
function drawFrame() {
    canvasContext.clearRect(0, 0, GAME.width, GAME.height);
    drawBackground();
    drawBall();
    drawRacket();
    drawScore();
    drawBurgers();
}

// Переменная для состояния паузы
var paused = false;

// Измененный обработчик клавиатуры
function onKeyDown(event) {
    if (event.key === 'ArrowLeft') RACKET.leftPressed = true;
    if (event.key === 'ArrowRight') RACKET.rightPressed = true;
    
    // Рестарт игры по нажатию клавиши R
    if (event.key === 'r' || event.key === 'R'|| event.key === 'к' || event.key === 'К') {
        if (GAME.gameOver) restartGame();
    }

    // Включение и выключение паузы по нажатию ESC
    if (event.key === 'Escape') {
        paused = !paused;
        if (!paused && !GAME.gameOver) play(); // продолжить игру, если паузу сняли
    }
}

// Измененная функция play (основной игровой цикл)
function play() {
    if (!GAME.gameOver && !paused) {
        drawFrame();
        updateBall();
        updateRacket();
        requestAnimationFrame(play);
    } else if (paused) {
        drawPause();
    } else {
        drawGameOver();
    }
}

// Функция для отображения экрана паузы
function drawPause() {
    canvasContext.fillStyle = "rgba(0, 0, 0, 0.6)";
    canvasContext.fillRect(0, 0, GAME.width, GAME.height);

    canvasContext.fillStyle = "#FFFFFF";
    canvasContext.font = "25px Arial";
    canvasContext.textAlign = "center";
    canvasContext.fillText("Пауза", GAME.width / 2, GAME.height / 2);
    canvasContext.font = "18px Arial";
    canvasContext.fillText("Нажмите ESC для продолжения", GAME.width / 2, GAME.height / 2 + 30);
}

// При рестарте игры снимайте паузу явно
function restartGame() {
    GAME.gameOver = false;
    paused = false;
    superGrowth = false;
    rotationAngle = 0;
    BALL = {...initialBallState};
    RACKET = {...initialRacketState};
    burgers = []; // очистите бургеры
    score = 0;
    play();
}


// Функция рестарта игры
function restartGame() {
    GAME.gameOver = false;
    BALL = {...initialBallState};
    RACKET = {...initialRacketState};
    score = 0;
    play();
}

// Запуск игры
play();
