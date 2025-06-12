import type { DailyInspection, MonthlyInspection } from './inspection';

export interface LiftingAccessory {
  id: string;
  accessoryName: string;
  accessoryId: string;
  accessoryType: string;
  manufacturer: string;
  modelNumber: string;
  safeWorkingLoad: string;
  sizeDimensions: string;
  weight: string;
  purchaseDate: Date | null;
  vendor: string;
  condition: 'new' | 'good' | 'maintenance' | 'damaged';
  assignedLocation: string;
  assignedTo: string;
  certificateNo: string;
  certificateIssueDate: Date | null;
  certificateExpiryDate: Date | null;
  nextInspectionDue: Date | null;
  inspectionFrequency: '3 months' | '6 months' | '1 year';
  lastInspectionDate: Date | null;
  inspectionStatus: 'passed' | 'needs-service' | 'failed';
  remarks: string;
  safetyCertified: boolean;
  inspectorName: string;
  storageLocation: string;
  safetyColorCode: string;
  status: 'active' | 'inspection' | 'inactive';
  image?: string;
  project: string;
  dailyInspections?: DailyInspection[];
  monthlyInspections?: MonthlyInspection[];
}