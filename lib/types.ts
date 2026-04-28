// IncidentType restricts incident categories to the three types CERP handles
export type IncidentType = "flood" | "fire" | "accident";

// SeverityLevel represents how critical an incident is rated by the admin
export type SeverityLevel = "low" | "moderate" | "critical";

// IncidentStatus tracks which stage of the dispatch workflow an incident is in
export type IncidentStatus = "new" | "dispatched" | "resolved";

// Incident is the main data shape for an emergency report submitted by a citizen
export interface Incident {
  // Unique identifier for the incident record
  id: string;
  // Category of emergency — flood, fire, or road accident
  type: IncidentType;
  // Human-readable title describing the incident
  title: string;
  // Street address or landmark where the incident occurred
  location: string;
  // The specific Kasoa community town where the incident occurred
  region: string;
  // How serious the incident is — set by admin after review
  severity: SeverityLevel;
  // Current stage in the response workflow
  status: IncidentStatus;
  // Longer description of what is happening at the scene
  description: string;
  // GPS latitude coordinate — used to place marker on the map
  latitude: number;
  // GPS longitude coordinate — used to place marker on the map
  longitude: number;
  // Human-readable timestamp showing when the incident was reported
  createdAt: string;
  // Name of the agency assigned to respond — undefined if not yet dispatched
  assignedAgency?: string;
}

// Agency represents an emergency response organisation in the Kasoa area
export interface Agency {
  // Unique identifier for the agency
  id: string;
  // Full name of the agency shown in dropdowns and logs
  name: string;
  // The category of incident this agency handles
  type: "fire" | "road" | "disaster" | "medical";
  // The geographic area this agency is responsible for
  coverageArea: string;
}
