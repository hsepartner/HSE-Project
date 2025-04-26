
import { ExpiryStatus } from "./status";

export type InspectionFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
export type InspectionStatus = 'pending' | 'in-progress' | 'completed' | 'overdue' | 'not-applicable';
export type DefectSeverity = 'critical' | 'major' | 'minor' | 'cosmetic';
export type MaintenanceType = 'preventive' | 'corrective' | 'predictive' | 'condition-based';

export interface ChecklistItem {
  id: string;
  description: string;
  isRequired: boolean;
  status: 'passed' | 'failed' | 'not-checked';
  notes?: string;
}

export interface InspectionChecklist {
  id: string;
  title: string;
  equipmentId: string;
  frequency: InspectionFrequency;
  status: InspectionStatus;
  dueDate: string;
  assignedTo?: string;
  completedBy?: string;
  completedDate?: string;
  items: ChecklistItem[];
}

export interface MaintenanceSchedule {
  id: string;
  equipmentId: string;
  title: string;
  description?: string;
  type: MaintenanceType;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  scheduledDate: string;
  estimatedDuration: number; // in hours
  actualDuration?: number;
  assignedTo?: string;
  completedBy?: string;
  completedDate?: string;
  parts?: MaintenancePart[];
}

export interface MaintenancePart {
  id: string;
  name: string;
  partNumber: string;
  quantity: number;
  unitCost?: number;
  replacementDate?: string;
  expiryDate?: string;
  status?: ExpiryStatus;
}

export interface Defect {
  id: string;
  equipmentId: string;
  title: string;
  description: string;
  reportedDate: string;
  reportedBy: string;
  severity: DefectSeverity;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  assignedTo?: string;
  resolvedDate?: string;
  resolvedBy?: string;
  maintenanceId?: string;
  attachments?: string[]; // URLs to images or documents
}

export interface ComplianceMetric {
  equipmentId: string;
  overallScore: number; // 0-100
  lastUpdated: string;
  expiryStatus: ExpiryStatus;
  inspectionScore: number;
  maintenanceScore: number;
  documentScore: number;
  defectScore: number;
  nextDueDate: string;
  nextDueItem: string;
}

export const SEVERITY_CONFIG = {
  'critical': {
    label: 'Critical',
    color: 'status-expired',
    description: 'Equipment unusable, safety risk',
    icon: 'alertOctagon'
  },
  'major': {
    label: 'Major',
    color: 'status-urgent',
    description: 'Limited functionality, immediate attention',
    icon: 'alertTriangle'
  },
  'minor': {
    label: 'Minor',
    color: 'status-warning',
    description: 'Functional but needs attention',
    icon: 'alertCircle'
  },
  'cosmetic': {
    label: 'Cosmetic',
    color: 'status-inactive',
    description: 'Visual issues only, no functional impact',
    icon: 'eye'
  }
};

export const INSPECTION_STATUS_CONFIG = {
  'pending': {
    label: 'Pending',
    color: 'status-warning',
    icon: 'clock'
  },
  'in-progress': {
    label: 'In Progress',
    color: 'blue-500',
    icon: 'clipboardCheck'
  },
  'completed': {
    label: 'Completed',
    color: 'status-valid',
    icon: 'checkCircle'
  },
  'overdue': {
    label: 'Overdue',
    color: 'status-expired',
    icon: 'alertCircle'
  },
  'not-applicable': {
    label: 'N/A',
    color: 'status-inactive',
    icon: 'minusCircle'
  }
};

// Helper function to calculate inspection status based on due date
export const getInspectionStatus = (dueDate: string, status: InspectionStatus): InspectionStatus => {
  if (status === 'completed' || status === 'not-applicable') {
    return status;
  }
  
  const today = new Date();
  const inspectionDueDate = new Date(dueDate);
  
  if (inspectionDueDate < today) {
    return 'overdue';
  }
  
  return status;
};

// Helper function to generate a random ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};
