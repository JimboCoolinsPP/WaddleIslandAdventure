document.addEventListener("DOMContentLoaded", function () {
    const gameCanvas = document.createElement("canvas");
    const ctx = gameCanvas.getContext("2d");
    document.getElementById("duck-heist-game").appendChild(gameCanvas);
    gameCanvas.width = window.innerWidth * 0.9;
    gameCanvas.height = window.innerHeight * 0.7;

    let duck = { x: 50, y: 300, width: 40, height: 40, speed: 5 };
    let bread = { x: Math.random() * (gameCanvas.width - 20), y: Math.random() * (gameCanvas.height - 20), width: 20, height: 20 };
    let guards = [{ x: gameCanvas.width - 100, y: gameCanvas.height / 2, width: 40, height: 40, speed: 2 }];
    let obstacles = [{ x: gameCanvas.width / 2, y: gameCanvas.height / 3, width: 50, height: 50 }];
    let score = 0;
    let timeLeft = 60;
    let keys = {};

    function drawDuck() {
        ctx.fillStyle = "yellow";
        ctx.fillRect(duck.x, duck.y, duck.width, duck.height);
    }

    function drawBread() {
        ctx.fillStyle = "brown";
        ctx.fillRect(bread.x, bread.y, bread.width, bread.height);
    }

    function drawGuards() {
        ctx.fillStyle = "red";
        guards.forEach(guard => {
            ctx.fillRect(guard.x, guard.y, guard.width, guard.height);
        });
    }

    function drawObstacles() {
        ctx.fillStyle = "gray";
        obstacles.forEach(obstacle => {
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        });
    }

    function moveGuards() {
        guards.forEach(guard => {
            if (guard.x > duck.x) guard.x -= guard.speed;
            if (guard.x < duck.x) guard.x += guard.speed;
            if (guard.y > duck.y) guard.y -= guard.speed;
            if (guard.y < duck.y) guard.y += guard.speed;
        });
    }

    function checkCollision(a, b) {
        return a.x < b.x + b.width &&
               a.x + a.width > b.x &&
               a.y < b.y + b.height &&
               a.y + a.height > b.y;
    }

    function updateGame() {
        ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        drawDuck();
        drawBread();
        drawGuards();
        drawObstacles();
        moveGuards();

        if (checkCollision(duck, bread)) {
            score++;
            bread.x = Math.random() * (gameCanvas.width - 20);
            bread.y = Math.random() * (gameCanvas.height - 20);
        }

        guards.forEach(guard => {
            if (checkCollision(duck, guard)) {
                alert("Caught by security! Game Over.");
                document.location.reload();
            }
        });
    }

    function gameLoop() {
        updateGame();
        requestAnimationFrame(gameLoop);
    }

    function handleMovement() {
        if (keys["ArrowUp"] && duck.y > 0) duck.y -= duck.speed;
        if (keys["ArrowDown"] && duck.y + duck.height < gameCanvas.height) duck.y += duck.speed;
        if (keys["ArrowLeft"] && duck.x > 0) duck.x -= duck.speed;
        if (keys["ArrowRight"] && duck.x + duck.width < gameCanvas.width) duck.x += duck.speed;
    }

    window.addEventListener("keydown", function (event) {
        keys[event.key] = true;
    });

    window.addEventListener("keyup", function (event) {
        keys[event.key] = false;
    });

    setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            alert("Time’s up! Game Over.");
            document.location.reload();
        }
    }, 1000);

    setInterval(handleMovement, 20);
    gameLoop();

    window.addEventListener("resize", function () {
        gameCanvas.width = window.innerWidth * 0.9;
        gameCanvas.height = window.innerHeight * 0.7;
    });
});
