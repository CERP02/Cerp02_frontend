import { ReactNode } from "react";

// Base URL for all API requests — reads from environment variable or falls back to localhost
export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// getToken reads the JWT token stored in the browser's localStorage after login
function getToken(): string | null {
  // Return null if running on the server side where localStorage doesn't exist
  if (typeof window === "undefined") return null;
  // Retrieve the token stored under the key "cerp_token"
  return localStorage.getItem("cerp_token");
}

// request is a generic helper that wraps fetch with auth headers and error handling
async function request<T>(
  // The API path to call e.g. "/incidents"
  path: string,
  // Optional fetch options like method, body etc.
  options: RequestInit = {}
): Promise<T> {
  // Get the stored JWT token to attach to the request
  const token = getToken();

  // Make the HTTP request to the backend API
  const res = await fetch(`${API_BASE}${path}`, {
    // Spread any caller-provided options (method, body etc.)
    ...options,
    headers: {
      // Always send JSON content type
      "Content-Type": "application/json",
      // Attach the Bearer token if the user is logged in
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      // Allow callers to override or add extra headers
      ...(options.headers || {}),
    },
  });

  // Parse the JSON response body
  const data = await res.json();

  // If the response status is not 2xx, throw an error with the server's message
  if (!res.ok) {
    throw new Error(data.error || "API request failed");
  }

  // Return the parsed data cast to the expected type
  return data as T;
}

// ── Auth Types ────────────────────────────────────────────────────────────────

// AuthUser represents the logged-in user's profile data
export interface AuthUser {
  // Unique user ID from the database
  id: string;
  // User's full name
  name: string;
  // User's email address used to log in
  email: string;
  // Role determines what the user can do — user, responder, admin, or superadmin
  role: "user" | "responder" | "admin" | "superadmin";
  // The Kasoa town the user is based in (optional)
  region: string | null;
}

// AuthResponse is what the server returns after a successful login or register
export interface AuthResponse {
  // Confirmation message from the server
  message: string;
  // JWT token to store and send with future requests
  token: string;
  // The user's profile data
  user: AuthUser;
}

// ── Auth Functions ────────────────────────────────────────────────────────────

// register creates a new user account and stores the returned JWT token
export async function register(payload: {
  // Full name of the new user
  name: string;
  // Email address used to log in
  email: string;
  // Plain text password — hashed on the server
  password: string;
  // Role defaults to user unless specified
  role?: string;
  // Optional Kasoa town the user is in
  region?: string;
}): Promise<AuthResponse> {
  // POST the registration data to the backend
  const data = await request<AuthResponse>("/auth/register", {
    method: "POST",
    // Convert the payload object to a JSON string
    body: JSON.stringify(payload),
  });
  // Store the returned token in localStorage for future requests
  localStorage.setItem("cerp_token", data.token);
  // Return the full response including user profile
  return data;
}

// login authenticates an existing user and stores the JWT token
export async function login(payload: {
  // Email address to log in with
  email: string;
  // Password to verify against the stored hash
  password: string;
}): Promise<AuthResponse> {
  // POST login credentials to the backend
  const data = await request<AuthResponse>("/auth/login", {
    method: "POST",
    // Serialize the email and password to JSON
    body: JSON.stringify(payload),
  });
  // Store the token so the user stays logged in across pages
  localStorage.setItem("cerp_token", data.token);
  // Return the full response so the UI can update with user info
  return data;
}

