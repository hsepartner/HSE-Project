export function getDaysUntilNextInspection(nextInspectionDate: string): number {
  const today = new Date();
  const inspectionDate = new Date(nextInspectionDate);
  const diffTime = inspectionDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getStatusType(daysToNextInspection: number): "valid" | "warning" | "expired" {
  if (daysToNextInspection > 30) {
    return "valid";
  } else if (daysToNextInspection > 0) {
    return "warning";
  } else {
    return "expired";
  }
}
