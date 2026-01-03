// Simple entry animation for buttons
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".btn");
  buttons.forEach((btn, i) => {
    btn.style.opacity = "0";
    setTimeout(() => {
      btn.style.transition = "opacity 0.8s ease";
      btn.style.opacity = "1";
    }, i * 300);
  });
});
