
import { User } from "@/types/auth";
import { RoleBadge } from "./RoleBadge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserCardProps {
  user: User;
  className?: string;
}

export function UserCard({ user, className }: UserCardProps) {
  // Generate initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-0">
        <div className="flex items-start p-4">
          <Avatar className="h-10 w-10 mr-4">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium">{user.name}</h3>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            <div className="mt-1">
              <RoleBadge role={user.role} size="sm" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
