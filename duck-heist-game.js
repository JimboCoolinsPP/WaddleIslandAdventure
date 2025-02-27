document.addEventListener("DOMContentLoaded", function () {
    const gameCanvas = document.createElement("canvas");
    const ctx = gameCanvas.getContext("2d");
    document.getElementById("duck-heist-game").appendChild(gameCanvas);
    gameCanvas.width = 800;
    gameCanvas.height = 600;

    const duckImg = new Image();
    duckImg.src = "duck.png";
    let duck = { x: 50, y: 300, width: 50, height: 50, speed: 7 };
    let bread = { x: Math.random() * 760, y: Math.random() * 560, width: 20, height: 20 };
    let guards = [{ x: 600, y: 300, width: 40, height: 40, speed: 3 }];
    let obstacles = [{ x: 400, y: 200, width: 50, height: 50 }];
    let score = 0;
    let timeLeft = 60;
    let gameOver = false;

    function drawDuck() {
        ctx.drawImage(duckImg, duck.x, duck.y, duck.width, duck.height);
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
        if (gameOver) return;
        ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
        drawDuck();
        drawBread();
        drawGuards();
        drawObstacles();
        moveGuards();
        
        if (checkCollision(duck, bread)) {
            score++;
            bread.x = Math.random() * 760;
            bread.y = Math.random() * 560;
        }

        guards.forEach(guard => {
            if (checkCollision(duck, guard)) {
                endGame("Caught by security! Game Over.");
            }
        });

        obstacles.forEach(obstacle => {
            if (checkCollision(duck, obstacle)) {
                duck.x -= duck.speed;
                duck.y -= duck.speed;
            }
        });
    }

    function endGame(message) {
        gameOver = true;
        alert(message);
        document.getElementById("restart-btn").style.display = "block";
    }

    function gameLoop() {
        updateGame();
        requestAnimationFrame(gameLoop);
    }

    window.addEventListener("keydown", function (event) {
        if (event.key === "ArrowUp") duck.y -= duck.speed;
        if (event.key === "ArrowDown") duck.y += duck.speed;
        if (event.key === "ArrowLeft") duck.x -= duck.speed;
        if (event.key === "ArrowRight") duck.x += duck.speed;
    });

    let touchStartX = 0, touchStartY = 0;
    window.addEventListener("touchstart", function (event) {
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
    });

    window.addEventListener("touchmove", function (event) {
        let touchEndX = event.touches[0].clientX;
        let touchEndY = event.touches[0].clientY;
        let deltaX = touchEndX - touchStartX;
        let deltaY = touchEndY - touchStartY;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX > 0) duck.x += duck.speed;
            else duck.x -= duck.speed;
        } else {
            if (deltaY > 0) duck.y += duck.speed;
            else duck.y -= duck.speed;
        }
    });

    setInterval(() => {
        if (!gameOver) {
            timeLeft--;
            if (timeLeft <= 0) {
                endGame("Time’s up! Game Over.");
            }
        }
    }, 1000);

    document.getElementById("restart-btn").addEventListener("click", function () {
        location.reload();
    });

    gameLoop();
});
