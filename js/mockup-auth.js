/* ======================== */
/* Monstro Auth Scripts     */
/* js/mockup-auth.js        */
/* ======================== */

(function () {
    'use strict'
  
    // --- Bootstrap Form Validation Trigger ---
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
      .forEach(function (form) {
        form.addEventListener('submit', function (event) {
          let passwordsMatch = true;
          // Optional: Add password confirmation check for signup form
          if (form.id === 'signupForm') { // Add id="signupForm" to your signup <form> tag
              const password = form.querySelector('#password');
              const confirmPassword = form.querySelector('#confirmPassword');
              const errorElement = form.querySelector('#passwordMatchError');
  
              if (password && confirmPassword && password.value !== confirmPassword.value) {
                  confirmPassword.classList.add('is-invalid'); // Add Bootstrap invalid class
                  if(errorElement) errorElement.textContent = 'Passwords do not match.'; // Set specific error
                  passwordsMatch = false;
              } else if (confirmPassword) {
                   confirmPassword.classList.remove('is-invalid'); // Clear error if they match now
              }
          }
  
          // Check form validity using Bootstrap's method AND our password check
          if (!form.checkValidity() || !passwordsMatch) {
            event.preventDefault()
            event.stopPropagation()
          }
  
          form.classList.add('was-validated')
        }, false)
      })
  
      // Optional: Real-time password match feedback
      const signupForm = document.getElementById('signupForm');
      if (signupForm) {
          const passwordInput = signupForm.querySelector('#password');
          const confirmPasswordInput = signupForm.querySelector('#confirmPassword');
          const errorElement = signupForm.querySelector('#passwordMatchError');
  
          if(passwordInput && confirmPasswordInput && errorElement) {
               const checkPasswords = () => {
                   if (confirmPasswordInput.value && passwordInput.value !== confirmPasswordInput.value) {
                       confirmPasswordInput.classList.add('is-invalid');
                       confirmPasswordInput.setCustomValidity("Invalid field."); // Required for CSS :invalid state
                       errorElement.textContent = 'Passwords do not match.';
                   } else {
                       confirmPasswordInput.classList.remove('is-invalid');
                       confirmPasswordInput.setCustomValidity(""); // Clear custom validity
                       // Keep default required message if needed
                       if (!confirmPasswordInput.value) {
                            errorElement.textContent = 'Please confirm your password.';
                       }
                   }
               };
              passwordInput.addEventListener('input', checkPasswords);
              confirmPasswordInput.addEventListener('input', checkPasswords);
          }
      }
  
  
    console.log("Auth page JS loaded.");
  })()