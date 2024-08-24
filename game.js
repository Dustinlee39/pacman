const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const tileSize = 16; // Each tile is 16x16 pixels
const rows = 31;
const cols = 28;

const maze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 1],
    [1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    // Add more rows to complete the maze
];

function drawMaze() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            let tile = maze[row][col];
            if (tile === 1) {
                ctx.fillStyle = '#0000FF'; // Wall color
                ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
            } else if (tile === 2) {
                ctx.fillStyle = '#FFD700'; // Pellet color
                ctx.beginPath();
                ctx.arc(col * tileSize + tileSize / 2, row * tileSize + tileSize / 2, tileSize / 6, 0, 2 * Math.PI);
                ctx.fill();
            } else if (tile === 3) {
                ctx.fillStyle = '#FFD700'; // Power pellet color
                ctx.beginPath();
                ctx.arc(col * tileSize + tileSize / 2, row * tileSize + tileSize / 2, tileSize / 3, 0, 2 * Math.PI);
                ctx.fill();
            }
        }
    }
}

let pacman = {
    x: 14 * tileSize, // Pac-Man's starting x position (center of the grid)
    y: 23 * tileSize, // Pac-Man's starting y position (near the bottom of the grid)
    size: tileSize,
    direction: 'left',
    mouthOpen: 0, // Track mouth animation
    speed: 2,
    invincible: false,
};

function drawPacman() {
    ctx.fillStyle = '#FFFF00'; // Pac-Man color
    ctx.beginPath();
    const mouthAngle = pacman.mouthOpen ? 0.2 : 0;
    const startAngle = (pacman.direction === 'right' ? 0 : pacman.direction === 'down' ? 0.5 : pacman.direction === 'left' ? 1 : 1.5) * Math.PI + mouthAngle;
    const endAngle = (pacman.direction === 'right' ? 0 : pacman.direction === 'down' ? 0.5 : pacman.direction === 'left' ? 1 : 1.5) * Math.PI + (2 - mouthAngle) * Math.PI;
    ctx.arc(pacman.x + pacman.size / 2, pacman.y + pacman.size / 2, pacman.size / 2, startAngle, endAngle, false);
    ctx.lineTo(pacman.x + pacman.size / 2, pacman.y + pacman.size / 2);
    ctx.fill();
}

function updatePacman() {
    if (pacman.direction === 'left') pacman.x -= pacman.speed;
    if (pacman.direction === 'right') pacman.direction === 'right') pacman.x += pacman.speed;
    if (pacman.direction === 'up') pacman.y -= pacman.speed;
    if (pacman.direction === 'down') pacman.y += pacman.speed;
    
    pacman.mouthOpen = !pacman.mouthOpen; // Toggle mouth open/close
    
    // Collision with walls
    if (isWall(pacman.x, pacman.y)) {
        if (pacman.direction === 'left') pacman.x += pacman.speed;
        if (pacman.direction === 'right') pacman.x -= pacman.speed;
        if (pacman.direction === 'up') pacman.y += pacman.speed;
        if (pacman.direction === 'down') pacman.y -= pacman.speed;
    }
}

function isWall(x, y) {
    let col = Math.floor(x / tileSize);
    let row = Math.floor(y / tileSize);
    return maze[row] && maze[row][col] === 1;
}

let ghosts = [
    { x: 13 * tileSize, y: 11 * tileSize, color: '#FF0000', direction: 'up', speed: 2, vulnerable: false, originalColor: '#FF0000' },
    { x: 14 * tileSize, y: 11 * tileSize, color: '#FFB8FF', direction: 'up', speed: 2, vulnerable: false, originalColor: '#FFB8FF' },
    { x: 13 * tileSize, y: 14 * tileSize, color: '#00FFFF', direction: 'up', speed: 2, vulnerable: false, originalColor: '#00FFFF' },
    { x: 14 * tileSize, y: 14 * tileSize, color: '#FFB852', direction: 'up', speed: 2, vulnerable: false, originalColor: '#FFB852' },
];

