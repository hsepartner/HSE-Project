
export type VendorCategory = 'supplier' | 'maintenance' | 'certification' | 'inspection' | 'rental';

export type VendorStatus = 'active' | 'pending' | 'suspended' | 'inactive';

export type VendorRating = 1 | 2 | 3 | 4 | 5;

export interface Vendor {
  id: string;
  name: string;
  status: VendorStatus;
  category: VendorCategory;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  registrationDate: string;
  taxId?: string;
  website?: string;
  rating?: VendorRating;
  notes?: string;
  verificationStatus: 'verified' | 'pending' | 'rejected';
  documents: VendorDocument[];
  equipmentServed?: string[]; // Array of equipment IDs
  contracts: VendorContract[];
  serviceHistory: ServiceRecord[];
}

export interface VendorDocument {
  id: string;
  name: string;
  type: 'license' | 'insurance' | 'certification' | 'tax' | 'contract' | 'other';
  status: 'verified' | 'pending' | 'rejected';
  issueDate: string;
  expiryDate?: string;
  fileUrl?: string;
  notes?: string;
}

export interface VendorContract {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  value: number;
  currency: string;
  status: 'active' | 'expired' | 'terminated' | 'draft';
  documentId?: string; // Reference to the contract document
  renewalReminder: boolean;
  renewalReminderDays: number;
  equipmentCovered?: string[]; // Array of equipment IDs
}

export interface ServiceRecord {
  id: string;
  equipmentId: string;
  serviceDate: string;
  serviceType: 'maintenance' | 'repair' | 'inspection' | 'installation' | 'calibration';
  description: string;
  cost: number;
  currency: string;
  technicianName?: string;
  status: 'completed' | 'in-progress' | 'scheduled' | 'cancelled';
  attachments?: string[];
  followUpRequired: boolean;
  followUpDate?: string;
  notes?: string;
}

// Vendor configuration similar to equipment categories
export const VENDOR_CATEGORY_CONFIG: Record<VendorCategory, { 
  label: string; 
  color: string; 
  icon: string;
}> = {
  supplier: { 
    label: 'Supplier', 
    color: 'blue-500', 
    icon: 'Truck' 
  },
  maintenance: { 
    label: 'Maintenance', 
    color: 'orange-500', 
    icon: 'Wrench' 
  },
  certification: { 
    label: 'Certification', 
    color: 'green-500', 
    icon: 'FileCheck' 
  },
  inspection: { 
    label: 'Inspection', 
    color: 'purple-500', 
    icon: 'ClipboardCheck' 
  },
  rental: { 
    label: 'Rental', 
    color: 'blue-500', 
    icon: 'Clock' 
  }
};

export const VENDOR_STATUS_CONFIG: Record<VendorStatus, { 
  label: string; 
  color: string; 
  icon: string;
}> = {
  active: { 
    label: 'Active', 
    color: 'green-500', 
    icon: 'CheckCircle' 
  },
  pending: { 
    label: 'Pending', 
    color: 'orange-500', 
    icon: 'Clock' 
  },
  suspended: { 
    label: 'Suspended', 
    color: 'purple-500', 
    icon: 'AlertTriangle' 
  },
  inactive: { 
    label: 'Inactive', 
    color: 'blue-500', 
    icon: 'XCircle' 
  }
};
