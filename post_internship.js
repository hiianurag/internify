document.addEventListener("DOMContentLoaded", () => {
  // Protect page - only allow logged in companies
  Auth.protectPage("company");

  const form = document.getElementById("internshipForm");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const currentUser = Auth.getCurrentUser();
      const companyName = currentUser ? (currentUser.companyName || currentUser.name) : document.getElementById("companyName").value;

      const internship = {
        id: "int_" + Date.now(),
        company: companyName, // Use logged in company name if available
        companyId: currentUser ? currentUser.id : null,
        title: document.getElementById("title").value,
        skills: document.getElementById("skills").value,
        duration: document.getElementById("duration").value,
        stipend: document.getElementById("stipend").value,
        date: new Date().toLocaleDateString(),
        status: "Open"
      };

      let internships = JSON.parse(localStorage.getItem("internships")) || [];
      internships.push(internship);
      localStorage.setItem("internships", JSON.stringify(internships));

      Auth.showMessage("Internship posted successfully!", "success");

      setTimeout(() => {
        window.location.href = "company_dashboard.html";
      }, 1500);
    });
  }

  // Pre-fill company name if logged in
  const currentUser = Auth.getCurrentUser();
  if (currentUser && currentUser.companyName) {
    const companyNameInput = document.getElementById("companyName");
    if (companyNameInput) {
      companyNameInput.value = currentUser.companyName;
      // Optional: make it read-only
      // companyNameInput.readOnly = true;
    }
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
