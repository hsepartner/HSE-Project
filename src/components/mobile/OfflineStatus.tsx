
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff } from "lucide-react";

export function OfflineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [hasPendingData, setHasPendingData] = useState(false);
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Simulate having some pending offline data
    setHasPendingData(Math.random() > 0.5);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return (
    <div className="flex items-center gap-2">
      {isOnline ? (
        <Badge variant="outline" className="bg-status-valid/10 text-status-valid border-status-valid/20">
          <Wifi className="h-3 w-3 mr-1" />
          Online
        </Badge>
      ) : (
        <Badge variant="outline" className="bg-status-warning/10 text-status-warning border-status-warning/20">
          <WifiOff className="h-3 w-3 mr-1" />
          Offline
        </Badge>
      )}
      
      {!isOnline && hasPendingData && (
        <Badge variant="outline" className="bg-status-warning/10 text-status-warning border-status-warning/20">
          Pending Uploads
        </Badge>
      )}
    </div>
  );
}
