/**
 * Reset Password Page Script
 */

document.addEventListener("DOMContentLoaded", () => {
  const resetForm = document.getElementById("resetForm");
  const newPasswordInput = document.getElementById("newPassword");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const showNewBtn = document.getElementById("showNew");
  const showConfirmBtn = document.getElementById("showConfirm");
  const strengthBar = document.getElementById("strengthBar");
  const strengthText = document.getElementById("strengthText");
  const newPassError = document.getElementById("newPassError");
  const confirmPassError = document.getElementById("confirmPassError");

  // Get reset email from localStorage
  const resetEmail = localStorage.getItem("internify_resetEmail");

  // If no reset email, redirect to forgot password page
  if (!resetEmail) {
    Auth.showMessage("Please request a password reset first!", "error");
    setTimeout(() => {
      window.location.href = "forgot_password.html";
    }, 2000);
    return;
  }

  // Toggle password visibility for new password
  if (showNewBtn) {
    showNewBtn.addEventListener("click", () => {
      const type = newPasswordInput.type === "password" ? "text" : "password";
      newPasswordInput.type = type;
      showNewBtn.textContent = type === "password" ? "👁️" : "🙈";
    });
  }

  // Toggle password visibility for confirm password
  if (showConfirmBtn) {
    showConfirmBtn.addEventListener("click", () => {
      const type = confirmPasswordInput.type === "password" ? "text" : "password";
      confirmPasswordInput.type = type;
      showConfirmBtn.textContent = type === "password" ? "👁️" : "🙈";
    });
  }

  // Password strength checker
  newPasswordInput.addEventListener("input", () => {
    const password = newPasswordInput.value;
    let strength = 0;
    let strengthLabel = "";
    let color = "";

    if (password.length === 0) {
      strengthBar.style.width = "0%";
      strengthText.textContent = "";
      newPassError.textContent = "";
      return;
    }

    // Check password strength
    if (password.length >= 6) strength += 25;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 10;

    // Determine strength label and color
    if (strength < 40) {
      strengthLabel = "Weak";
      color = "#f44336";
    } else if (strength < 70) {
      strengthLabel = "Medium";
      color = "#ff9800";
    } else {
      strengthLabel = "Strong";
      color = "#4CAF50";
    }

    strengthBar.style.width = strength + "%";
    strengthBar.style.backgroundColor = color;
    strengthText.textContent = strengthLabel;
    strengthText.style.color = color;

    // Show error if password is too short
    if (password.length < 6) {
      newPassError.textContent = "Password must be at least 6 characters";
      newPassError.style.color = "#f44336";
    } else {
      newPassError.textContent = "";
    }
  });

  // Confirm password validation
  confirmPasswordInput.addEventListener("input", () => {
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (confirmPassword.length === 0) {
      confirmPassError.textContent = "";
      return;
    }

    if (newPassword !== confirmPassword) {
      confirmPassError.textContent = "Passwords do not match";
      confirmPassError.style.color = "#f44336";
    } else {
      confirmPassError.textContent = "Passwords match ✓";
      confirmPassError.style.color = "#4CAF50";
    }
  });

  // Handle form submission
  resetForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // Validate inputs
    if (!newPassword) {
      Auth.showMessage("Please enter a new password!", "error");
      newPasswordInput.focus();
      return;
    }

    if (newPassword.length < 6) {
      Auth.showMessage("Password must be at least 6 characters long!", "error");
      newPasswordInput.focus();
      return;
    }

    if (!confirmPassword) {
      Auth.showMessage("Please confirm your password!", "error");
      confirmPasswordInput.focus();
      return;
    }

    if (newPassword !== confirmPassword) {
      Auth.showMessage("Passwords do not match!", "error");
      confirmPasswordInput.focus();
      return;
    }

    // Update password
    const result = Auth.updatePassword(resetEmail, newPassword);

    if (result.success) {
      Auth.showMessage(result.message, "success");

      // Clear reset email from localStorage
      localStorage.removeItem("internify_resetEmail");

      // Clear form
      resetForm.reset();

      // Redirect to login after 2 seconds
      setTimeout(() => {
        window.location.href = "login.html";
      }, 2000);
    } else {
      Auth.showMessage(result.message, "error");
    }
  });
});
