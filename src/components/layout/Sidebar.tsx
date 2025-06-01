import { cn } from "@/lib/utils";
import { 
  Calendar, 
  Clock, 
  FileCheck, 
  Home, 
  Settings, 
  Truck, 
  Users, 
  CheckCircle,
  CircleAlert,
  LogOut,
  FileText,
  BarChart3,
  Wrench,
  Bell,
  X,
  UserCheck
} from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/hooks/use-language";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type Module = {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  status?: 'expired' | 'urgent' | 'warning' | 'valid' | 'inactive';
  count?: number;
};

interface SidebarProps {
  currentPath: string;
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  isMobileView: boolean;
  handleLogout: () => void;
  onClose?: () => void;
}

export function Sidebar({ 
  currentPath, 
  sidebarOpen, 
  sidebarCollapsed, 
  isMobileView,
  handleLogout,
  onClose
}: SidebarProps) {
  const { t, currentLanguage } = useLanguage();
  const [userRole, setUserRole] = useState('admin');

  useEffect(() => {
    const savedRole = localStorage.getItem('userRole');
    if (savedRole) {
      setUserRole(savedRole);
    }
  }, []);

  // Preserve active state for current path
  const isPathActive = (path: string) => {
    return currentPath === path;
  };

  const dashboardModules: Module[] = [
    { name: t('dashboard'), icon: Home, path: '/', status: 'valid' },
    { name: t('equipment'), icon: Truck, path: '/equipment', status: 'warning', count: 12 },
    { name: t('Power Tools'), icon: Wrench, path: '/power-tools', status: 'warning', count: 7 },
    { name: t('Lifting Tools'), icon: Settings, path: '/lifting-tools', status: 'urgent', count: 4 },
    { name: t('operators'), icon: UserCheck, path: '/operators', status: 'warning', count: 8 },
    { name: t('certifications'), icon: FileCheck, path: '/certifications', status: 'urgent', count: 5 },
    { name: t('maintenance'), icon: Wrench, path: '/maintenance', status: 'expired', count: 3 },
    { name: t('scheduling'), icon: Calendar, path: '/scheduling', status: 'valid' },
  ];

  const managementModules: Module[] = [
    { name: t('users'), icon: Users, path: '/users', status: 'valid' },
    { name: t('analytics'), icon: BarChart3, path: '/analytics', status: 'valid' },
    { name: t('documents'), icon: FileText, path: '/documents', status: 'inactive' },
    { name: t('settings'), icon: Settings, path: '/settings', status: 'inactive' },
  ];

  return (
    <aside className={cn(
      "border-r bg-sidebar flex flex-col h-full transition-all duration-300 ease-in-out",
      isMobileView ? "fixed top-0 bottom-0 z-50" : "relative",
      sidebarCollapsed && !isMobileView ? "w-20" : "w-64",
      !sidebarOpen && isMobileView && "-translate-x-full"
    )}>
      <div className={cn(
        "p-4 border-b border-sidebar-border flex items-center",
        sidebarCollapsed && !isMobileView ? "justify-center" : "justify-between"
      )}>
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/8c82d641-16a6-45c2-baf5-d1cdef4d2b67.png" 
            alt="YourHSE Partner" 
            className={cn(
              "h-10",
              sidebarCollapsed && !isMobileView ? "w-10" : "mr-3"
            )}
          />
          {(!sidebarCollapsed || isMobileView) && (
            <div>
              <h2 className="text-xl font-bold tracking-tight">YourHSE</h2>
              <p className="text-xs text-sidebar-foreground/70">{t("equipmentManagement")}</p>
            </div>
          )}
        </div>
        {isMobileView && onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="md:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 scrollbar-thin">
        <nav className={cn(
          "space-y-6",
          sidebarCollapsed && !isMobileView ? "px-2" : "px-3"
        )}>
          <div>
            {(!sidebarCollapsed || isMobileView) && (
              <h3 className="text-sidebar-foreground/60 text-xs font-medium px-2 mb-2">
                {t("main").toUpperCase()}
              </h3>
            )}
            <ul className="space-y-1">
              {dashboardModules.map((module) => (
                <SidebarItem 
                  key={module.name} 
                  module={module} 
                  active={isPathActive(module.path)}
                  collapsed={sidebarCollapsed && !isMobileView}
                />
              ))}
            </ul>
          </div>
          
          <div>
            {(!sidebarCollapsed || isMobileView) && (
              <h3 className="text-sidebar-foreground/60 text-xs font-medium px-2 mb-2">
                {t("management").toUpperCase()}
              </h3>
            )}
            <ul className="space-y-1">
              {managementModules.map((module) => (
                <SidebarItem 
                  key={module.name} 
                  module={module} 
                  active={isPathActive(module.path)}
                  collapsed={sidebarCollapsed && !isMobileView}
                />
              ))}
            </ul>
          </div>

          <div>
            {(!sidebarCollapsed || isMobileView) && (
              <h3 className="text-sidebar-foreground/60 text-xs font-medium px-2 mb-2">
                {t("notifications").toUpperCase()}
              </h3>
            )}
            <ul className="space-y-1">
              <SidebarItem 
                module={{ 
                  name: t('notificationPreferences'), 
                  icon: Bell, 
                  path: '/notification-preferences', 
                  count: 3,
                  status: 'warning'
                }} 
                active={isPathActive('/notification-preferences')}
                collapsed={sidebarCollapsed && !isMobileView}
              />
            </ul>
          </div>

          <div>
            {(!sidebarCollapsed || isMobileView) && (
              <h3 className="text-sidebar-foreground/60 text-xs font-medium px-2 mb-2">
                {t("help").toUpperCase()}
              </h3>
            )}
            <ul className="space-y-1">
              <SidebarItem 
                module={{ 
                  name: t('howItWorks'), 
                  icon: CheckCircle, 
                  path: '/how-it-works'
                }} 
                active={isPathActive('/how-it-works')}
                collapsed={sidebarCollapsed && !isMobileView}
              />
            </ul>
          </div>
        </nav>
      </div>
      
      <div className={cn(
        "border-t border-sidebar-border",
        sidebarCollapsed && !isMobileView ? "p-2" : "p-4"
      )}>
        {(!sidebarCollapsed || isMobileView) && (
          <div className="flex items-center mb-4 space-x-3">
            <div className="w-10 h-10 rounded-full bg-sidebar-primary/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-sidebar-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{t("systemStatus")}</p>
              <p className="text-xs text-sidebar-foreground/70 truncate">
                {t("lastUpdated")}: 5m {t("ago")}
              </p>
            </div>
            <CircleAlert className="h-5 w-5 text-status-expired" />
          </div>
        )}
        
        {sidebarCollapsed && !isMobileView ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                className="w-full h-10 text-sidebar-foreground/80 hover:text-sidebar-foreground"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">{t('logout')}</TooltipContent>
          </Tooltip>
        ) : (
          <Button 
            variant="outline" 
            className="w-full text-sidebar-foreground/80 hover:text-sidebar-foreground justify-start"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            {t('logout')}
          </Button>
        )}
      </div>
    </aside>
  );
}

