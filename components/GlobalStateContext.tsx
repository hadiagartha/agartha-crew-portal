import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Incident, RestockTask, IncidentSeverity, AuditRequest } from '../types';

interface HardwareChecklistEntry {
    id: string;
    zone: string;
    item: string;
    status: 'Pass' | 'Fail';
    timestamp: Date;
    checkedBy: string;
}

export interface TechnicalIncident {
    id: string;
    zoneId: string;
    item: string;
    reason: string;
    severity: 'Low' | 'High';
    timestamp: Date;
    status: 'OPEN' | 'RESOLVED';
}

export interface ServiceTicket {
    id: string;
    incidentId: string;
    zoneId: string;
    item: string;
    type: 'INTERNAL' | 'EXTERNAL';
    status: 'ACTIVE' | 'PENDING' | 'COMPLETED';
}

interface PrepBatch {
    id: string;
    item: string;
    quantity: number;
    timestamp: Date;
}

interface WasteLog {
    id: string;
    item: string;
    reason: string;
    quantity: number;
    timestamp: Date;
}

interface FridgeTemp {
    id: string;
    temp: number;
    timestamp: Date;
    loggedBy: string;
}

interface POEntry {
    id: string;
    supplier: string;
    status: 'PENDING' | 'RECONCILED';
    items: {
        item: string;
        barcode?: string;
        unit?: string;
        expected: number;
        received: number;
        photoProof?: string;
    }[];
}

interface PromoCodeEntry {
    code: string;
    scannedAt: Date;
    scannedBy: string;
}

export interface GlobalState {
    live_guest_count: number;
    setLiveGuestCount: React.Dispatch<React.SetStateAction<number>>;

    promo_codes: PromoCodeEntry[];
    addPromoCode: (code: string, scannedBy: string) => void;

    crowdControlLevel: 'NORMAL' | 'ELEVATED' | 'CRITICAL';
    setCrowdControlLevel: React.Dispatch<React.SetStateAction<'NORMAL' | 'ELEVATED' | 'CRITICAL'>>;

    cleaning_timers: Record<string, { startTime: number | null; duration: number | null; isClean: boolean }>;
    setCleaningTimers: React.Dispatch<React.SetStateAction<Record<string, { startTime: number | null; duration: number | null; isClean: boolean }>>>;

    fridge_temperatures: FridgeTemp[];
    addFridgeTemp: (temp: number, loggedBy: string) => void;

    prep_batches: PrepBatch[];
    addPrepBatch: (item: string, quantity: number) => void;

    waste_logs: WasteLog[];
    addWasteLog: (item: string, quantity: number, reason: string) => void;

    active_pos: POEntry[];
    updatePO: (poId: string, items: { item: string; expected: number; received: number }[]) => void;

    central_storage: Record<string, number>;
    updateCentralStorage: (item: string, quantityAdded: number) => void;

    restock_tasks: RestockTask[];
    addRestockTask: (task: RestockTask) => void;
    updateRestockTask: (taskId: string, updates: Partial<RestockTask>) => void;

    logistics_incidents: Incident[];
    addLogisticsIncident: (incident: Incident) => void;

    manual_restock_logs: any[]; // Using any for brevity or ManualRestockLog if imported
    addManualRestockLog: (log: any) => void;

    audit_requests: AuditRequest[];
    updateAuditRequest: (auditId: string, actualQty: number) => void;

    hardware_checklists: HardwareChecklistEntry[];
    addHardwareChecklist: (entry: HardwareChecklistEntry) => void;

    consumables: Record<string, number>;
    useConsumable: (item: string, amount: number) => void;
    restockConsumable: (item: string, amount: number) => void;

    technical_incidents: TechnicalIncident[];
    zone_statuses: Record<string, 'Green' | 'Yellow' | 'Degraded'>;
    service_tickets: ServiceTicket[];
    reportTechnicalFailure: (zoneId: string, item: string, reason: string, severity: 'Low' | 'High') => void;
    resolveTechnicalFailure: (incidentId: string) => void;
}

const GlobalStateContext = createContext<GlobalState | undefined>(undefined);

