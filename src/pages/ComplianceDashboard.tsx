
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ComplianceDashboard as ComplianceDashboardComponent } from "@/components/compliance/ComplianceDashboard";

const ComplianceDashboard = () => {
  return (
    <DashboardLayout>
      <ComplianceDashboardComponent />
    </DashboardLayout>
  );
};

export default ComplianceDashboard;
