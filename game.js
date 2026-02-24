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

// Bird physics (EASY MODE)
let birdX = 60;
let birdY = 200;
let gravity = 0.25;     // LESS gravity → falls slower
let velocity = 0;
let jumpForce = -6;      // stronger flap but controlled

// Pipes (EASY MODE)
let pipes = [];
let pipeGap = 190;       // BIGGER GAP → easier to pass
let pipeWidth = 60;
let pipeSpeed = 1.6;     // slower pipes → easy timing

// Score
let score = 0;

// Add first pipe
pipes.push({
    x: canvas.width,
    height: Math.random() * 230 + 80  // more fair height
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

    // Pipes
    for (let i = 0; i < pipes.length; i++) {
        let pipe = pipes[i];
        pipe.x -= pipeSpeed;

        // Draw pipes
        ctx.fillStyle = "green";

        // Top pipe
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.height);

        // Bottom pipe
        ctx.fillRect(pipe.x, pipe.height + pipeGap, pipeWidth, canvas.height);

        // Collision (EASY HITBOX - forgiving)
        if (pipe.x < birdX + 35 && pipe.x + pipeWidth > birdX + 5) {
            if (birdY < pipe.height - 10 || birdY + 35 > pipe.height + pipeGap + 10) {
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
        if (pipe.x < canvas.width - 220 && !pipe.added) {
            pipes.push({
                x: canvas.width,
                height: Math.random() * 230 + 80
            });
            pipe.added = true;
        }
    }

    // Draw Score
    ctx.fillStyle = "white";
    ctx.font = "32px Arial";
    ctx.fillText("Score: " + score, 10, 40);

    requestAnimationFrame(gameLoop);
}

gameLoop();
