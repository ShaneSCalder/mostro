/* ============================ */
/* Monstro Dashboard Script     */
/* js/monstro-dashboard.js      */
/* ============================ */

document.addEventListener('DOMContentLoaded', function() {

    // --- Link Top Cards to Sidebar Tabs ---
    const topCardLinks = document.querySelectorAll('.top-card-link');

    topCardLinks.forEach(link => {
      link.addEventListener('click', function(event) {
        event.preventDefault(); // Stop default anchor behavior

        const targetId = this.getAttribute('href'); // e.g., "#streaming"
        const targetPane = document.querySelector(targetId); // The actual tab pane

        // Find the corresponding trigger link in the sidebar
        const sidebarLink = document.querySelector(`#sidebarMenu .nav-link[href="${targetId}"]`);

        if (sidebarLink && targetPane) {
          try {
            // Use Bootstrap's Tab API to show the corresponding tab
            // This automatically handles updating the .active class on the link and pane
            const tab = bootstrap.Tab.getOrCreateInstance(sidebarLink);
            tab.show();

            // Optional: Smooth scroll to the top of the main content area
             const mainContent = document.querySelector('main');
             if(mainContent) {
                 mainContent.scrollTo({ top: 0, behavior: 'smooth' });
             }

          } catch (e) {
              console.error("Error showing tab via JS:", e);
          }
        } else {
            console.warn(`Sidebar link or target pane for ${targetId} not found.`);
        }
      });
    });

    // --- Enable Bootstrap Form Validation ---
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation');

    // Loop over them and prevent submission on invalid
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add('was-validated');
      }, false);
    });


    // --- Add any other dashboard-specific JS below ---


    console.log("Monstro Dashboard JS Loaded Successfully."); // Confirmation message

});