// Import the Incident and Agency types from the local types file
import type { Incident, Agency } from "./types";

// INCIDENT_CATEGORIES defines the three emergency types the platform handles
// Each category has a type key, display label, emoji icon, color codes, responsible agency, and description
export const INCIDENT_CATEGORIES = [
  {
    // Flood category — triggers Disaster Management Agency dispatch
    type: "flood" as const,
    // Label shown to the user in the UI
    label: "Flood",
    // Emoji displayed on the incident type button
    emoji: "🌊",
    // Primary color used for flood incident markers and borders
    color: "#2e86ff",
    // Semi-transparent version of the color used for backgrounds
    dimColor: "rgba(46,134,255,0.12)",
    // The agency that gets dispatched when a flood is reported
    agency: "Disaster Management Agency (NADMO)",
    // Short description shown on the incident type card
    description:
      "Report rising water levels, flash floods, and drainage failures. GPS pinpointing helps responders reach Kasoa communities fast.",
  },
  {
    // Fire category — triggers Ghana Fire Service dispatch
    type: "fire" as const,
    // Label shown in the UI
    label: "Fire",
    // Emoji displayed on the incident type button
    emoji: "🔥",
    // Primary color used for fire incident markers and borders
    color: "#ff3b3b",
    // Semi-transparent background version of red
    dimColor: "rgba(255,59,59,0.12)",
    // The agency that handles fire incidents in Kasoa
    agency: "Ghana Fire Service",
    // Short description shown on the incident type card
    description:
      "Urban blazes and wildfires — every minute matters. Automatic dispatch to the nearest fire service unit in the Kasoa area.",
  },
  {
    // Road Accident category — triggers Road Safety and Ambulance dispatch
    type: "accident" as const,
    // Label shown in the UI
    label: "Road Accident",
    // Emoji displayed on the incident type button
    emoji: "🚗",
    // Primary color used for accident markers and borders
    color: "#ff8c00",
    // Semi-transparent background version of orange
    dimColor: "rgba(255,140,0,0.12)",
    // Both road safety and ambulance are dispatched for accidents
    agency: "Road Safety Authority + Ambulance",
    // Short description shown on the incident type card
    description:
      "Vehicle collisions, road blockages, and traffic emergencies. Dual dispatch ensures both road safety and medical response in Kasoa.",
  },
];

// KASOA_TOWNS replaces the old national REGIONS list
// These are the specific towns and communities within the Kasoa area that CERP covers
export const KASOA_TOWNS = [
  // The main Kasoa town centre
  "Kasoa Central",
  // Akweley area within the Kasoa community
  "Akweley",
  // Opeikuma town within Greater Kasoa
  "Opeikuma",
  // Millennium City housing development area
  "Millennium City",
  // Lamptey Mills community area
  "Lamptey Mills",
  // Ofaakor town near Kasoa
  "Ofaakor",
  // Gomoa Pomadze community
  "Gomoa Pomadze",
  // Bawjiase town within the Kasoa catchment
  "Bawjiase",
  // Nyanyano fishing community near Kasoa
  "Nyanyano",
  // Awutu Bereku — district capital near Kasoa
  "Awutu Bereku",
];

// MOCK_INCIDENTS is sample data used when the real backend is not yet connected
// In production these are loaded from the PostgreSQL database via the API
export const MOCK_INCIDENTS: Incident[] = [
  {
    // Unique identifier for this incident record
    id: "INC-001",
    // Type of emergency — fire in this case
    type: "fire",
    // Human-readable title describing the incident
    title: "Structure fire — Kasoa Market",
    // The street address or landmark of the incident
    location: "Kasoa Central Market, Kasoa",
    // The specific Kasoa town where this occurred
    region: "Kasoa Central",
    // How serious this incident is rated by the admin
    severity: "critical",
    // Current status in the dispatch workflow
    status: "dispatched",
    // Brief description of what is happening
    description: "Large market stall fire spreading to adjacent structures.",
    // GPS latitude coordinate of the incident
    latitude: 5.533,
    // GPS longitude coordinate of the incident
    longitude: -0.418,
    // How long ago this was reported (relative timestamp)
    createdAt: "3 min ago",
    // The agency that has been assigned to respond
    assignedAgency: "Ghana Fire Service — Kasoa",
  },
  {
    id: "INC-002",
    type: "flood",
    title: "Flash flood — Millennium City",
    location: "Millennium City, Kasoa",
    region: "Millennium City",
    severity: "moderate",
    status: "new",
    description: "Rapid water accumulation blocking the main access road.",
    latitude: 5.548,
    longitude: -0.424,
    createdAt: "8 min ago",
    // No agency assigned yet as status is still 'new'
  },
  {
    id: "INC-003",
    type: "accident",
    title: "Multi-vehicle collision — Kasoa-Winneba Rd",
    location: "Kasoa-Winneba Road, Ofaakor",
    region: "Ofaakor",
    severity: "moderate",
    status: "dispatched",
    description: "Three vehicles involved, one lane blocked.",
    latitude: 5.527,
    longitude: -0.432,
    createdAt: "14 min ago",
    assignedAgency: "Road Safety Authority",
  },
  {
    id: "INC-004",
    type: "flood",
    title: "Drainage overflow — Opeikuma",
    location: "Opeikuma Junction, Kasoa",
    region: "Opeikuma",
    severity: "low",
    status: "resolved",
    description: "Stormwater drain overflowing onto main road after heavy rain.",
    latitude: 5.541,
    longitude: -0.411,
    createdAt: "22 min ago",
    assignedAgency: "NADMO",
  },
  {
    id: "INC-005",
    type: "fire",
    title: "Building fire — Lamptey Mills",
    location: "Lamptey Mills Estate, Kasoa",
    region: "Lamptey Mills",
    severity: "critical",
    status: "dispatched",
    description: "Residential building fire with occupants still inside.",
    latitude: 5.538,
    longitude: -0.427,
    createdAt: "35 min ago",
    assignedAgency: "Ghana Fire Service",
  },
  {
    id: "INC-006",
    type: "accident",
    title: "Tanker accident — Bawjiase Road",
    location: "Bawjiase Road, Akweley",
    region: "Akweley",
    severity: "critical",
    status: "resolved",
    description: "Fuel tanker overturned, road fully blocked.",
    latitude: 5.556,
    longitude: -0.415,
    createdAt: "51 min ago",
    assignedAgency: "Road Safety + Ghana Fire Service",
  },
];