// forgotPassword initiates a password reset by sending a request to the backend
export async function forgotPassword(email: string): Promise<{ message: string; token?: string }> {
  return request<{ message: string; token?: string }>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

// resetPassword uses a valid token to update a user's password
export async function resetPassword(payload: {
  token: string;
  newPassword: string;
}): Promise<{ message: string }> {
  return request<{ message: string }>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// logout removes the stored token, effectively ending the user's session
export function logout(): void {
  // Remove the token from localStorage — user must log in again to get a new one
  localStorage.removeItem("cerp_token");
}

// getMe fetches the currently logged-in user's profile from the server
export async function getMe(): Promise<{ user: AuthUser }> {
  // GET /auth/me — the token is automatically attached by the request helper
  return request<{ user: AuthUser }>("/auth/me");
}

// getUsers fetches all platform users for superadmin management
export async function getUsers(): Promise<{ users: AuthUser[] }> {
  return request<{ users: AuthUser[] }>("/users");
}

// updateUser updates a user's role or region
export async function updateUser(
  id: string,
  payload: { role?: string; region?: string }
): Promise<{ message: string; user: AuthUser }> {
  return request(`/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

// deleteUser removes a user account from the system
export async function deleteUser(id: string): Promise<{ message: string }> {
  return request(`/users/${id}`, {
    method: "DELETE",
  });
}

// ── Incident Types ────────────────────────────────────────────────────────────

// Incident represents a single community issue report as returned by the backend API
export interface Incident {
  // Unique database ID for this incident
  id: string;
  // Category of the issue (matching IssueType in lib/types.ts)
  type: string;
  // Free-text description of what happened
  description: string;
  // Address or landmark of the incident
  location_text: string;
  // GPS latitude — null if citizen did not share location
  latitude: number | null;
  // GPS longitude — null if citizen did not share location
  longitude: number | null;
  // Which Kasoa community town this occurred in
  region: string;
  // How critical the incident is
  severity: string;
  // Current stage in the response workflow
  status: string;
  // Agency assigned to respond — null if not yet dispatched
  assigned_agency: string | null;
  // ID of the user who reported this incident
  reported_by: string | null;
  // Name of the reporter (joined from the users table)
  reporter_name: string | null;
  // Array of URLs pointing to uploaded photos or videos
  media_urls: string[];
  // ISO timestamp of when the incident was created
  created_at: string;
  // ISO timestamp of the last update to this incident
  updated_at: string;
}

// IncidentsResponse wraps the list of incidents with pagination metadata
export interface IncidentsResponse {
  // Array of incident records
  incidents: Incident[];
  // Total number of incidents matching the current filters
  total: number;
  // How many records were requested per page
  limit: number;
  // How many records were skipped (for pagination)
  offset: number;
}

// ── Incident Functions ────────────────────────────────────────────────────────

// getIncidents fetches a filtered, paginated list of incidents from the API
export async function getIncidents(filters?: {
  // Filter by incident type e.g. "flood"
  type?: string;
  // Filter by status e.g. "new"
  status?: string;
  // Filter by Kasoa town name
  region?: string;
  // Filter by severity level
  severity?: string;
  // Maximum number of records to return
  limit?: number;
  // Number of records to skip for pagination
  offset?: number;
}): Promise<IncidentsResponse> {
  // Build a query string from the provided filters
  const params = new URLSearchParams();
  // Add each filter to the query string only if it has a value
  if (filters?.type) params.set("type", filters.type);
  if (filters?.status) params.set("status", filters.status);
  if (filters?.region) params.set("region", filters.region);
  if (filters?.severity) params.set("severity", filters.severity);
  if (filters?.limit) params.set("limit", String(filters.limit));
  if (filters?.offset) params.set("offset", String(filters.offset));

  // Append the query string to the URL if any filters were set
  const query = params.toString() ? `?${params.toString()}` : "";
  // GET the incidents list from the backend
  return request<IncidentsResponse>(`/incidents${query}`);
}

// getIncident fetches a single incident by its ID including its response logs
export async function getIncident(
  // The UUID of the incident to retrieve
  id: string
): Promise<{ incident: Incident; logs: unknown[] }> {
  // GET /incidents/:id from the backend
  return request(`/incidents/${id}`);
}

// createIncident submits a new emergency report to the backend
export async function createIncident(payload: {
  // Type of emergency being reported
  type: string;
  // Description of what is happening
  description: string;
  // Address or landmark of the incident
  location_text: string;
  // GPS latitude — optional if citizen declines location sharing
  latitude?: number;
  // GPS longitude — optional
  longitude?: number;
  // Which Kasoa town the incident is in
  region: string;
  // Default to low severity — admin can upgrade after review
  severity?: string;
  // Optional array of media file URLs
  media_urls?: string[];
}): Promise<{ message: string; incident: Incident }> {
  // POST the new incident to the backend — requires a valid JWT token
  return request("/incidents", {
    method: "POST",
    // Serialize the incident data to JSON
    body: JSON.stringify(payload),
  });
}

// updateIncident allows admins and responders to change status, severity, or agency
export async function updateIncident(
  // The UUID of the incident to update
  id: string,
  payload: {
    // New status to set e.g. "dispatched"
    status?: string;
    // New severity level if reclassified
    severity?: string;
    // Name of the agency being assigned
    assigned_agency?: string;
  }
): Promise<{ message: string; incident: Incident }> {
  // PATCH the incident — only admin/responder tokens are accepted by the server
  return request(`/incidents/${id}`, {
    method: "PATCH",
    // Serialize the update fields to JSON
    body: JSON.stringify(payload),
  });
}

// dispatchIncident is a shortcut to assign an agency and set status to dispatched
export async function dispatchIncident(
  // The UUID of the incident being dispatched
  id: string,
  // Full name of the agency being dispatched
  assigned_agency: string
): Promise<{ message: string; incident: Incident }> {
  // PATCH /incidents/:id/dispatch — admin only endpoint
  return request(`/incidents/${id}/dispatch`, {
    method: "PATCH",
    // Send the agency name in the request body
    body: JSON.stringify({ assigned_agency }),
  });
}

// deleteIncident permanently removes an incident record — admin only
export async function deleteIncident(id: string): Promise<{ message: string }> {
  // DELETE /incidents/:id — requires admin JWT token
  return request(`/incidents/${id}`, { method: "DELETE" });
}

// ── Alert Types ───────────────────────────────────────────────────────────────

// Alert represents a broadcast message sent to citizens in a specific area
export interface Alert {
  // Unique database ID for this alert
  id: string;
  // Short title displayed in the alert notification
  title: string;
  // Full text of the alert message
  message: string;
  // Which Kasoa town or "All Towns" this alert targets
  target_region: string;
  // Optional radius in km for geo-fenced alerts
  radius_km: number | null;
  // Which delivery channels were used — sms, push, web
  channels: string[];
  // ID of the admin who sent this alert
  issued_by: string;
  // Full name of the admin who sent it (joined from users table)
  issuer_name: string;
  // ISO timestamp of when the alert was broadcast
  created_at: string;
}

// ── Alert Functions ───────────────────────────────────────────────────────────

// getAlerts fetches the list of broadcast alerts optionally filtered by town
export async function getAlerts(filters?: {
  // Filter alerts by target Kasoa town
  region?: string;
  // Maximum number of alerts to return
  limit?: number;
  // Number of alerts to skip for pagination
  offset?: number;
}): Promise<{ alerts: Alert[] }> {
  // Build query string from filters
  const params = new URLSearchParams();
  // Add town filter if provided
  if (filters?.region) params.set("region", filters.region);
  if (filters?.limit) params.set("limit", String(filters.limit));
  if (filters?.offset) params.set("offset", String(filters.offset));

  // Append query string if any filters exist
  const query = params.toString() ? `?${params.toString()}` : "";
  // GET the alerts list from the backend
  return request<{ alerts: Alert[] }>(`/alerts${query}`);
}

// createAlert broadcasts a new emergency alert — admin only
export async function createAlert(payload: {
  // Short title for the notification
  title: string;
  // Full message text
  message: string;
  // Target Kasoa town or "All Towns"
  target_region?: string;
  // Optional geo-fence radius in kilometres
  radius_km?: number;
  // Delivery channels to use
  channels?: string[];
}): Promise<{ message: string; alert: Alert }> {
  // POST to the alerts endpoint — requires admin JWT token
  return request("/alerts", {
    method: "POST",
    // Serialize the alert data to JSON
    body: JSON.stringify(payload),
  });
}

// deleteAlert removes an alert record — admin only
export async function deleteAlert(id: string): Promise<{ message: string }> {
  // DELETE /alerts/:id — requires admin JWT token
  return request(`/alerts/${id}`, { method: "DELETE" });
}
