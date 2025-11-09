// Mock data for machines
const INITIAL_MACHINES = [
  {
    id: "M001",
    name: "CNC Mill 01",
    status: "running",
    currentOrder: "PO-2024-1156",
    output: 1250,
    efficiency: 92,
  },
  {
    id: "M002",
    name: "Lathe Station 02",
    status: "running",
    currentOrder: "PO-2024-1157",
    output: 890,
    efficiency: 88,
  },
  {
    id: "M003",
    name: "Welding Robot 01",
    status: "idle",
    currentOrder: "",
    output: 0,
    efficiency: 0,
  },
  {
    id: "M004",
    name: "Assembly Line A",
    status: "running",
    currentOrder: "PO-2024-1158",
    output: 2100,
    efficiency: 95,
  },
  {
    id: "M005",
    name: "Press Machine 03",
    status: "maintenance",
    currentOrder: "",
    output: 450,
    efficiency: 65,
  },
  {
    id: "M006",
    name: "Packaging Unit 01",
    status: "running",
    currentOrder: "PO-2024-1159",
    output: 1800,
    efficiency: 91,
  },
  {
    id: "M007",
    name: "Quality Station 02",
    status: "error",
    currentOrder: "PO-2024-1160",
    output: 320,
    efficiency: 45,
  },
  {
    id: "M008",
    name: "CNC Lathe 04",
    status: "running",
    currentOrder: "PO-2024-1161",
    output: 1100,
    efficiency: 89,
  },
];

// Statuses available
const MACHINE_STATUSES = ["running", "idle", "maintenance", "error"];

// Status labels
const STATUS_LABELS = {
  running: "Running",
  idle: "Idle",
  maintenance: "Maintenance",
  error: "Error",
};
