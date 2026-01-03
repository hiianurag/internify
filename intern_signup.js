/**
 * Intern Signup Page Script
 */

document.addEventListener("DOMContentLoaded", () => {
  const internForm = document.getElementById("internForm");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const passwordInput = document.getElementById("password");
  const collegeInput = document.getElementById("college");
  const qualificationSelect = document.getElementById("qualification");

  // Handle form submission
  internForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get form values
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const password = passwordInput.value;
    const college = collegeInput.value.trim();
    const qualification = qualificationSelect.value;

    // Validate inputs
    if (!name) {
      Auth.showMessage("Please enter your full name!", "error");
      nameInput.focus();
      return;
    }

    if (name.length < 3) {
      Auth.showMessage("Name must be at least 3 characters long!", "error");
      nameInput.focus();
      return;
    }

    if (!email) {
      Auth.showMessage("Please enter your email!", "error");
      emailInput.focus();
      return;
    }

    if (!Auth.isValidEmail(email)) {
      Auth.showMessage("Please enter a valid email address!", "error");
      emailInput.focus();
      return;
    }

    if (!phone) {
      Auth.showMessage("Please enter your phone number!", "error");
      phoneInput.focus();
      return;
    }

    if (!Auth.isValidPhone(phone)) {
      Auth.showMessage("Please enter a valid 10-digit phone number!", "error");
      phoneInput.focus();
      return;
    }

    if (!password) {
      Auth.showMessage("Please enter a password!", "error");
      passwordInput.focus();
      return;
    }

    if (password.length < 6) {
      Auth.showMessage("Password must be at least 6 characters long!", "error");
      passwordInput.focus();
      return;
    }

    if (!college) {
      Auth.showMessage("Please enter your college name!", "error");
      collegeInput.focus();
      return;
    }

    if (!qualification) {
      Auth.showMessage("Please select your qualification!", "error");
      qualificationSelect.focus();
      return;
    }

    // Create user data object
    const userData = {
      name: name,
      email: email,
      phone: phone,
      password: password,
      college: college,
      qualification: qualification,
      userType: "intern",
    };

    // Register user
    const result = Auth.registerUser(userData);

    if (result.success) {
      Auth.showMessage(result.message, "success");

      // Clear form
      internForm.reset();

      // Redirect to login after 2 seconds
      setTimeout(() => {
        window.location.href = "login.html";
      }, 2000);
    } else {
      Auth.showMessage(result.message, "error");
    }
  });

  // Phone number validation - only allow digits
  phoneInput.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/\D/g, "");
  });

  // Check if already logged in
  if (Auth.isLoggedIn()) {
    const user = Auth.getCurrentUser();
    Auth.showMessage("You are already logged in!", "info");
    setTimeout(() => {
      const redirectPage =
        user.userType === "intern" ? "intern_dashboard.html" : "company_dashboard.html";
      window.location.href = redirectPage;
    }, 1500);
  }
});
