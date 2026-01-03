document.addEventListener("DOMContentLoaded", () => {
  // Protect page - only allow logged in companies
  Auth.protectPage("company");

  // Get current user
  const currentUser = Auth.getCurrentUser();

  // Personalize welcome message
  const welcomeHeading = document.querySelector(".main-section h1");
  if (welcomeHeading && currentUser) {
    const companyName = currentUser.companyName || "Company";
    welcomeHeading.textContent = `Welcome Back, ${companyName}!`;
  }

  const posts = JSON.parse(localStorage.getItem("internships")) || [];
  const applicants = JSON.parse(localStorage.getItem("applications")) || [];

  document.getElementById("totalPosts").textContent = posts.length;
  document.getElementById("totalApplicants").textContent = applicants.length;

  document.getElementById("activePosts").textContent = posts.filter(
    (p) => p.status === "Open"
  ).length;

  document.getElementById("closedPosts").textContent = posts.filter(
    (p) => p.status === "Closed"
  ).length;

  const recentContainer = document.getElementById("recentContainer");

  if (posts.length === 0) {
    recentContainer.innerHTML = `<p>No recent activity.</p>`;
    return;
  }

  posts
    .slice(-4)
    .reverse()
    .forEach((post) => {
      let card = document.createElement("div");
      card.classList.add("recent-card");

      card.innerHTML = `
        <div>
            <h3>${post.title}</h3>
            <p><strong>Field:</strong> ${post.skills}</p>
            <p><strong>Posted On:</strong> ${post.date}</p>
        </div>

        <div>
            <span class="status ${post.status.toLowerCase()}">${
        post.status
      }</span>
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
