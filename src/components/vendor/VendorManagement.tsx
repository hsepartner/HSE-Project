
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VendorList } from "@/components/vendor/VendorList";
import { VendorDetail } from "@/components/vendor/VendorDetail";
import { ContractExpiryDashboard } from "@/components/vendor/ContractExpiryDashboard";
import { Vendor } from "@/types/vendor";

// Sample vendor data
const SAMPLE_VENDORS: Vendor[] = [
  {
    id: "1",
    name: "TechInspect Inc.",
    status: "active",
    category: "inspection",
    contactPerson: "John Smith",
    email: "john@techinspect.com",
    phone: "+1 555-123-4567",
    address: "123 Main St, Anytown, USA",
    registrationDate: "2022-01-15",
    website: "https://techinspect.com",
    rating: 4,
    verificationStatus: "verified",
    documents: [
      {
        id: "v1d1",
        name: "Inspection License",
        type: "license",
        status: "verified",
        issueDate: "2023-01-01",
        expiryDate: "2025-01-01"
      },
      {
        id: "v1d2",
        name: "Insurance Certificate",
        type: "insurance",
        status: "verified",
        issueDate: "2024-01-01",
        expiryDate: "2025-01-01"
      }
    ],
    equipmentServed: ["1", "2", "5"],
    contracts: [
      {
        id: "c1",
        title: "Annual Inspection Services",
        startDate: "2024-01-01",
        endDate: "2025-06-15",
        value: 25000,
        currency: "USD",
        status: "active",
        renewalReminder: true,
        renewalReminderDays: 30,
        equipmentCovered: ["1", "2", "5"]
      }
    ],
    serviceHistory: [
      {
        id: "s1",
        equipmentId: "1",
        serviceDate: "2024-02-10",
        serviceType: "inspection",
        description: "Annual safety inspection",
        cost: 1200,
        currency: "USD",
        technicianName: "Mike Johnson",
        status: "completed",
        followUpRequired: false
      },
      {
        id: "s2",
        equipmentId: "2",
        serviceDate: "2024-03-15",
        serviceType: "inspection",
        description: "Hydraulic system inspection",
        cost: 850,
        currency: "USD",
        technicianName: "Mike Johnson",
        status: "completed",
        followUpRequired: true,
        followUpDate: "2024-06-15",
        notes: "Minor leak detected, needs follow-up inspection"
      }
    ]
  },
  {
    id: "2",
    name: "HeavyMaint Services",
    status: "active",
    category: "maintenance",
    contactPerson: "Sarah Wilson",
    email: "sarah@heavymaint.com",
    phone: "+1 555-987-6543",
    address: "456 Service Rd, Repairville, USA",
    registrationDate: "2021-05-20",
    website: "https://heavymaint.com",
    rating: 5,
    verificationStatus: "verified",
    documents: [
      {
        id: "v2d1",
        name: "Maintenance Certification",
        type: "certification",
        status: "verified",
        issueDate: "2023-05-01",
        expiryDate: "2025-05-01"
      }
    ],
    equipmentServed: ["1", "3", "4"],
    contracts: [
      {
        id: "c2",
        title: "Preventive Maintenance Contract",
        startDate: "2023-06-01",
        endDate: "2024-06-01",
        value: 45000,
        currency: "USD",
        status: "active",
        renewalReminder: true,
        renewalReminderDays: 45,
        equipmentCovered: ["1", "3", "4"]
      }
    ],
    serviceHistory: [
      {
        id: "s3",
        equipmentId: "1",
        serviceDate: "2024-01-05",
        serviceType: "maintenance",
        description: "Quarterly maintenance service",
        cost: 2200,
        currency: "USD",
        technicianName: "Robert Miller",
        status: "completed",
        followUpRequired: false
      }
    ]
  },
  {
    id: "3",
    name: "EquipCert Authority",
    status: "active",
    category: "certification",
    contactPerson: "David Brown",
    email: "david@equipcert.com",
    phone: "+1 555-456-7890",
    address: "789 Cert Ave, Standardville, USA",
    registrationDate: "2020-11-10",
    website: "https://equipcert.com",
    rating: 4,
    verificationStatus: "verified",
    documents: [
      {
        id: "v3d1",
        name: "Accreditation Certificate",
        type: "certification",
        status: "verified",
        issueDate: "2022-11-01",
        expiryDate: "2025-11-01"
      }
    ],
    equipmentServed: ["1", "2", "3", "4", "5"],
    contracts: [
      {
        id: "c3",
        title: "Equipment Certification Services",
        startDate: "2023-01-01",
        endDate: "2024-12-31",
        value: 18000,
        currency: "USD",
        status: "active",
        renewalReminder: true,
        renewalReminderDays: 60,
        equipmentCovered: ["1", "2", "3", "4", "5"]
      }
    ],
    serviceHistory: [
      {
        id: "s4",
        equipmentId: "1",
        serviceDate: "2023-12-15",
        serviceType: "inspection",
        description: "Certification inspection",
        cost: 1500,
        currency: "USD",
        technicianName: "Jennifer Lee",
        status: "completed",
        followUpRequired: false
      }
    ]
  }
];

export function VendorManagement() {
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(SAMPLE_VENDORS[0]);
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Vendor Management</h1>
        <p className="text-muted-foreground">
          Manage and track vendor information, contracts, and service history.
        </p>
      </div>
      
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Vendor List</TabsTrigger>
          <TabsTrigger value="detail">Vendor Details</TabsTrigger>
          <TabsTrigger value="contracts">Contract Expiry</TabsTrigger>
          <TabsTrigger value="performance">Performance Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="space-y-4">
          <VendorList 
            vendors={SAMPLE_VENDORS} 
            onSelectVendor={setSelectedVendor} 
          />
        </TabsContent>
        
        <TabsContent value="detail" className="space-y-4">
          {selectedVendor ? (
            <VendorDetail vendor={selectedVendor} />
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <p className="text-muted-foreground">
                  Please select a vendor to view details
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="contracts" className="space-y-4">
          <ContractExpiryDashboard vendors={SAMPLE_VENDORS} />
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Performance Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">
                  Vendor performance analytics will be displayed here.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
