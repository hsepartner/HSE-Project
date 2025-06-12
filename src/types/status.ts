export type ExpiryStatus = 'valid' | 'warning' | 'urgent' | 'expired' | 'inactive';

interface StatusConfig {
  label: string;
  color: string;
}

export const STATUS_CONFIG: Record<ExpiryStatus, StatusConfig> = {
  valid: {
    label: 'Valid',
    color: 'green',
  },
  warning: {
    label: 'Warning',
    color: 'yellow',
  },
  urgent: {
    label: 'Urgent',
    color: 'orange',
  },
  expired: {
    label: 'Expired',
    color: 'red',
  },
  inactive: {
    label: 'Inactive',
    color: 'gray',
  },
};

export function getStatusFromDays(days: number | null): ExpiryStatus {
  if (days === null) return 'inactive';
  if (days <= 0) return 'expired';
  if (days <= 7) return 'urgent';
  if (days <= 30) return 'warning';
  return 'valid';
}