function drawGhosts() {
    ghosts.forEach(ghost => {
        ctx.fillStyle = ghost.color;
        ctx.beginPath();
        ctx.arc(ghost.x + tileSize / 2, ghost.y + tileSize / 2, tileSize / 2, 0, Math.PI, true); // Head
        ctx.rect(ghost.x, ghost.y + tileSize / 2, tileSize, tileSize / 2); // Body
        ctx.fill();
    });
}

function moveGhosts() {
    ghosts.forEach(ghost => {
        if (ghost.direction === 'left') ghost.x -= ghost.speed;
        if (ghost.direction === 'right') ghost.x += ghost.speed;
        if (ghost.direction === 'up') ghost.y -= ghost.speed;
        if (ghost.direction === 'down') ghost.y += ghost.speed;

        // Simple AI: Change direction randomly for now
        if (Math.random() < 0.1) {
            const directions = ['left', 'right', 'up', 'down'];
            ghost.direction = directions[Math.floor(Math.random() * directions.length)];
        }

        // Prevent ghosts from moving through walls
        if (isWall(ghost.x, ghost.y)) {
            if (ghost.direction === 'left') ghost.x += ghost.speed;
            if (ghost.direction === 'right') ghost.x -= ghost.speed;
            if (ghost.direction === 'up') ghost.y += ghost.speed;
            if (ghost.direction === 'down') ghost.y -= ghost.speed;
        }
    });
}

function eatDot() {
    let col = Math.floor(pacman.x / tileSize);
    let row = Math.floor(pacman.y / tileSize);

    if (maze[row][col] === 2) {
        maze[row][col] = 0; // Pac-Man eats the dot
        score += 10;
    } else if (maze[row][col] === 3) {
        maze[row][col] = 0; // Pac-Man eats the power pellet
        score += 50;
        ghosts.forEach(ghost => {
            ghost.vulnerable = true;
            ghost.color = '#0000FF'; // Change ghost color to blue
        });
        setTimeout(() => {
            ghosts.forEach(ghost => {
                ghost.vulnerable = false;
                ghost.color = ghost.originalColor;
            });
        }, 10000); // Ghosts are vulnerable for 10 seconds
    }
}

function checkCollisions() {
    let nextX = pacman.x, nextY = pacman.y;
    if (pacman.direction === 'left') nextX -= pacman.speed;
    if (pacman.direction === 'right') nextX += pacman.speed;
    if (pacman.direction === 'up') nextY -= pacman.speed;
    if (pacman.direction === 'down') nextY += pacman.speed;

    if (!isWall(nextX, pacman.y)) pacman.x = nextX;
    if (!isWall(pacman.x, nextY)) pacman.y = nextY;

    ghosts.forEach(ghost => {
        if (Math.abs(ghost.x - pacman.x) < tileSize && Math.abs(ghost.y - pacman.y) < tileSize) {
            if (ghost.vulnerable) {
                ghost.x = 13 * tileSize; // Reset ghost position
                ghost.y = 14 * tileSize;
                score += 200; // Add score for eating a ghost
            } else if (!pacman.invincible) {
                resetGame(); // Pac-Man loses a life
            }
        }
    });
}

function resetGame() {
    lives--;
    if (lives === 0) {
        gameOver();
    } else {
        pacman.x = 14 * tileSize;
        pacman.y = 23 * tileSize;
        ghosts.forEach(ghost => {
            ghost.x = 13 * tileSize;
            ghost.y = 14 * tileSize;
        });
    }
}

function gameOver() {
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '30px Arial';
    ctx.fillText('Game Over', canvas.width / 2 - 80, canvas.height / 2);
    ctx.font = '20px Arial';
    ctx.fillText('Press R to Restart', canvas.width / 2 - 100, canvas.height / 2 + 30);
    document.removeEventListener('keydown', handleInput);
    document.addEventListener('keydown', restartGame);
}