type SidebarItemProps = {
  module: Module;
  active?: boolean;
  collapsed?: boolean;
};

function SidebarItem({ module, active = false, collapsed = false }: SidebarItemProps) {
  const statusClasses = {
    expired: "text-status-expired bg-status-expired/10 border-status-expired/20",
    urgent: "text-status-urgent bg-status-urgent/10 border-status-urgent/20",
    warning: "text-status-warning bg-status-warning/10 border-status-warning/20",
    valid: "text-status-valid bg-status-valid/10 border-status-valid/20",
    inactive: "text-status-inactive bg-status-inactive/10 border-status-inactive/20",
  };

  const statusClass = module.status ? statusClasses[module.status] : '';

  const icon = <module.icon className="h-5 w-5 flex-shrink-0" />;
  const badge = module.count !== undefined && (
    <span className={cn(
      "h-5 min-w-5 rounded-full px-1 text-xs flex items-center justify-center border",
      statusClass
    )}>
      {module.count}
    </span>
  );

  if (collapsed) {
    return (
      <li>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              to={module.path}
              className={cn(
                "flex flex-col items-center justify-center rounded-md py-3 text-sm font-medium transition-colors",
                active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              {icon}
              {badge && <div className="mt-1">{badge}</div>}
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">
            {module.name}
          </TooltipContent>
        </Tooltip>
      </li>
    );
  }

  return (
    <li>
      <Link
        to={module.path}
        className={cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
          active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        )}
      >
        {icon}
        <span className="flex-1 truncate">{module.name}</span>
        {badge}
      </Link>
    </li>
  );
}