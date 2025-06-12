import type { DailyInspection, MonthlyInspection } from './inspection';

export interface PowerTool {
  id: string;
  toolName: string;
  toolId: string;
  toolType: string;
  manufacturer: string;
  modelNumber: string;
  powerRating: string;
  toolSize: string;
  weight: string;
  purchaseDate: Date | null;
  vendor: string;
  condition: 'new' | 'good' | 'maintenance' | 'damaged';
  assignedLocation: string;
  assignedTo: string;
  certificateNo: string;
  certificateIssueDate: Date | null;
  certificateExpiryDate: Date | null;
  nextCalibrationDue: Date | null;
  inspectionFrequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  lastInspectionDate: Date | null;
  inspectionStatus: 'passed' | 'needs-service' | 'failed';
  remarks: string;
  operatorLicenseRequired: boolean;
  operatorName: string;
  storageLocation: string;
  safetyAccessories: string;
  status: 'active' | 'maintenance' | 'inactive';
  image?: string;
  project: string;
  dailyInspections?: DailyInspection[];
  monthlyInspections?: MonthlyInspection[];
}
