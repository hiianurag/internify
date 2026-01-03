// internship.js

document.addEventListener("DOMContentLoaded", () => {
  // Protect page - only allow logged in interns
  Auth.protectPage("intern");

  const container = document.getElementById("internshipContainer");
  const searchInput = document.getElementById("searchInput");

  // Load internships from localStorage (posted by companies)
  // If none, use some default ones for demo
  let internships = JSON.parse(localStorage.getItem("internships")) || [];

  if (internships.length === 0) {
    internships = [
      {
        company: "TechCorp",
        title: "Frontend Developer",
        skills: "HTML, CSS, JavaScript",
        duration: "3 months",
        stipend: "₹10,000",
        status: "Open"
      },
      {
        company: "DesignWorks",
        title: "UI/UX Intern",
        skills: "Figma, Adobe XD",
        duration: "15 days",
        stipend: "₹8,000",
        status: "Open"
      },
      {
        company: "Vecmocon Technologies Pvt Ltd",
        title: "Software-Intern",
        skills: "HTML, CSS, JavaScript",
        duration: "2 months",
        stipend: "₹9,000",
        status: "Open"
      },
      {
        company: "DataSoft",
        title: "Data Analyst Intern",
        skills: "Excel, Python, SQL",
        duration: "4 months",
        stipend: "₹12,000",
        status: "Open"
      },
    ];
    // Save defaults so they persist
    localStorage.setItem("internships", JSON.stringify(internships));
  }

  function displayInternships(list) {
    container.innerHTML = "";
    
    // Filter only Open internships
    const openInternships = list.filter(i => i.status !== "Closed");

    if (openInternships.length === 0) {
      container.innerHTML = "<p>No internships available at the moment.</p>";
      return;
    }

    openInternships.forEach((internship, index) => {
      const card = document.createElement("div");
      card.className = "internship-card";
      card.innerHTML = `
        <h3>${internship.title}</h3>
        <p><strong>Company:</strong> ${internship.company || internship.companyName}</p>
        <p><strong>Skills:</strong> ${internship.skills}</p>
        <p><strong>Duration:</strong> ${internship.duration} ${internship.duration.includes('month') || internship.duration.includes('day') ? '' : 'months'}</p>
        <p><strong>Stipend:</strong> ₹${internship.stipend}</p>

        <button class="apply-btn" data-id="${internship.id || index}">Apply</button>
      `;
      container.appendChild(card);
    });

    // Attach click listener
    container.querySelectorAll(".apply-btn").forEach((btn, idx) => {
      btn.addEventListener("click", () => {
        // Find the actual internship object
        // If we used ID, find by ID, else use index from the filtered list
        const selected = openInternships[idx];

        // Save selected internship for apply page
        localStorage.setItem("selectedInternship", JSON.stringify(selected));

        window.location.href = "apply.html";
      });
    });
  }

  // Search filter
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const query = this.value.toLowerCase();
      const filtered = internships.filter(
        (item) =>
          (item.skills && item.skills.toLowerCase().includes(query)) ||
          (item.title && item.title.toLowerCase().includes(query)) ||
          (item.company && item.company.toLowerCase().includes(query)) ||
          (item.companyName && item.companyName.toLowerCase().includes(query))
      );
      displayInternships(filtered);
    });
  }

  // Initial display
  displayInternships(internships);

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
