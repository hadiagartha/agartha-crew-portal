import React, { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import ZoneCheckIn from './components/ZoneCheckIn';
import InternalMaintenanceDashboard from './components/InternalMaintenanceDashboard';
import DailyChecklist from './components/DailyChecklist';
import Incidents from './components/Incidents';
import ShiftSchedule from './components/ShiftSchedule';
import CheckInLog from './components/CheckInLog';
import ZoneSurveillance from './components/ZoneSurveillance';
import Settings from './components/Settings';
import Broadcasts from './components/Broadcasts';
import FNBDashboard from './components/FNBDashboard';
import RunnerDashboard from './components/RunnerDashboard';
import SecurityDashboard from './components/SecurityDashboard';
import HealthDashboard from './components/HealthDashboard';
import ExperienceDashboard from './components/ExperienceDashboard';
import CleaningDashboard from './components/CleaningDashboard';
import GiftShopDashboard from './components/GiftShopDashboard';
import ExternalMaintenanceDashboard from './components/ExternalMaintenanceDashboard';
import ServiceDashboard from './components/ServiceDashboard';
import { View, Incident, IncidentSeverity, CheckInRecord, StaffMember, Alert, AuthResponse, AppMode, deriveModeFromStaff, defaultViewForMode, isViewAllowed, RestockTask } from './types';

// Mock data moved to App level for persistence
const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'INC-089',
    timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 mins ago
    type: 'Creature Malfunction',
    severity: IncidentSeverity.HIGH,
    description: 'Leviathan-03 hydraulic leak detected during sequence B.',
    status: 'INVESTIGATING',
    reportedBy: '8842-A',
    zone_id: 'Z-04'
  },
  {
    id: 'INC-088',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
    type: 'Zone System Failure',
    severity: IncidentSeverity.MEDIUM,
    description: 'Ambient lighting flicker in Zone 02 transition corridor.',
    status: 'OPEN',
    reportedBy: 'Staff-04',
    zone_id: 'Z-02'
  },
  {
    id: 'MED-771',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    type: 'Personnel Health Crisis',
    severity: IncidentSeverity.HIGH,
    description: 'Staff member exhibiting tachycardia and disorientation in Zone 04 near biolume vents.',
    status: 'OPEN',
    reportedBy: 'AI-Pulse-01',
    zone_id: 'Z-04'
  },
  {
    id: 'MED-772',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    type: 'Guest Medical Anomaly',
    severity: IncidentSeverity.MEDIUM,
    description: 'Minor respiratory distress reported in sector 7 corridor.',
    status: 'OPEN',
    reportedBy: 'Staff-881',
    zone_id: 'Z-01'
  },
  {
    id: 'INC-087',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    type: 'Safety Hazard',
    severity: IncidentSeverity.LOW,
    description: 'Spilled lubricant near maintenance hatch 4B.',
    status: 'RESOLVED',
    reportedBy: '8842-A',
    zone_id: 'Z-04',
    arrivalTimestamp: new Date(Date.now() - 1000 * 60 * 60 * 23.5),
    evidenceLogged: true
  },
];

