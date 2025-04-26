import React, { useState } from 'react';
import { Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { NotificationItem } from './NotificationItem';
import { Notification } from '@/types/notification';
import { useLanguage } from '@/hooks/use-language';

// Sample notifications (unchanged)
const SAMPLE_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'maintenance_due',
    title: 'Maintenance Due: Excavator XL2000',
    message: 'Scheduled maintenance is due in 3 days for Excavator XL2000 (CAT320-45678)',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: 'unread',
    priority: 'high',
    relatedItemId: '1',
    relatedItemType: 'equipment',
    actions: [
      { label: 'View Equipment', action: 'view_equipment', href: '/equipment/1' },
      { label: 'Schedule Now', action: 'schedule_maintenance' }
    ]
  },
  {
    id: '2',
    type: 'inspection_required',
    title: 'Inspection Required: Utility Truck',
    message: 'Safety inspection needs to be completed for Utility Truck (FORD450-78901)',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'unread',
    priority: 'medium',
    relatedItemId: '2',
    relatedItemType: 'equipment',
    actions: [
      { label: 'Start Inspection', action: 'start_inspection' }
    ]
  },
  {
    id: '3',
    type: 'certification_expiry',
    title: 'Certification Expiring: Portable Generator',
    message: 'Electrical safety certification for Portable Generator will expire in 15 days',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'read',
    priority: 'medium',
    relatedItemId: '3',
    relatedItemType: 'equipment',
    actions: [
      { label: 'Renew Certification', action: 'renew_certification' }
    ]
  },
  {
    id: '4',
    type: 'vendor_contract_expiry',
    title: 'Contract Expiring: HeavyMaint Services',
    message: 'Service contract with HeavyMaint Services will expire in 30 days',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'read',
    priority: 'low',
    relatedItemId: '2',
    relatedItemType: 'vendor',
    actions: [
      { label: 'View Contract', action: 'view_contract' },
      { label: 'Contact Vendor', action: 'contact_vendor' }
    ]
  },
  {
    id: '5',
    type: 'equipment_status_change',
    title: 'Status Change: Concrete Mixer',
    message: 'Concrete Mixer has been marked as DECOMMISSIONED',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'archived',
    priority: 'low',
    relatedItemId: '4',
    relatedItemType: 'equipment'
  }
];

export function NotificationCenter() {
  const { t, currentLanguage } = useLanguage();
  const isRTL = currentLanguage === 'ar';
  const [notifications] = useState<Notification[]>(SAMPLE_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'unread') return matchesSearch && notification.status === 'unread';
    if (activeTab === 'archived') return matchesSearch && notification.status === 'archived';
    return matchesSearch;
  });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={isRTL ? "فتح الإشعارات" : "Open notifications"}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
              {unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent
        className="w-full sm:max-w-md p-0"
        side={isRTL ? 'left' : 'right'}
      >
        <SheetHeader className="p-6 border-b">
          <SheetTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            {isRTL ? "مركز الإشعارات" : "Notification Center"}
          </SheetTitle>
        </SheetHeader>

        <div className="p-6 space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={isRTL ? "البحث في الإشعارات..." : "Search notifications..."}
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label={isRTL ? "البحث في الإشعارات" : "Search notifications"}
            />
          </div>

          {/* Notification Summary */}
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{isRTL ? "ملخص الإشعارات" : "Notification Summary"}</CardTitle>
              <CardDescription>
                {isRTL ? "نظرة عامة على نشاط الإشعارات" : "Overview of notification activity"}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-sm font-medium">{unreadCount}</p>
                  <p className="text-xs text-muted-foreground">{isRTL ? "غير مقروء" : "Unread"}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">{notifications.filter(n => n.priority === 'high' || n.priority === 'critical').length}</p>
                  <p className="text-xs text-muted-foreground">{isRTL ? "عالية الأولوية" : "High Priority"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 gap-2 p-1 bg-muted rounded-lg">
              <TabsTrigger
                value="all"
                className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow"
              >
                {isRTL ? "الكل" : "All"}
              </TabsTrigger>
              <TabsTrigger
                value="unread"
                className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow"
              >
                {isRTL ? "غير مقروء" : "Unread"}
                {unreadCount > 0 && (
                  <span className="ml-1 rounded-full bg-destructive px-1.5 text-xs text-destructive-foreground">
                    {unreadCount}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="archived"
                className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow"
              >
                {isRTL ? "مؤرشف" : "Archived"}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              <ScrollArea className="h-[calc(100vh-20rem)]">
                {filteredNotifications.length > 0 ? (
                  <div className="space-y-3">
                    {filteredNotifications.map((notification) => (
                      <NotificationItem key={notification.id} notification={notification} />
                    ))}
                  </div>
                ) : (
                  <div className="flex h-32 items-center justify-center">
                    <p className="text-muted-foreground">{isRTL ? "لا توجد إشعارات لعرضها" : "No notifications to display"}</p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="unread" className="mt-4">
              <ScrollArea className="h-[calc(100vh-20rem)]">
                {filteredNotifications.length > 0 ? (
                  <div className="space-y-3">
                    {filteredNotifications.map((notification) => (
                      <NotificationItem key={notification.id} notification={notification} />
                    ))}
                  </div>
                ) : (
                  <div className="flex h-32 items-center justify-center">
                    <p className="text-muted-foreground">{isRTL ? "لا توجد إشعارات غير مقروءة" : "No unread notifications"}</p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="archived" className="mt-4">
              <ScrollArea className="h-[calc(100vh-20rem)]">
                {filteredNotifications.length > 0 ? (
                  <div className="space-y-3">
                    {filteredNotifications.map((notification) => (
                      <NotificationItem key={notification.id} notification={notification} />
                    ))}
                  </div>
                ) : (
                  <div className="flex h-32 items-center justify-center">
                    <p className="text-muted-foreground">{isRTL ? "لا توجد إشعارات مؤرشفة" : "No archived notifications"}</p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        <div className="p-6 border-t flex justify-between">
          <Button variant="outline" size="sm">
            {isRTL ? "وضع علامة مقروء على الكل" : "Mark All as Read"}
          </Button>
          <Button variant="outline" size="sm">
            {isRTL ? "مسح الكل" : "Clear All"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}