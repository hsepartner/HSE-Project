
import React from 'react';
import { cn } from '@/lib/utils';
import { User, Shield, Wrench, HardHat } from 'lucide-react';

type UserRole = 'admin' | 'operator' | 'maintenance' | 'hse';

interface UserRoleBadgeProps {
  role: UserRole;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function UserRoleBadge({ 
  role, 
  size = 'md', 
  showLabel = true,
  className 
}: UserRoleBadgeProps) {
  const roleConfig = {
    admin: {
      icon: Shield,
      label: 'Admin',
      color: 'blue'
    },
    operator: {
      icon: HardHat,
      label: 'Operator',
      color: 'yellow'
    },
    maintenance: {
      icon: Wrench,
      label: 'Maintenance',
      color: 'green'
    },
    hse: {
      icon: User,
      label: 'HSE',
      color: 'orange'
    }
  };
  
  const config = roleConfig[role] || roleConfig.admin;
  const IconComponent = config.icon;
  
  const sizeClasses = {
    sm: {
      avatar: "h-6 w-6",
      icon: "h-3 w-3",
      text: "text-xs"
    },
    md: {
      avatar: "h-8 w-8",
      icon: "h-4 w-4",
      text: "text-sm"
    },
    lg: {
      avatar: "h-10 w-10",
      icon: "h-5 w-5",
      text: "text-base"
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn(
        `bg-${config.color}-100 text-${config.color}-600 rounded-full flex items-center justify-center`,
        sizeClasses[size].avatar
      )}>
        <IconComponent className={sizeClasses[size].icon} />
      </div>
      {showLabel && (
        <span className={cn("font-medium", sizeClasses[size].text)}>
          {config.label}
        </span>
      )}
    </div>
  );
}
