/**
 * Login Page Script
 */

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const userTypeSelect = document.getElementById("userType");
  const togglePasswordBtn = document.getElementById("togglePassword");
  const forgotPasswordLink = document.getElementById("forgotPassword");
  const signupLink = document.getElementById("signupLink");

  // Toggle password visibility
  if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener("click", () => {
      const type = passwordInput.type === "password" ? "text" : "password";
      passwordInput.type = type;
      togglePasswordBtn.textContent = type === "password" ? "👁️" : "🙈";
    });
  }

  // Forgot password link
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "forgot_password.html";
    });
  }

  // Signup link - show options
  if (signupLink) {
    signupLink.addEventListener("click", (e) => {
      e.preventDefault();
      
      // Create modal for signup type selection
      const modal = document.createElement("div");
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      `;

      const modalContent = document.createElement("div");
      modalContent.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 10px;
        text-align: center;
        max-width: 400px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      `;

      modalContent.innerHTML = `
        <h2 style="margin-bottom: 20px; color: #333;">Sign Up As</h2>
        <button id="internSignup" style="
          width: 100%;
          padding: 15px;
          margin: 10px 0;
          background: #4CAF50;
          color: white;
          border: none;
          border-radius: 5px;
          font-size: 16px;
          cursor: pointer;
          font-weight: 500;
        ">Intern</button>
        <button id="companySignup" style="
          width: 100%;
          padding: 15px;
          margin: 10px 0;
          background: #2196F3;
          color: white;
          border: none;
          border-radius: 5px;
          font-size: 16px;
          cursor: pointer;
          font-weight: 500;
        ">Company</button>
        <button id="cancelSignup" style="
          width: 100%;
          padding: 15px;
          margin: 10px 0;
          background: #f44336;
          color: white;
          border: none;
          border-radius: 5px;
          font-size: 16px;
          cursor: pointer;
          font-weight: 500;
        ">Cancel</button>
      `;

      modal.appendChild(modalContent);
      document.body.appendChild(modal);

      // Event listeners for modal buttons
      document.getElementById("internSignup").addEventListener("click", () => {
        window.location.href = "intern_signup.html";
      });

      document.getElementById("companySignup").addEventListener("click", () => {
        window.location.href = "company_signup.html";
      });

      document.getElementById("cancelSignup").addEventListener("click", () => {
        document.body.removeChild(modal);
      });

      // Close on background click
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          document.body.removeChild(modal);
        }
      });
    });
  }

  // Handle login form submission
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get form values
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const userType = userTypeSelect.value;

    // Validate inputs
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

    if (!password) {
      Auth.showMessage("Please enter your password!", "error");
      passwordInput.focus();
      return;
    }

    if (!userType) {
      Auth.showMessage("Please select user type (Intern or Company)!", "error");
      userTypeSelect.focus();
      return;
    }

    // Attempt login
    const result = Auth.login(email, password, userType);

    if (result.success) {
      Auth.showMessage(result.message, "success");

      // Redirect based on user type
      setTimeout(() => {
        if (userType === "intern") {
          window.location.href = "intern_dashboard.html";
        } else {
          window.location.href = "company_dashboard.html";
        }
      }, 1000);
    } else {
      Auth.showMessage(result.message, "error");
    }
  });

  // Check if already logged in
  if (Auth.isLoggedIn()) {
    const user = Auth.getCurrentUser();
    const redirectPage =
      user.userType === "intern" ? "intern_dashboard.html" : "company_dashboard.html";
    window.location.href = redirectPage;
  }
});
