// js/mockup-games.js

document.addEventListener('DOMContentLoaded', function() {
    console.log("Games Arcade Script Loaded");

    const gameModals = document.querySelectorAll('.modal.game-modal');

    gameModals.forEach(modal => {
        const gameId = modal.dataset.gameId; // e.g., 'coinfall', 'puzzle'

        modal.addEventListener('show.bs.modal', event => {
            console.log(`Modal shown for game: ${gameId}`);
            // Initialize the specific game based on its ID
            switch(gameId) {
                case 'coinfall':
                    // --- TODO: Call Coin Fall initialization function ---
                    // This function should ideally reside in game1.js and be globally accessible
                    // or attached to the window object. It needs to find the correct canvas/buttons
                    // inside the '#coinfallModal' element.
                    // Example: if (typeof initCoinfallGame === 'function') initCoinfallGame();
                    console.log("Initialize Coin Fall Game (Placeholder)");
                    break;
                case 'puzzle':
                    // --- TODO: Call Puzzle Blocks initialization function ---
                    // Similar to Coin Fall, this function should be in game2.js
                    // Example: if (typeof initPuzzleGame === 'function') initPuzzleGame();
                    console.log("Initialize Puzzle Blocks Game (Placeholder)");
                    break;
                // No case needed for trivia as it's just info
            }
        });

        modal.addEventListener('hide.bs.modal', event => {
            console.log(`Modal hidden for game: ${gameId}`);
            // Stop/Cleanup the specific game based on its ID
             switch(gameId) {
                case 'coinfall':
                    // --- TODO: Call Coin Fall cleanup/stop function ---
                    // Example: if (typeof destroyCoinfallGame === 'function') destroyCoinfallGame();
                    console.log("Cleanup Coin Fall Game (Placeholder)");
                    break;
                case 'puzzle':
                     // --- TODO: Call Puzzle Blocks cleanup/stop function ---
                     // Example: if (typeof destroyPuzzleGame === 'function') destroyPuzzleGame();
                     console.log("Cleanup Puzzle Blocks Game (Placeholder)");
                    break;
            }
            // Optional: You might want to reset scores or game states displayed
            // outside the canvas here if the game logic doesn't handle it on stop.
        });
    });

});

// ============================================================
// REMINDER: You MUST modify game1.js and game2.js for this to work.
// They need to:
// 1. Target elements correctly (e.g., document.getElementById('coinfallCanvas')
//    instead of just 'game1Canvas' if IDs were changed, or accept element IDs/references).
// 2. Ideally, expose functions like `initCoinfallGame()` and `destroyCoinfallGame()`
//    that can be called from this script to start and stop the game cleanly
//    (adding/removing event listeners, clearing intervals/timeouts).
// ============================================================