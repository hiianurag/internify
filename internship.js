// internship.js - FIXED VERSION

document.addEventListener("DOMContentLoaded", () => {
  // Protect page - only allow logged in interns
  Auth.protectPage("intern");

  const container = document.getElementById("internshipContainer");
  let searchInput = document.getElementById("searchInput"); // Changed to let for reassignment

  // Get current user for skills matching
  const currentUser = Auth.getCurrentUser();

  // Debug: Log current user info
  console.log("Current User:", currentUser);
  console.log("User Skills:", currentUser?.skills);

  // Load internships: Fetch from JSON mock API + LocalStorage (user posts)
  async function loadInternships() {
    let allInternships = [];
    console.log("Loading internships...");

    if (!container) {
      console.error("Internship container not found!");
      return;
    }

    container.innerHTML = "<p>Loading internships...</p>";

    // 1. Try Fetch from Mock API
    let apiData = [];
    try {
      const response = await fetch("internships.json");
      if (response.ok) {
        apiData = await response.json();
        console.log("Loaded from API:", apiData.length);
      } else {
        throw new Error("Fetch failed");
      }
    } catch (error) {
      console.warn(
        "Could not fetch internships.json (likely CORS/file protocol). Using fallback data.",
        error,
      );
      // Fallback data (Hardcoded to ensure display works even without server)
      apiData = [
        {
          id: "mock_1",
          company: "TechCorp",
          title: "Frontend Developer",
          skills: "HTML, CSS, JavaScript, React",
          duration: "3 months",
          stipend: "12,000",
          status: "Open",
        },
        {
          id: "mock_2",
          company: "InnovateAI",
          title: "Machine Learning Intern",
          skills: "Python, TensorFlow, PyTorch",
          duration: "6 months",
          stipend: "20,000",
          status: "Open",
        },
        {
          id: "mock_3",
          company: "CreativeStudio",
          title: "UI/UX Designer",
          skills: "Figma, Adobe XD",
          duration: "2 months",
          stipend: "8,000",
          status: "Open",
        },
        {
          id: "mock_4",
          company: "DataFlow",
          title: "Backend Developer",
          skills: "Node.js, Mongo, SQL",
          duration: "4 months",
          stipend: "15,000",
          status: "Open",
        },
        {
          id: "mock_5",
          company: "MarketGurus",
          title: "Digital Marketing",
          skills: "SEO, Social Media",
          duration: "3 months",
          stipend: "10,000",
          status: "Open",
        },
        {
          id: "mock_6",
          company: "CyberSecure",
          title: "Security Analyst",
          skills: "Linux, Network, Python",
          duration: "5 months",
          stipend: "18,000",
          status: "Open",
        },
        {
          id: "mock_7",
          company: "CloudNine",
          title: "Cloud Intern",
          skills: "AWS, Docker",
          duration: "4 months",
          stipend: "16,000",
          status: "Open",
        },
        {
          id: "mock_8",
          company: "FinTech Sol",
          title: "Data Analyst",
          skills: "Excel, Python, SQL",
          duration: "3 months",
          stipend: "14,000",
          status: "Open",
        },
        {
          id: "mock_9",
          company: "EduTech",
          title: "Content Writer",
          skills: "English, Writing",
          duration: "2 months",
          stipend: "5,000",
          status: "Open",
        },
        {
          id: "mock_10",
          company: "GreenEnergy",
          title: "Research Assoc",
          skills: "Research, Analysis",
          duration: "4 months",
          stipend: "11,000",
          status: "Open",
        },
        {
          id: "mock_11",
          company: "AppDevs",
          title: "Android Helper",
          skills: "Java, Kotlin",
          duration: "3 months",
          stipend: "12,000",
          status: "Open",
        },
        {
          id: "mock_12",
          company: "WebWizards",
          title: "Full Stack",
          skills: "MERN, React, Node",
          duration: "6 months",
          stipend: "22,000",
          status: "Open",
        },
        {
          id: "mock_13",
          company: "GameOn",
          title: "Game Dev",
          skills: "Unity, C#",
          duration: "4 months",
          stipend: "15,000",
          status: "Open",
        },
        {
          id: "mock_14",
          company: "PixelArt",
          title: "Graphic Design",
          skills: "Photoshop, Illustrator",
          duration: "2 months",
          stipend: "6,000",
          status: "Open",
        },
        {
          id: "mock_15",
          company: "SalesForce",
          title: "Sales Intern",
          skills: "Communication, Sales",
          duration: "3 months",
          stipend: "9,000",
          status: "Open",
        },
      ];
    }

    allInternships = [...apiData];

    // 2. Fetch from LocalStorage (User posted internships)
    const localData = JSON.parse(localStorage.getItem("internships")) || [];
    const userPosted = localData.filter(
      (item) => item.id && item.id.toString().startsWith("int_"),
    );

    allInternships = [...userPosted, ...allInternships];

    console.log("Total internships to display:", allInternships.length);

    // Initial Display
    displayInternships(allInternships);

    // Setup Search Logic with the loaded data
    setupSearch(allInternships);
  }

  // --- AI SMART MATCH LOGIC ---
  function calculateMatch(internSkillsStr, jobSkillsStr) {
    if (!internSkillsStr || !jobSkillsStr) return 0;

    // Tokenize and clean
    const internSkills = internSkillsStr
      .toLowerCase()
      .split(",")
      .map((s) => s.trim());
    const jobSkills = jobSkillsStr
      .toLowerCase()
      .split(",")
      .map((s) => s.trim());

    if (jobSkills.length === 0) return 0;

    // Find intersection
    const matched = jobSkills.filter((skill) => internSkills.includes(skill));

    // Calculate percentage
    const score = Math.round((matched.length / jobSkills.length) * 100);
    return score;
  }

  function getMatchBadge(score) {
    let colorClass, text;
    if (score >= 70) {
      colorClass = "match-high";
      text = "Top Match";
    } else if (score >= 40) {
      colorClass = "match-medium";
      text = "Good Match";
    } else {
      colorClass = "match-low";
      text = "Low Match";
    }

    return `<span class="match-badge ${colorClass}">${score}% Match</span>`;
  }
  // ---------------------------

  function displayInternships(list) {
    container.innerHTML = "";

    // Filter only Open internships
    const openInternships = list.filter((i) => i.status !== "Closed");

    if (openInternships.length === 0) {
      container.innerHTML = "<p>No internships available at the moment.</p>";
      return;
    }

    // Calculate matches if user has skills
    if (currentUser && currentUser.skills) {
      openInternships.forEach((internship) => {
        internship.matchScore = calculateMatch(
          currentUser.skills,
          internship.skills,
        );
      });

      // Optional: Sort by match score (highest first)
      openInternships.sort((a, b) => b.matchScore - a.matchScore);
    }

    openInternships.forEach((internship, index) => {
      const matchBadgeHTML =
        currentUser && currentUser.skills
          ? getMatchBadge(internship.matchScore)
          : "";

      const card = document.createElement("div");
      card.className = "internship-card";
      card.innerHTML = `
        <div class="card-header">
            <h3>${internship.title}</h3>
            ${matchBadgeHTML}
        </div>
        <p><strong>Company:</strong> ${internship.company || internship.companyName}</p>
        <p><strong>Skills:</strong> ${internship.skills}</p>
        <p><strong>Duration:</strong> ${internship.duration} ${internship.duration.includes("month") || internship.duration.includes("day") ? "" : "months"}</p>
        <p><strong>Stipend:</strong> ₹${internship.stipend}</p>

        <button class="apply-btn" data-id="${internship.id || index}">Apply</button>
      `;
      container.appendChild(card);
    });

    // Attach click listener
    container.querySelectorAll(".apply-btn").forEach((btn, idx) => {
      btn.addEventListener("click", () => {
        const selected = openInternships[idx];

        // Save selected internship for apply page
        localStorage.setItem("selectedInternship", JSON.stringify(selected));

        window.location.href = "apply.html";
      });
    });
  }

  function setupSearch(allData) {
    if (searchInput) {
      // FIXED: Clone and replace, then reassign the reference
      const newSearchInput = searchInput.cloneNode(true);
      searchInput.parentNode.replaceChild(newSearchInput, searchInput);
      searchInput = newSearchInput; // CRITICAL: Reassign to the new element

      searchInput.addEventListener("input", function () {
        const query = this.value.toLowerCase();
        const filtered = allData.filter(
          (item) =>
            (item.skills && item.skills.toLowerCase().includes(query)) ||
            (item.title && item.title.toLowerCase().includes(query)) ||
            (item.company && item.company.toLowerCase().includes(query)) ||
            (item.companyName &&
              item.companyName.toLowerCase().includes(query)),
        );
        displayInternships(filtered);
      });
    }
  }

  // Start the app
  loadInternships();

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
