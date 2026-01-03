/**
 * Company Signup Page Script
 */

document.addEventListener("DOMContentLoaded", () => {
  const companyForm = document.getElementById("companyForm");
  const companyNameInput = document.getElementById("companyName");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const passwordInput = document.getElementById("password");
  const industryInput = document.getElementById("industry");
  const locationInput = document.getElementById("location");

  // Handle form submission
  companyForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get form values
    const companyName = companyNameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const password = passwordInput.value;
    const industry = industryInput.value.trim();
    const location = locationInput.value.trim();

    // Validate inputs
    if (!companyName) {
      Auth.showMessage("Please enter your company name!", "error");
      companyNameInput.focus();
      return;
    }

    if (companyName.length < 3) {
      Auth.showMessage("Company name must be at least 3 characters long!", "error");
      companyNameInput.focus();
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

    if (!industry) {
      Auth.showMessage("Please enter your industry type!", "error");
      industryInput.focus();
      return;
    }

    if (!location) {
      Auth.showMessage("Please enter your location!", "error");
      locationInput.focus();
      return;
    }

    // Create user data object
    const userData = {
      companyName: companyName,
      email: email,
      phone: phone,
      password: password,
      industry: industry,
      location: location,
      userType: "company",
    };

    // Register user
    const result = Auth.registerUser(userData);

    if (result.success) {
      Auth.showMessage(result.message, "success");

      // Clear form
      companyForm.reset();

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
