import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Sidebar } from "../layout/Sidebar";
import { ThemeToggle } from "../theme/ThemeToggle";
import { NotificationCenter } from "../notification/NotificationCenter";
import { LanguageToggle } from "../language/LanguageToggle";
import {
  X,
  ChevronLeft,
  ChevronRight,
  User,
  Info,
  Settings,
  LogOut,
} from "lucide-react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/use-language";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [isTabletView, setIsTabletView] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState<string>("");
  const [userRole, setUserRole] = useState<string>("");
  const { t, currentLanguage } = useLanguage();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const checkViewport = () => {
      const mobile = window.innerWidth < 768;
      const tablet = window.innerWidth >= 768 && window.innerWidth < 1024;

      setIsMobileView(mobile);
      setIsTabletView(tablet);

      if (mobile) {
        setSidebarOpen(false);
        setSidebarCollapsed(false);
      } else if (tablet) {
        setSidebarOpen(true);
        setSidebarCollapsed(true);
      } else {
        setSidebarOpen(true);
        setSidebarCollapsed(false);
      }
    };

    checkViewport();
    window.addEventListener("resize", checkViewport);

    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  // Set document direction based on language
  useEffect(() => {
    // Always keep LTR direction regardless of language
    document.documentElement.dir = "ltr";
    document.documentElement.style.direction = "ltr";
    document.documentElement.lang = currentLanguage;
    
    // Remove any RTL classes that might be added automatically
    document.documentElement.classList.remove('rtl');
    document.body.classList.remove('rtl');
  }, [currentLanguage]);

  useEffect(() => {
    const role = localStorage.getItem("userRole") || "admin";
    const name = localStorage.getItem("username") || role;
    setUsername(name);
    setUserRole(role);
  }, []);

  const toggleSidebar = () => {
    if (isMobileView) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;

    try {
      setIsLoggingOut(true);

      // Try to call logout API
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          await fetch('https://laravel.mysignages.com/api/logout', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
          });
        } catch (error) {
          console.error('Logout API error:', error);
          // Continue with local logout even if API fails
        }
      }

      // Clear local storage
      localStorage.removeItem("userRole");
      localStorage.removeItem("username");
      localStorage.removeItem("userId");
      localStorage.removeItem("authToken");
      localStorage.setItem("loggingOut", "true");

      // Show toast
      toast({
        title: t("loggedOut"),
        description: t("logoutSuccessful"),
      });

      // Navigate after a short delay
      setTimeout(() => {
        navigate("/login");
      }, 500);
    } catch (error) {
      setIsLoggingOut(false);
      localStorage.removeItem("loggingOut");
      toast({
        title: t("error"),
        description: t("logoutFailed"),
        variant: "destructive",
      });
    }
  };

  if (isLoggingOut) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex h-screen overflow-hidden bg-background">
        {isMobileView && sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div
          className={cn(
            "transition-all duration-300 ease-in-out h-full",
            isMobileView &&
              (sidebarOpen
                ? "fixed top-0 z-50 w-64 translate-x-0"
                : "fixed top-0 z-50 w-64 -translate-x-full"),
            !isMobileView &&
              (sidebarCollapsed ? "relative z-10 w-20" : "relative z-10 w-64")
          )}
        >
          <Sidebar
            currentPath={location.pathname}
            sidebarOpen={sidebarOpen}
            sidebarCollapsed={sidebarCollapsed}
            isMobileView={isMobileView}
            handleLogout={handleLogout}
            onClose={() => setSidebarOpen(false)}
          />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-background border-b h-16 flex items-center px-4 sticky top-0 z-30 shadow-sm">
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className="text-muted-foreground hover:text-foreground bg-background hover:bg-accent rounded-md p-1.5 transition-colors"
                    onClick={toggleSidebar}
                    aria-label="Toggle sidebar"
                  >
                    {sidebarOpen && isMobileView ? (
                      <X className="h-5 w-5" />
                    ) : sidebarCollapsed && !isMobileView ? (
                      <ChevronRight className="h-5 w-5" />
                    ) : (
                      <ChevronLeft className="h-5 w-5" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  {sidebarOpen && isMobileView
                    ? t("closeSidebar")
                    : sidebarCollapsed && !isMobileView
                    ? t("expandSidebar")
                    : t("collapseSidebar")}
                </TooltipContent>
              </Tooltip>

              <div className="flex items-center">
                {(!sidebarOpen || sidebarCollapsed || isMobileView) && (
                  <img
                    src="/lovable-uploads/8c82d641-16a6-45c2-baf5-d1cdef4d2b67.png"
                    alt="YourHSE Partner"
                    className="h-8 mr-2"
                  />
                )}
                <h1
                  className={cn(
                    "text-xl font-semibold truncate",
                    !sidebarOpen || sidebarCollapsed || isMobileView
                      ? "block"
                      : "hidden md:block"
                  )}
                >
                  YourHSE Partner
                </h1>
              </div>
            </div>

            <div className="flex-1" />

            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Dialog open={showHelpModal} onOpenChange={setShowHelpModal}>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground"
                      >
                        <Info className="h-5 w-5" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>{t("howItWorks")}</DialogTitle>
                        <DialogDescription>{t("quickGuide")}</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <h3 className="font-medium">
                            {t("equipmentManagement")}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {t("equipmentManagementDescription")}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <h3 className="font-medium">
                            {t("certificationsDocuments")}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {t("certificationsDocumentsDescription")}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <h3 className="font-medium">
                            {t("schedulingMaintenance")}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {t("schedulingMaintenanceDescription")}
                          </p>
                        </div>

                        <div className="mt-6 flex justify-end">
                          <Button
                            onClick={() => {
                              setShowHelpModal(false);
                              navigate("/how-it-works");
                            }}
                          >
                            {t("viewFullGuide")}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TooltipTrigger>
                <TooltipContent side="bottom">{t("help")}</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <LanguageToggle />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  {t("changeLanguage")}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <NotificationCenter />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  {t("notifications")}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <ThemeToggle />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  {t("toggleTheme")}
                </TooltipContent>
              </Tooltip>

              {/* User profile dropdown - consistent across all screen sizes */}
              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex items-center gap-2 border-l pl-3 ml-2 h-10 focus:outline-none">
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-medium truncate max-w-[120px]">
                        {username}
                      </span>
                      <span className="text-xs text-muted-foreground capitalize">
                        {userRole}
                      </span>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <User className="h-4 w-4" />
                    </div>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-0" align="end">
                  <div className="py-1">
                    <Link
                      to="/settings"
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-accent/50"
                    >
                      <Settings className="h-4 w-4" />
                      <span>{t("settings")}</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-accent/50"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>{t("logout")}</span>
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto bg-muted/20 p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}