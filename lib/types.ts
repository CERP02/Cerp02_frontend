// IssueType restricts community issue categories to the ten types CERP handles
export type IssueType =
  | "traffic_congestion"    // Traffic jams requiring police direction
  | "burst_water_pipe"      // Water pipe leaks needing GWCL
  | "electrical_fault"      // Power issues needing ECG
  | "weak_bridge"           // Compromised bridges needing GHA
  | "pothole_bad_road"      // Road damage needing repair
  | "illegal_dumping"       // Waste issues needing Zoomlion
  | "streetlight_outage"    // Broken lights needing ECG
  | "open_manhole"          // Uncovered manholes needing HSD
  | "noise_complaint"       // Noise needing police
  | "other";                // General issues for Municipal Assembly

// SeverityLevel represents how urgent a community issue is rated by the admin
export type SeverityLevel = "low" | "moderate" | "critical";

// IssueStatus tracks which stage of the resolution workflow an issue is in
export type IssueStatus = "new" | "assigned" | "in_progress" | "resolved";

// Incident is the main data shape for a community issue reported by a citizen
export interface Incident {
  // Unique identifier for the issue record
  id: string;
  // Category of community issue
  type: IssueType;
  // Human-readable title describing the issue
  title: string;
  // Street address or landmark where the issue was observed
  location: string;
  // The specific Kasoa community town where the issue was observed
  region: string;
  // How urgent the issue is — set by admin after review
  severity: SeverityLevel;
  // Current stage in the resolution workflow
  status: IssueStatus;
  // Longer description of the community issue
  description: string;
  // GPS latitude coordinate — used to place marker on the map
  latitude: number;
  // GPS longitude coordinate — used to place marker on the map
  longitude: number;
  // Human-readable timestamp showing when the issue was reported
  createdAt: string;
  // Name of the agency assigned to handle the issue — undefined if not yet assigned
  assignedAgency?: string;
}

// Agency represents a government or utility agency serving the Kasoa area
export interface Agency {
  // Unique identifier for the agency
  id: string;
  // Full name of the agency shown in dropdowns and logs
  name: string;
  // The category of community issues this agency handles
  type: "police" | "water" | "electricity" | "roads" | "sanitation" | "drainage" | "general";
  // The geographic area this agency is responsible for
  coverageArea: string;
}
