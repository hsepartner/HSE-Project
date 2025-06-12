import type { VehicleDailyInspection, VehicleMonthlyInspection } from './vehicleInspection';

export type VehicleCategory = "light" | "heavy" | "commercial";
export type VehicleStatus = "active" | "maintenance" | "decommissioned";
export type VehicleDocumentType = "registration" | "insurance" | "permit" | "inspection" | "maintenance";
export type VehicleDocumentStatus = "verified" | "pending" | "rejected";

export interface VehicleDocument {
  id: string;
  name: string;
  type: VehicleDocumentType;
  status: VehicleDocumentStatus;
  issueDate: string;
  expiryDate: string;
  issuedBy: string;
  fileUrl?: string;
  notes?: string;
}

export interface Vehicle {
  id: string;
  name: string;
  model: string;
  plateNumber: string;
  category: VehicleCategory;
  status: VehicleStatus;
  complianceScore: number;
  nextInspectionDate: string;
  purchaseDate: string;
  location: string;
  assignedTo: string;
  image: string;
  documents: VehicleDocument[];
  project: string;
  dailyInspections?: VehicleDailyInspection[];
  monthlyInspections?: VehicleMonthlyInspection[];
}

export const VEHICLE_CATEGORY_CONFIG = {
  'heavy': {
    label: 'Heavy Vehicle',
    color: 'blue-500',
    icon: 'truck'
  },
  'light': {
    label: 'Light Vehicle',
    color: 'green-500',
    icon: 'car'
  },
  'commercial': {
    label: 'Commercial Vehicle',
    color: 'purple-500',
    icon: 'truck'
  }
};

export const VEHICLE_STATUS_CONFIG = {
  'active': {
    label: 'Active',
    color: 'status-valid',
    icon: 'circle-check'
  },
  'maintenance': {
    label: 'Maintenance',
    color: 'status-warning',
    icon: 'circle-pause'
  },
  'decommissioned': {
    label: 'Decommissioned',
    color: 'status-inactive',
    icon: 'circle-x'
  }
};

export const VEHICLE_DOCUMENT_STATUS_CONFIG = {
  'verified': {
    label: 'Verified',
    color: 'status-valid',
    icon: 'file-check'
  },
  'pending': {
    label: 'Pending',
    color: 'status-warning',
    icon: 'file-minus'
  },
  'rejected': {
    label: 'Rejected',
    color: 'status-expired',
    icon: 'file-x'
  }
};

// Helper function to calculate days until next inspection
export const getDaysUntilNextInspection = (nextInspectionDate: string): number => {
  const today = new Date();
  const inspectionDate = new Date(nextInspectionDate);
  const differenceInTime = inspectionDate.getTime() - today.getTime();
  return Math.ceil(differenceInTime / (1000 * 3600 * 24));
};
