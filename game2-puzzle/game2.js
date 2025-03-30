// game2-puzzle/game2.js
(function() { // IIFE to encapsulate game logic
    // --- Current Date Log ---
    const now = new Date(); // Using system time
    console.log(`Initializing Game 2: Puzzle Blocks - ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`);


    // --- DOM Elements ---
    const canvas = document.getElementById('game2Canvas');
    if (!canvas) { console.error("Game 2 Error: Canvas 'game2Canvas' not found!"); return; }
    const ctx = canvas.getContext('2d');
    const startButton = document.getElementById('game2StartButton');
    const pauseButton = document.getElementById('game2PauseButton');
    const scoreDisplay = document.getElementById('game2ScoreDisplay');
    const levelDisplay = document.getElementById('game2LevelDisplay');
    const targetDisplay = document.getElementById('game2TargetDisplay');
    const messageOverlay = document.getElementById('game2MessageOverlay');
    const messageText = document.getElementById('game2MessageText');
    const nextLevelButton = document.getElementById('game2NextLevelButton');

    // --- Constants ---
    const GRID_COLS = 8;
    const GRID_ROWS = 12;
    const BLOCK_SIZE = Math.min(Math.floor(canvas.width / GRID_COLS), Math.floor(canvas.height / GRID_ROWS));
    const canvasWidth = GRID_COLS * BLOCK_SIZE;
    const canvasHeight = GRID_ROWS * BLOCK_SIZE;
    // canvas.width = canvasWidth; // Optional resize
    // canvas.height = canvasHeight;

    const BORDER_WIDTH = 1;
    const ALL_COLORS = ['#FF5555', '#55FF55', '#5555FF', '#FFFF55', '#FF55FF', '#55FFFF']; // R,G,B,Y,M,C
    const EMPTY_CELL = null;
    const MATCH_THRESHOLD = 3;
    const TYPE_NORMAL = 'NORMAL';
    const TYPE_BOMB = 'BOMB';

    // --- Game States ---
    const STATE = {
        READY: 'READY', PLAYING: 'PLAYING', PROCESSING: 'PROCESSING', PAUSED: 'PAUSED',
        LEVEL_COMPLETE: 'LEVEL_COMPLETE', NEXT_LEVEL_READY: 'NEXT_LEVEL_READY',
        GAME_OVER: 'GAME_OVER', GAME_WON: 'GAME_WON'
    };
    let gameState = STATE.READY;

    // --- Level Configuration ---
    const levels2 = [
        { targetScore: 500,  numColors: 3, initialFill: 0.5, bombChance: 0.05 },
        { targetScore: 1000, numColors: 4, initialFill: 0.55, bombChance: 0.04 },
        { targetScore: 1750, numColors: 5, initialFill: 0.6, bombChance: 0.04 },
        { targetScore: 2500, numColors: 6, initialFill: 0.65, bombChance: 0.03 },
        { targetScore: 3500, numColors: 6, initialFill: 0.7, bombChance: 0.03 }
    ];
    let currentLevelIndex = 0;

    // --- Game Variables ---
    let score = 0;
    let grid = [];
    let animationFrameId = null;
    let lastTime = 0;
    let processingState = { needsProcessing: false, spawned: false };

    // --- Core Functions ---
    function initializeGrid() {
        if (currentLevelIndex < 0 || currentLevelIndex >= levels2.length) { currentLevelIndex = 0; }
        const config = levels2[currentLevelIndex];
        const startFillRow = Math.floor(GRID_ROWS * (1 - config.initialFill));
        grid = [];
        for (let r = 0; r < GRID_ROWS; r++) {
            grid[r] = [];
            for (let c = 0; c < GRID_COLS; c++) {
                grid[r][c] = (r >= startFillRow) ? createRandomBlock() : EMPTY_CELL;
            }
        }
        let moved; do { moved = applyGravity(); } while (moved);
        console.log(`Grid Initialized for Level ${currentLevelIndex + 1}`);
    }

    function createRandomBlock() {
        if (currentLevelIndex < 0 || currentLevelIndex >= levels2.length) { currentLevelIndex = 0; }
        const config = levels2[currentLevelIndex];
        const type = Math.random() < config.bombChance ? TYPE_BOMB : TYPE_NORMAL;
        let color;
        if (type === TYPE_BOMB) { color = '#AAAAAA'; }
        else { const availableColors = ALL_COLORS.slice(0, config.numColors); color = availableColors[Math.floor(Math.random() * availableColors.length)]; }
        return { color: color, type: type };
    }

    function setupLevel() {
        if (currentLevelIndex < 0 || currentLevelIndex >= levels2.length) { currentLevelIndex = 0; }
        const config = levels2[currentLevelIndex];
        score = 0;
        const displayLevel = currentLevelIndex + 1;
        initializeGrid();
        if(scoreDisplay) scoreDisplay.textContent = score;
        if(levelDisplay) levelDisplay.textContent = displayLevel;
        if(targetDisplay) targetDisplay.textContent = config.targetScore;
        processingState = { needsProcessing: false, spawned: false };
        console.log(`Game 2: Setting up Level ${displayLevel}`);
    }

    function startGame2() {
        console.log("startGame2 called. Current state:", gameState);
        if (gameState === STATE.GAME_OVER || gameState === STATE.GAME_WON) { currentLevelIndex = 0; }
        if (gameState === STATE.READY || gameState === STATE.GAME_OVER || gameState === STATE.GAME_WON) {
             if (gameState === STATE.READY) console.log("Starting Game 2 (State is READY)");
             else console.log("Restarting Game 2 (State was", gameState, ")");

            setupLevel();
            console.log("Initial processingState after setup:", JSON.stringify(processingState));
            changeState(STATE.PLAYING);
            console.log("State AFTER changeState call:", gameState); // Debug log
            hideMessage();
            console.log("About to call resumeGameLoop. State should be PLAYING:", gameState); // Debug log
            resumeGameLoop();
        } else {
            console.log("startGame2 ignored. State is not READY/OVER/WON:", gameState);
        }
    }

    function togglePauseGame2() {
        if (gameState === STATE.PLAYING) {
            stopGameLoop(); // Stop loop first
            changeState(STATE.PAUSED);
            showMessage("Paused");
        } else if (gameState === STATE.PAUSED) {
            hideMessage();
            changeState(STATE.PLAYING); // Change state BEFORE resuming
            resumeGameLoop();
        }
    }
    // Expose pause function globally
    window.pauseGame2 = function() { if (gameState === STATE.PLAYING) { togglePauseGame2(); } }


    // --- Game Loop (with Debug Logs) ---
    function gameLoop2(timestamp) {
        console.log(">>> ENTERING gameLoop2 <<<", timestamp); // Debug log
        console.log(`Game 2 Loop Tick - State: ${gameState}, Time: ${timestamp.toFixed(0)}`); // Debug log

        if (gameState === STATE.PAUSED || gameState === STATE.READY || gameState === STATE.GAME_OVER || gameState === STATE.GAME_WON || gameState === STATE.NEXT_LEVEL_READY) {
             console.log("gameLoop2: Exiting early, state is", gameState); // Debug log
             animationFrameId = null;
             return;
         };

        let deltaTime = timestamp - lastTime;
        if (deltaTime > 100) deltaTime = 16.67;
        lastTime = timestamp;

        if (gameState === STATE.PROCESSING && processingState.needsProcessing) {
            runProcessingStep();
        }
        else if (gameState === STATE.PLAYING) {
             updateGame2(deltaTime);
        }

        drawGame2();

        if (gameState === STATE.PLAYING || gameState === STATE.PROCESSING) {
            animationFrameId = requestAnimationFrame(gameLoop2);
        } else {
            animationFrameId = null;
        }
    }

    // --- Game Loop Control (with Debug Logs) ---
    function resumeGameLoop() {
        console.log("resumeGameLoop called. Current state:", gameState, "animationFrameId:", animationFrameId); // Debug log
        console.log(">>> Checking condition: !animationFrameId =", !animationFrameId, "&& gameState === STATE.PLAYING is", (gameState === STATE.PLAYING)); // Debug log

        if (!animationFrameId && gameState === STATE.PLAYING ) {
            console.log("Condition passed, requesting animation frame..."); // Debug log
            lastTime = performance.now();
            console.log(">>> Requesting frame now..."); // Debug log
            animationFrameId = requestAnimationFrame(gameLoop2);
            console.log(">>> Frame requested. ID:", animationFrameId); // Debug log
        } else if (gameState !== STATE.PLAYING) {
             console.log("<<< Condition FAILED because gameState is not PLAYING. It is:", gameState); // Debug log
        } else {
             console.log("<<< Condition FAILED because animationFrameId is not null:", animationFrameId); // Debug log
        }
    }

    function stopGameLoop() {
        if (animationFrameId) {
            console.log("Stopping Game 2 loop");
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    }

    // --- Processing Logic ---
    function runProcessingStep() {
        let blocksMoved = false;
        let blocksSpawned = false;

        // 1. Apply Gravity
        blocksMoved = applyGravity();
        if (blocksMoved) { return; }

        // 2. Spawn
        if (!blocksMoved && !processingState.spawned) {
             blocksSpawned = spawnNewBlocks();
             if (blocksSpawned) {
                 processingState.spawned = true;
                 return;
             }
        }

        // 3. If settled & spawned/not needed -> Finish processing
        if (!blocksMoved && (processingState.spawned || !blocksSpawned)) {
            console.log("Processing complete.");
            processingState.needsProcessing = false;
            processingState.spawned = false;

            if (currentLevelIndex < 0 || currentLevelIndex >= levels2.length) { /* Error handling */ changeState(STATE.GAME_OVER); showMessage("Error", "Invalid Level State"); stopGameLoop(); return; }
            const config = levels2[currentLevelIndex];
            // Check score target
            if (score >= config.targetScore) {
                console.log(`Level ${currentLevelIndex + 1} target reached!`);
                changeState(STATE.LEVEL_COMPLETE);
                stopGameLoop();
                proceedToNextLevel2();
                return;
            }
            // Check game over
            else if (checkGameOver()) {
                changeState(STATE.GAME_OVER);
                showMessage("GAME OVER!");
                stopGameLoop();
            } else {
                // Return to playing state
                changeState(STATE.PLAYING);
            }
        }
    }

    // --- Game Logic Functions ---
    function updateGame2(deltaTime) { /* Placeholder */ }
    function drawGame2() {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(30, 10, 30, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let r = 0; r < GRID_ROWS; r++) {
            for (let c = 0; c < GRID_COLS; c++) {
                if (grid[r][c] && grid[r][c] !== EMPTY_CELL) {
                    const block = grid[r][c];
                    const x = c * BLOCK_SIZE;
                    const y = r * BLOCK_SIZE;

                    ctx.fillStyle = block.color;
                    ctx.fillRect( x + BORDER_WIDTH, y + BORDER_WIDTH, BLOCK_SIZE - 2 * BORDER_WIDTH, BLOCK_SIZE - 2 * BORDER_WIDTH);

                    if (block.type === TYPE_BOMB) {
                         ctx.fillStyle = '#FFF'; ctx.beginPath(); ctx.arc(x + BLOCK_SIZE / 2, y + BLOCK_SIZE / 2, BLOCK_SIZE * 0.2, 0, Math.PI * 2); ctx.fill();
                         ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(x + BLOCK_SIZE / 2, y + BLOCK_SIZE / 2, BLOCK_SIZE * 0.1, 0, Math.PI * 2); ctx.fill();
                    }
                }
            }
        }
    }
    function handleCanvasClick(event) {
        if (gameState !== STATE.PLAYING) { console.log("Ignoring click, state is:", gameState); return; }

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = (event.clientX - rect.left) * scaleX;
        const y = (event.clientY - rect.top) * scaleY;
        const col = Math.floor(x / BLOCK_SIZE);
        const row = Math.floor(y / BLOCK_SIZE);

        console.log(`Click detected at Row: ${row}, Col: ${col}`);

        if (isValidCell(row, col) && grid[row][col]) {
            const clickedBlock = grid[row][col];
            let blocksToClear = [];

            if (clickedBlock.type === TYPE_BOMB) { blocksToClear = handleExplosion(row, col); }
            else if (clickedBlock.type === TYPE_NORMAL) {
                let matches = findMatches(row, col);
                if (matches.length >= MATCH_THRESHOLD) { blocksToClear = matches; }
                else { console.log(`Not enough matches found (found ${matches.length}, need ${MATCH_THRESHOLD}).`); }
            }

            if (blocksToClear.length > 0) {
                clearMatches(blocksToClear);
                processingState.needsProcessing = true;
                processingState.spawned = false;
                changeState(STATE.PROCESSING);
                resumeGameLoop();
            }
        } else { console.log("Clicked on empty cell or outside grid"); }
    }
    function isValidCell(r, c) { return r >= 0 && r < GRID_ROWS && c >= 0 && c < GRID_COLS; }
    function findMatches(startRow, startCol) {
        const startBlock = grid[startRow][startCol];
        if (!startBlock || startBlock.type !== TYPE_NORMAL) return [];
        const targetColor = startBlock.color;
        const matches = [];
        const visited = Array(GRID_ROWS).fill(null).map(() => Array(GRID_COLS).fill(false));
        const queue = [{ r: startRow, c: startCol }];
        visited[startRow][startCol] = true;
        let head = 0;
        while (head < queue.length) {
            const current = queue[head++]; const { r, c } = current;
            if (!isValidCell(r,c) || !grid[r][c] || grid[r][c].type !== TYPE_NORMAL || grid[r][c].color !== targetColor) { continue; }
            matches.push(current);
            const neighbors = [ { r: r + 1, c: c }, { r: r - 1, c: c }, { r: r, c: c + 1 }, { r: r, c: c - 1 } ];
            for (const neighbor of neighbors) {
                 const nr = neighbor.r; const nc = neighbor.c;
                 if (isValidCell(nr, nc) && !visited[nr][nc] && grid[nr][nc] && grid[nr][nc].color === targetColor && grid[nr][nc].type === TYPE_NORMAL) {
                     visited[nr][nc] = true; queue.push(neighbor);
                 }
             }
        }
        console.log(`Found ${matches.length} matches for color ${targetColor}`);
        return matches;
    }
    function clearMatches(blocksToClear) {
         let pointsEarned = 0;
         console.log(`Clearing ${blocksToClear.length} blocks.`);
         blocksToClear.forEach(blockPos => {
             if (isValidCell(blockPos.r, blockPos.c) && grid[blockPos.r][blockPos.c]) {
                 grid[blockPos.r][blockPos.c] = EMPTY_CELL; pointsEarned += 10;
             }
         });
         if (blocksToClear.length >= MATCH_THRESHOLD + 1) { pointsEarned += (blocksToClear.length - (MATCH_THRESHOLD -1)) * 5; }
         score += pointsEarned;
         if(scoreDisplay) scoreDisplay.textContent = score;
         console.log(`Earned ${pointsEarned} points. Total Score: ${score}`);
     }
    function handleExplosion(row, col) {
        console.log(`Bomb exploded at [${row}, ${col}]`);
        const blocksAffected = [];
        for (let r = row - 1; r <= row + 1; r++) {
            for (let c = col - 1; c <= col + 1; c++) { if (isValidCell(r, c)) { blocksAffected.push({ r: r, c: c }); } }
        }
        return blocksAffected;
    }
    function applyGravity() {
        let blocksMoved = false;
        for (let c = 0; c < GRID_COLS; c++) {
            let writeRow = GRID_ROWS - 1;
            for (let r = GRID_ROWS - 1; r >= 0; r--) {
                if (grid[r][c] !== EMPTY_CELL) { if (r !== writeRow) { grid[writeRow][c] = grid[r][c]; grid[r][c] = EMPTY_CELL; blocksMoved = true; } writeRow--; }
            }
        }
        return blocksMoved;
    }
    function spawnNewBlocks() {
         let blocksSpawned = false;
         for (let c = 0; c < GRID_COLS; c++) { if (grid[0][c] === EMPTY_CELL) { grid[0][c] = createRandomBlock(); blocksSpawned = true; } }
         if (blocksSpawned) console.log("Spawned new blocks.");
         return blocksSpawned;
     }
    function checkGameOver() {
        for (let c = 0; c < GRID_COLS; c++) { if (grid[0][c] !== EMPTY_CELL) { console.log("Game Over condition met: Block settled in top row at col", c); return true; } }
        return false;
    }

    // --- State and UI Helpers ---
    function changeState(newState) {
        gameState = newState;
        console.log("Game 2 State changed to:", gameState);
        if (!startButton || !pauseButton || !nextLevelButton) return;
        switch (gameState) {
            case STATE.READY: startButton.textContent = "Start Puzzle"; startButton.disabled = false; pauseButton.textContent = "Pause"; pauseButton.disabled = true; nextLevelButton.classList.add('d-none'); break;
            case STATE.PLAYING: startButton.disabled = true; pauseButton.disabled = false; pauseButton.textContent = "Pause"; hideMessage(); nextLevelButton.classList.add('d-none'); break;
            case STATE.PROCESSING: startButton.disabled = true; pauseButton.disabled = true; pauseButton.textContent = "Pause"; nextLevelButton.classList.add('d-none'); break; // Disable pause during processing
            case STATE.PAUSED: startButton.disabled = true; pauseButton.textContent = "Resume"; pauseButton.disabled = false; nextLevelButton.classList.add('d-none'); break;
            case STATE.LEVEL_COMPLETE: startButton.disabled = true; pauseButton.disabled = true; nextLevelButton.classList.add('d-none'); break;
            case STATE.NEXT_LEVEL_READY: startButton.disabled = true; pauseButton.disabled = true; /* Button shown via showMessage */ break;
            case STATE.GAME_OVER: case STATE.GAME_WON: startButton.textContent = "Restart"; startButton.disabled = false; pauseButton.disabled = true; nextLevelButton.classList.add('d-none'); break;
        }
    }
    function showMessage(text, subtext = "", showNextLevelBtn = false, nextLevelNum = 0) {
         if (!messageOverlay || !messageText || !nextLevelButton) return;
        messageText.innerHTML = text + (subtext ? `<br><small style="font-size: 0.6em; line-height: 1.4;">${subtext}</small>` : "");
        if (showNextLevelBtn && gameState === STATE.NEXT_LEVEL_READY) { nextLevelButton.textContent = `Start Level ${nextLevelNum}`; nextLevelButton.classList.remove('d-none'); }
        else { nextLevelButton.classList.add('d-none'); }
        messageOverlay.classList.remove('d-none'); messageOverlay.classList.add('d-flex');
        const g1NextBtn = document.getElementById('game1NextLevelButton'); if (g1NextBtn) g1NextBtn.classList.add('d-none');
    }
    function hideMessage() { if (messageOverlay) { messageOverlay.classList.add('d-none'); messageOverlay.classList.remove('d-flex'); } }

    // --- Level Transition Logic ---
    function proceedToNextLevel2() {
        stopGameLoop();
        currentLevelIndex++;
        if (currentLevelIndex >= levels2.length) {
            changeState(STATE.GAME_WON); showMessage("YOU WIN!", `Completed all levels!<br>Press Enter or Restart`);
        } else {
             if (levels2[currentLevelIndex]) {
                changeState(STATE.NEXT_LEVEL_READY); const nextConfig = levels2[currentLevelIndex];
                showMessage(`Level ${currentLevelIndex} Complete!`, `Get Ready for Level ${currentLevelIndex + 1}<br>Target: ${nextConfig.targetScore}`, true, currentLevelIndex + 1);
            } else { /* Error handling */ changeState(STATE.GAME_WON); showMessage("Error!", "Could not load next level data."); }
        }
    }
    function handleStartNextLevel2() {
         if (gameState === STATE.NEXT_LEVEL_READY) {
            console.log(`Game 2: Starting next level: ${currentLevelIndex + 1}`); setupLevel(); changeState(STATE.PLAYING); hideMessage(); resumeGameLoop();
         }
    }

    // --- Initialization ---
    function initializeGame2() {
        console.log("Initializing Game 2 listeners and setup...");
        if (!ctx) { console.error("Game 2: Canvas context not available!"); return; }
        setupLevel(); changeState(STATE.READY); drawGame2(); showMessage("Puzzle Blocks", "Press Start");
        // Add Input Listeners
        canvas.addEventListener('click', handleCanvasClick);
        if (startButton) startButton.addEventListener('click', startGame2); else console.warn("Game 2: Start button not found");
        if (pauseButton) pauseButton.addEventListener('click', togglePauseGame2); else console.warn("Game 2: Pause button not found");
        if (nextLevelButton) nextLevelButton.addEventListener('click', handleStartNextLevel2); else console.warn("Game 2: Next Level button not found");
        // Add global key listener
        document.addEventListener('keydown', handleGlobalKeyDownGame2);
        console.log("Game 2 Initialized.");
    }

    // --- Global Key Listener ---
    function handleGlobalKeyDownGame2(e) {
        const game2Pane = document.getElementById('game2-pane');
        if (!game2Pane || !game2Pane.classList.contains('active')) { return; }
        if (gameState === STATE.READY && e.key === "Enter") startGame2();
        else if (gameState === STATE.NEXT_LEVEL_READY && e.key === "Enter") handleStartNextLevel2();
        else if ((gameState === STATE.GAME_OVER || gameState === STATE.GAME_WON) && e.key === "Enter") startGame2();
        else if ((gameState === STATE.PLAYING || gameState === STATE.PAUSED) && (e.key === 'p' || e.key === 'P')) togglePauseGame2();
    }

    // --- Run Game 2 Initialization ---
     if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', initializeGame2); }
     else { initializeGame2(); }

})(); // End of IIFE for Game 2