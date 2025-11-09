const Machines = {
  currentEditId: null,
  deleteTargetId: null,
  dialog: null,
  deleteDialog: null,

  init() {
    this.dialog = document.getElementById("machine-dialog");
    this.deleteDialog = document.getElementById("delete-dialog");

    this.renderTable();
    Store.subscribe(() => this.renderTable());
    this.setupEventListeners();
  },

  setupEventListeners() {
    document.getElementById("add-machine-btn").addEventListener("click", () => {
      this.openAddDialog();
    });

    document
      .getElementById("save-machine-btn")
      .addEventListener("click", () => {
        this.saveMachine();
      });

    document
      .getElementById("cancel-machine-btn")
      .addEventListener("click", () => {
        this.dialog.hide();
      });

    document
      .getElementById("confirm-delete-btn")
      .addEventListener("click", () => {
        this.confirmDelete();
      });

    document
      .getElementById("cancel-delete-btn")
      .addEventListener("click", () => {
        this.deleteDialog.hide();
      });
  },

  renderTable() {
    const machines = Store.getAllMachines();
    const tbody = document.getElementById("machines-tbody");

    tbody.innerHTML = machines
      .map(
        (machine) => `
          <tr data-id="${machine.id}">
              <td>${machine.id}</td>
              <td><strong>${machine.name}</strong></td>
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
                      <sl-button 
                          variant="text" 
                          size="small"
                          class="edit-btn" 
                          data-id="${machine.id}">
                          <sl-icon slot="prefix" name="pencil"></sl-icon>
                          Edit
                      </sl-button>
                      <sl-button 
                          variant="text" 
                          size="small"
                          class="delete-btn" 
                          data-id="${machine.id}">
                          <sl-icon slot="prefix" name="trash"></sl-icon>
                          Delete
                      </sl-button>
                  </div>
              </td>
          </tr>
      `
      )
      .join("");

    tbody.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.currentTarget.getAttribute("data-id");
        this.openEditDialog(id);
      });
    });

    tbody.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.currentTarget.getAttribute("data-id");
        this.openDeleteDialog(id);
      });
    });
  },

  openAddDialog() {
    this.currentEditId = null;
    this.dialog.label = "Add Machine";

    document.getElementById("machine-name").value = "";
    document.getElementById("machine-status").value = "running";
    document.getElementById("machine-order").value = "";
    document.getElementById("machine-output").value = "0";
    document.getElementById("machine-efficiency").value = "85";

    this.dialog.show();
  },

  openEditDialog(id) {
    const machine = Store.getMachineById(id);
    if (!machine) return;

    this.currentEditId = id;
    this.dialog.label = "Edit Machine";

    document.getElementById("machine-name").value = machine.name;
    document.getElementById("machine-status").value = machine.status;
    document.getElementById("machine-order").value = machine.currentOrder || "";
    document.getElementById("machine-output").value = machine.output;
    document.getElementById("machine-efficiency").value = machine.efficiency;

    this.dialog.show();
  },

  openDeleteDialog(id) {
    const machine = Store.getMachineById(id);
    if (!machine) return;

    this.deleteTargetId = id;
    document.getElementById(
      "delete-message"
    ).textContent = `Are you sure you want to delete "${machine.name}"? This action cannot be undone.`;

    this.deleteDialog.show();
  },

  confirmDelete() {
    if (this.deleteTargetId) {
      const machine = Store.getMachineById(this.deleteTargetId);
      const machineName = machine ? machine.name : "Machine";

      Store.deleteMachine(this.deleteTargetId);
      this.showToast(
        "success",
        `${machineName} has been deleted successfully.`
      );

      this.deleteDialog.hide();
      this.deleteTargetId = null;
    }
  },

  saveMachine() {
    const name = document.getElementById("machine-name").value.trim();
    const status = document.getElementById("machine-status").value;
    const currentOrder = document.getElementById("machine-order").value.trim();
    const output =
      parseInt(document.getElementById("machine-output").value) || 0;
    const efficiency =
      parseInt(document.getElementById("machine-efficiency").value) || 0;

    if (!name) {
      this.showToast("danger", "Machine name is required.");
      return;
    }

    if (efficiency < 0 || efficiency > 100) {
      this.showToast("danger", "Efficiency must be between 0 and 100.");
      return;
    }

    const machineData = {
      name,
      status,
      currentOrder,
      output,
      efficiency,
    };

    if (this.currentEditId) {
      Store.updateMachine(this.currentEditId, machineData);
      this.showToast("success", `${name} has been updated successfully.`);
    } else {
      Store.addMachine(machineData);
      this.showToast("success", `${name} has been added successfully.`);
    }

    this.dialog.hide();
  },

  showToast(variant, message) {
    const alert = Object.assign(document.createElement("sl-alert"), {
      variant: variant,
      closable: true,
      duration: 3000,
      innerHTML: `
              <sl-icon name="${this.getIconForVariant(
                variant
              )}" slot="icon"></sl-icon>
              ${message}
          `,
    });

    document.body.append(alert);
    alert.toast();
  },

  getIconForVariant(variant) {
    const icons = {
      success: "check-circle",
      danger: "exclamation-triangle",
      warning: "exclamation-triangle",
      primary: "info-circle",
    };
    return icons[variant] || "info-circle";
  },
};
