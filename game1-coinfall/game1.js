// game1-coinfall/game1.js
(function() { // Start of IIFE to encapsulate Game 1 logic

    // --- DOM Elements (Using new IDs) ---
    const canvas = document.getElementById('game1Canvas');
    // Add a null check in case the canvas isn't found (e.g., script loads before element somehow)
    if (!canvas) {
        console.error("Game 1 Error: Canvas element 'game1Canvas' not found!");
        return; // Stop execution if canvas isn't found
    }
    const ctx = canvas.getContext('2d');
    const startButton = document.getElementById('game1StartButton');
    const pauseButton = document.getElementById('game1PauseButton');
    const levelDisplay = document.getElementById('game1LevelDisplay');
    const scoreDisplay = document.getElementById('game1ScoreDisplay');
    const targetDisplay = document.getElementById('game1TargetDisplay');
    const livesDisplay = document.getElementById('game1LivesDisplay');
    const messageOverlay = document.getElementById('game1MessageOverlay');
    const messageText = document.getElementById('game1MessageText');
    const nextLevelButton = document.getElementById('game1NextLevelButton');

    // --- Game States ---
    const STATE = {
        READY: 'READY',
        PLAYING: 'PLAYING',
        PAUSED: 'PAUSED',
        LEVEL_COMPLETE: 'LEVEL_COMPLETE',
        NEXT_LEVEL_READY: 'NEXT_LEVEL_READY',
        GAME_OVER: 'GAME_OVER',
        GAME_WON: 'GAME_WON'
    };
    let gameState = STATE.READY; // Default state

    // --- Level Configuration ---
    const levels = [
        // Level 1          target, misses, speed, spawn, speedInc, spawnDec
        { target: 100, misses: 10, speed: 2.5, spawn: 900, speedInc: 0.001, spawnDec: 0.5 },
        { target: 150, misses: 9, speed: 2.8, spawn: 850, speedInc: 0.0012, spawnDec: 0.6 },
        { target: 200, misses: 8, speed: 3.1, spawn: 800, speedInc: 0.0014, spawnDec: 0.7 },
        { target: 250, misses: 7, speed: 3.4, spawn: 750, speedInc: 0.0016, spawnDec: 0.8 },
        { target: 300, misses: 6, speed: 3.7, spawn: 700, speedInc: 0.0018, spawnDec: 0.9 },
        { target: 350, misses: 5, speed: 4.0, spawn: 650, speedInc: 0.0020, spawnDec: 1.0 },
        { target: 400, misses: 4, speed: 4.3, spawn: 600, speedInc: 0.0022, spawnDec: 1.1 },
        { target: 450, misses: 3, speed: 4.6, spawn: 550, speedInc: 0.0024, spawnDec: 1.2 },
        { target: 500, misses: 2, speed: 4.9, spawn: 500, speedInc: 0.0026, spawnDec: 1.3 },
        { target: 600, misses: 1, speed: 5.2, spawn: 450, speedInc: 0.0030, spawnDec: 1.5 }
    ];
    let currentLevelIndex = 0;

    // --- Game Variables ---
    let score = 0;
    let totalScore = 0;
    let lives = 0;
    let coins = [];
    let gameSpeed = 0;
    let speedIncrease = 0;
    let spawnRate = 0;
    let spawnRateDecrease = 0;
    let lastSpawn = -1;
    const coinRadius = 12;
    let animationFrameId = null;
    let lastTime = 0;

    // --- Player Object ---
    const player = {
        x: canvas.width / 2 - 30, // Use canvas width directly
        y: canvas.height - 50,    // Use canvas height directly
        width: 60,
        height: 15,
        speed: 7,
        color: "#6a44ff"
    };

    // --- Input Handling ---
    let rightPressed = false;
    let leftPressed = false;

    // --- Drawing Functions ---
    function drawPlayer() {
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, player.width, player.height);
        ctx.strokeStyle = "#c0c0ff";
        ctx.lineWidth = 1;
        ctx.strokeRect(player.x, player.y, player.width, player.height);
    }

    function drawCoins() {
        for (let coin of coins) {
            ctx.beginPath();
            ctx.arc(coin.x, coin.y, coin.radius, 0, Math.PI * 2);
            ctx.fillStyle = coin.color;
            ctx.fill();
            ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.closePath();
        }
    }

    // --- Game Logic Functions ---
    function spawnCoin() {
        if (gameState !== STATE.PLAYING) return;

        let coin = {
            x: Math.random() * (canvas.width - coinRadius * 2) + coinRadius,
            y: -coinRadius,
            radius: coinRadius,
            speed: gameSpeed + Math.random() * 1.5,
            color: "#FFD700",
            value: 10
        };
        if (Math.random() < Math.min(0.5, 0.1 + currentLevelIndex * 0.04)) {
            coin.color = "#00FFFF";
            coin.value = 50;
        }
        coins.push(coin);
    }

    function updatePlayer() {
        if (rightPressed && player.x < canvas.width - player.width) {
            player.x += player.speed;
        } else if (leftPressed && player.x > 0) {
            player.x -= player.speed;
        }
    }

    function updateCoins(deltaTime) {
        // Add safety check for levels array bounds
        if (currentLevelIndex < 0 || currentLevelIndex >= levels.length) {
             console.error("Game 1: Invalid level index in updateCoins:", currentLevelIndex);
             changeState(STATE.GAME_OVER); // Or handle appropriately
             showMessage("Error", "Invalid level state");
             return;
        }
        const levelConf = levels[currentLevelIndex];
        if (!levelConf) return; // Extra safety

        for (let i = coins.length - 1; i >= 0; i--) {
            let coin = coins[i];
            coin.y += coin.speed * (deltaTime / 16.67);

            // Collision with player
            if (coin.y + coin.radius > player.y &&
                coin.y - coin.radius < player.y + player.height &&
                coin.x + coin.radius > player.x &&
                coin.x - coin.radius < player.x + player.width) {
                score += coin.value;
                totalScore += coin.value;
                coins.splice(i, 1);
                // Check if scoreDisplay exists before updating
                if (scoreDisplay) scoreDisplay.textContent = score;

                // Check level complete *after* updating score display
                if (score >= levelConf.target) {
                    console.log(`Game 1: Level ${currentLevelIndex + 1} target reached!`);
                    changeState(STATE.LEVEL_COMPLETE);
                    stopGameLoop();
                    proceedToNextLevel();
                    return;
                }
                continue;
            }

            // Check if coin missed
            if (coin.y - coin.radius > canvas.height) {
                lives--;
                coins.splice(i, 1);
                if (livesDisplay) livesDisplay.textContent = lives; // Update UI

                if (lives <= 0) {
                    console.log("Game 1: Game Over - Ran out of lives");
                    changeState(STATE.GAME_OVER);
                    stopGameLoop();
                    showMessage("GAME OVER", `Final Score: ${totalScore}<br>Press Enter or Restart`);
                    return;
                }
                continue;
            }
        }

        // Increase Difficulty Within Level
        gameSpeed += speedIncrease * (deltaTime / 1000);
        const minSpawnRate = 200;
        if (spawnRate > minSpawnRate) {
            spawnRate -= spawnRateDecrease * (deltaTime / 1000);
            if (spawnRate < minSpawnRate) spawnRate = minSpawnRate;
        }
    }

    // --- Game Loop ---
    function gameLoop(timestamp) {
        if (gameState !== STATE.PLAYING) {
            animationFrameId = null;
            return;
        };

        let deltaTime = timestamp - lastTime;
        if (deltaTime > 100) deltaTime = 16.67;
        lastTime = timestamp;

        // Need ctx check in case canvas failed but somehow loop started
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (timestamp > lastSpawn + spawnRate) {
            spawnCoin();
            lastSpawn = timestamp;
        }

        updatePlayer();
        updateCoins(deltaTime); // This might change gameState

        if (gameState === STATE.PLAYING) { // Check state AGAIN
            drawPlayer();
            drawCoins();
            animationFrameId = requestAnimationFrame(gameLoop);
        } else {
            animationFrameId = null;
        }
    }

    // --- Game Loop Control ---
    function resumeGameLoop() {
        // Ensure element checks pass before resuming
        if (!canvas || !ctx) return;
        if (!animationFrameId && gameState === STATE.PLAYING) {
            console.log("Game 1: Resuming game loop");
            lastTime = performance.now();
            animationFrameId = requestAnimationFrame(gameLoop);
        } else {
            console.log("Game 1: Cannot resume loop. State:", gameState, "FrameId:", animationFrameId);
        }
    }

    function stopGameLoop() {
        if (animationFrameId) {
            console.log("Game 1: Stopping game loop");
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    }

    // --- Game State Management & UI ---
    function changeState(newState) {
        gameState = newState;
        console.log("Game 1: State changed to:", gameState); // Add prefix for clarity

        // Check if buttons exist before trying to modify them
        if (!startButton || !pauseButton || !nextLevelButton) {
             console.warn("Game 1: Control buttons not found during state change.");
        }

        switch (gameState) {
            case STATE.READY:
                if(startButton) { startButton.textContent = "Start Game"; startButton.disabled = false; }
                if(pauseButton) { pauseButton.textContent = "Pause"; pauseButton.disabled = true; }
                break;
            case STATE.PLAYING:
                if(startButton) startButton.disabled = true;
                if(pauseButton) { pauseButton.disabled = false; pauseButton.textContent = "Pause"; }
                hideMessage(); // Ensure overlay hidden
                break;
            case STATE.PAUSED:
                if(pauseButton) { pauseButton.textContent = "Resume"; pauseButton.disabled = false; }
                break; // Message shown in togglePause
            case STATE.LEVEL_COMPLETE:
            case STATE.NEXT_LEVEL_READY:
                 if(startButton) startButton.disabled = true;
                 if(pauseButton) pauseButton.disabled = true;
                break;
            case STATE.GAME_OVER:
            case STATE.GAME_WON:
                if(startButton) { startButton.textContent = "Restart"; startButton.disabled = false; }
                if(pauseButton) pauseButton.disabled = true;
                break;
        }

        // Manage nextLevelButton visibility
        if (nextLevelButton && gameState !== STATE.NEXT_LEVEL_READY) {
           nextLevelButton.classList.add('d-none');
        }
    }

    function showMessage(text, subtext = "", showNextLevelBtn = false, nextLevelNum = 0) {
         // Check if overlay elements exist
         if (!messageOverlay || !messageText || !nextLevelButton) return;

        messageText.innerHTML = text + (subtext ? `<br><small style="font-size: 0.6em; line-height: 1.4;">${subtext}</small>` : "");

        if (showNextLevelBtn && gameState === STATE.NEXT_LEVEL_READY) {
            nextLevelButton.textContent = `Start Level ${nextLevelNum}`;
            nextLevelButton.classList.remove('d-none');
        } else {
            nextLevelButton.classList.add('d-none');
        }

        messageOverlay.classList.remove('d-none');
        messageOverlay.classList.add('d-flex');
    }

    function hideMessage() {
        if (messageOverlay) {
            messageOverlay.classList.add('d-none');
            messageOverlay.classList.remove('d-flex');
        }
    }

    // --- Setup, Start, Pause, Level Transitions ---
    function setupLevel() {
        if (currentLevelIndex < 0 || currentLevelIndex >= levels.length) {
            currentLevelIndex = 0;
        }
        const levelConf = levels[currentLevelIndex];
        if (!levelConf) { // Added check
             console.error("Game 1: Level config not found for index", currentLevelIndex);
             return;
        }

        score = 0;
        lives = levelConf.misses;
        gameSpeed = levelConf.speed;
        speedIncrease = levelConf.speedInc;
        spawnRate = levelConf.spawn;
        spawnRateDecrease = levelConf.spawnDec;
        coins = [];
        if (canvas) player.x = canvas.width / 2 - player.width / 2; // Check canvas
        rightPressed = false;
        leftPressed = false;
        lastSpawn = performance.now();

        // Update UI only if elements exist
        if(levelDisplay) levelDisplay.textContent = currentLevelIndex + 1;
        if(scoreDisplay) scoreDisplay.textContent = score;
        if(targetDisplay) targetDisplay.textContent = levelConf.target;
        if(livesDisplay) livesDisplay.textContent = lives;

        console.log(`Game 1: Setting up Level ${currentLevelIndex + 1}`);
    }

    function handleStartOrRestart() {
        console.log("Game 1: handleStartOrRestart called. Current state:", gameState);
        if (gameState === STATE.READY || gameState === STATE.GAME_OVER || gameState === STATE.GAME_WON) {
            let isRestart = gameState === STATE.GAME_OVER || gameState === STATE.GAME_WON;
            if (isRestart) {
                currentLevelIndex = 0;
                totalScore = 0;
                console.log("Game 1: Restarting game from Level 1");
            } else {
                console.log("Game 1: Starting game from Level 1");
            }
            setupLevel();
            // Change state *before* trying to resume loop
            changeState(STATE.PLAYING);
            hideMessage(); // Ensure message hidden
            console.log("Game 1: About to call resumeGameLoop. State should be PLAYING:", gameState);
            resumeGameLoop();
        } else {
            console.log("Game 1: handleStartOrRestart ignored. State is not READY/OVER/WON.");
        }
    }

    function handleStartNextLevel() {
        if (gameState === STATE.NEXT_LEVEL_READY) {
            console.log(`Game 1: Starting next level: ${currentLevelIndex + 1}`);
            setupLevel();
             // Change state *before* trying to resume loop
            changeState(STATE.PLAYING);
            hideMessage();
            resumeGameLoop();
        } else {
             console.log("Game 1: handleStartNextLevel ignored. State is not NEXT_LEVEL_READY.");
        }
    }

    function togglePause() {
        if (gameState === STATE.PLAYING) {
            stopGameLoop();
            changeState(STATE.PAUSED);
            showMessage("Paused"); // Show message after state change
        } else if (gameState === STATE.PAUSED) {
            hideMessage();
            changeState(STATE.PLAYING); // Change state BEFORE resuming
            resumeGameLoop();
        }
    }

     // Expose pause function globally FOR GAME 1, called by tab switcher
     window.pauseGame1 = function() {
        console.log("Game 1: External pause requested. Current state:", gameState);
        // Only pause if actually playing, otherwise do nothing
        if (gameState === STATE.PLAYING) {
             togglePause();
         }
     }

    function proceedToNextLevel() {
        stopGameLoop(); // Ensure loop is stopped

        currentLevelIndex++;
        if (currentLevelIndex >= levels.length) {
            changeState(STATE.GAME_WON);
            showMessage("YOU WIN!", `Total Score: ${totalScore}<br>Press Enter or Restart`);
        } else {
             // Check if next level config exists before proceeding
             if (levels[currentLevelIndex]) {
                changeState(STATE.NEXT_LEVEL_READY);
                showMessage(
                    `Level ${currentLevelIndex} Complete!`, // Show previous level complete
                    `Get Ready for Level ${currentLevelIndex + 1}<br>Target: ${levels[currentLevelIndex].target} | Misses Allowed: ${levels[currentLevelIndex].misses}`,
                    true, // Show the next level button
                    currentLevelIndex + 1
                );
             } else {
                 console.error("Game 1: Attempted to proceed to non-existent level index", currentLevelIndex);
                 changeState(STATE.GAME_WON); // Treat as game won if config missing
                 showMessage("Error", "Could not load next level data.");
             }
        }
    }

    // --- Keyboard Handlers ---
    function keyDownHandler(e) {
        // Check if the active tab is game 1 before handling keys
        const game1Pane = document.getElementById('game1-pane');
        if (!game1Pane || !game1Pane.classList.contains('active')) {
            // If game 1 pane is not active, ignore keyboard input for this game
            return;
        }

        if (gameState === STATE.PLAYING) {
            if (e.key == "Right" || e.key == "ArrowRight") rightPressed = true;
            else if (e.key == "Left" || e.key == "ArrowLeft") leftPressed = true;
            else if (e.key === 'p' || e.key === 'P') togglePause();
        }

        if ((gameState === STATE.NEXT_LEVEL_READY || gameState === STATE.GAME_OVER || gameState === STATE.GAME_WON) && e.key === "Enter") {
            if (gameState === STATE.NEXT_LEVEL_READY) handleStartNextLevel();
            else handleStartOrRestart();
        }
        if (gameState === STATE.READY && e.key === "Enter") {
            handleStartOrRestart();
        }
    }

    function keyUpHandler(e) {
         // Check if the active tab is game 1
         const game1Pane = document.getElementById('game1-pane');
         if (!game1Pane || !game1Pane.classList.contains('active')) {
             return;
         }

        if (e.key == "Right" || e.key == "ArrowRight") rightPressed = false;
        else if (e.key == "Left" || e.key == "ArrowLeft") leftPressed = false;
    }

    // --- Initial Setup ---
    function initializeGame() {
        // Don't run initialization if canvas isn't found
        if (!canvas || !ctx) {
            console.error("Game 1: Cannot initialize - canvas or context missing.");
            return;
        }
        console.log("Game 1: Initializing Game...");
        currentLevelIndex = 0;
        totalScore = 0;

        // Setup initial UI based on Level 1 config (check elements exist)
        const initialLevelConf = levels[0];
         if (initialLevelConf) {
             if(levelDisplay) levelDisplay.textContent = 1;
             if(scoreDisplay) scoreDisplay.textContent = 0;
             if(targetDisplay) targetDisplay.textContent = initialLevelConf.target;
             if(livesDisplay) livesDisplay.textContent = initialLevelConf.misses;
         } else {
              console.error("Game 1: Cannot read initial level config.");
         }

        // Set initial state first
        changeState(STATE.READY);

        // Clear canvas and show initial message
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        showMessage("Coin Fall", "Press Start or Enter to Play");

        // --- Attach Event Listeners ---
        // Ensure elements exist before adding listeners
        if (startButton) startButton.addEventListener('click', handleStartOrRestart);
        if (pauseButton) pauseButton.addEventListener('click', togglePause);
        if (nextLevelButton) nextLevelButton.addEventListener('click', handleStartNextLevel);
        // Key listeners are global but check for active tab inside handlers
        document.addEventListener('keydown', keyDownHandler, false);
        document.addEventListener('keyup', keyUpHandler, false);

        console.log("Game 1: Initialization complete and listeners attached.");
    }

    // --- Run initialization ---
    // Defer initialization until the DOM is fully loaded to ensure all elements are available
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeGame);
    } else {
        initializeGame(); // DOM is already ready
    }

})(); // End of IIFE for Game 1