/* ============================ */
/* Monstro Artist Page Script   */
/* js/mockup-artist-page.js     */
/* ============================ */

document.addEventListener('DOMContentLoaded', () => {
    console.log('Monstro Artist Page JS Loaded');

    // --- Follow Button Toggle ---
    const followButton = document.getElementById('follow-btn-public');
    if (followButton) {
        followButton.addEventListener('click', () => {
            // Check current state based on text or potentially a class
            const isFollowing = followButton.textContent.includes('Following');

            if (isFollowing) {
                followButton.innerHTML = '<i class="bi bi-person-plus-fill me-1"></i> Follow';
                followButton.classList.remove('btn-secondary', 'following'); // Change class if needed
                followButton.classList.add('btn-primary');
                console.log('Action: Unfollow Artist (Mockup)');
            } else {
                followButton.innerHTML = '<i class="bi bi-person-check-fill me-1"></i> Following';
                followButton.classList.remove('btn-primary');
                followButton.classList.add('btn-secondary', 'following'); // Change class if needed
                console.log('Action: Follow Artist (Mockup)');
            }
            // In a real app, this would trigger an API call to follow/unfollow
        });
    }

    // --- Play Button Placeholders ---
     const playButtons = document.querySelectorAll('.action-buttons-public .btn-light, .embedded-player-public .btn-outline-secondary, #music .btn-primary, #music .btn-outline-primary');
     playButtons.forEach(button => {
         button.addEventListener('click', (e) => {
             e.preventDefault(); // Prevent default link behavior if it's an anchor
             console.log('Play button clicked! (Mockup)');
             alert('Play action triggered! (Mockup - Integrate with player)');
             // Real app: interact with audio player service/state management
         });
     });

     // --- Ticket Button Placeholder ---
     const ticketButtons = document.querySelectorAll('#shows .btn-success');
     ticketButtons.forEach(button => {
         button.addEventListener('click', (e) => {
              e.preventDefault();
              console.log('Tickets button clicked!');
              alert('Navigate to ticketing site/modal! (Mockup)');
         });
     });

      // --- Merch Button Placeholder ---
     const merchButtons = document.querySelectorAll('#merch .btn-outline-primary');
     merchButtons.forEach(button => {
         button.addEventListener('click', (e) => {
              e.preventDefault();
              console.log('View Item button clicked!');
              alert('Navigate to merch item detail/store! (Mockup)');
         });
     });


    // Bootstrap Tabs are initialized automatically via data attributes

}); // End DOMContentLoaded