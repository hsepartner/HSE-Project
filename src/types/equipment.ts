import type { DailyInspection, MonthlyInspection } from './inspection';

export type EquipmentCategory = 'heavy' | 'light' | 'power-tool' | 'lifting-tool';
export type OperationalStatus = 'active' | 'maintenance' | 'decommissioned';
export type DocumentStatus = 'verified' | 'pending' | 'rejected';
export type DocumentType = 'certificate' | 'manual' | 'inspection';

export interface Equipment {
  id: string;
  name: string;
  model: string;
  serialNumber: string;
  category: EquipmentCategory;
  status: OperationalStatus;
  complianceScore: number;
  nextInspectionDate: string;
  purchaseDate: string;
  documents: Document[];
  notes?: string;
  assignedTo?: string;
  location?: string;
  parentEquipmentId?: string;
  image?: string;
  dailyInspections?: DailyInspection[];
  monthlyInspections?: MonthlyInspection[];
}

export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  status: DocumentStatus;
  issueDate: string;
  expiryDate: string;
  issuedBy?: string;
  fileUrl?: string;
  notes?: string;
}

export const CATEGORY_CONFIG = {
  'heavy': {
    label: 'Heavy Equipment',
    color: 'blue-500',
    icon: 'truck'
  },
  'light': {
    label: 'Light Vehicles',
    color: 'green-500',
    icon: 'car'
  },
  'power-tool': {
    label: 'Power Tools',
    color: 'orange-500',
    icon: 'wrench'
  },
  'lifting-tool': {
    label: 'Lifting Tools',
    color: 'red-500',
    icon: 'settings'
  }
};

export const STATUS_CONFIG = {
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

export const DOCUMENT_STATUS_CONFIG = {
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

export const DOCUMENT_TYPE_CONFIG = {
  'certificate': {
    label: 'Certificate',
    color: 'blue-500',
    icon: 'file-check'
  },
  'manual': {
    label: 'Manual',
    color: 'purple-500',
    icon: 'file-text'
  },
  'inspection': {
    label: 'Inspection',
    color: 'orange-500',
    icon: 'calendar'
  }
};

// Helper function to calculate days until next inspection
export const getDaysUntilNextInspection = (nextInspectionDate: string): number => {
  const today = new Date();
  const inspectionDate = new Date(nextInspectionDate);
  const differenceInTime = inspectionDate.getTime() - today.getTime();
  return Math.ceil(differenceInTime / (1000 * 3600 * 24));
};
