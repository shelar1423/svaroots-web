document.addEventListener("DOMContentLoaded", function () {

  const form = document.querySelector(".career-form");

  if (!form) return;

  const firstNameInput = document.getElementById("firstName");
  const lastNameInput = document.getElementById("lastName");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const fileInput = document.getElementById("cvUpload");

  const uploadBox = document.querySelector(".upload-box");
  const uploadSpan = uploadBox.querySelector("span");
  const uploadIcon = uploadBox.querySelector("svg");



  /* FILE PICKER CLICK */
  uploadBox.addEventListener("click", function (e) {
    if (e.target !== fileInput) {
      fileInput.click();
    }
  });



  /* FILE CHANGE */
  fileInput.addEventListener("change", function () {

    const file = this.files[0];
    if (!file) return;

    const maxSize = 25 * 1024 * 1024;

    if (file.size > maxSize) {

      uploadBox.style.borderColor = "#c0392b";
      uploadSpan.textContent = "File too large (max 25MB)";
      uploadSpan.style.color = "#c0392b";
      this.value = "";

      return;
    }

    uploadBox.style.borderColor = "#27ae60";
    uploadBox.style.background = "#f0faf4";

    uploadSpan.textContent = file.name;
    uploadSpan.style.color = "#27ae60";

    uploadIcon.style.display = "none";
  });



  /* VALIDATION FUNCTIONS */

  function showError(input, message) {

    clearError(input);

    input.style.borderColor = "#c0392b";

    const error = document.createElement("span");
    error.className = "field-error";
    error.textContent = message;

    error.style.cssText =
      "color:#c0392b;font-size:12px;margin-top:4px;display:block";

    input.parentNode.insertBefore(error, input.nextSibling);
  }

  function clearError(input) {

    input.style.borderColor = "";

    const next = input.nextSibling;

    if (next && next.className === "field-error") {
      next.remove();
    }
  }

  function showSuccess(input) {

    clearError(input);
    input.style.borderColor = "#27ae60";
  }



  /* LIVE VALIDATION */

  firstNameInput.addEventListener("input", function () {
    if (this.value.trim() === "") {
      showError(this, "First name required");
    } else {
      showSuccess(this);
    }
  });

  lastNameInput.addEventListener("input", function () {
    if (this.value.trim() === "") {
      showError(this, "Last name required");
    } else {
      showSuccess(this);
    }
  });

  emailInput.addEventListener("input", function () {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(this.value)) {
      showError(this, "Invalid email");
    } else {
      showSuccess(this);
    }
  });

  phoneInput.addEventListener("input", function () {

    const digits = this.value.replace(/\D/g, "");

    if (digits.length !== 10) {
      showError(this, "Phone must be 10 digits");
    } else {
      showSuccess(this);
    }
  });



  /* FORM SUBMIT */

  form.addEventListener("submit", function (e) {

    e.preventDefault();

    let isValid = true;

    if (firstNameInput.value.trim() === "") {
      showError(firstNameInput, "First name required");
      isValid = false;
    }

    if (lastNameInput.value.trim() === "") {
      showError(lastNameInput, "Last name required");
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(emailInput.value)) {
      showError(emailInput, "Invalid email");
      isValid = false;
    }

    const digits = phoneInput.value.replace(/\D/g, "");

    if (digits.length !== 10) {
      showError(phoneInput, "Phone must be 10 digits");
      isValid = false;
    }

    if (!fileInput.files.length) {
      uploadBox.style.borderColor = "#c0392b";
      isValid = false;
    }

    if (!isValid) return;



    /* SAVE APPLICATION LOCALLY FOR THE STATIC FRONT-END FLOW */

    const applications = JSON.parse(localStorage.getItem("svarootsCareerApplications") || "[]");

    applications.push({
      id: Date.now(),
      firstName: firstNameInput.value.trim(),
      lastName: lastNameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: digits,
      cvFileName: fileInput.files[0] ? fileInput.files[0].name : "",
      submittedAt: new Date().toISOString()
    });

    localStorage.setItem("svarootsCareerApplications", JSON.stringify(applications));
    showSuccessMessage();

  });



  /* SUCCESS MESSAGE */

  function showSuccessMessage() {

    form.innerHTML = `
      <div style="text-align:center;padding:48px">

        <div style="
        width:64px;
        height:64px;
        background:#27ae60;
        border-radius:50%;
        display:flex;
        align-items:center;
        justify-content:center;
        margin:0 auto 20px;
        font-size:28px;
        color:white;">
        ✓
        </div>

        <h3 style="color:#A42100;margin-bottom:10px">
        Application Submitted!
        </h3>

        <p style="color:#555">
        Thank you for applying to Svaroots.<br>
        We'll contact you soon.
        </p>

      </div>
    `;
  }

});