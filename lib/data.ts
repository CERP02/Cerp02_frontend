import type { Agency } from "./types";

/**
 * CIRP Static Data Store: Defines categories, towns, agencies, and roadmap.
 */

export const ISSUE_CATEGORIES = [
  { type: "traffic_congestion" as const, label: "Traffic Congestion", emoji: "🚦", color: "#e74c3c", dimColor: "rgba(231,76,60,0.1)", agency: "Police Service", description: "Report jams, blocked intersections, and roads needing police direction." },
  { type: "burst_water_pipe" as const, label: "Burst Water Pipe", emoji: "💧", color: "#3498db", dimColor: "rgba(52,152,219,0.1)", agency: "GWCL", description: "Report leaking pipes, low pressure, and supply disruptions." },
  { type: "electrical_fault" as const, label: "Electrical Fault", emoji: "⚡", color: "#f39c12", dimColor: "rgba(243,156,18,0.1)", agency: "ECG", description: "Report exposed wires, fallen lines, and power outages." },
  { type: "weak_bridge" as const, label: "Weak Bridge", emoji: "🌉", color: "#8e44ad", dimColor: "rgba(142,68,173,0.1)", agency: "GHA", description: "Report cracked or structurally weak bridges and footbridges." },
  { type: "pothole_bad_road" as const, label: "Pothole / Bad Road", emoji: "🕳️", color: "#d35400", dimColor: "rgba(211,84,0,0.1)", agency: "GHA", description: "Report potholes and crumbling road surfaces needing repair." },
  { type: "illegal_dumping" as const, label: "Illegal Dumping", emoji: "🗑️", color: "#27ae60", dimColor: "rgba(39,174,96,0.1)", agency: "Zoomlion", description: "Report illegal waste dumping and unsanitary conditions." },
  { type: "streetlight_outage" as const, label: "Streetlight Outage", emoji: "🔦", color: "#2c3e50", dimColor: "rgba(44,62,80,0.1)", agency: "ECG", description: "Report non-functional street lights affecting night safety." },
  { type: "open_manhole" as const, label: "Open Manhole", emoji: "🚧", color: "#16a085", dimColor: "rgba(22,160,133,0.1)", agency: "HSD", description: "Report uncovered manholes and blocked gutters." },
  { type: "noise_complaint" as const, label: "Noise Complaint", emoji: "📢", color: "#c0392b", dimColor: "rgba(192,57,43,0.1)", agency: "Police Service", description: "Report excessive noise from construction or events." },
  { type: "other" as const, label: "Other Issue", emoji: "📋", color: "#7f8c8d", dimColor: "rgba(127,140,141,0.1)", agency: "Municipal Assembly", description: "Report any other community issues not listed above." },
];

export const KASOA_TOWNS = ["Kasoa Central", "Akweley", "Opeikuma", "Millennium City", "Lamptey Mills", "Ofaakor", "Gomoa Pomadze", "Bawjiase", "Nyanyano", "Awutu Bereku"];

export const COMMUNITY_AGENCIES: Agency[] = [
  { id: "A1", name: "Ghana Police Service", type: "police", coverageArea: "Kasoa" },
  { id: "A2", name: "Ghana Water Company Ltd", type: "water", coverageArea: "Kasoa" },
  { id: "A3", name: "Electricity Company of Ghana", type: "electricity", coverageArea: "Kasoa" },
  { id: "A4", name: "Ghana Highway Authority", type: "roads", coverageArea: "Kasoa" },
  { id: "A5", name: "Zoomlion Ghana Ltd", type: "sanitation", coverageArea: "Kasoa" },
  { id: "A6", name: "Hydrological Services Dept", type: "drainage", coverageArea: "Kasoa" },
  { id: "A7", name: "Municipal Assembly", type: "general", coverageArea: "Kasoa" },
];

export const WORKFLOW_STEPS = [
  { number: 1, title: "Reported", desc: "Citizen files issue with GPS + photos" },
  { number: 2, title: "Verified", desc: "Admin confirms and classifies urgency" },
  { number: 3, title: "Assigned", desc: "Correct agency dispatched for repair" },
  { number: 4, title: "Working", desc: "Agency addresses the issue on-site" },
  { number: 5, title: "Resolved", desc: "Resolution logged and confirmed" },
];

export const KPI_DATA = [
  { value: "3.8", unit: "hrs", label: "Avg. Assignment Time", trend: "+22% faster", up: true },
  { value: "2.1", unit: "days", label: "Avg. Resolution Time", trend: "+15% better", up: true },
  { value: "91", unit: "%", label: "Verified Reports", trend: "High accuracy", up: true },
  { value: "99.8", unit: "%", label: "System Uptime", trend: "Stable", up: true },
];

export const ROADMAP_PHASES = [
  { number: "01", title: "Core Launch", timeline: "Q1-Q2 2026", description: "Deploy basic reporting and agency assignment infrastructure.", tags: ["Web Reporting", "Admin Dashboard", "Live Map", "SMS Routing"] },
  { number: "02", title: "Mobile & AI", timeline: "Q3 2026", description: "Native apps and automated smart routing based on workload.", tags: ["iOS/Android Apps", "Auto Assignment", "Analytics", "Offline Mode"] },
  { number: "03", title: "Predictive", timeline: "2027", description: "Predictive maintenance and AI-driven issue prioritization.", tags: ["AI Detection", "Predictive Alerts", "Smart Scoring", "Citizen Feedback"] },
];