function restartGame(e) {
    if (e.key === 'r' || e.key === 'R') {
        score = 0;
        lives = 3;
        resetGame();
        document.removeEventListener('keydown', restartGame);
        document.addEventListener('keydown', handleInput);
    }
}

function drawScore() {
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '16px Arial';
    ctx.fillText(`Score: ${score}`, 8, canvas.height - 8);
    const highScore = localStorage.getItem('highScore') || 0;
    ctx.fillText(`High Score: ${highScore}`, 8, canvas.height - 30);
}

function nextLevel() {
    if (maze.every(row => row.every(tile => tile !== 2 && tile !== 3))) {
        ghosts.forEach(ghost => {
            ghost.speed += 1;
        });
        resetMaze();
    }
}

function resetMaze() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (maze[row][col] === 0) {
                maze[row][col] = 2; // Replace empty spaces with dots
            }
        }
    }
}

function checkForEasterEgg() {
    if (score >= 1000 && !easterEggActive) {
        activateEasterEgg();
    }
}

function activateEasterEgg() {
    easterEggActive = true;
    pacman.invincible = true;
    pacman.speed = 4;

    const originalColor = '#FFFF00';
    ctx.fillStyle = '#FFD700'; // Golden color
    setTimeout(() => {
        pacman.invincible = false;
        pacman.speed = 2;
        ctx.fillStyle = originalColor;
    }, 10000);
}

function updateGame() {
    eatDot();
    checkCollisions();
    updatePacman();
    moveGhosts();
    drawMaze();
    drawPacman();
    drawGhosts();
    drawScore();
    nextLevel();
    checkForEasterEgg();
}

function startScreen() {
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '30px Arial';
    ctx.fillText('Pac-Man', canvas.width / 2 - 70, canvas.height / 2 - 50);
    ctx.font = '20px Arial';
    ctx.fillText('Press Enter to Start', canvas.width / 2 - 100, canvas.height / 2);
    document.addEventListener('keydown', startGame);
}

function startGame(e) {
    if (e.key === 'Enter') {
        document.removeEventListener('keydown', startGame);
        document.addEventListener('keydown', handleInput);
        gameInterval = setInterval(updateGame, 100);
    }
}

function pauseGame() {
    if (!gamePaused) {
        gamePaused = true;
        clearInterval(gameInterval);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '30px Arial';
        ctx.fillText('Paused', canvas.width / 2 - 50, canvas.height / 2);
    } else {
        gamePaused = false;
        gameInterval = setInterval(updateGame, 100}
}

function handleInput(e) {
    if (e.key === 'ArrowLeft') pacman.direction = 'left';
    if (e.key === 'ArrowRight') pacman.direction = 'right';
    if (e.key === 'ArrowUp') pacman.direction = 'up';
    if (e.key === 'ArrowDown') pacman.direction = 'down';
    if (e.key === 'p' || e.key === 'P') pauseGame(); // Pause the game
}

function resizeCanvas() {
    const scaleFactor = Math.min(window.innerWidth / 448, window.innerHeight / 496);
    canvas.width = 448 * scaleFactor;
    canvas.height = 496 * scaleFactor;
    ctx.scale(scaleFactor, scaleFactor);
    drawMaze();
    drawPacman();
    drawGhosts();
    drawScore();
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function handleTouchStart(e) {
    const touch = e.touches[0];
    const x = touch.clientX - canvas.offsetLeft;
    const y = touch.clientY - canvas.offsetTop;

    if (x < canvas.width / 3) pacman.direction = 'left';
    else if (x > canvas.width * 2 / 3) pacman.direction = 'right';
    else if (y < canvas.height / 3) pacman.direction = 'up';
    else if (y > canvas.height * 2 / 3) pacman.direction = 'down';
}

canvas.addEventListener('touchstart', handleTouchStart);

let gameInterval;
let gamePaused = false;
let score = 0;
let lives = 3;
let easterEggActive = false;

startScreen();