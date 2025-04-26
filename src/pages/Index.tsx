
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Bell, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/use-language";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, currentLanguage } = useLanguage();
  const [showWelcomeAlert, setShowWelcomeAlert] = useState(true);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const isRTL = currentLanguage === 'ar';

  useEffect(() => {
    // Check if user is logged in
    const role = localStorage.getItem('userRole');
    
    if (!role) {
      navigate('/login');
      return;
    }
    
    // Get username
    const username = localStorage.getItem('username') || role;
    setUserName(username);
    setUserRole(role);
    
    // Show welcome toast when dashboard loads
    toast({
      title: `${t('welcome')}, ${username}!`,
      description: isRTL 
        ? "لقد قمت بتسجيل الدخول بنجاح إلى لوحة تحكم شريك YourHSE الخاص بك." 
        : "You have successfully logged in to YourHSE Partner dashboard.",
    });
    
    // Hide welcome alert after 8 seconds
    const timer = setTimeout(() => {
      setShowWelcomeAlert(false);
    }, 8000);
    
    return () => clearTimeout(timer);
  }, [navigate, toast, t, isRTL]);

  // Dismiss welcome alert
  const dismissAlert = () => {
    setShowWelcomeAlert(false);
  };

  return (
    <DashboardLayout>
      {showWelcomeAlert && (
        <div className="mb-6 animate-fade-in">
          <Alert 
            className={cn(
              "border-l-4 rtl:border-l-0 rtl:border-r-4 bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-950/40 dark:to-emerald-950/40",
              "relative overflow-hidden"
            )}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-emerald-500/5"></div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <AlertTitle className="text-lg font-semibold mb-1">
                  {isRTL ? 'مرحبًا بك في لوحة تحكم شريك YourHSE' : t('welcome') + ' to YourHSE Partner Dashboard'}
                </AlertTitle>
                <AlertDescription className="text-muted-foreground">
                  {isRTL 
                    ? `مرحبًا ${userName}، أنت مسجل الدخول كـ `
                    : `${t('welcome')} ${userName}, you are logged in as `} 
                  <span className="font-semibold capitalize">{userRole}</span>. 
                  {isRTL 
                    ? ' استكشف لوحة التحكم لإدارة سجلات المعدات وتنبيهات انتهاء صلاحية المستندات وتتبع الصيانة.'
                    : ' Explore the dashboard to manage equipment logs, document expiry alerts, and maintenance tracking.'}
                </AlertDescription>
              </div>
              <button 
                onClick={dismissAlert}
                className="absolute top-3 right-3 rtl:right-auto rtl:left-3 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                aria-label="Dismiss"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <div className="mt-4 flex gap-2 flex-wrap no-rtl-flip">
              <div className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200 px-2 py-1 rounded flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" /> 
                <span>{isRTL ? '5 شهادات معدات ستنتهي صلاحيتها قريبًا' : '5 equipment certificates expiring soon'}</span>
              </div>
              <div className="text-xs bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200 px-2 py-1 rounded flex items-center gap-1">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{isRTL ? 'تم إرسال تذكير بقائمة التحقق اليومية' : 'Daily checklist reminder sent'}</span>
              </div>
            </div>
          </Alert>
        </div>
      )}
      <Dashboard />
    </DashboardLayout>
  );
};

export default Index;
