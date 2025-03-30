/* =================================== */
/* Monstro Gamification Hub Script     */
/* js/mockup-gamification-script.js    */
/* =================================== */

document.addEventListener('DOMContentLoaded', () => {
    console.log('Monstro Gamification Hub JS Loaded - Modal V2');

    // --- REMOVED Tooltip Initialization ---
    // const tooltipTriggerList = ... (Removed)

    // --- Token Balance Counter Animation (remains the same) ---
    const tokenBalanceElement = document.getElementById('token-balance-amount');
    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start).toLocaleString();
            if (progress < 1) { window.requestAnimationFrame(step); }
        };
        window.requestAnimationFrame(step);
    }
    if (tokenBalanceElement) {
        const finalBalance = parseInt(tokenBalanceElement.textContent.replace(/,/g, ''), 10) || 0;
        animateValue(tokenBalanceElement, 0, finalBalance, 1500);
    }

    // --- Task Detail Modal Logic (remains the same) ---
    const taskDetailModal = document.getElementById('taskDetailModal');
    if (taskDetailModal) {
        taskDetailModal.addEventListener('show.bs.modal', event => {
            const cardTrigger = event.relatedTarget; // The .task-card that was clicked
            // --- Extract data and populate modal (code from previous response) ---
             const title = cardTrigger.getAttribute('data-title') || 'Task Details';
             const iconClass = cardTrigger.getAttribute('data-icon-class') || 'fas fa-question-circle';
             const description = cardTrigger.getAttribute('data-description') || 'No description available.';
             const progress = parseInt(cardTrigger.getAttribute('data-progress') || '-1', 10);
             const rewardText = cardTrigger.getAttribute('data-reward-text') || 'No reward specified';
             const goLink = cardTrigger.getAttribute('data-go-link') || '#';
             const goText = cardTrigger.getAttribute('data-go-text') || '';

             const modalTitle = taskDetailModal.querySelector('#taskDetailModalLabel');
             const modalTaskTitle = taskDetailModal.querySelector('#modalTaskTitle');
             const modalTaskIcon = taskDetailModal.querySelector('#modalTaskTitle i');
             const modalDescription = taskDetailModal.querySelector('#modalTaskDescription');
             const modalProgressContainer = taskDetailModal.querySelector('#modalTaskProgressContainer');
             const modalProgressBar = taskDetailModal.querySelector('.modal-progress-bar');
             const modalReward = taskDetailModal.querySelector('#modalTaskReward');
             const modalEncouragement = taskDetailModal.querySelector('#modalEncouragement');
             const modalGoButton = taskDetailModal.querySelector('#modalTaskGoButton');

             if (modalTitle) modalTitle.textContent = title;
             if (modalTaskTitle) modalTaskTitle.querySelector('span').textContent = title;
             if (modalTaskIcon) modalTaskIcon.className = iconClass + " me-2";
             if (modalDescription) modalDescription.textContent = description;
             if (modalReward) modalReward.textContent = rewardText;

             if (modalProgressContainer && modalProgressBar) {
                 if (progress >= 0 && progress <= 100) {
                     modalProgressBar.style.width = progress + '%';
                     modalProgressBar.setAttribute('aria-valuenow', progress);
                     modalProgressBar.textContent = progress + '%';
                     modalProgressContainer.style.display = 'block';
                 } else {
                     modalProgressContainer.style.display = 'none';
                 }
             }

             if (modalGoButton) {
                 if (goText && goLink !== '#') {
                     modalGoButton.href = goLink;
                     modalGoButton.textContent = goText;
                     modalGoButton.style.display = 'inline-block';
                     modalGoButton.onclick = (e) => { console.log(`Modal 'Go' button clicked for "${title}"`); };
                 } else {
                     modalGoButton.style.display = 'none';
                     modalGoButton.onclick = null;
                 }
             }

            if(modalEncouragement) {
                const encouragements = [ "You've got this!", "Keep up the great momentum!", "Almost there!", "Nice progress!", "Let's do this!", "Every step counts!" ];
                if (progress === 100) { modalEncouragement.textContent = "Task Complete! Awesome job!"; }
                else if (progress > 50) { modalEncouragement.textContent = encouragements[Math.floor(Math.random() * 3)]; }
                else { modalEncouragement.textContent = encouragements[Math.floor(Math.random() * encouragements.length)]; }
            }
            // --- End Task Modal Population ---
        }); // End show.bs.modal listener
    } // end check for taskDetailModal


    // --- NEW: Trophy Detail Modal Logic ---
    const trophyDetailModal = document.getElementById('trophyDetailModal');
    if (trophyDetailModal) {
        trophyDetailModal.addEventListener('show.bs.modal', event => {
            const trophyTrigger = event.relatedTarget; // The .trophy-item that was clicked

            // Extract data from the clicked trophy's data-* attributes
            const trophyName = trophyTrigger.getAttribute('data-trophy-name') || 'Trophy';
            const description = trophyTrigger.getAttribute('data-description') || 'No details available.';
            const iconClass = trophyTrigger.getAttribute('data-icon-class') || 'fas fa-question-circle fa-4x';
            const earnedStatus = trophyTrigger.getAttribute('data-earned-status') === 'true';
            const earnedDate = trophyTrigger.getAttribute('data-earned-date'); // Might be null/empty

             // Get elements inside the modal
            const modalLabel = trophyDetailModal.querySelector('#trophyDetailModalLabel');
            const modalIcon = trophyDetailModal.querySelector('#modalTrophyIcon');
            const modalTrophyName = trophyDetailModal.querySelector('#modalTrophyName');
            const modalDescription = trophyDetailModal.querySelector('#modalTrophyDescription');
            const modalStatus = trophyDetailModal.querySelector('#modalTrophyStatus');

            // Populate modal elements
            if (modalLabel) modalLabel.textContent = trophyName; // Set modal title
            if (modalTrophyName) modalTrophyName.textContent = trophyName;
            if (modalDescription) modalDescription.textContent = description;

            // Update Icon
            if (modalIcon) {
                modalIcon.className = iconClass; // Set the base class and size
                if (earnedStatus) {
                    modalIcon.classList.add('earned-icon'); // Add class for earned color (defined in CSS)
                    modalIcon.classList.remove('text-muted'); // Remove default muted color
                } else {
                    modalIcon.classList.remove('earned-icon');
                    modalIcon.classList.add('text-muted'); // Ensure unearned is muted
                }
            }

            // Update Earned Status display
            if (modalStatus) {
                if (earnedStatus) {
                    let statusHTML = `<span class="badge bg-success">Earned!</span>`;
                    if (earnedDate) {
                        statusHTML += `<div class="text-muted small mt-1">Achieved: ${earnedDate}</div>`;
                    }
                    modalStatus.innerHTML = statusHTML;
                } else {
                    modalStatus.innerHTML = `<span class="badge bg-secondary">Not Yet Earned</span>`;
                }
            }

        }); // End show.bs.modal listener for trophy
    } // end check for trophyDetailModal

    console.log("Monstro Gamification Hub JS Loaded - Modal Logic Added for Tasks & Trophies");

}); // End DOMContentLoaded