document.addEventListener("DOMContentLoaded", function () {
    const gameContainer = document.getElementById("duck-heist-game");
    if (!gameContainer) {
        console.error("Error: 'duck-heist-game' div not found!");
        return;
    }

    // Create Canvas
    const gameCanvas = document.createElement("canvas");
    const ctx = gameCanvas.getContext("2d");
    gameCanvas.width = 800;
    gameCanvas.height = 600;
    gameContainer.appendChild(gameCanvas);

    // Load Duck Image
    const duckImg = new Image();
    duckImg.src = "duck.png"; // Make sure the duck image is in the correct folder

    // Game Objects
    let duck = { x: 50, y: 300, width: 50, height: 50, speed: 7 };
    let bread = { x: Math.random() * 760, y: Math.random() * 560, width: 30, height: 30 };
    let guards = [{ x: 600, y: 300, width: 40, height: 40, speed: 3 }];
    let obstacles = [{ x: 400, y: 200, width: 50, height: 50 }];
    let score = 0;
    let timeLeft = 60;

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

    function restartGame() {
        score = 0;
        timeLeft = 60;
        duck.x = 50;
        duck.y = 300;
        guards = [{ x: 600, y: 300, width: 40, height: 40, speed: 3 }];
        bread.x = Math.random() * 760;
        bread.y = Math.random() * 560;
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
            bread.x = Math.random() * (gameCanvas.width - bread.width);
            bread.y = Math.random() * (gameCanvas.height - bread.height);
        }

        guards.forEach(guard => {
            if (checkCollision(duck, guard)) {
                alert("Caught by security! Game Over.");
                restartGame();
            }
        });
    }

    function gameLoop() {
        updateGame();
        requestAnimationFrame(gameLoop);
    }

    // Keyboard Controls
    window.addEventListener("keydown", function (event) {
        if (event.key === "ArrowUp" && duck.y > 0) duck.y -= duck.speed;
        if (event.key === "ArrowDown" && duck.y < gameCanvas.height - duck.height) duck.y += duck.speed;
        if (event.key === "ArrowLeft" && duck.x > 0) duck.x -= duck.speed;
        if (event.key === "ArrowRight" && duck.x < gameCanvas.width - duck.width) duck.x += duck.speed;
    });

    // Touch Controls for Mobile
    let touchStartX = 0, touchStartY = 0;

    gameCanvas.addEventListener("touchstart", function (e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });

    gameCanvas.addEventListener("touchmove", function (e) {
        let touchX = e.touches[0].clientX;
        let touchY = e.touches[0].clientY;

        if (touchX < touchStartX) duck.x -= duck.speed;  // Swipe left
        if (touchX > touchStartX) duck.x += duck.speed;  // Swipe right
        if (touchY < touchStartY) duck.y -= duck.speed;  // Swipe up
        if (touchY > touchStartY) duck.y += duck.speed;  // Swipe down

        touchStartX = touchX;
        touchStartY = touchY;

        e.preventDefault();
    });

    // Timer
    setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            alert("Time’s up! Game Over.");
            restartGame();
        }
    }, 1000);

    gameLoop();
});
