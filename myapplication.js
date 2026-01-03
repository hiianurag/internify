/**
 * My Applications Page Script
 */

document.addEventListener("DOMContentLoaded", () => {
  // Protect page - only allow logged in interns
  Auth.protectPage("intern");

  const currentUser = Auth.getCurrentUser();
  const applicationsList = document.getElementById("applicationsList");

  // Load all applications
  const allApplications = JSON.parse(localStorage.getItem("applications")) || [];

  // Filter for current user
  const myApplications = allApplications.filter(
    (app) => app.email === currentUser.email
  );

  if (myApplications.length === 0) {
    applicationsList.innerHTML = `
      <div class="no-apps">
        <p>You haven't applied to any internships yet.</p>
        <a href="internship.html" class="browse-btn">Browse Internships</a>
      </div>
    `;
    return;
  }

  // Display applications
  myApplications.reverse().forEach((app) => {
    const card = document.createElement("div");
    card.className = "application-card";
    
    // Determine status class
    const statusClass = app.status ? app.status.toLowerCase() : "pending";
    
    card.innerHTML = `
      <div class="app-header">
        <h3>${app.internshipTitle || app.title || "Internship"}</h3>
        <span class="status-badge ${statusClass}">${app.status || "Pending"}</span>
      </div>
      <div class="app-body">
        <p><strong>Company:</strong> ${app.companyName || app.company || "Unknown Company"}</p>
        <p><strong>Applied On:</strong> ${app.date || app.appliedOn || "Recently"}</p>
      </div>
    `;
    
    applicationsList.appendChild(card);
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
