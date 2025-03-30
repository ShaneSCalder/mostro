// js/mockup-album.js

document.addEventListener('DOMContentLoaded', function() {
    console.log("Mostro Album Page Loaded");

    // Add interactivity here later
    const playButtons = document.querySelectorAll('.play-track-btn');

    playButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            const listItem = event.currentTarget.closest('.list-group-item');
            const trackTitle = listItem.querySelector('.track-title').textContent;
            console.log(`Play button clicked for track: ${trackTitle}`);
            // Placeholder: Implement actual audio preview logic here
            alert(`Playing preview for: ${trackTitle} (Implementation needed)`);
        });
    });

     const nftButtons = document.querySelectorAll('.nft-track-btn:not(.disabled)');
     nftButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            const listItem = event.currentTarget.closest('.list-group-item');
            const trackTitle = listItem.querySelector('.track-title').textContent;
            console.log(`NFT button clicked for track: ${trackTitle}`);
            // Placeholder: Link to NFT details/marketplace
            alert(`Viewing NFT for: ${trackTitle} (Implementation needed)`);
        });
    });


});