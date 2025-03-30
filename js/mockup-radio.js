/* ======================== */
/* Monstro Radio Page Script */
/* js/mockup-radio.js        */
/* ======================== */

document.addEventListener('DOMContentLoaded', () => {
    console.log('Monstro Radio Page JS Loaded');

    const filterButtons = document.querySelectorAll('.filter-buttons .btn');
    const contentSections = document.querySelectorAll('.content-section');

    // --- Filtering Logic ---
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Don't re-filter if already active
            if (button.classList.contains('active')) {
                return;
            }

            // Update active button style
            filterButtons.forEach(btn => btn.classList.remove('active', 'btn-primary')); // Remove from all
            filterButtons.forEach(btn => btn.classList.add('btn-outline-primary')); // Reset all to outline
            button.classList.add('active', 'btn-primary'); // Make clicked one primary
            button.classList.remove('btn-outline-primary');

            const filterValue = button.getAttribute('data-filter');

            // Show/Hide sections based on filter
            contentSections.forEach(section => {
                const sectionType = section.getAttribute('data-section');
                if (filterValue === 'all' || sectionType === filterValue) {
                    section.classList.remove('hidden'); // Show matching or if 'all'
                } else {
                    section.classList.add('hidden'); // Hide non-matching
                }
            });
        });
    });


    // --- Placeholder for Play Buttons ---
    const playButtons = document.querySelectorAll('.broadcast-card .btn'); // Select all buttons in cards
    playButtons.forEach(button => {
        // Exclude filter buttons
        if (!button.closest('.filter-buttons')) {
            button.addEventListener('click', (e) => {
                 const card = e.target.closest('.broadcast-card');
                 const title = card?.querySelector('.card-title')?.textContent.trim() || 'Item';
                 console.log(`Play/Action button clicked for: ${title}`);
                 alert(`Action for "${title}" triggered (Mockup)`);
                 // Real app: Interact with player service, open modal, navigate etc.
            });
        }
    });


}); // End DOMContentLoaded