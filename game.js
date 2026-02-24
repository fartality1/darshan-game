// Canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Background FULLSCREEN FIX
let bg = new Image();
bg.src = "background.png";

// Bird
let bird = new Image();
bird.src = "face.png";

// Sounds
let jumpSound = new Audio("jump.mp3");
let hitSound = new Audio("hit.mp3");
let pointSound = new Audio("point.mp3");

// SUPER EASY PHYSICS
let birdX = 60;
let birdY = 200;
let gravity = 0.15;     // VERY slow falling
let velocity = 0;
let jumpForce = -5;     // softer jump

// SUPER EASY PIPES
let pipes = [];
let pipeGap = 240;      // VERY BIG gap
let pipeSpeed = 1;      // VERY slow pipes
let pipeWidth = 60;

let score = 0;

// First pipe
pipes.push({
    x: canvas.width + 150,
    height: Math.random() * 200 + 100
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

// Main loop
function gameLoop() {

    // FULLSCREEN BACKGROUND
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

    // Bird physics
    velocity += gravity;
    birdY += velocity;

    // Draw bird
    ctx.drawImage(bird, birdX, birdY, 40, 40);

    // Boundaries
    if (birdY < 0 || birdY + 40 > canvas.height) {
        hitSound.play();
        alert("Game Over! Score: " + score);
        return location.reload();
    }

    // Pipes
    for (let pipe of pipes) {
        pipe.x -= pipeSpeed;

        ctx.fillStyle = "green";

        // Top pipe
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.height);

        // Bottom pipe
        ctx.fillRect(pipe.x, pipe.height + pipeGap, pipeWidth, canvas.height);

        // SUPER EASY HITBOX
        if (pipe.x < birdX + 35 && pipe.x + pipeWidth > birdX + 5) {
            if (birdY < pipe.height - 15 ||
                birdY + 35 > pipe.height + pipeGap + 15) 
            {
                hitSound.play();
                alert("Game Over! Score: " + score);
                return location.reload();
            }
        }

        // Score
        if (!pipe.passed && pipe.x + pipeWidth < birdX) {
            score++;
            pointSound.play();
            pipe.passed = true;
        }
    }

    // Add new pipe
    if (pipes[pipes.length - 1].x < canvas.width - 250) {
        pipes.push({
            x: canvas.width,
            height: Math.random() * 200 + 100
        });
    }

    // Draw score
    ctx.fillStyle = "white";
    ctx.font = "32px Arial";
    ctx.fillText("Score: " + score, 10, 40);

    requestAnimationFrame(gameLoop);
}

gameLoop();
