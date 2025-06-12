import { VehicleCategory } from "./vehicle";

export type InspectionItemStatus = 'passed' | 'failed' | 'not-checked';

export interface InspectionItem {
  id: string;
  description: string;
  isRequired: boolean;
  status: InspectionItemStatus;
  notes?: string;
  checkedBy?: string;
  checkedAt?: string;
}

export interface VehicleDailyInspection {
  date: string;
  driverId: string;
  driverName: string;
  items: InspectionItem[];
  notes?: string;
  status: 'completed' | 'incomplete';
  vehicleId: string;
  mileage: number;
}

export interface VehicleMonthlyInspection {
  date: string;
  technicianId: string;
  technicianName: string;
  items: InspectionItem[];
  notes?: string;
  status: 'completed' | 'incomplete';
  vehicleId: string;
  nextInspectionDate: string;
  mileage: number;
}

export const DEFAULT_VEHICLE_DAILY_CHECKLIST_ITEMS: { [key in VehicleCategory]: InspectionItem[] } = {
  'heavy': [
    { id: 'vh1', description: 'Check engine oil level', isRequired: true, status: 'not-checked' },
    { id: 'vh2', description: 'Check coolant level', isRequired: true, status: 'not-checked' },
    { id: 'vh3', description: 'Check brake fluid', isRequired: true, status: 'not-checked' },
    { id: 'vh4', description: 'Inspect tire condition and pressure', isRequired: true, status: 'not-checked' },
    { id: 'vh5', description: 'Test all lights and signals', isRequired: true, status: 'not-checked' },
    { id: 'vh6', description: 'Check horn and backup alarm', isRequired: true, status: 'not-checked' },
    { id: 'vh7', description: 'Inspect windshield and wipers', isRequired: true, status: 'not-checked' },
    { id: 'vh8', description: 'Check mirrors and cameras', isRequired: true, status: 'not-checked' }
  ],
  'light': [
    { id: 'vl1', description: 'Check engine oil level', isRequired: true, status: 'not-checked' },
    { id: 'vl2', description: 'Check coolant level', isRequired: true, status: 'not-checked' },
    { id: 'vl3', description: 'Check brake fluid', isRequired: true, status: 'not-checked' },
    { id: 'vl4', description: 'Inspect tire condition', isRequired: true, status: 'not-checked' },
    { id: 'vl5', description: 'Test all lights', isRequired: true, status: 'not-checked' },
    { id: 'vl6', description: 'Check windshield and wipers', isRequired: true, status: 'not-checked' }
  ],
  'commercial': [
    { id: 'vc1', description: 'Check engine oil level', isRequired: true, status: 'not-checked' },
    { id: 'vc2', description: 'Check coolant level', isRequired: true, status: 'not-checked' },
    { id: 'vc3', description: 'Check brake fluid', isRequired: true, status: 'not-checked' },
    { id: 'vc4', description: 'Inspect tire condition', isRequired: true, status: 'not-checked' },
    { id: 'vc5', description: 'Test all lights and signals', isRequired: true, status: 'not-checked' },
    { id: 'vc6', description: 'Check cargo area security', isRequired: true, status: 'not-checked' },
    { id: 'vc7', description: 'Inspect load securing mechanisms', isRequired: true, status: 'not-checked' }
  ]
};
