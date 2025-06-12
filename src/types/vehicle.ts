export type VehicleCategory = "light" | "heavy" | "commercial";
export type VehicleStatus = "active" | "maintenance" | "decommissioned";

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
  documents: Array<{
    id: string;
    name: string;
    type: string;
    status: string;
    issueDate: string;
    expiryDate: string;
    issuedBy: string;
  }>;
  project: string;
}
