let gameSeq = [];
let userSeq = [];

let btns = ["green", "red", "yellow", "purple"];

let started = false;
let level = 0;
let highScore = parseInt(localStorage.getItem("highScore")) || 0; // Retrieve high score from localStorage

let h2 = document.querySelector("h2");
let startBtn = document.getElementById("startBtn");
let highScoreDisplay = document.createElement("h3"); // Create an element to display the high score
highScoreDisplay.innerText = `High Score: ${highScore}`;
document.body.insertBefore(highScoreDisplay, startBtn); // Insert it into the DOM
let bgMusic = document.getElementById("bgMusic");

// Ensure the music starts from the beginning when the game starts
function startMusic() {
    bgMusic.play().catch(err => {
        console.error("Error playing the music: ", err);
    });
}

function stopMusic() {
    bgMusic.pause(); // Stop the music when the game ends
    bgMusic.currentTime = 0; // Reset the music to the start
}

// Start game on button click (for mobile) or keypress (for desktop)
startBtn.addEventListener("click", startGame);
document.addEventListener("keypress", startGame);

// Ensure the music continues playing by handling the ended event
bgMusic.addEventListener('ended', () => {
    bgMusic.currentTime = 0; // Reset the playback position
    bgMusic.play().catch(err => {
        console.error("Error playing the music: ", err);
    }); // Restart the music
});

function startGame() {
    if (!started) {
        started = true;
        levelUp();
        startMusic(); // Start the background music when the game starts
        startBtn.style.display = "none"; // Hide the start button when the game starts
    }
}

function gameFlash(btn) {
    btn.classList.add("flash");
    setTimeout(function () {
        btn.classList.remove("flash");
    }, 250);
}

function userFlash(btn) {
    btn.classList.add("userFlash");
    setTimeout(function () {
        btn.classList.remove("userFlash");
    }, 250);
}

function levelUp() {
    userSeq = [];
    level++;
    h2.innerText = `Level ${level}`;
    let randIdx = Math.floor(Math.random() * 4); 
    let randColor = btns[randIdx];
    let randBtn = document.querySelector(`.${randColor}`);
    gameSeq.push(randColor);
    gameFlash(randBtn);
}

function checkAns(idx) {
    if (userSeq[idx] === gameSeq[idx]) {
        if (userSeq.length === gameSeq.length) {
            setTimeout(levelUp, 1000);
        }
    } else {
        h2.innerHTML = `Game Over! Your score was <b>${level}</b>.<br> Press Start to play again.`;

        // Update high score if the current level is higher
        if (level > highScore) {
            highScore = level;
            localStorage.setItem("highScore", highScore); // Save the new high score to localStorage
            highScoreDisplay.innerText = `High Score: ${highScore}`; // Update the displayed high score
        }

        document.querySelector("body").style.backgroundColor = "red";
        setTimeout(function () {
            document.querySelector("body").style.backgroundColor = "white";
        }, 200);
        stopMusic(); // Stop the music when the game ends
        reset();
        startBtn.style.display = "block"; // Show the start button again when the game is over
    }
}

function btnPress() {
    let btn = this;
    userFlash(btn);
    userColor = btn.getAttribute("id");
    userSeq.push(userColor);

    checkAns(userSeq.length - 1);
}

let allBtns = document.querySelectorAll(".btn");
for (let btn of allBtns) {
    btn.addEventListener("click", btnPress);
}

function reset() {
    gameSeq = [];
    userSeq = [];
    started = false;
    level = 0;
    startMusic(); // Restart the music when the game is reset
}
