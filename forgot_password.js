/**
 * Forgot Password Page Script
 */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("forgotForm");
  const emailInput = document.getElementById("email");

  // Handle form submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();

    // Validate email
    if (!email) {
      Auth.showMessage("Please enter your registered email address!", "error");
      emailInput.focus();
      return;
    }

    if (!Auth.isValidEmail(email)) {
      Auth.showMessage("Please enter a valid email address!", "error");
      emailInput.focus();
      return;
    }

    // Check if user exists
    const user = Auth.findUserByEmail(email);

    if (!user) {
      Auth.showMessage("No account found with this email!", "error");
      return;
    }

    // Store email for password reset
    localStorage.setItem("internify_resetEmail", email);

    Auth.showMessage(`Password reset link sent to ${email}!`, "success");

    // Redirect to reset password page after 2 seconds
    setTimeout(() => {
      window.location.href = "reset_password.html";
    }, 2000);
  });
});
