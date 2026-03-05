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
  FNB_POS_LITE = 'FNB_POS_LITE',
  FNB_STOCK_STATUS = 'FNB_STOCK_STATUS',
  FNB_RESTOCK_REQUESTS = 'FNB_RESTOCK_REQUESTS',
  FNB_WASTE_LOG = 'FNB_WASTE_LOG',
  FNB_PREP_BATCHES = 'FNB_PREP_BATCHES',
  RUNNER_DASHBOARD = 'RUNNER_DASHBOARD',
  SECURITY_DASHBOARD = 'SECURITY_DASHBOARD',
  HEALTH_DASHBOARD = 'HEALTH_DASHBOARD',
  EXPERIENCE_DASHBOARD = 'EXPERIENCE_DASHBOARD',
  CLEANING_DASHBOARD = 'CLEANING_DASHBOARD',
  GIFTSHOP_DASHBOARD = 'GIFTSHOP_DASHBOARD',
  EXTERNAL_MAINTENANCE_DASHBOARD = 'EXTERNAL_MAINTENANCE_DASHBOARD',
  SERVICE_DASHBOARD = 'SERVICE_DASHBOARD',
  MAINTENANCE_MANAGER_DASHBOARD = 'MAINTENANCE_MANAGER_DASHBOARD',
  LOGISTICS_PO = 'LOGISTICS_PO',
  LOGISTICS_RESTOCK = 'LOGISTICS_RESTOCK',
  LOGISTICS_MANUAL = 'LOGISTICS_MANUAL',
  LOGISTICS_INCIDENT = 'LOGISTICS_INCIDENT',
  LOGISTICS_AUDIT = 'LOGISTICS_AUDIT',
  RETAIL_RECEIVING = 'RETAIL_RECEIVING',
  RETAIL_STATUS = 'RETAIL_STATUS',
  RETAIL_RESTOCK = 'RETAIL_RESTOCK',
  RETAIL_DAMAGE_LOG = 'RETAIL_DAMAGE_LOG',
  RETAIL_AUDIT = 'RETAIL_AUDIT',
  HOME = 'HOME'
}

export enum IncidentSeverity {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export interface Incident {
  id: string;
  timestamp: Date;
  type: 'Missing Items' | 'Damaged on Arrival' | 'Quantity Mismatch' | string;
  severity: IncidentSeverity;
  description: string;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED';
  reportedBy: string;
  arrivalTimestamp?: Date; // Added for Security Arrival Verification
  evidenceLogged?: boolean; // Added for Security Evidence Logging
  zone_id?: string; // Standardize zone linkage
  item_id?: string;
  expected_qty?: number;
  actual_qty?: number;
  photo_proof?: string;
}

export interface RestockTask {
  id: string;
  item: string;
  barcode?: string;
  quantity: number;
  unit: string;
  standLocation: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  requestedAt: Date;
  isUrgent: boolean;
  acceptedBy?: string;
  photoProof?: string;
  zoneQrVerified?: boolean;

  // Metadata for UI
  statusDetails?: string;
  action?: string;
  distanceEstimate?: string;
  zoneId?: string;
  pickedUpQuantity?: number;
  priority?: 'NORMAL' | 'HIGH' | 'CRITICAL';
  destination?: string;
  origin?: string;
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
  alert_type: 'auth_security' | 'broadcast' | 'system' | 'technical_maintenance';
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

