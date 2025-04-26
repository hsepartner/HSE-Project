import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Notification, NotificationPriority } from '@/types/notification';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Wrench, 
  FileCheck, 
  Award, 
  AlertTriangle, 
  FileText, 
  Clock, 
  User,
  Bell
} from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

// Map notification types to icons
const NOTIFICATION_ICONS: Record<string, React.ReactNode> = {
  maintenance_due: <Wrench className="h-5 w-5 text-blue-600" />,
  inspection_required: <FileCheck className="h-5 w-5 text-green-600" />,
  certification_expiry: <Award className="h-5 w-5 text-yellow-600" />,
  equipment_status_change: <AlertTriangle className="h-5 w-5 text-orange-600" />,
  vendor_contract_expiry: <FileText className="h-5 w-5 text-purple-600" />,
  document_approval_required: <FileCheck className="h-5 w-5 text-green-600" />,
  equipment_assignment: <User className="h-5 w-5 text-teal-600" />,
  system_alert: <Bell className="h-5 w-5 text-red-600" />,
};

// Map priority to colors and labels
const PRIORITY_STYLES: Record<NotificationPriority, { color: string, label: string }> = {
  low: { color: "bg-blue-100 text-blue-700 border-blue-200", label: "Low" },
  medium: { color: "bg-amber-100 text-amber-700 border-amber-200", label: "Medium" },
  high: { color: "bg-orange-100 text-orange-700 border-orange-200", label: "High" },
  critical: { color: "bg-red-100 text-red-700 border-red-200", label: "Critical" },
};

interface NotificationItemProps {
  notification: Notification;
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const { t, currentLanguage } = useLanguage();
  const isRTL = currentLanguage === 'ar';
  const isUnread = notification.status === 'unread';

  // Placeholder for user avatar (can be replaced with actual user data)
  const userAvatar = notification.relatedItemType === 'equipment' ? (
    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-xs font-medium">
      {notification.title.charAt(0).toUpperCase()}
    </div>
  ) : null;

  return (
    <div
      className={cn(
        "relative rounded-lg border p-4 transition-all duration-200 hover:shadow-md",
        isUnread ? "bg-muted/50" : "bg-background",
        PRIORITY_STYLES[notification.priority].color
      )}
    >
      {isUnread && (
        <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-primary" />
      )}

      <div className="flex gap-4">
        <div className="mt-0.5">
          {NOTIFICATION_ICONS[notification.type] || <Bell className="h-5 w-5 text-muted-foreground" />}
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <p className="font-medium text-sm">{notification.title}</p>
            <span
              className={cn(
                "text-xs font-medium px-2 py-1 rounded-full",
                PRIORITY_STYLES[notification.priority].color
              )}
            >
              {isRTL ? t(`priority_${notification.priority}`) : PRIORITY_STYLES[notification.priority].label}
            </span>
          </div>

          <p className="text-sm text-muted-foreground">{notification.message}</p>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
          </div>

          {notification.actions && notification.actions.length > 0 && (
            <div className="flex gap-2 pt-2">
              <TooltipProvider>
                {notification.actions.map((action, i) => (
                  <Tooltip key={i}>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant={i === 0 ? "default" : "outline"}
                        className="h-8"
                        asChild={!!action.href}
                      >
                        {action.href ? (
                          <a href={action.href}>{action.label}</a>
                        ) : (
                          action.label
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isRTL ? `تنفيذ ${action.label}` : `Perform ${action.label}`}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
          )}
        </div>

        {userAvatar && (
          <div className="mt-0.5">
            {userAvatar}
          </div>
        )}
      </div>
    </div>
  );
}