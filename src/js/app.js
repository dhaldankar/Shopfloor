// Main application initialization and navigation
const App = {
  // Initialize application
  init() {
    // Initialize store with mock data
    Store.init(INITIAL_MACHINES);

    // Initialize modules
    Dashboard.init();
    Machines.init();

    // Setup navigation
    this.setupNavigation();

    // Show dashboard by default
    this.navigateTo("dashboard");

    console.log("mCockpit initialized successfully!");
  },

  // Setup navigation handlers
  setupNavigation() {
    // Navigation links
    document.getElementById("nav-dashboard").addEventListener("click", (e) => {
      e.preventDefault();
      this.navigateTo("dashboard");
    });

    document.getElementById("nav-machines").addEventListener("click", (e) => {
      e.preventDefault();
      this.navigateTo("machines");
    });

    // Handle browser back/forward
    window.addEventListener("popstate", (e) => {
      const section =
        e.state && e.state.section ? e.state.section : "dashboard";
      this.navigateTo(section, false);
    });
  },

  // Navigate to section
  navigateTo(section, pushState = true) {
    // Hide all sections
    document.querySelectorAll(".content-section").forEach((sec) => {
      sec.classList.remove("active");
    });

    // Show target section
    const targetSection = document.getElementById(`${section}-section`);
    if (targetSection) {
      targetSection.classList.add("active");
    }

    // Update active nav item
    document.querySelectorAll("cds-header-nav-item").forEach((item) => {
      item.removeAttribute("active");
    });

    const activeNav = document.getElementById(`nav-${section}`);
    if (activeNav) {
      activeNav.setAttribute("active", "");
    }

    // Update URL
    if (pushState) {
      history.pushState({ section }, "", `#${section}`);
    }
  },
};

// Initialize app when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => App.init());
} else {
  App.init();
}
