// ============================================================
//  SVAROOTS CAREERS PAGE — JavaScript Interactions
//  Interaction 1: Form Validation
//  Interaction 2: File Upload Preview
//  Interaction 3: Footer Email Subscribe
// ============================================================

// Wait for the page to fully load before running any JS
document.addEventListener('DOMContentLoaded', function () {

  // ============================================================
  // INTERACTION 1 — FORM VALIDATION
  // Validates all fields when Submit is clicked
  // ============================================================

  const form = document.querySelector('.career-form');

  if (form) {
    // Get all inputs
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput  = document.getElementById('lastName');
    const emailInput     = document.getElementById('email');
    const phoneInput     = document.getElementById('phone');
    const fileInput      = document.getElementById('cvUpload');

    // ---- Helper: show error under a field ----
    function showError(inputEl, message) {
      // Remove any existing error first
      clearError(inputEl);

      inputEl.style.borderColor = '#c0392b';  // red border

      const error = document.createElement('span');
      error.className = 'field-error';
      error.textContent = message;
      error.style.cssText = `
        color: #c0392b;
        font-size: 12px;
        font-family: 'Nunito Sans', sans-serif;
        margin-top: 4px;
        display: block;
      `;
      inputEl.parentNode.insertBefore(error, inputEl.nextSibling);
    }

    // ---- Helper: show success on a field ----
    function showSuccess(inputEl) {
      clearError(inputEl);
      inputEl.style.borderColor = '#27ae60';  // green border
    }

    // ---- Helper: clear error from a field ----
    function clearError(inputEl) {
      inputEl.style.borderColor = '';
      const existingError = inputEl.nextSibling;
      if (existingError && existingError.className === 'field-error') {
        existingError.remove();
      }
    }

    // ---- Live validation as user types ----
    firstNameInput.addEventListener('input', function () {
      if (this.value.trim() !== '') showSuccess(this);
      else showError(this, 'First name is required');
    });

    lastNameInput.addEventListener('input', function () {
      if (this.value.trim() !== '') showSuccess(this);
      else showError(this, 'Last name is required');
    });

    emailInput.addEventListener('input', function () {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(this.value)) showSuccess(this);
      else showError(this, 'Enter a valid email address');
    });

    phoneInput.addEventListener('input', function () {
      const digits = this.value.replace(/\D/g, '');
      if (digits.length === 10) showSuccess(this);
      else showError(this, 'Phone number must be 10 digits');
    });

    // ---- Validate everything on Submit ----
    form.addEventListener('submit', function (e) {
      e.preventDefault();   // stop page from reloading
      let isValid = true;

      // Check First Name
      if (firstNameInput.value.trim() === '') {
        showError(firstNameInput, 'First name is required');
        isValid = false;
      } else {
        showSuccess(firstNameInput);
      }

      // Check Last Name
      if (lastNameInput.value.trim() === '') {
        showError(lastNameInput, 'Last name is required');
        isValid = false;
      } else {
        showSuccess(lastNameInput);
      }

      // Check Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value)) {
        showError(emailInput, 'Enter a valid email address');
        isValid = false;
      } else {
        showSuccess(emailInput);
      }

      // Check Phone
      const digits = phoneInput.value.replace(/\D/g, '');
      if (digits.length !== 10) {
        showError(phoneInput, 'Phone number must be 10 digits');
        isValid = false;
      } else {
        showSuccess(phoneInput);
      }

      // Check File
      const uploadBox = document.querySelector('.upload-box');
      if (!fileInput.files || fileInput.files.length === 0) {
        uploadBox.style.borderColor = '#c0392b';
        const existing = uploadBox.nextSibling;
        if (!existing || existing.className !== 'field-error') {
          const err = document.createElement('span');
          err.className = 'field-error';
          err.textContent = 'Please upload your CV';
          err.style.cssText = 'color:#c0392b;font-size:12px;font-family:Nunito Sans,sans-serif;margin-top:4px;display:block;';
          uploadBox.parentNode.insertBefore(err, uploadBox.nextSibling);
        }
        isValid = false;
      }

      // If everything is valid — show success message
      if (isValid) {
        showFormSuccess();
      }
    });

    // ---- Success state after valid submission ----
    function showFormSuccess() {
      form.innerHTML = `
        <div style="
          text-align: center;
          padding: 48px 24px;
          font-family: 'Nunito Sans', sans-serif;
        ">
          <div style="
            width: 64px; height: 64px;
            background: #27ae60;
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            margin: 0 auto 20px;
            font-size: 28px;
            color: white;
          ">✓</div>
          <h3 style="color: #A42100; font-size: 22px; margin-bottom: 10px;">
            Application Submitted!
          </h3>
          <p style="color: #555; font-size: 15px; line-height: 1.6;">
            Thank you for applying to Svaroots.<br>
            We'll be in touch with you shortly.
          </p>
        </div>
      `;
    }
  }


  // ============================================================
  // INTERACTION 2 — FILE UPLOAD PREVIEW
  // Shows filename inside upload box when file is selected
  // ============================================================

  const fileInputEl   = document.getElementById('cvUpload');
  const uploadBox     = document.querySelector('.upload-box');
  const uploadSpan    = uploadBox ? uploadBox.querySelector('span') : null;
  const uploadIcon    = uploadBox ? uploadBox.querySelector('svg') : null;

  if (fileInputEl && uploadBox) {

    fileInputEl.addEventListener('change', function () {
      const file = this.files[0];

      if (!file) return;

      // Check file size — max 25MB
      const maxSize = 25 * 1024 * 1024;  // 25MB in bytes
      if (file.size > maxSize) {
        uploadBox.style.borderColor = '#c0392b';
        uploadSpan.textContent = '✗  File too large (max 25MB)';
        uploadSpan.style.color = '#c0392b';
        this.value = '';  // clear the selection
        return;
      }

      // File is valid — update upload box UI
      uploadBox.style.borderColor   = '#27ae60';
      uploadBox.style.background    = '#f0faf4';
      uploadSpan.textContent        = '✓  ' + file.name;
      uploadSpan.style.color        = '#27ae60';
      uploadSpan.style.fontWeight   = '600';

      // Hide upload icon — file is already chosen
      if (uploadIcon) uploadIcon.style.display = 'none';

      // Add a small "remove" × button so user can clear and reupload
      const existingRemove = document.getElementById('removeFile');
      if (!existingRemove) {
        const removeBtn = document.createElement('span');
        removeBtn.id = 'removeFile';
        removeBtn.textContent = '  ×';
        removeBtn.style.cssText = `
          color: #c0392b;
          font-size: 18px;
          cursor: pointer;
          font-weight: bold;
          margin-left: 6px;
        `;

        removeBtn.addEventListener('click', function (e) {
          e.preventDefault();  // don't trigger file picker
          fileInputEl.value    = '';
          uploadSpan.textContent = 'Upload your CV *';
          uploadSpan.style.color  = '';
          uploadSpan.style.fontWeight = '';
          uploadBox.style.borderColor = '';
          uploadBox.style.background  = '';
          if (uploadIcon) uploadIcon.style.display = '';
          removeBtn.remove();
        });

        uploadBox.appendChild(removeBtn);
      }
    });
  }


  // ============================================================
  // INTERACTION 3 — FOOTER EMAIL SUBSCRIBE
  // Validates email in footer and shows feedback
  // ============================================================

  const footerEmailInput = document.querySelector('.footer-email-row input');
  const footerBtn        = document.querySelector('.footer-email-row button');
  const footerEmailRow   = document.querySelector('.footer-email-row');

  if (footerBtn && footerEmailInput) {

    footerBtn.addEventListener('click', function () {
      const email = footerEmailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // Remove any previous feedback message
      const existing = document.getElementById('subscribeMsg');
      if (existing) existing.remove();

      const msg = document.createElement('p');
      msg.id = 'subscribeMsg';
      msg.style.cssText = `
        font-family: 'Nunito Sans', sans-serif;
        font-size: 13px;
        margin-top: 8px;
      `;

      if (email === '') {
        // Empty field
        msg.textContent   = 'Please enter your email address.';
        msg.style.color   = '#ff8a80';
        footerEmailRow.style.borderColor = '#ff8a80';

      } else if (!emailRegex.test(email)) {
        // Invalid format
        msg.textContent   = 'That doesn\'t look like a valid email.';
        msg.style.color   = '#ff8a80';
        footerEmailRow.style.borderColor = '#ff8a80';

      } else {
        // Valid email — success!
        msg.textContent   = '🎉 You\'re subscribed! Welcome to Svaroots.';
        msg.style.color   = '#a5d6a7';
        footerEmailRow.style.borderColor = '#a5d6a7';
        footerEmailInput.value = '';  // clear input
      }

      // Insert message below the email row
      footerEmailRow.parentNode.insertBefore(msg, footerEmailRow.nextSibling);

      // Auto-remove message after 4 seconds
      setTimeout(function () {
        msg.remove();
        footerEmailRow.style.borderColor = '';
      }, 4000);
    });

    // Clear error styling when user starts typing again
    footerEmailInput.addEventListener('input', function () {
      footerEmailRow.style.borderColor = '';
      const msg = document.getElementById('subscribeMsg');
      if (msg) msg.remove();
    });
  }

});
// ============================================================
//  END OF FILE
// ============================================================