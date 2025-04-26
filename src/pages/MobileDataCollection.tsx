
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MobileDataCollection as MobileDataCollectionComponent } from "@/components/mobile/MobileDataCollection";

const MobileDataCollection = () => {
  return (
    <DashboardLayout>
      <MobileDataCollectionComponent />
    </DashboardLayout>
  );
};

export default MobileDataCollection;
