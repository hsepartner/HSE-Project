// Common inspection item interface
interface InspectionItem {
  id: string;
  description: string;
  isRequired: boolean;
  status: 'not-checked' | 'passed' | 'failed';
}

// Base inspection interface
interface BaseInspection {
  date: string;
  items: InspectionItem[];
  notes: string;
  status: 'completed';
}

// Daily inspections
export interface DailyInspection extends BaseInspection {
  operatorId: string;
  operatorName: string;
  equipmentId: string;
  toolName: string;
  serialNumber: string;
  manufacturer: string;
  modelNumber: string;
}

// Monthly inspections
export interface MonthlyInspection extends BaseInspection {
  technicianId: string;
  technicianName: string;
  equipmentId: string;
  toolName: string;
  serialNumber: string;
  manufacturer: string;
  modelNumber: string;
  nextInspectionDate: string;
}

// Default checklist items for different equipment categories
export const DEFAULT_DAILY_CHECKLIST_ITEMS: { [key in EquipmentCategory]: InspectionItem[] } = {
  'heavy': [
    { id: 'h1', description: 'Check fluid levels (oil, coolant, hydraulic)', isRequired: true, status: 'not-checked' },
    { id: 'h2', description: 'Inspect tire condition and pressure', isRequired: true, status: 'not-checked' },
    { id: 'h3', description: 'Test all lights and signals', isRequired: true, status: 'not-checked' },
    { id: 'h4', description: 'Check safety features (horn, backup alarm)', isRequired: true, status: 'not-checked' },
    { id: 'h5', description: 'Inspect for visible damage or leaks', isRequired: true, status: 'not-checked' }
  ],
  'light': [
    { id: 'l1', description: 'Check oil and fuel levels', isRequired: true, status: 'not-checked' },
    { id: 'l2', description: 'Inspect tire condition', isRequired: true, status: 'not-checked' },
    { id: 'l3', description: 'Test brakes and steering', isRequired: true, status: 'not-checked' },
    { id: 'l4', description: 'Check all lights', isRequired: true, status: 'not-checked' }
  ],
  'power-tool': [
    { id: 'p1', description: 'Inspect power cord/battery condition', isRequired: true, status: 'not-checked' },
    { id: 'p2', description: 'Check guards and safety features', isRequired: true, status: 'not-checked' },
    { id: 'p3', description: 'Test power switch operation', isRequired: true, status: 'not-checked' },
    { id: 'p4', description: 'Look for visible damage', isRequired: true, status: 'not-checked' }
  ],
  'lifting-tool': [
    { id: 't1', description: 'Inspect chains/slings for damage', isRequired: true, status: 'not-checked' },
    { id: 't2', description: 'Check load capacity indicators', isRequired: true, status: 'not-checked' },
    { id: 't3', description: 'Test safety latches and hooks', isRequired: true, status: 'not-checked' },
    { id: 't4', description: 'Verify emergency stop operation', isRequired: true, status: 'not-checked' }
  ]
};
