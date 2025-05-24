import React, { useEffect, useState } from 'react';
import { Bell, Calendar, FileCheck, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/use-language';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, CheckCircle, AlertTriangle, Clock } from "lucide-react";

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
        
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-8">
          <Card className="bg-white/20 backdrop-blur-lg border border-white/30 shadow-xl transition-transform hover:scale-105 hover:shadow-2xl duration-200 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-white">Total Equipment</CardTitle>
              <span className="rounded-full p-2 bg-gradient-to-tr from-blue-500 to-emerald-400 shadow-md group-hover:scale-110 transition-transform">
                <BarChart className="h-5 w-5 text-white" />
              </span>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-white drop-shadow-lg">28</div>
              <p className="text-xs text-white/80 mt-1">Active tracking across all categories</p>
            </CardContent>
          </Card>
          <Card className="bg-white/20 backdrop-blur-lg border border-white/30 shadow-xl transition-transform hover:scale-105 hover:shadow-2xl duration-200 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-white">Compliance Rate</CardTitle>
              <span className="rounded-full p-2 bg-gradient-to-tr from-green-400 to-blue-400 shadow-md group-hover:scale-110 transition-transform">
                <CheckCircle className="h-5 w-5 text-white" />
              </span>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-white drop-shadow-lg">85%</div>
              <p className="text-xs text-white/80 mt-1">Equipment meeting all requirements</p>
            </CardContent>
          </Card>
          <Card className="bg-white/20 backdrop-blur-lg border border-white/30 shadow-xl transition-transform hover:scale-105 hover:shadow-2xl duration-200 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-white">Pending Approvals</CardTitle>
              <span className="rounded-full p-2 bg-gradient-to-tr from-yellow-400 to-orange-400 shadow-md group-hover:scale-110 transition-transform">
                <Clock className="h-5 w-5 text-white" />
              </span>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-white drop-shadow-lg">4</div>
              <p className="text-xs text-white/80 mt-1">Documents awaiting verification</p>
            </CardContent>
          </Card>
          <Card className="bg-white/20 backdrop-blur-lg border border-white/30 shadow-xl transition-transform hover:scale-105 hover:shadow-2xl duration-200 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-white">Upcoming Expirations</CardTitle>
              <span className="rounded-full p-2 bg-gradient-to-tr from-pink-500 to-yellow-400 shadow-md group-hover:scale-110 transition-transform">
                <AlertTriangle className="h-5 w-5 text-white" />
              </span>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-white drop-shadow-lg">7</div>
              <p className="text-xs text-white/80 mt-1">Documents expiring within 30 days</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
