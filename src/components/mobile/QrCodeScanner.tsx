
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";

interface QrCodeScannerProps {
  onScanComplete: (result: string) => void;
}

export function QrCodeScanner({ onScanComplete }: QrCodeScannerProps) {
  const [error, setError] = useState<string | null>(null);
  
  // In a real implementation, this would use a library like @zxing/browser
  // or html5-qrcode to handle actual QR scanning
  
  // For demo purposes, we'll simulate a scan after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      // Simulate scanning a QR code - in a real app, this would be the actual scanned value
      onScanComplete("EQ-2023-105");
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onScanComplete]);
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-64 h-64 border-2 border-dashed border-muted-foreground rounded-lg mb-4 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-lg bg-primary opacity-20"></span>
          <span className="relative inline-flex rounded-lg h-40 w-40 bg-primary opacity-10"></span>
        </div>
        <Camera className="h-10 w-10 text-muted-foreground z-10" />
      </div>
      
      <p className="text-sm text-muted-foreground text-center mb-4">
        Scanning... Position QR code within the scanner area.
      </p>
      
      {error && (
        <p className="text-sm text-destructive text-center mb-4">
          {error}
        </p>
      )}
      
      <div className="animate-pulse text-center">
        <div className="h-2 w-24 bg-muted-foreground/20 rounded mx-auto mb-1"></div>
        <div className="h-2 w-32 bg-muted-foreground/20 rounded mx-auto"></div>
      </div>
    </div>
  );
}