// MOCK_AGENCIES lists the emergency response agencies that serve the Kasoa community
export const MOCK_AGENCIES: Agency[] = [
  // Ghana Fire Service handles all fire-related incidents
  { id: "A1", name: "Ghana Fire Service", type: "fire", coverageArea: "Kasoa Community" },
  // NADMO handles flood and natural disaster incidents
  { id: "A2", name: "NADMO", type: "disaster", coverageArea: "Kasoa Community" },
  // Road Safety Authority handles traffic and road accident incidents
  { id: "A3", name: "Road Safety Authority", type: "road", coverageArea: "Kasoa Community" },
  // National Ambulance Service handles medical emergencies alongside accidents
  { id: "A4", name: "National Ambulance Service", type: "medical", coverageArea: "Kasoa Community" },
];

// WORKFLOW_STEPS describes the 5-stage process from report submission to resolution
export const WORKFLOW_STEPS = [
  // Step 1 — the citizen submits a report via the platform
  { number: 1, title: "Report Submitted", desc: "Community member files incident with GPS + media" },
  // Step 2 — an admin reviews and verifies the report is genuine
  { number: 2, title: "Admin Review", desc: "Command center verifies and classifies severity" },
  // Step 3 — the system assigns the appropriate agency based on incident type
  { number: 3, title: "Agency Assigned", desc: "Nearest agency auto-assigned by incident type" },
  // Step 4 — the assigned responder accepts and travels to the scene
  { number: 4, title: "En Route", desc: "Responder accepts dispatch and updates status" },
  // Step 5 — the incident is marked resolved and logged with a timestamp
  { number: 5, title: "Incident Resolved", desc: "Closure logged with response time recorded" },
];

// KPI_DATA holds the key performance metrics displayed on the platform dashboard
export const KPI_DATA = [
  // Average time between a citizen submitting a report and an agency being dispatched
  { value: "4.2", unit: "min", label: "Avg. Report to Dispatch", trend: "+18% faster", up: true },
  // Average time for a responder to arrive at the scene after dispatch
  { value: "11.7", unit: "min", label: "Avg. Response Time", trend: "+9% improvement", up: true },
  // Percentage of submitted reports that are genuine vs false alarms
  { value: "89", unit: "%", label: "Verified vs False Reports", trend: "Accuracy rising", up: true },
  // Percentage of time the platform is operational and accessible
  { value: "99.8", unit: "%", label: "System Uptime", trend: "Within SLA", up: true },
];

// ROADMAP_PHASES outlines the three deployment phases for the CERP platform
export const ROADMAP_PHASES = [
  {
    // Phase number displayed as a badge
    number: "01",
    // Phase title shown as the card heading
    title: "Phase 1 — Core Launch",
    // Estimated timeline for completing this phase
    timeline: "(3–6 months)",
    // Description of what this phase delivers
    description:
      "Stand up the essential reporting and dispatch infrastructure for community deployment in Kasoa.",
    // List of features to be delivered in this phase
    tags: [
      "Citizen web reporting",
      "Admin dashboard",
      "Community live map",
      "Basic dispatch tracking",
      "SMS alert integration",
    ],
  },
  {
    number: "02",
    title: "Phase 2 — Mobile & Intelligence",
    timeline: "",
    description:
      "Dedicated native apps and smarter dispatch logic based on geolocation and agency capacity within Kasoa.",
    tags: [
      "iOS & Android apps",
      "Auto nearest-agency assignment",
      "Performance analytics dashboard",
      "Offline responder mode",
    ],
  },
  {
    number: "03",
    title: "Phase 3 — AI & Predictive Systems",
    timeline: "",
    description:
      "Machine learning and local data feeds to anticipate emergencies in the Kasoa community before they escalate.",
    tags: [
      "AI duplicate detection",
      "Predictive flood risk modeling",
      "Fire risk forecasting",
      "Weather API integration",
      "Traffic system integration",
    ],
  },
];
