/**
 * Authentication Module
 * Handles all authentication-related operations using localStorage
 */

const Auth = {
  /**
   * Storage keys
   */
  USERS_KEY: "internify_users",
  LOGGED_IN_USER_KEY: "internify_loggedInUser",
  RESET_EMAIL_KEY: "internify_resetEmail",

  /**
   * Get all users from localStorage
   * @returns {Array} Array of user objects
   */
  getAllUsers() {
    try {
      const users = localStorage.getItem(this.USERS_KEY);
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error("Error reading users from localStorage:", error);
      return [];
    }
  },

  /**
   * Save users array to localStorage
   * @param {Array} users - Array of user objects
   */
  saveUsers(users) {
    try {
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
      return true;
    } catch (error) {
      console.error("Error saving users to localStorage:", error);
      return false;
    }
  },

  /**
   * Check if email already exists
   * @param {string} email - Email to check
   * @returns {boolean} True if email exists
   */
  emailExists(email) {
    const users = this.getAllUsers();
    return users.some(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  },

  /**
   * Register a new user
   * @param {Object} userData - User data object
   * @returns {Object} Result object with success status and message
   */
  registerUser(userData) {
    // Validate required fields
    if (!userData.email || !userData.password) {
      return {
        success: false,
        message: "Email and password are required!",
      };
    }

    // Check if email already exists
    if (this.emailExists(userData.email)) {
      return {
        success: false,
        message: "This email is already registered!",
      };
    }

    // Validate password length
    if (userData.password.length < 6) {
      return {
        success: false,
        message: "Password must be at least 6 characters long!",
      };
    }

    // Create user object with timestamp
    const newUser = {
      id: Date.now().toString(),
      email: userData.email.toLowerCase(),
      password: userData.password, // In production, this should be hashed
      userType: userData.userType || "intern",
      createdAt: new Date().toISOString(),
      ...userData,
    };

    // Remove duplicate email field if exists
    delete newUser.email;
    newUser.email = userData.email.toLowerCase();

    // Get existing users and add new user
    const users = this.getAllUsers();
    users.push(newUser);

    // Save to localStorage
    if (this.saveUsers(users)) {
      return {
        success: true,
        message: "Registration successful!",
        user: { ...newUser, password: undefined }, // Don't return password
      };
    } else {
      return {
        success: false,
        message: "Failed to save user data. Please try again.",
      };
    }
  },

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} userType - Type of user (intern/company)
   * @returns {Object} Result object with success status and message
   */
  login(email, password, userType) {
    // Validate inputs
    if (!email || !password) {
      return {
        success: false,
        message: "Email and password are required!",
      };
    }

    if (!userType) {
      return {
        success: false,
        message: "Please select user type!",
      };
    }

    // Find user
    const users = this.getAllUsers();
    const user = users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password &&
        u.userType === userType
    );

    if (!user) {
      return {
        success: false,
        message: "Invalid email, password, or user type!",
      };
    }

    // Set logged in user (without password)
    const loggedInUser = { ...user, password: undefined };
    try {
      localStorage.setItem(
        this.LOGGED_IN_USER_KEY,
        JSON.stringify(loggedInUser)
      );
      return {
        success: true,
        message: "Login successful!",
        user: loggedInUser,
      };
    } catch (error) {
      console.error("Error saving logged in user:", error);
      return {
        success: false,
        message: "Login failed. Please try again.",
      };
    }
  },

  /**
   * Logout current user
   */
  logout() {
    try {
      localStorage.removeItem(this.LOGGED_IN_USER_KEY);
      return true;
    } catch (error) {
      console.error("Error during logout:", error);
      return false;
    }
  },

  /**
   * Get currently logged in user
   * @returns {Object|null} User object or null if not logged in
   */
  getCurrentUser() {
    try {
      const user = localStorage.getItem(this.LOGGED_IN_USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  },

  /**
   * Check if user is logged in
   * @returns {boolean} True if user is logged in
   */
  isLoggedIn() {
    return this.getCurrentUser() !== null;
  },

  /**
   * Protect page - redirect to login if not authenticated
   * @param {string} requiredUserType - Optional user type requirement
   */
  protectPage(requiredUserType = null) {
    const user = this.getCurrentUser();

    if (!user) {
      // Not logged in - redirect to login
      window.location.href = "login.html";
      return false;
    }

    if (requiredUserType && user.userType !== requiredUserType) {
      // Wrong user type - redirect to appropriate dashboard
      const redirectPage =
        user.userType === "intern"
          ? "intern_dashboard.html"
          : "company_dashboard.html";
      window.location.href = redirectPage;
      return false;
    }

    return true;
  },

  /**
   * Find user by email
   * @param {string} email - Email to search for
   * @returns {Object|null} User object or null if not found
   */
  findUserByEmail(email) {
    const users = this.getAllUsers();
    return (
      users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null
    );
  },

  /**
   * Update user password
   * @param {string} email - User email
   * @param {string} newPassword - New password
   * @returns {Object} Result object with success status and message
   */
  updatePassword(email, newPassword) {
    if (!newPassword || newPassword.length < 6) {
      return {
        success: false,
        message: "Password must be at least 6 characters long!",
      };
    }

    const users = this.getAllUsers();
    const userIndex = users.findIndex(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (userIndex === -1) {
      return {
        success: false,
        message: "User not found!",
      };
    }

    // Update password
    users[userIndex].password = newPassword;

    // Save updated users
    if (this.saveUsers(users)) {
      return {
        success: true,
        message: "Password updated successfully!",
      };
    } else {
      return {
        success: false,
        message: "Failed to update password. Please try again.",
      };
    }
  },

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} True if email is valid
   */
  isValidEmail(email) {
    const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailPattern.test(email);
  },

  /**
   * Validate phone number (10 digits)
   * @param {string} phone - Phone number to validate
   * @returns {boolean} True if phone is valid
   */
  isValidPhone(phone) {
    const phonePattern = /^\d{10}$/;
    return phonePattern.test(phone);
  },

  /**
   * Show message to user
   * @param {string} message - Message to display
   * @param {string} type - Message type (success/error)
   */
  showMessage(message, type = "info") {
    // Create message element if it doesn't exist
    let messageEl = document.getElementById("auth-message");

    if (!messageEl) {
      messageEl = document.createElement("div");
      messageEl.id = "auth-message";
      messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      `;
      document.body.appendChild(messageEl);

      // Add animation
      const style = document.createElement("style");
      style.textContent = `
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `;
      document.head.appendChild(style);
    }

    // Set message and style based on type
    messageEl.textContent = message;

    if (type === "success") {
      messageEl.style.backgroundColor = "#4CAF50";
      messageEl.style.color = "white";
    } else if (type === "error") {
      messageEl.style.backgroundColor = "#f44336";
      messageEl.style.color = "white";
    } else {
      messageEl.style.backgroundColor = "#2196F3";
      messageEl.style.color = "white";
    }

    // Auto hide after 3 seconds
    setTimeout(() => {
      if (messageEl) {
        messageEl.style.animation = "slideIn 0.3s ease-out reverse";
        setTimeout(() => {
          if (messageEl && messageEl.parentNode) {
            messageEl.parentNode.removeChild(messageEl);
          }
        }, 300);
      }
    }, 3000);
  },
};

// Export for use in other files
if (typeof module !== "undefined" && module.exports) {
  module.exports = Auth;
}
