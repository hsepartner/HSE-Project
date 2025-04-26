
import React, { useEffect, useState } from 'react';
import { Bell, Calendar, FileCheck, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/use-language';

interface WelcomeHeaderProps {
  showBanner?: boolean;
}

export function WelcomeHeader({ showBanner = true }: WelcomeHeaderProps) {
  const [userName, setUserName] = useState('User');
  const [userRole, setUserRole] = useState('Admin');
  const { toast } = useToast();
  const { t } = useLanguage();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    // Get saved user role
    const savedRole = localStorage.getItem('userRole');
    if (savedRole) {
      setUserRole(savedRole.charAt(0).toUpperCase() + savedRole.slice(1));
      setUserName(savedRole.charAt(0).toUpperCase() + savedRole.slice(1));
    }

    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const handleNotificationClick = () => {
    toast({
      title: "Notifications",
      description: "You have 3 pending notifications",
    });
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="bg-gradient-to-r from-blue-600 to-emerald-500 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/lovable-uploads/8c82d641-16a6-45c2-baf5-d1cdef4d2b67.png')] bg-no-repeat bg-right-bottom bg-contain opacity-10"></div>
        
        <div className="flex justify-between items-start relative z-10">
          <div>
            <h1 className="text-3xl font-bold">{greeting}, {userName}!</h1>
            <p className="text-white/80 mt-1">Welcome to YourHSE Partner - Equipment Management Dashboard</p>
            
            <div className="mt-4 inline-flex items-center px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-green-400 mr-2"></span>
              <span>Role: {userRole}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="secondary" 
              size="sm" 
              className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
              onClick={handleNotificationClick}
            >
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            
            <Button 
              variant="secondary" 
              size="sm" 
              className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Schedule
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-center">
            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-4">
              <FileCheck className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-white/80">Total Equipment</p>
              <p className="text-xl font-semibold">28</p>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-center">
            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-4">
              <Bell className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-white/80">Pending Alerts</p>
              <p className="text-xl font-semibold">7</p>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-center">
            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-4">
              <Settings className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-white/80">Maintenance Due</p>
              <p className="text-xl font-semibold">4</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
