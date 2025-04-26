
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { VendorManagement as VendorManagementComponent } from "@/components/vendor/VendorManagement";

const VendorManagement = () => {
  return (
    <DashboardLayout>
      <VendorManagementComponent />
    </DashboardLayout>
  );
};

export default VendorManagement;