  return 'UNKNOWN';
}

export function defaultViewForMode(mode: AppMode): View {
  switch (mode) {
    case 'FNB':
      return View.FNB_POS_LITE;
    case 'INTERNAL_MAINTENANCE':
    case 'SERVICE_CREW':
    case 'SECURITY_CREW':
    case 'HEALTH_CREW':
    case 'CLEANING_CREW':
    case 'RUNNER':
    case 'EXPERIENCE_CREW':
    case 'GIFTSHOP_CREW':
      return View.RETAIL_STATUS;
    case 'EXTERNAL_MAINTENANCE':
      return View.HOME;
    default:
      return View.SETTINGS;
  }
}

export function allowedViewsForMode(mode: AppMode): View[] {
  switch (mode) {
    case 'INTERNAL_MAINTENANCE':
      return [
        View.HOME,
        View.ZONE_CHECK_IN,
        View.MAINTENANCE_LOG,
        View.SETTINGS,
        View.ANNOUNCEMENTS
      ];
    case 'SERVICE_CREW':
      return [View.HOME, View.ZONE_CHECK_IN, View.SERVICE_DASHBOARD, View.SETTINGS, View.ANNOUNCEMENTS];
    case 'SECURITY_CREW':
      return [View.HOME, View.ZONE_CHECK_IN, View.SECURITY_DASHBOARD, View.INCIDENTS, View.ZONE_SURVEILLANCE, View.SETTINGS, View.ANNOUNCEMENTS];
    case 'HEALTH_CREW':
      return [View.HOME, View.ZONE_CHECK_IN, View.HEALTH_DASHBOARD, View.INCIDENTS, View.SETTINGS, View.ANNOUNCEMENTS];
    case 'CLEANING_CREW':
      return [View.HOME, View.ZONE_CHECK_IN, View.CLEANING_DASHBOARD, View.SETTINGS, View.ANNOUNCEMENTS];
    case 'FNB':
      return [
        View.HOME,
        View.ZONE_CHECK_IN,
        View.FNB_POS_LITE,
        View.FNB_STOCK_STATUS,
        View.FNB_RESTOCK_REQUESTS,
        View.FNB_WASTE_LOG,
        View.FNB_PREP_BATCHES,
        View.SETTINGS,
        View.ANNOUNCEMENTS
      ];
    case 'RUNNER':
      return [
        View.HOME,
        View.ZONE_CHECK_IN,
        View.LOGISTICS_PO,
        View.LOGISTICS_RESTOCK,
        View.LOGISTICS_MANUAL,
        View.LOGISTICS_INCIDENT,
        View.LOGISTICS_AUDIT,
        View.SETTINGS,
        View.ANNOUNCEMENTS
      ];
    case 'EXPERIENCE_CREW':
      return [View.HOME, View.ZONE_CHECK_IN, View.EXPERIENCE_DASHBOARD, View.SETTINGS, View.ANNOUNCEMENTS];
    case 'GIFTSHOP_CREW':
      return [
        View.HOME,
        View.ZONE_CHECK_IN,
        View.RETAIL_RECEIVING,
        View.RETAIL_STATUS,
        View.RETAIL_RESTOCK,
        View.RETAIL_DAMAGE_LOG,
        View.RETAIL_AUDIT,
        View.SETTINGS,
        View.ANNOUNCEMENTS
      ];
    case 'EXTERNAL_MAINTENANCE':
      // Very restricted view
      return [View.HOME, View.ZONE_CHECK_IN, View.EXTERNAL_MAINTENANCE_DASHBOARD];
    default:
      return [View.HOME, View.SETTINGS];
  }
}

export function isViewAllowed(mode: AppMode, view: View): boolean {
  return allowedViewsForMode(mode).includes(view);
}
export interface AuditRequest {
  id: string;
  item: string;
  section: string;
  photo?: string;
  unit: string;
  status: 'PENDING' | 'COMPLETED' | 'RECOUNT_REQUIRED';
  expectedQty?: number; // Hidden from runner (Blind Count)
  actualQty?: number;
  lastUpdated: Date;
}

export interface PurchaseOrder {
  id: string;
  supplier: string;
  status: 'PENDING' | 'RECONCILED';
  createdAt: Date;
  items: {
    item: string;
    barcode?: string;
    unit?: string;
    expected: number;
    received: number;
    photoProof?: string;
  }[];
}

export interface ManualRestockLog {
  id: string;
  destination: string;
  item: string;
  barcode: string;
  quantity: number;
  unit: string;
  timestamp: Date;
  photoProof: string;
  zoneQrVerified: boolean;
}

// --- F&B specific types ---
export interface FNBMenuItem {
  id: string;
  name: string;
  category: 'RAW INGREDIENT' | 'PREPARED ITEM' | 'RETAIL' | 'DRINK';
  status: 'Available' | 'Out of Stock';
  currentStock: number;
  lowStockThreshold: number;
}

export interface FNBOrder {
  id: string;
  priority: boolean;
  items: {
    menuItemId: string;
    name: string;
    category: 'RAW INGREDIENT' | 'PREPARED ITEM' | 'RETAIL' | 'DRINK';
    quantity: number;
  }[];
  status: 'PENDING' | 'PREPARING' | 'COMPLETED';
  createdAt: Date;
}

export interface FNBPrepBatch {
  id: string;
  recipeName: string;
  status: 'In Progress' | 'Cooling' | 'Completed';
  yieldQuantity: number;
  unit: string;
  rawIngredientsUsed: {
    menuItemId: string;
    quantity: number;
  }[];
  startedAt: Date;
  bestBefore?: Date;
}

export interface FNBWasteLog {
  id: string;
  item: string;
  category: string;
  reasonCode: 'Expired / EOD' | 'Dropped / Spilled' | 'Contaminated' | 'Prep Error';
  quantity: number;
  costImpact: number; // hidden from crew
  timestamp: Date;
}
