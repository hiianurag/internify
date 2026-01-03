/**
 * Company Profile Page Script
 */

document.addEventListener("DOMContentLoaded", () => {
  // Protect page - only allow logged in companies
  Auth.protectPage("company");

  const currentUser = Auth.getCurrentUser();
  const form = document.getElementById("profileForm");
  
  // Form fields
  const companyNameInput = document.getElementById("companyName");
  const websiteInput = document.getElementById("website");
  const emailInput = document.getElementById("email");
  const aboutInput = document.getElementById("about");

  // Preview elements
  const prevName = document.getElementById("prevName");
  const prevWebsite = document.getElementById("prevWebsite");
  const prevEmail = document.getElementById("prevEmail");
  const prevAbout = document.getElementById("prevAbout");

  // Load current user data
  if (currentUser) {
    companyNameInput.value = currentUser.companyName || currentUser.name || "";
    websiteInput.value = currentUser.website || "";
    emailInput.value = currentUser.email || "";
    aboutInput.value = currentUser.about || "";
    
    // Make email read-only
    emailInput.readOnly = true;
    
    updatePreview();
  }

  function updatePreview() {
    prevName.textContent = companyNameInput.value || "-";
    prevWebsite.textContent = websiteInput.value || "-";
    prevEmail.textContent = emailInput.value || "-";
    prevAbout.textContent = aboutInput.value || "-";
  }

  // Add input listeners for preview
  [companyNameInput, websiteInput, emailInput, aboutInput].forEach(input => {
    if (input) {
      input.addEventListener("input", updatePreview);
    }
  });

  // Handle form submission
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const companyName = companyNameInput.value.trim();
      const website = websiteInput.value.trim();
      const about = aboutInput.value.trim();

      if (!companyName) {
        Auth.showMessage("Company Name is required!", "error");
        return;
      }

      // Update user data
      const users = Auth.getAllUsers();
      const userIndex = users.findIndex(u => u.id === currentUser.id);

      if (userIndex !== -1) {
        users[userIndex] = {
          ...users[userIndex],
          companyName: companyName,
          name: companyName, // Update name as well for consistency
          website: website,
          about: about
        };

        if (Auth.saveUsers(users)) {
          // Update session
          const updatedUser = { ...users[userIndex], password: undefined };
          localStorage.setItem(Auth.LOGGED_IN_USER_KEY, JSON.stringify(updatedUser));
          
          Auth.showMessage("Profile updated successfully!", "success");
        } else {
          Auth.showMessage("Failed to save profile!", "error");
        }
      }
    });
  }

  // Handle logout
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      Auth.logout();
      Auth.showMessage("Logged out successfully!", "success");
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1000);
    });
  }
});
