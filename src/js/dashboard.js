const Dashboard = {
  updateInterval: null,
  currentFilter: null,

  init() {
    this.render();
    Store.subscribe(() => this.render());
    this.setupFilterCards();

    // Start real-time simulation
    this.startRealTimeSimulation();
  },

  // Setup filter card click handlers
  setupFilterCards() {
    const filterCards = document.querySelectorAll(".filter-card");
    const clearFilterBtn = document.getElementById("clear-filter-btn");

    filterCards.forEach((card) => {
      card.addEventListener("click", () => {
        const status = card.dataset.status;

        if (this.currentFilter === status) {
          this.currentFilter = null;
          card.classList.remove("active");
          clearFilterBtn.style.display = "none";
        } else {
          filterCards.forEach((c) => c.classList.remove("active"));

          this.currentFilter = status;
          card.classList.add("active");
          clearFilterBtn.style.display = "inline-flex";
        }

        this.renderMachineStatus();
      });
    });

    clearFilterBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.currentFilter = null;
      filterCards.forEach((c) => c.classList.remove("active"));
      clearFilterBtn.style.display = "none";
      this.renderMachineStatus();
    });
  },

  render() {
    this.renderKPIs();
    this.renderMachineStatus();
    this.renderProductionStats();
  },

  renderKPIs() {
    const stats = Store.getStats();

    document.getElementById("kpi-running").textContent = stats.running;
    document.getElementById("kpi-idle").textContent = stats.idle;
    document.getElementById("kpi-maintenance").textContent = stats.maintenance;
    document.getElementById("kpi-error").textContent = stats.error;
  },

  renderMachineStatus() {
    let machines = Store.getAllMachines();

    if (this.currentFilter) {
      machines = machines.filter((m) => m.status === this.currentFilter);
    }

    const board = document.getElementById("machine-kanban-board");

    const grouped = {
      running: machines.filter((m) => m.status === "running"),
      idle: machines.filter((m) => m.status === "idle"),
      maintenance: machines.filter((m) => m.status === "maintenance"),
      error: machines.filter((m) => m.status === "error"),
    };

    const columnsToShow = this.currentFilter
      ? [this.currentFilter]
      : ["running", "idle", "maintenance", "error"];

    board.innerHTML = columnsToShow
      .map(
        (status) => `
          <div class="kanban-column ${status}">
              <div class="kanban-column-header">
                  <span class="kanban-column-title">${
                    STATUS_LABELS[status]
                  }</span>
                  <span class="kanban-column-count">${
                    grouped[status].length
                  }</span>
              </div>
              <div class="kanban-cards">
                  ${
                    grouped[status].length > 0
                      ? grouped[status]
                          .map(
                            (machine) => `
                          <div class="kanban-card-item ${
                            machine.status
                          }" data-id="${machine.id}">
                              <div class="kanban-card-header">
                                  <div class="kanban-card-name">${
                                    machine.name
                                  }</div>
                                  <div class="kanban-card-id">${
                                    machine.id
                                  }</div>
                              </div>
                              <div class="kanban-card-info">
                                  <div class="kanban-card-info-row">
                                      <span class="kanban-card-info-label">Order:</span>
                                      <span class="kanban-card-info-value">${
                                        machine.currentOrder || "N/A"
                                      }</span>
                                  </div>
                                  <div class="kanban-card-info-row">
                                      <span class="kanban-card-info-label">Output:</span>
                                      <span class="kanban-card-info-value">${
                                        machine.output
                                      } units</span>
                                  </div>
                                  <div class="kanban-card-info-row">
                                      <span class="kanban-card-info-label">Efficiency:</span>
                                      <span class="kanban-card-info-value">${
                                        machine.efficiency
                                      }%</span>
                                  </div>
                              </div>
                          </div>
                      `
                          )
                          .join("")
                      : '<div class="kanban-empty">No machines</div>'
                  }
              </div>
          </div>
      `
      )
      .join("");

    board.querySelectorAll(".kanban-card-item").forEach((card) => {
      card.addEventListener("click", () => {
        const machineId = card.dataset.id;
        this.showMachineDetails(machineId);
      });
    });
  },

  renderProductionStats() {
    const stats = Store.getStats();

    document.getElementById("total-output").textContent =
      stats.totalOutput.toLocaleString();
    document.getElementById("overall-efficiency").textContent =
      stats.avgEfficiency + "%";
    document.getElementById("active-machines").textContent = stats.running;
    document.getElementById("total-machines").textContent = stats.total;
  },

  showMachineDetails(machineId) {
    const machine = Store.getMachineById(machineId);
    if (machine) {
      document.getElementById("nav-machines").click();

      setTimeout(() => {
        const row = document.querySelector(`tr[data-id="${machineId}"]`);
        if (row) {
          row.classList.add("highlight-row");
          row.scrollIntoView({ behavior: "smooth", block: "center" });

          setTimeout(() => {
            row.classList.remove("highlight-row");
          }, 2000);
        }
      }, 100);
    }
  },

  startRealTimeSimulation() {
    // Update every 3 seconds
    this.updateInterval = setInterval(() => {
      this.simulateRealTimeUpdates();
    }, 3000);
  },

  simulateRealTimeUpdates() {
    const machines = Store.getAllMachines();

    machines.forEach((machine) => {
      if (machine.status === "running") {
        const updates = {};

        const outputIncrease = Math.floor(Math.random() * 10) + 1;
        updates.output = machine.output + outputIncrease;

        const efficiencyChange = Math.floor(Math.random() * 5) - 2;
        updates.efficiency = Math.max(
          0,
          Math.min(100, machine.efficiency + efficiencyChange)
        );

        if (Math.random() < 0.05) {
          const possibleStatuses = ["running", "idle", "error"];
          updates.status =
            possibleStatuses[
              Math.floor(Math.random() * possibleStatuses.length)
            ];

          if (updates.status !== "running") {
            updates.currentOrder = "";
          }
        }

        Store.updateMachine(machine.id, updates);
      }
    });

    this.animateUpdate();
  },

  animateUpdate() {
    const kpiCards = document.querySelectorAll(".animate-element");
    kpiCards.forEach((card) => {
      card.classList.add("updating");
      setTimeout(() => card.classList.remove("updating"), 1000);
    });
  },

  stopRealTimeSimulation() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  },
};
