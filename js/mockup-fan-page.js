/* ========================= */
/* Monstro Fan Page Script   */
/* js/mockup-fan-page.js     */
/* ========================= */

document.addEventListener('DOMContentLoaded', () => {
    console.log('Monstro Fan Page JS Loaded');

    // --- Like Button Toggle (Visual Mockup) ---
    const feedArea = document.getElementById('profile-feed'); // Target container

    if (feedArea) {
        feedArea.addEventListener('click', function(event) {
            // Check if a like button or its icon was clicked
            const likeButton = event.target.closest('.like-button');
            if (!likeButton) return; // Exit if not a like button click

            const icon = likeButton.querySelector('i');
            const countSpan = likeButton.textContent.match(/\((\d+)\)/); // Find number in brackets
            let currentCount = countSpan ? parseInt(countSpan[1], 10) : 0;

            if (likeButton.classList.contains('active')) {
                // Currently Liked -> Unlike
                likeButton.classList.remove('active', 'text-danger');
                likeButton.classList.add('btn-outline-danger'); // Or your default outline style
                if (icon) icon.classList.replace('bi-heart-fill', 'bi-heart');
                currentCount--;
                likeButton.innerHTML = `<i class="bi bi-heart"></i> Like (${currentCount})`;

            } else {
                // Currently Unliked -> Like
                likeButton.classList.add('active', 'text-danger');
                likeButton.classList.remove('btn-outline-danger');
                if (icon) icon.classList.replace('bi-heart', 'bi-heart-fill');
                currentCount++;
                 likeButton.innerHTML = `<i class="bi bi-heart-fill"></i> Liked (${currentCount})`;
            }
             // In a real app, send API request here to update like status/count
             console.log("Like toggled (visual only)");
        });
    }


    // --- Load More Feed Simulation ---
    const loadMoreButton = document.getElementById('loadMoreFeed');
    if(loadMoreButton){
        loadMoreButton.addEventListener('click', () => {
            console.log('Load More clicked (simulating)');
            // Simulate loading: Get the first feed item, clone it, append a few clones
            const firstItem = feedArea.querySelector('.fan-feed-item');
            if(firstItem){
                 const parent = firstItem.parentNode; // The container div
                 for(let i = 0; i < 3; i++){ // Add 3 more dummy items
                      const clone = firstItem.cloneNode(true);
                      // Optional: slightly modify clone content to show it's new
                      const meta = clone.querySelector('.feed-item-meta');
                      if(meta) meta.textContent = meta.textContent.replace(/ago/, 'just now');
                      parent.insertBefore(clone, loadMoreButton.parentNode); // Insert before the button container
                 }
                 // Optional: Hide button after some loads or if no more items
                 // loadMoreButton.style.display = 'none';
                 alert("Simulated loading more items!");
            }

        });
    }

    // Bootstrap tabs init automatically via data attributes

}); // End DOMContentLoaded