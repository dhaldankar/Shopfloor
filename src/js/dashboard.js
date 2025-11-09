// Dashboard functionality
const Dashboard = {
  updateInterval: null,

  // Initialize dashboard
  init() {
    this.render();
    Store.subscribe(() => this.render());

    // Start real-time simulation (Cool Feature!)
    this.startRealTimeSimulation();
  },

  // Render dashboard
  render() {
    this.renderKPIs();
    this.renderMachineStatus();
    this.renderProductionStats();
  },

  // Render KPI cards
  renderKPIs() {
    const stats = Store.getStats();

    document.getElementById("kpi-running").textContent = stats.running;
    document.getElementById("kpi-idle").textContent = stats.idle;
    document.getElementById("kpi-maintenance").textContent = stats.maintenance;
    document.getElementById("kpi-error").textContent = stats.error;
  },

  // Render machine status grid
  renderMachineStatus() {
    const machines = Store.getAllMachines();
    const grid = document.getElementById("machine-status-grid");

    grid.innerHTML = machines
      .map(
        (machine) => `
            <div class="machine-card ${machine.status}" data-id="${machine.id}">
                <div class="machine-card-header">
                    <div class="machine-card-name">${machine.name}</div>
                    <span class="machine-card-status ${machine.status}">
                        ${STATUS_LABELS[machine.status]}
                    </span>
                </div>
                <div class="machine-card-info">
                    <div><strong>Order:</strong> ${
                      machine.currentOrder || "N/A"
                    }</div>
                    <div><strong>Output:</strong> ${machine.output} units</div>
                    <div><strong>Efficiency:</strong> ${
                      machine.efficiency
                    }%</div>
                </div>
            </div>
        `
      )
      .join("");

    // Add click handlers to machine cards
    grid.querySelectorAll(".machine-card").forEach((card) => {
      card.addEventListener("click", () => {
        const machineId = card.dataset.id;
        this.showMachineDetails(machineId);
      });
    });
  },

  // Render production statistics
  renderProductionStats() {
    const stats = Store.getStats();

    document.getElementById("total-output").textContent =
      stats.totalOutput.toLocaleString();
    document.getElementById("overall-efficiency").textContent =
      stats.avgEfficiency + "%";
  },

  // Show machine details (could open modal or navigate)
  showMachineDetails(machineId) {
    const machine = Store.getMachineById(machineId);
    if (machine) {
      // Switch to machines view and highlight
      document.getElementById("nav-machines").click();

      // Highlight row
      setTimeout(() => {
        const row = document.querySelector(`tr[data-id="${machineId}"]`);
        if (row) {
          row.style.backgroundColor = "#d0e2ff";
          row.scrollIntoView({ behavior: "smooth", block: "center" });

          setTimeout(() => {
            row.style.backgroundColor = "";
          }, 2000);
        }
      }, 100);
    }
  },

  // Real-time simulation (Cool Feature!)
  startRealTimeSimulation() {
    // Update every 3 seconds
    this.updateInterval = setInterval(() => {
      this.simulateRealTimeUpdates();
    }, 3000);
  },

  // Simulate real-time machine updates
  simulateRealTimeUpdates() {
    const machines = Store.getAllMachines();

    machines.forEach((machine) => {
      // Only update running machines
      if (machine.status === "running") {
        const updates = {};

        // Randomly increase output (1-10 units)
        const outputIncrease = Math.floor(Math.random() * 10) + 1;
        updates.output = machine.output + outputIncrease;

        // Efficiency fluctuates slightly (±2%)
        const efficiencyChange = Math.floor(Math.random() * 5) - 2;
        updates.efficiency = Math.max(
          0,
          Math.min(100, machine.efficiency + efficiencyChange)
        );

        // Small chance (5%) of status change
        if (Math.random() < 0.05) {
          const possibleStatuses = ["running", "idle", "error"];
          updates.status =
            possibleStatuses[
              Math.floor(Math.random() * possibleStatuses.length)
            ];

          // If changing to idle/error, clear current order
          if (updates.status !== "running") {
            updates.currentOrder = "";
          }
        }

        Store.updateMachine(machine.id, updates);
      }
    });

    // Add visual feedback for updates
    this.animateUpdate();
  },

  // Animate dashboard update
  animateUpdate() {
    const kpiCards = document.querySelectorAll(".kpi-card");
    kpiCards.forEach((card) => {
      card.classList.add("updating");
      setTimeout(() => card.classList.remove("updating"), 1000);
    });
  },

  // Stop simulation (cleanup)
  stopRealTimeSimulation() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  },
};
