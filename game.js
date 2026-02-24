// Canvas setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Background
let bg = new Image();
bg.src = "background.png";

// Bird (your face)
let bird = new Image();
bird.src = "face.png";

// Sounds
let jumpSound = new Audio("jump.mp3");
let hitSound = new Audio("hit.mp3");
let pointSound = new Audio("point.mp3");

// Bird physics
let birdX = 60;
let birdY = 200;
let gravity = 0.35;
let velocity = 0;
let jumpForce = -7;

// Pipes
let pipes = [];
let pipeGap = 150;
let pipeWidth = 60;
let pipeSpeed = 2.2;

// Score
let score = 0;

// Add first pipe
pipes.push({
    x: canvas.width,
    height: Math.random() * 250 + 50
});

// Jump
function jump() {
    velocity = jumpForce;
    jumpSound.currentTime = 0;
    jumpSound.play();
}

// Controls
canvas.addEventListener("click", jump);
canvas.addEventListener("touchstart", jump);
document.addEventListener("keydown", jump);

// Main Game Loop
function gameLoop() {

    // Draw background
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

    // Bird physics
    velocity += gravity;
    birdY += velocity;

    // Draw bird
    ctx.drawImage(bird, birdX, birdY, 40, 40);

    // Check boundaries
    if (birdY + 40 > canvas.height || birdY < 0) {
        hitSound.play();
        alert("Game Over! Score: " + score);
        return location.reload();
    }

    // Pipe Logic
    for (let i = 0; i < pipes.length; i++) {
        let pipe = pipes[i];
        pipe.x -= pipeSpeed;

        // Draw pipes
        ctx.fillStyle = "green";

        // Top pipe
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.height);

        // Bottom pipe
        ctx.fillRect(pipe.x, pipe.height + pipeGap, pipeWidth, canvas.height);

        // Collision
        if (pipe.x < birdX + 40 && pipe.x + pipeWidth > birdX) {
            if (birdY < pipe.height || birdY + 40 > pipe.height + pipeGap) {
                hitSound.play();
                alert("Game Over! Score: " + score);
                return location.reload();
            }
        }

        // Score
        if (!pipe.passed && pipe.x + pipeWidth < birdX) {
            score += 1;
            pointSound.play();
            pipe.passed = true;
        }

        // Add new pipe
        if (pipe.x < canvas.width - 200 && !pipe.added) {
            pipes.push({
                x: canvas.width,
                height: Math.random() * 250 + 50
            });
            pipe.added = true;
        }
    }

    // Draw Score
    ctx.fillStyle = "black";
    ctx.font = "32px Arial";
    ctx.fillText("Score: " + score, 10, 40);

    requestAnimationFrame(gameLoop);
}

gameLoop();
