export enum View {
  ZONE_CHECK_IN = 'ZONE_CHECK_IN',
  MAINTENANCE_LOG = 'MAINTENANCE_LOG',
  DAILY_CHECKLIST = 'DAILY_CHECKLIST',
  ZONE_SURVEILLANCE = 'ZONE_SURVEILLANCE',
  INCIDENTS = 'INCIDENTS',
  SHIFT_SCHEDULE = 'SHIFT_SCHEDULE',
  CHECK_IN_LOG = 'CHECK_IN_LOG',
  ANNOUNCEMENTS = 'ANNOUNCEMENTS',
  SETTINGS = 'SETTINGS',
  FNB_DASHBOARD = 'FNB_DASHBOARD',
  RUNNER_DASHBOARD = 'RUNNER_DASHBOARD',
  SECURITY_DASHBOARD = 'SECURITY_DASHBOARD',
  HEALTH_DASHBOARD = 'HEALTH_DASHBOARD',
  EXPERIENCE_DASHBOARD = 'EXPERIENCE_DASHBOARD',
  CLEANING_DASHBOARD = 'CLEANING_DASHBOARD',
  GIFTSHOP_DASHBOARD = 'GIFTSHOP_DASHBOARD',
  EXTERNAL_MAINTENANCE_DASHBOARD = 'EXTERNAL_MAINTENANCE_DASHBOARD',
  SERVICE_DASHBOARD = 'SERVICE_DASHBOARD'
}

export enum IncidentSeverity {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export interface Incident {
  id: string;
  timestamp: Date;
  type: string;
  severity: IncidentSeverity;
  description: string;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED';
  reportedBy: string;
  arrivalTimestamp?: Date; // Added for Security Arrival Verification
  evidenceLogged?: boolean; // Added for Security Evidence Logging
  zone_id?: string; // Standardize zone linkage
}

export interface RestockTask {
  id: string;
  item: string;
  quantity: number;
  standLocation: string; // The zone requesting the restock
  status: 'PENDING' | 'IN_TRANSIT' | 'COMPLETED';
  requestedAt: Date;
  isUrgent: boolean; // True if triggered specifically by "Below Par" automation

