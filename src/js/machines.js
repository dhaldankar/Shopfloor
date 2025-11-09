// Machine management functionality
const Machines = {
  currentEditId: null,

  // Initialize machines view
  init() {
    this.renderTable();
    Store.subscribe(() => this.renderTable());
    this.setupEventListeners();
  },

  // Setup event listeners
  setupEventListeners() {
    // Add machine button
    document.getElementById("add-machine-btn").addEventListener("click", () => {
      this.openAddModal();
    });

    // Save machine button
    document
      .getElementById("save-machine-btn")
      .addEventListener("click", () => {
        this.saveMachine();
      });

    // Modal close buttons
    document.querySelectorAll("[data-modal-close]").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.closeModal();
      });
    });
  },

  // Render machines table
  renderTable() {
    const machines = Store.getAllMachines();
    const tbody = document.getElementById("machines-tbody");

    tbody.innerHTML = machines
      .map(
        (machine) => `
            <tr data-id="${machine.id}">
                <td>${machine.id}</td>
                <td>${machine.name}</td>
                <td>
                    <span class="status-badge ${machine.status}">
                        ${STATUS_LABELS[machine.status]}
                    </span>
                </td>
                <td>${machine.currentOrder || "-"}</td>
                <td>${machine.output}</td>
                <td>${machine.efficiency}%</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon edit" data-id="${machine.id}" 
                                title="Edit">✏️</button>
                        <button class="btn-icon delete" data-id="${machine.id}" 
                                title="Delete">🗑️</button>
                    </div>
                </td>
            </tr>
        `
      )
      .join("");

    // Add event listeners to action buttons
    tbody.querySelectorAll(".btn-icon.edit").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        this.openEditModal(id);
      });
    });

    tbody.querySelectorAll(".btn-icon.delete").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        this.deleteMachine(id);
      });
    });
  },

  // Open modal for adding machine
  openAddModal() {
    this.currentEditId = null;
    document.getElementById("modal-title").textContent = "Add Machine";
    document.getElementById("machine-form").reset();
    document.getElementById("machine-modal").setAttribute("open", "");
  },

  // Open modal for editing machine
  openEditModal(id) {
    const machine = Store.getMachineById(id);
    if (!machine) return;

    this.currentEditId = id;
    document.getElementById("modal-title").textContent = "Edit Machine";

    // Populate form
    document.getElementById("machine-name").value = machine.name;
    document.getElementById("machine-status").value = machine.status;
    document.getElementById("machine-order").value = machine.currentOrder || "";
    document.getElementById("machine-output").value = machine.output;
    document.getElementById("machine-efficiency").value = machine.efficiency;

    document.getElementById("machine-modal").setAttribute("open", "");
  },

  // Close modal
  closeModal() {
    document.getElementById("machine-modal").removeAttribute("open");
    document.getElementById("machine-form").reset();
    this.currentEditId = null;
  },

  // Save machine (add or update)
  saveMachine() {
    const form = document.getElementById("machine-form");

    // Validate form
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // Get form data
    const machineData = {
      name: document.getElementById("machine-name").value.trim(),
      status: document.getElementById("machine-status").value,
      currentOrder: document.getElementById("machine-order").value.trim(),
      output: parseInt(document.getElementById("machine-output").value) || 0,
      efficiency:
        parseInt(document.getElementById("machine-efficiency").value) || 0,
    };

    // Validate efficiency range
    if (machineData.efficiency < 0 || machineData.efficiency > 100) {
      this.showNotification("Efficiency must be between 0 and 100", "error");
      return;
    }

    // Add or update
    if (this.currentEditId) {
      Store.updateMachine(this.currentEditId, machineData);
      this.showNotification("Machine updated successfully", "success");
    } else {
      Store.addMachine(machineData);
      this.showNotification("Machine added successfully", "success");
    }

    this.closeModal();
  },

  // Delete machine
  deleteMachine(id) {
    const machine = Store.getMachineById(id);
    if (!machine) return;

    if (confirm(`Are you sure you want to delete ${machine.name}?`)) {
      Store.deleteMachine(id);
      this.showNotification("Machine deleted successfully", "success");
    }
  },

  // Show notification
  showNotification(message, type = "success") {
    const notification = document.getElementById("notification");
    notification.textContent = message;
    notification.className = `notification ${type} show`;

    setTimeout(() => {
      notification.classList.remove("show");
    }, 3000);
  },
};