export const GlobalStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [liveGuestCount, setLiveGuestCount] = useState(0);
    const [promoCodes, setPromoCodes] = useState<PromoCodeEntry[]>([]);
    const [crowdControlLevel, setCrowdControlLevel] = useState<'NORMAL' | 'ELEVATED' | 'CRITICAL'>('NORMAL');
    const [cleaningTimers, setCleaningTimers] = useState<Record<string, { startTime: number | null; duration: number | null; isClean: boolean }>>({
        'Z-01': { startTime: null, duration: null, isClean: true },
        'Z-02': { startTime: null, duration: null, isClean: true },
        'Z-03': { startTime: null, duration: null, isClean: true },
        'Z-04': { startTime: null, duration: null, isClean: true },
    });

    const [fridgeTemperatures, setFridgeTemperatures] = useState<FridgeTemp[]>([]);
    const [prepBatches, setPrepBatches] = useState<PrepBatch[]>([]);
    const [wasteLogs, setWasteLogs] = useState<WasteLog[]>([]);
    const [activePos, setActivePos] = useState<POEntry[]>([
        {
            id: 'PO-1001',
            supplier: 'Galactic Supplies Co.',
            status: 'PENDING',
            items: [
                { item: 'Napkins', barcode: 'NPK-001', unit: 'packs', expected: 500, received: 0 },
                { item: 'Bottled Water', barcode: 'H2O-500', unit: 'bottles', expected: 200, received: 0 },
                { item: 'Safety Vests', barcode: 'SFT-VST', unit: 'pcs', expected: 50, received: 0 }
            ]
        },
        {
            id: 'PO-1002',
            supplier: 'Terra Retail Group',
            status: 'PENDING',
            items: [
                { item: 'Souvenir Magnets', barcode: 'MAG-001', unit: 'pcs', expected: 100, received: 0 },
                { item: 'Themed T-Shirts', barcode: 'TSH-001', unit: 'pcs', expected: 75, received: 0 }
            ]
        }
    ]);
    const [centralStorage, setCentralStorage] = useState<Record<string, number>>({
        'Napkins': 1000,
        'Bottled Water': 500,
        'Safety Vests': 50,
        'Souvenir Magnets': 200,
        'Themed T-Shirts': 150
    });
    const [manualRestockLogs, setManualRestockLogs] = useState<any[]>([]);

    const [hardwareChecklists, setHardwareChecklists] = useState<HardwareChecklistEntry[]>([]);
    const [consumables, setConsumables] = useState<Record<string, number>>({
        'Bandages': 100,
        'Ice Packs': 50,
        'Antiseptic': 30
    });

    const [technicalIncidents, setTechnicalIncidents] = useState<TechnicalIncident[]>([]);
    const [zoneStatuses, setZoneStatuses] = useState<Record<string, 'Green' | 'Yellow' | 'Degraded'>>({
        'Z-01': 'Green',
        'Z-02': 'Green',
        'Z-03': 'Green',
        'Z-04': 'Green',
    });
    const [restockTasks, setRestockTasks] = useState<RestockTask[]>([
        { id: 'RT-101', item: 'Cola Syrup', quantity: 2, unit: 'boxes', origin: 'Main Warehouse', standLocation: 'Snack Bar', status: 'PENDING', requestedAt: new Date(), isUrgent: true, zoneId: 'Z-01', priority: 'CRITICAL', barcode: 'SYN-001' },
        { id: 'RT-102', item: 'Paper Cups', quantity: 500, unit: 'pcs', origin: 'Cafe Storage', standLocation: 'Cafe', status: 'PENDING', requestedAt: new Date(), isUrgent: false, zoneId: 'Z-02', priority: 'NORMAL', barcode: 'CUP-500' }
    ]);
    const [logisticsIncidents, setLogisticsIncidents] = useState<Incident[]>([]);
    const [auditRequests, setAuditRequests] = useState<AuditRequest[]>([
        { id: 'AUD-001', item: 'Bottled Water 500ml', section: 'Main Warehouse A1', unit: 'cases', status: 'PENDING', expectedQty: 150, lastUpdated: new Date() },
        { id: 'AUD-002', item: 'Napkins (Bulk)', section: 'Storage B2', unit: 'boxes', status: 'PENDING', expectedQty: 45, lastUpdated: new Date() }
    ]);
    const [serviceTickets, setServiceTickets] = useState<ServiceTicket[]>([]);

    const addPromoCode = (code: string, scannedBy: string) => {
        setPromoCodes(prev => [...prev, { code, scannedAt: new Date(), scannedBy }]);
    };

    const addFridgeTemp = (temp: number, loggedBy: string) => {
        setFridgeTemperatures(prev => [...prev, { id: `FT-${Date.now()}`, temp, timestamp: new Date(), loggedBy }]);
    };

    const addPrepBatch = (item: string, quantity: number) => {
        setPrepBatches(prev => [...prev, { id: `PB-${Date.now()}`, item, quantity, timestamp: new Date() }]);
    };

    const addWasteLog = (item: string, quantity: number, reason: string) => {
        setWasteLogs(prev => [...prev, { id: `WL-${Date.now()}`, item, quantity, reason, timestamp: new Date() }]);
    };

    const updatePO = (poId: string, items: { item: string; expected: number; received: number }[]) => {
        setActivePos(prev => prev.map(po => {
            if (po.id === poId) {
                return { ...po, items, status: 'RECONCILED' };
            }
            return po;
        }));
    };

    const updateCentralStorage = (item: string, quantityAdded: number) => {
        setCentralStorage(prev => ({
            ...prev,
            [item]: (prev[item] || 0) + quantityAdded
        }));
    };

    const addHardwareChecklist = (entry: HardwareChecklistEntry) => {
        setHardwareChecklists(prev => [...prev, entry]);
    };

    const useConsumable = (item: string, amount: number) => {
        setConsumables(prev => ({
            ...prev,
            [item]: Math.max(0, (prev[item] || 0) - amount)
        }));
    };

    const restockConsumable = (item: string, amount: number) => {
        setConsumables(prev => ({
            ...prev,
            [item]: (prev[item] || 0) + amount
        }));
    };

    const reportTechnicalFailure = (zoneId: string, item: string, reason: string, severity: 'Low' | 'High') => {
        const incidentId = `TECH-${Date.now()}`;
        const newIncident: TechnicalIncident = {
            id: incidentId,
            zoneId,
            item,
            reason,
            severity,
            timestamp: new Date(),
            status: 'OPEN'
        };

        setTechnicalIncidents(prev => [...prev, newIncident]);
        setZoneStatuses(prev => ({ ...prev, [zoneId]: severity === 'High' ? 'Degraded' : 'Yellow' }));

        const newTicket: ServiceTicket = {
            id: `TKT-${Date.now()}`,
            incidentId,
            zoneId,
            item,
            type: severity === 'High' ? 'EXTERNAL' : 'INTERNAL',
            status: 'ACTIVE'
        };
        setServiceTickets(prev => [...prev, newTicket]);
    };

    const resolveTechnicalFailure = (incidentId: string) => {
        setTechnicalIncidents(prev => prev.map(inc => inc.id === incidentId ? { ...inc, status: 'RESOLVED' } : inc));

        const incident = technicalIncidents.find(inc => inc.id === incidentId);
        if (incident) {
            setZoneStatuses(prev => ({ ...prev, [incident.zoneId]: 'Green' }));
        }

        setServiceTickets(prev => prev.map(tkt => tkt.incidentId === incidentId ? { ...tkt, status: 'COMPLETED' } : tkt));
    };

    const value: GlobalState = {
        live_guest_count: liveGuestCount,
        setLiveGuestCount,
        promo_codes: promoCodes,
        addPromoCode,
        crowdControlLevel,
        setCrowdControlLevel,
        cleaning_timers: cleaningTimers,
        setCleaningTimers,
        fridge_temperatures: fridgeTemperatures,
        addFridgeTemp,
        prep_batches: prepBatches,
        addPrepBatch,
        waste_logs: wasteLogs,
        addWasteLog,
        active_pos: activePos,
        updatePO,
        central_storage: centralStorage,
        updateCentralStorage,
        restock_tasks: restockTasks,
        addRestockTask: (task) => setRestockTasks(prev => [task, ...prev]),
        updateRestockTask: (id, updates) => setRestockTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t)),
        logistics_incidents: logisticsIncidents,
        addLogisticsIncident: (inc) => setLogisticsIncidents(prev => [inc, ...prev]),
        manual_restock_logs: manualRestockLogs,
        addManualRestockLog: (log) => setManualRestockLogs(prev => [log, ...prev]),
        audit_requests: auditRequests,
        updateAuditRequest: (id, qty) => setAuditRequests(prev => prev.map(a => a.id === id ? { ...a, actualQty: qty, status: 'COMPLETED', lastUpdated: new Date() } : a)),
        hardware_checklists: hardwareChecklists,
        addHardwareChecklist,
        consumables,
        useConsumable,
        restockConsumable,
        technical_incidents: technicalIncidents,
        zone_statuses: zoneStatuses,
        service_tickets: serviceTickets,
        reportTechnicalFailure,
        resolveTechnicalFailure
    };

    return <GlobalStateContext.Provider value={value}>{children}</GlobalStateContext.Provider>;
};

export const useGlobalState = () => {
    const context = useContext(GlobalStateContext);
    if (context === undefined) {
        throw new Error('useGlobalState must be used within a GlobalStateProvider');
    }
    return context;
};
