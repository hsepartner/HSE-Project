import React, { useState } from 'react';
import { Bell, Search, Filter, Check, Archive, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { NotificationItem } from './NotificationItem';
import { Notification } from '@/types/notification';
import { useLanguage } from '@/hooks/use-language';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
  const [notifications, setNotifications] = useState<Notification[]>(SAMPLE_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);

  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = !priorityFilter || notification.priority === priorityFilter;
    
    if (activeTab === 'all') return matchesSearch && matchesPriority;
    if (activeTab === 'unread') return matchesSearch && notification.status === 'unread' && matchesPriority;
    if (activeTab === 'archived') return matchesSearch && notification.status === 'archived' && matchesPriority;
    return matchesSearch && matchesPriority;
  });

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => 
      n.status === 'unread' ? {...n, status: 'read'} : n
    ));
  };

  const clearAll = () => {
    setNotifications(notifications.map(n => 
      n.status !== 'archived' ? {...n, status: 'archived'} : n
    ));
  };

  const priorityOptions = [
    { value: 'high', label: isRTL ? 'عالية' : 'High' },
    { value: 'medium', label: isRTL ? 'متوسطة' : 'Medium' },
    { value: 'low', label: isRTL ? 'منخفضة' : 'Low' },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-primary/10"
          aria-label={isRTL ? "فتح الإشعارات" : "Open notifications"}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-medium text-destructive-foreground"
            >
              {unreadCount}
            </motion.span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent
        className="w-full sm:max-w-md p-0 border-l border-border/40"
        side={isRTL ? 'left' : 'right'}
      >
        <SheetHeader className="p-6 border-b">
          <SheetTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{isRTL ? "مركز الإشعارات" : "Notification Center"}</h2>
              <p className="text-sm text-muted-foreground">
                {isRTL ? `${unreadCount} إشعارات غير مقروءة` : `${unreadCount} unread notifications`}
              </p>
            </div>
          </SheetTitle>
        </SheetHeader>

        <div className="p-6 space-y-6">
          {/* Search and Filter Bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={isRTL ? "البحث في الإشعارات..." : "Search notifications..."}
                className="pl-9 pr-4"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label={isRTL ? "البحث في الإشعارات" : "Search notifications"}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0">
                  <Filter className="h-4 w-4" />
                  <span className="sr-only">{isRTL ? "تصفية" : "Filter"}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isRTL ? 'start' : 'end'} className="w-48">
                <DropdownMenuItem 
                  onClick={() => setPriorityFilter(null)}
                  className={cn(!priorityFilter && "bg-accent")}
                >
                  <span>{isRTL ? "كل الأولويات" : "All Priorities"}</span>
                </DropdownMenuItem>
                {priorityOptions.map(option => (
                  <DropdownMenuItem 
                    key={option.value}
                    onClick={() => setPriorityFilter(option.value)}
                    className={cn(priorityFilter === option.value && "bg-accent")}
                  >
                    <span>{option.label}</span>
                    {priorityFilter === option.value && (
                      <Check className="ml-auto h-4 w-4" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Notification Summary */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <span>{isRTL ? "ملخص الإشعارات" : "Notification Summary"}</span>
                  <Badge variant="outline" className="border-primary/30 text-primary">
                    {filteredNotifications.length} {isRTL ? "نتيجة" : "results"}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {isRTL ? "نظرة عامة على نشاط الإشعارات" : "Overview of notification activity"}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{unreadCount}</p>
                    <p className="text-xs text-muted-foreground">{isRTL ? "غير مقروء" : "Unread"}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">
                      {notifications.filter(n => n.priority === 'high').length}
                    </p>
                    <p className="text-xs text-muted-foreground">{isRTL ? "عالية" : "High"}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">
                      {notifications.filter(n => n.priority === 'medium').length}
                    </p>
                    <p className="text-xs text-muted-foreground">{isRTL ? "متوسطة" : "Medium"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 gap-2 p-1 bg-muted/50 rounded-lg">
              <TabsTrigger
                value="all"
                className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                {isRTL ? "الكل" : "All"}
              </TabsTrigger>
              <TabsTrigger
                value="unread"
                className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <div className="flex items-center gap-1">
                  {isRTL ? "غير مقروء" : "Unread"}
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-destructive px-1.5 text-xs text-destructive-foreground">
                      {unreadCount}
                    </span>
                  )}
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="archived"
                className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                {isRTL ? "مؤرشف" : "Archived"}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              <ScrollArea className="h-[calc(100vh-22rem)]">
                {filteredNotifications.length > 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-3"
                  >
                    <AnimatePresence>
                      {filteredNotifications.map((notification) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                        >
                          <NotificationItem notification={notification} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex h-40 flex-col items-center justify-center gap-2 text-center"
                  >
                    <Search className="h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      {isRTL ? "لا توجد إشعارات لعرضها" : "No notifications to display"}
                    </p>
                    {searchTerm && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setSearchTerm('')}
                        className="text-primary"
                      >
                        {isRTL ? "مسح البحث" : "Clear search"}
                      </Button>
                    )}
                  </motion.div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="unread" className="mt-4">
              <ScrollArea className="h-[calc(100vh-22rem)]">
                {filteredNotifications.length > 0 ? (
                  <div className="space-y-3">
                    {filteredNotifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <NotificationItem notification={notification} />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-40 flex-col items-center justify-center gap-2 text-center">
                    <Check className="h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      {isRTL ? "لا توجد إشعارات غير مقروءة" : "No unread notifications"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {isRTL ? "كل شيء محدث!" : "You're all caught up!"}
                    </p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="archived" className="mt-4">
              <ScrollArea className="h-[calc(100vh-22rem)]">
                {filteredNotifications.length > 0 ? (
                  <div className="space-y-3">
                    {filteredNotifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <NotificationItem notification={notification} />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-40 flex-col items-center justify-center gap-2 text-center">
                    <Archive className="h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      {isRTL ? "لا توجد إشعارات مؤرشفة" : "No archived notifications"}
                    </p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="p-4 border-t flex items-center justify-between bg-background/95 backdrop-blur"
        >
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="h-8"
          >
            <Check className="h-4 w-4 mr-1" />
            <span className="text-sm">
              {isRTL ? "قراءة الكل" : "Read All"}
            </span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearAll}
            disabled={notifications.length === 0}
            className="h-8"
          >
            <Archive className="h-4 w-4 mr-1" />
            <span className="text-sm">
              {isRTL ? "أرشفة" : "Archive"}
            </span>
          </Button>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
}