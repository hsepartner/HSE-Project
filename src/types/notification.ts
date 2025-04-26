
export type NotificationChannel = 'in-app' | 'email' | 'sms' | 'whatsapp';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'critical';

export type NotificationType = 
  | 'maintenance_due' 
  | 'inspection_required' 
  | 'certification_expiry' 
  | 'equipment_status_change'
  | 'vendor_contract_expiry'
  | 'document_approval_required'
  | 'equipment_assignment'
  | 'system_alert';

export type NotificationStatus = 'unread' | 'read' | 'archived';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  status: NotificationStatus;
  priority: NotificationPriority;
  relatedItemId?: string; // ID of equipment, vendor, etc.
  relatedItemType?: 'equipment' | 'vendor' | 'document' | 'inspection';
  actions?: NotificationAction[];
  metadata?: Record<string, any>;
}

export interface NotificationAction {
  label: string;
  action: string; // A unique identifier for the action
  href?: string; // Optional link
}

export interface NotificationPreference {
  type: NotificationType;
  channels: Record<NotificationChannel, boolean>;
  enabled: boolean;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  type: NotificationType;
  subject: string;
  content: string;
  variables: string[]; // List of available variables
}