const INITIAL_LOGS: CheckInRecord[] = [
  { id: 'LOG-001', staffId: '8842-A', name: 'Alex Chen', zone: 'Z-04', date: 'Oct 24, 2023', checkInTime: '08:00 AM', checkOutTime: null, status: 'ON TIME' },
  { id: 'LOG-002', staffId: '9921-B', name: 'Sarah Miller', zone: 'Z-02', date: 'Oct 24, 2023', checkInTime: '08:15 AM', checkOutTime: null, status: 'LATE' },
  { id: 'LOG-003', staffId: '7732-C', name: 'David Kim', zone: 'Z-01', date: 'Oct 24, 2023', checkInTime: '07:55 AM', checkOutTime: null, status: 'ON TIME' },
  { id: 'LOG-004', staffId: '8842-A', name: 'Alex Chen', zone: 'Z-04', date: 'Oct 23, 2023', checkInTime: '08:02 AM', checkOutTime: '05:00 PM', status: 'ON TIME' },
  { id: 'LOG-005', staffId: '9921-B', name: 'Sarah Miller', zone: 'Z-02', date: 'Oct 23, 2023', checkInTime: '08:45 AM', checkOutTime: '05:15 PM', status: 'LATE' },
  { id: 'LOG-006', staffId: '7732-C', name: 'David Kim', zone: 'Z-01', date: 'Oct 23, 2023', checkInTime: '08:00 AM', checkOutTime: '05:00 PM', status: 'ON TIME' },
  { id: 'LOG-007', staffId: '8842-A', name: 'Alex Chen', zone: 'Z-04', date: 'Oct 22, 2023', checkInTime: '08:30 AM', checkOutTime: '05:00 PM', status: 'LATE' },
  { id: 'LOG-008', staffId: '4451-D', name: 'James Wilson', zone: 'Z-03', date: 'Oct 22, 2023', checkInTime: '08:00 AM', checkOutTime: '05:00 PM', status: 'ON TIME' },
  { id: 'LOG-009', staffId: '8842-A', name: 'Alex Chen', zone: 'Z-04', date: 'Oct 21, 2023', checkInTime: '08:00 AM', checkOutTime: '05:00 PM', status: 'ON TIME' },
  { id: 'LOG-010', staffId: '8842-A', name: 'Alex Chen', zone: 'Z-04', date: 'Oct 20, 2023', checkInTime: '08:00 AM', checkOutTime: '05:00 PM', status: 'ON TIME' },
];

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [staff, setStaff] = useState<StaffMember | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [broadcasts, setBroadcasts] = useState<Alert[]>([]);
  const [localAlerts, setLocalAlerts] = useState<Alert[]>([]);
  const [pendingStationaryAlert, setPendingStationaryAlert] = useState<Alert | null>(null);
  const [appMode, setAppMode] = useState<AppMode>('UNKNOWN');
  const isTechOpsRole = ['INTERNAL_MAINTENANCE', 'TECH_SUPPORT'].includes(appMode);

  // Global Maintenance State
  const [systemHealthPercentage, setSystemHealthPercentage] = useState<number>(87);

  // Track if there are unread general announcements
  const [hasUnreadAnnouncements, setHasUnreadAnnouncements] = useState(false);

  const [currentView, setCurrentView] = useState<View>(View.ZONE_CHECK_IN);
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [checkInLogs, setCheckInLogs] = useState<CheckInRecord[]>(INITIAL_LOGS);
  const [incidentDefaultTab, setIncidentDefaultTab] = useState<'REPORT' | 'LOG' | undefined>(undefined);

  // Global Zone Statuses
  const [zoneStatuses, setZoneStatuses] = useState<Record<string, 'Ready' | 'Cleaning'>>({
    'Z-01': 'Ready',
    'Z-02': 'Ready',
    'Z-03': 'Ready',
    'Z-04': 'Cleaning' // E.g., currently being cleaned
  });

  // Shared Restock Task State (Pre-populated for Runner test)
  const [restockTasks, setRestockTasks] = useState<RestockTask[]>([
    {
      id: 'RSTK-001',
      item: 'Bottled Water',
      quantity: 200,
      standLocation: 'Crystal Caves Cafe',
      zoneId: 'Z-01',
      status: 'PENDING',
      requestedAt: new Date(Date.now() - 1000 * 60 * 2), // 2 mins ago
      isUrgent: true,
      statusDetails: 'Below Par (2%)',
      action: 'PRIORITY DISPATCH',
      distanceEstimate: '85m'
    },
    {
      id: 'RSTK-002',
      item: 'Energy Snacks',
      quantity: 50,
      standLocation: 'Biolume Forest Gift Shop',
      zoneId: 'Z-02',
      status: 'PENDING',
      requestedAt: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
      isUrgent: false, // We will calculate this dynamically in the component or rely on 'Below Par (< 10%)' string for prioritization UI
      statusDetails: 'Below Par (12%)',
      action: 'REQUESTED',
      distanceEstimate: '210m'
    },
    {
      id: 'RSTK-003',
      item: 'Napkins',
      quantity: 500,
      standLocation: 'Steam Vents Kiosk',
      zoneId: 'Z-03',
      status: 'PENDING',
      requestedAt: new Date(Date.now() - 1000 * 60 * 45), // 45 mins ago
      isUrgent: false,
      statusDetails: 'Manual Request',
      action: 'IN QUEUE',
      distanceEstimate: '450m'
    }
  ]);

  // Shift state: Starts false, becomes true after Zone Check-In
  const [isOnShift, setIsOnShift] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (currentView !== View.INCIDENTS) {
      setIncidentDefaultTab(undefined);
    }
  }, [currentView]);

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchBroadcasts();
      const interval = setInterval(fetchBroadcasts, 30000); // Poll every 30s

      // Health Pulse Simulation
      const simulationInterval = setInterval(() => {
        const now = new Date().toISOString();
        const rand = Math.random();

        setLocalAlerts(prev => {
          let next = [...prev];

          // Type A: Stationary Anomaly (Medium)
          if (rand < 0.05) { // 5% chance to trigger/update
            const alertId = 'HP-STATIONARY-GUEST-101';
            const exists = next.find(a => a.id === alertId);
            if (!exists) {
              next.push({
                id: alertId,
                alert_type: 'health_pulse',
                severity: 'medium',
                zone_id: 'Z-02',
                zone_name: 'Zone 02',
                status: 'open',
                created_at: now,
                description: 'Stationary anomaly: Guest #101 stationary in Zone 02 transit corridor for 3.5 minutes. Check camera feed.'
              });
            }
          } else if (rand > 0.98) { // 2% chance to clear
            next = next.filter(a => a.id !== 'HP-STATIONARY-GUEST-101');
          }

          // Type B: Sprint Anomaly (Critical)
          if (rand > 0.45 && rand < 0.50) { // 5% chance
            const alertId = 'HP-SPRINT-GUEST-202';
            const exists = next.find(a => a.id === alertId);
            if (!exists) {
              next.push({
                id: alertId,
                alert_type: 'health_pulse',
                severity: 'critical',
                zone_id: 'Z-04',
                zone_name: 'Zone 04',
                status: 'open',
                created_at: now,
                description: 'Sprint anomaly: Guest #202 moving 12.5 km/h toward exit in Zone 04 transit corridor. Possible panic event.'
              });
            }
          } else if (rand < 0.02) { // 2% chance to clear
            next = next.filter(a => a.id !== 'HP-SPRINT-GUEST-202');
          }

          return next;
        });
      }, 5000);

      return () => {
        clearInterval(interval);
        clearInterval(simulationInterval);
      };
    }
  }, [isAuthenticated, token]);

  const fetchBroadcasts = async () => {
    try {
      const response = await fetch('/api/alerts/broadcasts');
      if (response.ok) {
        const data: Alert[] = await response.json();
        setBroadcasts(data);

        // Determine if there are unread general announcements
        const hasGeneral = data.some(a => a.severity === 'low' || a.severity === 'medium');
        if (hasGeneral && currentView !== View.ANNOUNCEMENTS) {
          setHasUnreadAnnouncements(true);
        }
      }
    } catch (err) {
      console.error('Failed to fetch broadcasts', err);
    }
  };

  const handleLogin = (auth: AuthResponse) => {
    setToken(auth.token);
    setStaff(auth.staff);
    setIsAuthenticated(true);

    localStorage.setItem('agartha_token', auth.token);
    localStorage.setItem('agartha_staff', JSON.stringify(auth.staff));

    const derivedMode = deriveModeFromStaff(auth.staff);
    setAppMode(derivedMode);
    setCurrentView(defaultViewForMode(derivedMode));
    localStorage.setItem('agartha_app_mode', derivedMode);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setStaff(null);
    setToken(null);
    setIsOnShift(false); // Reset shift status on logout
    setAppMode('UNKNOWN');
    setCurrentView(View.SETTINGS); // Reset view to default

    localStorage.removeItem('agartha_token');
    localStorage.removeItem('agartha_staff');
    localStorage.removeItem('agartha_app_mode');
  };

  const handleModeChange = (mode: AppMode) => {
    setAppMode(mode);
    setCurrentView(defaultViewForMode(mode));
    localStorage.setItem('agartha_app_mode', mode);
  };

  const handleAcknowledge = async (alert: Alert) => {
    if (!staff || !token) return;

    if (alert.alert_type === 'health_pulse') {
      if (alert.severity === 'critical') {
        // Type B: Sprint Anomaly - Immediate Incident
        const newIncident: Incident = {
          id: `INC-HP-${Date.now()}`,
          timestamp: new Date(),
          type: 'Sprint Anomaly',
          severity: IncidentSeverity.HIGH,
          description: alert.description,
          status: 'OPEN',
          reportedBy: staff.staff_id
        };
        handleAddIncident(newIncident);
        setLocalAlerts(prev => prev.filter(a => a.id !== alert.id));
        setIncidentDefaultTab('LOG');
        setCurrentView(View.INCIDENTS);
      } else {
        // Type A: Stationary Anomaly - Needs Confirmation
        setPendingStationaryAlert(alert);
      }
      return;
    }

    // Server-side alerts
    try {
      await fetch('/api/alerts/acknowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alert_id: alert.id, staff_id: staff.id }),
      });

      // Remove from local state for immediate feedback
      setBroadcasts(prev => prev.filter(b => b.id !== alert.id));

      // Create a new Incident client-side
      let severity: IncidentSeverity = IncidentSeverity.LOW;
      if (alert.severity === 'critical' || alert.severity === 'high') {
        severity = IncidentSeverity.HIGH;
      } else if (alert.severity === 'medium') {
        severity = IncidentSeverity.MEDIUM;
      }

      const newIncident: Incident = {
        id: `INC-${Date.now()}`,
        timestamp: new Date(),
        type: "Broadcast Alert",
        severity,
        description: `[${alert.id}] ${alert.description}${alert.zone_name ? ` (Zone: ${alert.zone_name})` : ''}`,
        status: "OPEN",
        reportedBy: staff.staff_id
      };

      handleAddIncident(newIncident);
      setIncidentDefaultTab('LOG');
      setCurrentView(View.INCIDENTS);
    } catch (err) {
      console.error('Failed to acknowledge', err);
    }
  };

  const handleConfirmStationary = (confirmed: boolean) => {
    if (!pendingStationaryAlert || !staff) return;

    if (confirmed) {
      const newIncident: Incident = {
        id: `INC-HP-${Date.now()}`,
        timestamp: new Date(),
        type: 'Stationary Anomaly',
        severity: IncidentSeverity.MEDIUM,
        description: pendingStationaryAlert.description + ' Emergency confirmed.',
        status: 'OPEN',
        reportedBy: staff.staff_id
      };
      handleAddIncident(newIncident);
      setIncidentDefaultTab('LOG');
      setCurrentView(View.INCIDENTS);
    }

    setLocalAlerts(prev => prev.filter(a => a.id !== pendingStationaryAlert.id));
    setPendingStationaryAlert(null);
  };

  const handleAddIncident = (newIncident: Incident) => {
    setIncidents(prev => [newIncident, ...prev]);
  };

  const handleUpdateIncidentStatus = (id: string, newStatus: Incident['status']) => {
    setIncidents(prev => prev.map(inc =>
      inc.id === id ? { ...inc, status: newStatus } : inc
    ));
  };

  // Security Handlers
  const handleSecurityMedicalEscalation = (zone_id: string, description: string) => {
    if (!staff) return;

    // Create new Medical incident
    const newIncident: Incident = {
      id: `INC-MED-${Date.now()}`,
      timestamp: new Date(),
      type: 'Medical Escalation',
      severity: IncidentSeverity.HIGH,
      description,
      status: 'OPEN',
      reportedBy: staff.staff_id,
      zone_id
    };
    handleAddIncident(newIncident);

    // Blast Critical Alert
    const newAlert: Alert = {
      id: `ALT-MED-${Date.now()}`,
      alert_type: 'broadcast',
      severity: 'critical',
      zone_id,
      description: `MEDICAL ESCALATION REQUIRED: ${description}`,
      status: 'open',
      created_at: new Date().toISOString()
    };
    setBroadcasts(prev => [newAlert, ...prev]);
  };

  const handleSecurityLogEvidence = (id: string) => {
    setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, evidenceLogged: true } : inc));
  };

  const handleSecurityScanArrival = (id: string, timestamp: Date) => {
    setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, arrivalTimestamp: timestamp } : inc));
  };

  // Restock Task Handlers
  const handleRequestRestock = (item: string, isUrgent: boolean) => {
    const newTask: RestockTask = {
      id: `RSTK-${Date.now()}`,
      item,
      quantity: 50, // Default bulk restock amount
      standLocation: staff?.current_zone_id ? `Zone ${staff.current_zone_id.replace('Z-', '')} Kiosk` : 'Central Plaza Kiosk',
      status: 'PENDING',
      requestedAt: new Date(),
      isUrgent
    };
    setRestockTasks(prev => [...prev, newTask]);
  };

  const handlePickupTask = (taskId: string, pickedUpQuantity: number) => {
    setRestockTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'IN_TRANSIT', pickedUpQuantity } : t));
  };

  const handleCompleteTask = (taskId: string) => {
    setRestockTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'COMPLETED' } : t));

    // Simulate updating local inventory state based on the delivered quantity
    const task = restockTasks.find(t => t.id === taskId);
    if (task && task.pickedUpQuantity) {
      console.log(`[Inventory Sync] Added ${task.pickedUpQuantity} units of ${task.item} to ${task.standLocation}`);
      // In a real app, you would dispatch an action or API call to update the specific zone's inventory here.
    }
  };

  const handleCheckInComplete = (timestamp: Date) => {
    setIsOnShift(true);

    const shiftStart = new Date();
    shiftStart.setHours(8, 0, 0, 0); // 8:00 AM today

    // If the check-in is after 8:00 AM, mark as late
    const isLate = timestamp > shiftStart;

    const newLog: CheckInRecord = {
      id: `LOG-${Date.now()}`,
      staffId: staff?.staff_id || '8842-A',
      name: staff?.name || 'Alex Chen', // Current User
      zone: 'Z-04',
      date: timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      checkInTime: timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      checkOutTime: null,
      status: isLate ? 'LATE' : 'ON TIME'
    };

    setCheckInLogs(prev => [newLog, ...prev]);

    // Auto-route based on role
    if (appMode === 'FNB') setCurrentView(View.FNB_DASHBOARD);
    else if (appMode === 'RUNNER') setCurrentView(View.RUNNER_DASHBOARD);
    else if (appMode === 'SECURITY_CREW') setCurrentView(View.SECURITY_DASHBOARD);
    else if (appMode === 'HEALTH_CREW') setCurrentView(View.HEALTH_DASHBOARD);
    else if (appMode === 'EXPERIENCE_CREW') setCurrentView(View.EXPERIENCE_DASHBOARD);
    else if (appMode === 'CLEANING_CREW') setCurrentView(View.CLEANING_DASHBOARD);
    else if (appMode === 'GIFTSHOP_CREW') setCurrentView(View.GIFTSHOP_DASHBOARD);
    else if (appMode === 'SERVICE_CREW') setCurrentView(View.SERVICE_DASHBOARD);
    else if (appMode === 'INTERNAL_MAINTENANCE') setCurrentView(View.MAINTENANCE_LOG);
    else if (appMode === 'TECH_SUPPORT') setCurrentView(View.MAINTENANCE_LOG);
    else if (appMode === 'OPS') setCurrentView(View.ZONE_SURVEILLANCE);
    else setCurrentView(View.DAILY_CHECKLIST); // Default for other modes
  };

  const handleCheckOutComplete = () => {
    setIsOnShift(false);

    const now = new Date();
    const formattedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    setCheckInLogs(prev => {
      const logs = [...prev];
      // Find the most recent active log for this user
      // We assume the top of the list is the most recent
      const activeLogIndex = logs.findIndex(log => log.staffId === (staff?.staff_id || '8842-A') && log.checkOutTime === null);

      if (activeLogIndex !== -1) {
        logs[activeLogIndex] = {
          ...logs[activeLogIndex],
          checkOutTime: formattedTime
        };
      }
      return logs;
    });
  };

  const renderContent = () => {
    let activeView = isViewAllowed(appMode, currentView) ? currentView : defaultViewForMode(appMode);

    // List of Operational Dashboards that require an active shift
    const shiftRequiredViews = [
      View.FNB_DASHBOARD,
      View.RUNNER_DASHBOARD,
      View.SECURITY_DASHBOARD,
      View.HEALTH_DASHBOARD,
      View.EXPERIENCE_DASHBOARD,
      View.CLEANING_DASHBOARD,
      View.GIFTSHOP_DASHBOARD,
      View.MAINTENANCE_LOG,
      View.EXTERNAL_MAINTENANCE_DASHBOARD,
      View.SERVICE_DASHBOARD
    ];

    if (!isOnShift && shiftRequiredViews.includes(activeView)) {
      // User is trying to access a restricted view without checking in.
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-[#2d3142] border border-red-500/30 rounded-2xl shadow-2xl h-full animate-fadeIn">
          <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
            {/* Using standard icon sizes */}
            <Lock className="text-red-400 w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3 text-center">Access Restricted</h2>
          <p className="text-gray-400 text-center max-w-md mb-8">
            Physical Zone Validation Required. Please scan your Zone QR to unlock operational tools.
          </p>
          <button
            onClick={() => setCurrentView(View.ZONE_CHECK_IN)}
            className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3 px-8 rounded-lg shadow-lg shadow-yellow-400/20 transition-all hover:-translate-y-0.5"
          >
            Go to Zone Check-In
          </button>
        </div>
      );
    }

    switch (activeView) {
      case View.ZONE_CHECK_IN:
        return (
          <ZoneCheckIn
            onViewChange={setCurrentView}
            isOnShift={isOnShift}
            onCheckInComplete={handleCheckInComplete}
            onCheckOutComplete={handleCheckOutComplete}
          />
        );
      case View.FNB_DASHBOARD:
        return <FNBDashboard onRequestRestock={handleRequestRestock} restockTasks={restockTasks} />;
      case View.RUNNER_DASHBOARD:
        return <RunnerDashboard tasks={restockTasks} onPickupTask={handlePickupTask} onCompleteTask={handleCompleteTask} />;
      case View.SECURITY_DASHBOARD:
        return (
          <SecurityDashboard
            incidents={incidents}
            onJumpToSurveillance={(zoneId) => {
              // In a real app we might pass the zoneId to ZoneSurveillance via state/context
              setCurrentView(View.ZONE_SURVEILLANCE);
            }}
            onMedicalEscalation={handleSecurityMedicalEscalation}
            onScanArrival={handleSecurityScanArrival}
            onLogEvidence={handleSecurityLogEvidence}
          />
        );
      case View.HEALTH_DASHBOARD:
        return (
          <HealthDashboard
            incidents={incidents}
            onScanArrival={handleSecurityScanArrival}
          />
        );
      case View.EXPERIENCE_DASHBOARD:
        return (
          <ExperienceDashboard
            handleAddIncident={handleAddIncident}
            staff={staff!}
            zoneStatuses={zoneStatuses}
          />
        );
      case View.CLEANING_DASHBOARD:
        return (
          <CleaningDashboard
            staff={staff!}
            onRequestRestock={handleRequestRestock}
            handleAddIncident={handleAddIncident}
          />
        );
      case View.GIFTSHOP_DASHBOARD:
        return <GiftShopDashboard onRequestRestock={handleRequestRestock} />;
      case View.SERVICE_DASHBOARD:
        return <ServiceDashboard />;
      case View.MAINTENANCE_LOG:
        return (
          <InternalMaintenanceDashboard
            redAlerts={[...localAlerts, ...broadcasts].filter(a => a.severity === 'high' || a.severity === 'critical' || a.alert_type === 'health_pulse')}
            systemHealthPercentage={systemHealthPercentage}
            onResolveIncident={(incidentId) => {
              // Mock resolving the alert in global state
              setBroadcasts(prev => prev.filter(a => a.id !== incidentId));
              setSystemHealthPercentage(prev => Math.min(100, prev + 13));
            }}
          />
        );
      case View.EXTERNAL_MAINTENANCE_DASHBOARD:
        return (
          <ExternalMaintenanceDashboard
            staff={staff!}
            onLogout={handleLogout}
            onSecurityAlert={(desc: string) => {
              // Creating a simulated critical alert 
              const newAlert: Alert = {
                id: `ALRT-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
                alert_type: 'auth_security',
                severity: 'critical',
                description: desc,
                status: 'open',
                created_at: new Date().toISOString()
              };
              setBroadcasts(prev => [newAlert, ...prev]);
            }}
          />
        );
      case View.DAILY_CHECKLIST:
        return <DailyChecklist appMode={appMode} />;
      case View.ZONE_SURVEILLANCE:
        return <ZoneSurveillance hasHealthPulseAlert={localAlerts.some(a => a.alert_type === 'health_pulse')} />;
      case View.INCIDENTS:
        return (
          <Incidents
            incidents={incidents}
            onAddIncident={handleAddIncident}
            onUpdateIncidentStatus={handleUpdateIncidentStatus}
            defaultTab={incidentDefaultTab}
          />
        );
      case View.SHIFT_SCHEDULE:
        return <ShiftSchedule />;
      case View.CHECK_IN_LOG:
        return <CheckInLog logs={checkInLogs} />;
      case View.ANNOUNCEMENTS:
        return (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">All Announcements</h2>
            <Broadcasts
              alerts={[...localAlerts, ...broadcasts]
                .filter((v, i, a) => a.findIndex(t => t.id === v.id) === i)
                .filter(a => isTechOpsRole || (a.severity === 'low' || a.severity === 'medium'))
              }
              staff={staff!}
              onAcknowledge={handleAcknowledge}
            />
          </div>
        );
      case View.SETTINGS:
        return (
          <Settings
            onLogout={handleLogout}
            staff={staff!}
            appMode={appMode}
            onChangeMode={handleModeChange}
          />
        );
      default:
        return (
          <ZoneCheckIn
            onViewChange={setCurrentView}
            isOnShift={isOnShift}
            onCheckInComplete={handleCheckInComplete}
            onCheckOutComplete={handleCheckOutComplete}
          />
        );
    }
  };

  if (!isAuthenticated || !staff) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex flex-col h-screen w-full bg-[#1a1d29]">
      <Header
        isOnShift={isOnShift}
        staff={staff}
        appMode={appMode}
        onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar
          currentView={currentView}
          appMode={appMode}
          isOnShift={isOnShift}
          hasUnreadAnnouncements={hasUnreadAnnouncements}
          onViewChange={(view) => {
            if (!isViewAllowed(appMode, view)) {
              setCurrentView(defaultViewForMode(appMode));
              return;
            }
            setCurrentView(view);
            setIncidentDefaultTab(undefined); // Reset default tab on manual navigation

            // Clear unread indicator when visiting announcements
            if (view === View.ANNOUNCEMENTS) {
              setHasUnreadAnnouncements(false);
            }

            setIsMobileMenuOpen(false);
          }}
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
        <main className="flex-1 overflow-hidden relative w-full">
          {/* Subtle background grid pattern for tech feel */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
          <div className="relative z-10 h-full w-full overflow-y-auto p-4 md:p-6">
            {currentView !== View.ANNOUNCEMENTS && isTechOpsRole && (
              <Broadcasts
                alerts={[...localAlerts, ...broadcasts]
                  .filter((v, i, a) => a.findIndex(t => t.id === v.id) === i)
                  .filter(a => a.severity === 'high' || a.severity === 'critical' || a.alert_type === 'health_pulse') // Only show Red Alerts here
                }
                staff={staff}
                onAcknowledge={handleAcknowledge}
              />
            )}
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Confirmation Modal for Stationary Anomaly */}
      {pendingStationaryAlert && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#1a1d29] w-full max-w-md rounded-2xl border border-yellow-400/30 shadow-2xl overflow-hidden">
            <div className="bg-[#2d3142] p-6 border-b border-gray-700">
              <h3 className="text-xl font-bold text-white mb-2">Emergency confirmed?</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {pendingStationaryAlert.description}
              </p>
            </div>
            <div className="p-6 flex flex-col gap-3">
              <button
                onClick={() => handleConfirmStationary(true)}
                className="w-full bg-red-500 hover:bg-red-400 text-white py-3 rounded-lg font-bold transition-colors"
              >
                Yes — Dispatch staff
              </button>
              <button
                onClick={() => handleConfirmStationary(false)}
                className="w-full bg-[#2d3142] hover:bg-[#343a4f] text-gray-300 py-3 rounded-lg font-bold transition-colors"
              >
                No — False alarm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;