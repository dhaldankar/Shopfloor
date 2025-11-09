const App = {
  init() {
    // Initialize store with mock data
    Store.init(INITIAL_MACHINES);

    Dashboard.init();
    Machines.init();

    this.setupNavigation();

    this.navigateTo("dashboard");

    console.log("mCockpit initialized successfully!");
  },

  setupNavigation() {
    document.getElementById("nav-dashboard").addEventListener("click", (e) => {
      e.preventDefault();
      this.navigateTo("dashboard");
    });

    document.getElementById("nav-machines").addEventListener("click", (e) => {
      e.preventDefault();
      this.navigateTo("machines");
    });

    window.addEventListener("popstate", (e) => {
      const section =
        e.state && e.state.section ? e.state.section : "dashboard";
      this.navigateTo(section, false);
    });
  },

  navigateTo(section, pushState = true) {
    document.querySelectorAll(".content-section").forEach((sec) => {
      sec.classList.remove("active");
    });

    const targetSection = document.getElementById(`${section}-section`);
    if (targetSection) {
      targetSection.classList.add("active");
    }

    document.querySelectorAll(".nav-link").forEach((item) => {
      item.classList.remove("active");
    });

    const activeNav = document.getElementById(`nav-${section}`);
    if (activeNav) {
      activeNav.classList.add("active");
    }

    if (pushState) {
      history.pushState({ section }, "", `#${section}`);
    }
  },
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => App.init());
} else {
  App.init();
}