  // New Metadata fields
  statusDetails?: string;
  action?: string;
  distanceEstimate?: string;
  zoneId?: string;
  pickedUpQuantity?: number; // Added to track quantity verified during pickup
}

export interface ZoneData {
  id: string;
  name: string;
  supervisor: string;
  shiftStart: string;
  shiftEnd: string;
}

export interface StaffMember {
  id: string;
  staff_id: string;
  name: string;
  role: string;
  current_zone_id: string | null;
  isOnShift: boolean;
  phone_number: string;
  failed_login_attempts: number;
  last_failed_login: string | null;
  locked_until: string | null;
  last_login_at: string | null;
}

export interface Alert {
  id: string;
  alert_type: 'auth_security' | 'broadcast' | 'system' | 'health_pulse';
  severity: 'low' | 'medium' | 'high' | 'critical';
  staff_id?: string;
  zone_id?: string;
  description: string;
  status: 'open' | 'resolved';
  created_at: string;
  zone_name?: string; // For joined data
}

export interface AlertAcknowledgement {
  alert_id: string;
  staff_id: string;
  acknowledged_at: string;
}

export interface CheckInRecord {
  id: string;
  staffId: string;
  name: string;
  zone: string;
  date: string;
  checkInTime: string;
  checkOutTime: string | null;
  status: 'ON TIME' | 'LATE';
}

export interface AuthResponse {
  token: string;
  staff: StaffMember;
}

export type AppMode =
  | 'OPS'
  | 'INTERNAL_MAINTENANCE'
  | 'SERVICE_CREW'
  | 'SECURITY_CREW'
  | 'HEALTH_CREW'
  | 'CLEANING_CREW'
  | 'FNB'
  | 'RUNNER'
  | 'EXPERIENCE_CREW'
  | 'GIFTSHOP_CREW'
  | 'EXTERNAL_MAINTENANCE'
  | 'UNKNOWN';

export function deriveModeFromStaff(staff: StaffMember): AppMode {
  const role = (staff.role ?? '').trim().toLowerCase();

  if (role === 'ops') return 'OPS';
  if (role === 'internal_maintenance' || role === 'internal_maintainence_crew') return 'INTERNAL_MAINTENANCE';

  if (role === 'service_crew') return 'SERVICE_CREW';
  if (role === 'security_crew') return 'SECURITY_CREW';
  if (role === 'health_crew') return 'HEALTH_CREW';
  if (role === 'cleaning_crew') return 'CLEANING_CREW';
  if (role === 'fnb_crew') return 'FNB';
  if (role === 'runner_crew') return 'RUNNER';
  if (role === 'experience_crew') return 'EXPERIENCE_CREW';
  if (role === 'giftshop_crew') return 'GIFTSHOP_CREW';
  if (role === 'external_maintenance_crew' || role === 'external_maintenance') return 'EXTERNAL_MAINTENANCE';

  if (role.includes('maintenance') || role.includes('technician')) return 'INTERNAL_MAINTENANCE';
  if (role.includes('operations')) return 'OPS';

  return 'UNKNOWN';
}

export function defaultViewForMode(mode: AppMode): View {
  switch (mode) {
    case 'OPS':
      return View.ZONE_SURVEILLANCE;
    case 'INTERNAL_MAINTENANCE':
      return View.MAINTENANCE_LOG;
    case 'SERVICE_CREW':
      return View.ZONE_CHECK_IN;
    case 'SECURITY_CREW':
      return View.ZONE_CHECK_IN; // Ensure they check in first
    case 'HEALTH_CREW':
      return View.ZONE_CHECK_IN;
    case 'CLEANING_CREW':
      return View.ZONE_CHECK_IN;
    case 'FNB':
    case 'RUNNER':
    case 'EXPERIENCE_CREW':
    case 'GIFTSHOP_CREW':
    case 'EXTERNAL_MAINTENANCE':
      return View.ZONE_CHECK_IN;
    default:
      return View.SETTINGS;
  }
}

export function allowedViewsForMode(mode: AppMode): View[] {
  switch (mode) {
    case 'OPS':
      return [
        View.ZONE_SURVEILLANCE,
        View.SHIFT_SCHEDULE,
        View.INCIDENTS,
        View.CHECK_IN_LOG,
        View.SETTINGS,
        View.ANNOUNCEMENTS
      ];
    case 'INTERNAL_MAINTENANCE':
      return [
        View.ZONE_CHECK_IN,
        View.MAINTENANCE_LOG,
        View.INCIDENTS,
        View.SETTINGS,
        View.ANNOUNCEMENTS
      ];
    case 'SERVICE_CREW':
      return [View.ZONE_CHECK_IN, View.SERVICE_DASHBOARD, View.INCIDENTS, View.SETTINGS, View.ANNOUNCEMENTS];
    case 'SECURITY_CREW':
      return [View.ZONE_CHECK_IN, View.SECURITY_DASHBOARD, View.INCIDENTS, View.ZONE_SURVEILLANCE, View.SETTINGS, View.ANNOUNCEMENTS];
    case 'HEALTH_CREW':
      return [View.ZONE_CHECK_IN, View.HEALTH_DASHBOARD, View.INCIDENTS, View.ZONE_SURVEILLANCE, View.SETTINGS, View.ANNOUNCEMENTS];
    case 'CLEANING_CREW':
      return [View.ZONE_CHECK_IN, View.CLEANING_DASHBOARD, View.INCIDENTS, View.SETTINGS, View.ANNOUNCEMENTS];
    case 'FNB':
      return [View.ZONE_CHECK_IN, View.FNB_DASHBOARD, View.DAILY_CHECKLIST, View.INCIDENTS, View.SETTINGS, View.ANNOUNCEMENTS];
    case 'RUNNER':
      return [View.ZONE_CHECK_IN, View.RUNNER_DASHBOARD, View.INCIDENTS, View.SETTINGS, View.ANNOUNCEMENTS];
    case 'EXPERIENCE_CREW':
      return [View.ZONE_CHECK_IN, View.EXPERIENCE_DASHBOARD, View.INCIDENTS, View.SETTINGS, View.ANNOUNCEMENTS];
    case 'GIFTSHOP_CREW':
      return [View.ZONE_CHECK_IN, View.GIFTSHOP_DASHBOARD, View.INCIDENTS, View.SETTINGS, View.ANNOUNCEMENTS];
    case 'EXTERNAL_MAINTENANCE':
      // Very restricted view
      return [View.ZONE_CHECK_IN, View.EXTERNAL_MAINTENANCE_DASHBOARD];
    default:
      return [View.SETTINGS];
  }
}

export function isViewAllowed(mode: AppMode, view: View): boolean {
  return allowedViewsForMode(mode).includes(view);
}
