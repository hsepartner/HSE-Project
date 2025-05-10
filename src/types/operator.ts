export enum OperatorDocumentType {
    OPERATOR_CV = "OPERATOR_CV",
    LICENSE = "LICENSE",
    CERTIFICATION = "CERTIFICATION",
    TRAINING = "TRAINING",
    MEDICAL = "MEDICAL",
    PASSPORT = "PASSPORT"
  }
  
  export enum DocumentStatus {
    PENDING = "PENDING",
    VALIDATED = "VALIDATED",
    REJECTED = "REJECTED",
    EXPIRED = "EXPIRED"
  }
  
  export interface OperatorDocument {
    id: string;
    type: OperatorDocumentType;
    fileName: string;
    fileUrl: string;
    uploadDate: string;
    expiryDate?: string | null;
    status: DocumentStatus;
    notes?: string;
  }
  
  export interface Operator {
    id: string;
    name: string;
    email: string;
    documents: OperatorDocument[];
    active: boolean;
    role?: string;
    department?: string;
    profileImageUrl?: string;
  }