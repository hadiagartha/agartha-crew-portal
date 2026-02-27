import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Incident, RestockTask, IncidentSeverity } from '../types';

interface HardwareChecklistEntry {
    id: string;
    zone: string;
    item: string;
    status: 'Pass' | 'Fail';
    timestamp: Date;
    checkedBy: string;
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
    items: { item: string; expected: number; received: number }[];
    status: 'PENDING' | 'RECONCILED';
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

    hardware_checklists: HardwareChecklistEntry[];
    addHardwareChecklist: (entry: HardwareChecklistEntry) => void;

    consumables: Record<string, number>;
    useConsumable: (item: string, amount: number) => void;
    restockConsumable: (item: string, amount: number) => void;
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
        { id: 'PO-1001', status: 'PENDING', items: [{ item: 'Napkins', expected: 500, received: 0 }, { item: 'Bottled Water', expected: 200, received: 0 }] }
    ]);
    const [centralStorage, setCentralStorage] = useState<Record<string, number>>({
        'Napkins': 1000,
        'Bottled Water': 500
    });

    const [hardwareChecklists, setHardwareChecklists] = useState<HardwareChecklistEntry[]>([]);
    const [consumables, setConsumables] = useState<Record<string, number>>({
        'Bandages': 100,
        'Ice Packs': 50,
        'Antiseptic': 30
    });

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
        hardware_checklists: hardwareChecklists,
        addHardwareChecklist,
        consumables,
        useConsumable,
        restockConsumable
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
