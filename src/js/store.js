const Store = {
  machines: [],
  listeners: [],

  init(initialData) {
    this.machines = [...initialData];
    this.notify();
  },

  getAllMachines() {
    return [...this.machines];
  },

  getMachineById(id) {
    return this.machines.find((m) => m.id === id);
  },

  addMachine(machine) {
    // Generate ID
    const maxId = this.machines.reduce((max, m) => {
      const num = parseInt(m.id.substring(1));
      return num > max ? num : max;
    }, 0);

    machine.id = `M${String(maxId + 1).padStart(3, "0")}`;
    this.machines.push(machine);
    this.notify();
    return machine;
  },

  updateMachine(id, updates) {
    const index = this.machines.findIndex((m) => m.id === id);
    if (index !== -1) {
      this.machines[index] = { ...this.machines[index], ...updates };
      this.notify();
      return this.machines[index];
    }
    return null;
  },

  deleteMachine(id) {
    const index = this.machines.findIndex((m) => m.id === id);
    if (index !== -1) {
      this.machines.splice(index, 1);
      this.notify();
      return true;
    }
    return false;
  },

  getStats() {
    const stats = {
      total: this.machines.length,
      running: 0,
      idle: 0,
      maintenance: 0,
      error: 0,
      totalOutput: 0,
      avgEfficiency: 0,
    };

    this.machines.forEach((machine) => {
      stats[machine.status]++;
      stats.totalOutput += machine.output || 0;
      stats.avgEfficiency += machine.efficiency || 0;
    });

    if (stats.total > 0) {
      stats.avgEfficiency = Math.round(stats.avgEfficiency / stats.total);
    }

    return stats;
  },

  subscribe(callback) {
    this.listeners.push(callback);
  },

  notify() {
    this.listeners.forEach((callback) => callback());
  },
};
