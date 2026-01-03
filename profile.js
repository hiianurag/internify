/**
 * Intern Profile Page Script
 */

document.addEventListener("DOMContentLoaded", () => {
  // Protect page - only allow logged in interns
  Auth.protectPage("intern");

  // Get current user
  const currentUser = Auth.getCurrentUser();

  const form = document.getElementById("internProfileForm");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const collegeInput = document.getElementById("college");
  const skillsInput = document.getElementById("skills");

  // Preview elements
  const pName = document.getElementById("pName");
  const pEmail = document.getElementById("pEmail");
  const pPhone = document.getElementById("pPhone");
  const pCollege = document.getElementById("pCollege");
  const pSkills = document.getElementById("pSkills");

  // Load current user data into form
  if (currentUser) {
    nameInput.value = currentUser.name || "";
    emailInput.value = currentUser.email || "";
    phoneInput.value = currentUser.phone || "";
    collegeInput.value = currentUser.college || "";
    skillsInput.value = currentUser.skills || "";

    // Update preview
    updatePreview();
  }

  // Update preview function
  function updatePreview() {
    pName.textContent = nameInput.value || "-";
    pEmail.textContent = emailInput.value || "-";
    pPhone.textContent = phoneInput.value || "-";
    pCollege.textContent = collegeInput.value || "-";
    pSkills.textContent = skillsInput.value || "-";
  }

  // Update preview on input
  [nameInput, emailInput, phoneInput, collegeInput, skillsInput].forEach((input) => {
    input.addEventListener("input", updatePreview);
  });

  // Handle form submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const college = collegeInput.value.trim();
    const skills = skillsInput.value.trim();

    // Validate inputs
    if (!name) {
      Auth.showMessage("Please enter your name!", "error");
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

    if (phone && !Auth.isValidPhone(phone)) {
      Auth.showMessage("Please enter a valid 10-digit phone number!", "error");
      phoneInput.focus();
      return;
    }

    // Update user data in localStorage
    const users = Auth.getAllUsers();
    const userIndex = users.findIndex((u) => u.id === currentUser.id);

    if (userIndex !== -1) {
      users[userIndex] = {
        ...users[userIndex],
        name: name,
        email: email,
        phone: phone,
        college: college,
        skills: skills,
      };

      // Save updated users
      if (Auth.saveUsers(users)) {
        // Update logged in user
        const updatedUser = { ...users[userIndex], password: undefined };
        localStorage.setItem(Auth.LOGGED_IN_USER_KEY, JSON.stringify(updatedUser));

        Auth.showMessage("Profile updated successfully!", "success");
        updatePreview();
      } else {
        Auth.showMessage("Failed to update profile. Please try again.", "error");
      }
    } else {
      Auth.showMessage("User not found. Please login again.", "error");
      setTimeout(() => {
        Auth.logout();
        window.location.href = "login.html";
      }, 2000);
    }
  });

  // Phone number validation - only allow digits
  phoneInput.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/\D/g, "");
  });

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
