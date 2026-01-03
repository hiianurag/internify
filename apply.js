/**
 * Apply Page Script
 */

document.addEventListener("DOMContentLoaded", () => {
  // Protect page - only allow logged in interns
  Auth.protectPage("intern");

  const currentUser = Auth.getCurrentUser();
  const applyForm = document.getElementById("applyForm");
  
  // Get selected internship
  const selectedInternship = JSON.parse(localStorage.getItem("selectedInternship"));
  
  if (!selectedInternship) {
    Auth.showMessage("No internship selected! Redirecting...", "error");
    setTimeout(() => {
      window.location.href = "internship.html";
    }, 1500);
    return;
  }

  // Update page title or show selected internship info
  const header = document.querySelector("header h1");
  if (header) {
    header.textContent = `Apply for ${selectedInternship.title}`;
  } else {
    // If no header h1, maybe insert info
    const container = document.querySelector(".apply-container");
    const infoDiv = document.createElement("div");
    infoDiv.style.marginBottom = "20px";
    infoDiv.style.padding = "10px";
    infoDiv.style.background = "#f0f4ff";
    infoDiv.style.borderRadius = "5px";
    infoDiv.innerHTML = `
      <h3>Applying for: ${selectedInternship.title}</h3>
      <p><strong>Company:</strong> ${selectedInternship.company || selectedInternship.companyName}</p>
    `;
    container.insertBefore(infoDiv, applyForm);
  }

  // Pre-fill form with user data
  if (currentUser) {
    if (document.getElementById("name")) document.getElementById("name").value = currentUser.name || "";
    if (document.getElementById("email")) document.getElementById("email").value = currentUser.email || "";
    if (document.getElementById("phone")) document.getElementById("phone").value = currentUser.phone || "";
    if (document.getElementById("college")) document.getElementById("college").value = currentUser.college || "";
    
    // Make email read-only as it's the ID
    if (document.getElementById("email")) document.getElementById("email").readOnly = true;
  }

  // Handle form submission
  applyForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get form values
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const college = document.getElementById("college") ? document.getElementById("college").value : "";
    const skills = document.getElementById("skills").value;
    const experience = document.getElementById("experience").value;
    
    // Get status (radio button)
    let status = "";
    const statusRadios = document.getElementsByName("status");
    for (const radio of statusRadios) {
      if (radio.checked) {
        status = radio.value;
        break;
      }
    }

    // Basic validation
    if (!name || !email || !phone || !skills) {
      Auth.showMessage("Please fill in all required fields!", "error");
      return;
    }

    // Create application object
    const application = {
      id: "app_" + Date.now(),
      internshipId: selectedInternship.id || "unknown",
      internshipTitle: selectedInternship.title,
      company: selectedInternship.company || selectedInternship.companyName,
      companyId: selectedInternship.companyId, // Important for company dashboard filtering
      
      // Applicant info
      userId: currentUser.id,
      name: name,
      email: email,
      phone: phone,
      college: college,
      skills: skills,
      experience: experience,
      currentStatus: status,
      
      status: "Pending",
      appliedOn: new Date().toLocaleDateString()
    };

    // Save to localStorage
    let applications = JSON.parse(localStorage.getItem("applications")) || [];
    
    // Check for duplicate application
    const isDuplicate = applications.some(
      app => app.email === email && 
             (app.internshipId === application.internshipId && application.internshipId !== "unknown" || 
              app.internshipTitle === application.internshipTitle)
    );

    if (isDuplicate) {
      Auth.showMessage("You have already applied for this internship!", "error");
      return;
    }

    applications.push(application);
    localStorage.setItem("applications", JSON.stringify(applications));

    // Show success
    const successMsg = document.getElementById("successMsg");
    if (successMsg) {
      successMsg.style.display = "block";
    }
    Auth.showMessage("Application submitted successfully!", "success");

    // Redirect
    setTimeout(() => {
      window.location.href = "myapplication.html";
    }, 2000);
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
