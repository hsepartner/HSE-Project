
export type ExpiryStatus = 'expired' | 'urgent' | 'warning' | 'valid' | 'inactive';

export interface StatusConfig {
  label: string;
  color: string;
  description: string;
  daysRange: string;
}

export const STATUS_CONFIG: Record<ExpiryStatus, StatusConfig> = {
  expired: {
    label: 'Expired',
    color: 'status-expired',
    description: 'Expired or critical issues',
    daysRange: '0 days or past expiry'
  },
  urgent: {
    label: 'Urgent',
    color: 'status-urgent',
    description: 'Requires urgent attention',
    daysRange: '1-7 days to expiry'
  },
  warning: {
    label: 'Warning',
    color: 'status-warning',
    description: 'Warning state',
    daysRange: '8-30 days to expiry'
  },
  valid: {
    label: 'Valid',
    color: 'status-valid',
    description: 'Valid and compliant',
    daysRange: '31+ days to expiry'
  },
  inactive: {
    label: 'Not Applicable',
    color: 'status-inactive',
    description: 'Not applicable or inactive',
    daysRange: 'N/A'
  }
};

export const getStatusFromDays = (daysToExpiry: number | null): ExpiryStatus => {
  if (daysToExpiry === null) return 'inactive';
  if (daysToExpiry <= 0) return 'expired';
  if (daysToExpiry <= 7) return 'urgent';
  if (daysToExpiry <= 30) return 'warning';
  return 'valid';
};
