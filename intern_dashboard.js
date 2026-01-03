// intern_dashboard.js

document.addEventListener("DOMContentLoaded", () => {
  // Protect page - only allow logged in interns
  Auth.protectPage("intern");

  // Get current user
  const currentUser = Auth.getCurrentUser();

  // Personalize welcome message
  const welcomeHeading = document.querySelector(".main-section h1");
  if (welcomeHeading && currentUser) {
    const userName = currentUser.name || "Intern";
    welcomeHeading.textContent = `Welcome, ${userName}!`;
  }

  const apps = JSON.parse(localStorage.getItem("applications")) || [];

  // Counts
  document.getElementById("totalApps").textContent = apps.length;
  document.getElementById("shortlisted").textContent = apps.filter(
    (a) => a.status === "Shortlisted"
  ).length;
  document.getElementById("pending").textContent = apps.filter(
    (a) => a.status === "Pending"
  ).length;
  document.getElementById("rejected").textContent = apps.filter(
    (a) => a.status === "Rejected"
  ).length;

  const recentContainer = document.getElementById("recentContainer");

  if (apps.length === 0) {
    recentContainer.innerHTML = `<p>No recent activity.</p>`;
    return;
  }

  // Last 4 applications (latest first)
  apps
    .slice(-4)
    .reverse()
    .forEach((app) => {
      const company = app.companyName || app.company || "Company";
      const title = app.internshipTitle || app.skills || "Internship";
      const appliedOn = app.date || app.appliedOn || "";

      let card = document.createElement("div");
      card.classList.add("recent-card");

      card.innerHTML = `
        <div>
          <h3>${title}</h3>
          <p><strong>Company:</strong> ${company}</p>
          <p><strong>Applied On:</strong> ${appliedOn}</p>
        </div>
        <div>
          <span class="status ${app.status.toLowerCase()}">
            ${app.status}
          </span>
        </div>
      `;

      recentContainer.appendChild(card);
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
