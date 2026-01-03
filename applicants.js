document.addEventListener("DOMContentLoaded", () => {
  // Protect page - only allow logged in companies
  Auth.protectPage("company");

  const currentUser = Auth.getCurrentUser();
  let applicants = JSON.parse(localStorage.getItem("applications")) || [];
  
  // Filter applicants for this company
  // If application has companyId, match it. If not, match company name.
  // For demo purposes, if no company info in application, maybe show all? 
  // Better to show only relevant ones if possible.
  if (currentUser) {
    applicants = applicants.filter(app => {
      // If app has companyId, match it
      if (app.companyId && currentUser.id) {
        return app.companyId === currentUser.id;
      }
      // Fallback to name match
      if (app.companyName || app.company) {
        const appCompany = (app.companyName || app.company).toLowerCase();
        const currentCompany = (currentUser.companyName || currentUser.name).toLowerCase();
        return appCompany === currentCompany;
      }
      // If no company info in app, show it (legacy/demo)
      return true;
    });
  }

  let applicantList = document.getElementById("applicantList");
  let applicantCard = document.getElementById("applicantCard");
  let currentIndex = -1;

  function loadApplicants() {
    applicantList.innerHTML = "";

    if (applicants.length === 0) {
      applicantList.innerHTML = "<p>No applicants found for your internships.</p>";
      return;
    }

    applicants.forEach((a, index) => {
      let div = document.createElement("div");
      div.className = "applicant-box";
      div.innerHTML = `
        <strong>${a.name}</strong>  
        — <span style="opacity: .7">${a.internshipTitle || a.title || "Internship"}</span>
        <br>
        <small>${a.email}</small>
      `;
      div.onclick = () => openCard(index);
      applicantList.appendChild(div);
    });
  }

  window.openCard = function(index) {
    currentIndex = index;
    let a = applicants[index];

    document.getElementById("cName").textContent = a.name;
    document.getElementById("cEmail").textContent = a.email;
    document.getElementById("cPhone").textContent = a.phone;
    document.getElementById("cCollege").textContent = a.college;
    document.getElementById("cSkills").textContent = a.skills;
    document.getElementById("cExp").textContent = a.experience || "Not given";
    document.getElementById("cStatus").textContent = a.status;

    applicantCard.classList.remove("hidden");
  }

  window.closePopup = function() {
    applicantCard.classList.add("hidden");
  }

  const shortBtn = document.getElementById("shortBtn");
  if (shortBtn) {
    shortBtn.onclick = () => {
      if (currentIndex === -1) return;
      
      // Update local array
      applicants[currentIndex].status = "Shortlisted";
      
      // Update global storage
      // We need to find the original application in localStorage and update it
      // This is tricky because we filtered the list. 
      // Let's reload all, find the match, update, and save.
      const allApps = JSON.parse(localStorage.getItem("applications")) || [];
      const appToUpdate = applicants[currentIndex];
      
      const realIndex = allApps.findIndex(a => 
        a.id === appToUpdate.id || 
        (a.email === appToUpdate.email && a.internshipTitle === appToUpdate.internshipTitle)
      );
      
      if (realIndex !== -1) {
        allApps[realIndex].status = "Shortlisted";
        localStorage.setItem("applications", JSON.stringify(allApps));
        Auth.showMessage("Applicant shortlisted!", "success");
      }
      
      closePopup();
      // Reload local list to reflect changes
      // Actually we just updated the local object reference so it might show
      document.getElementById("cStatus").textContent = "Shortlisted";
      loadApplicants();
    };
  }

  const rejBtn = document.getElementById("rejBtn");
  if (rejBtn) {
    rejBtn.onclick = () => {
      if (currentIndex === -1) return;
      
      applicants[currentIndex].status = "Rejected";
      
      const allApps = JSON.parse(localStorage.getItem("applications")) || [];
      const appToUpdate = applicants[currentIndex];
      
      const realIndex = allApps.findIndex(a => 
        a.id === appToUpdate.id || 
        (a.email === appToUpdate.email && a.internshipTitle === appToUpdate.internshipTitle)
      );
      
      if (realIndex !== -1) {
        allApps[realIndex].status = "Rejected";
        localStorage.setItem("applications", JSON.stringify(allApps));
        Auth.showMessage("Applicant rejected", "info");
      }
      
      closePopup();
      document.getElementById("cStatus").textContent = "Rejected";
      loadApplicants();
    };
  }

  loadApplicants();

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
