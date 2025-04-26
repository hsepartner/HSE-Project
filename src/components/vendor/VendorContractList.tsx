
import { VendorContract } from "@/types/vendor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  XCircle, 
  FileText,
  Bell
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface VendorContractListProps {
  contracts: VendorContract[];
}

export function VendorContractList({ contracts }: VendorContractListProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-status-valid" />;
      case 'expired':
        return <XCircle className="h-4 w-4 text-status-expired" />;
      case 'terminated':
        return <XCircle className="h-4 w-4 text-status-urgent" />;
      case 'draft':
      default:
        return <Clock className="h-4 w-4 text-status-warning" />;
    }
  };

  // Function to calculate days until contract expiry
  const getDaysUntilExpiry = (endDate: string) => {
    const today = new Date();
    const expiryDate = new Date(endDate);
    const differenceInTime = expiryDate.getTime() - today.getTime();
    return Math.ceil(differenceInTime / (1000 * 3600 * 24));
  };

  return (
    <Card>
      <CardHeader className="px-6 py-4">
        <CardTitle className="text-lg">Vendor Contracts</CardTitle>
      </CardHeader>
      <CardContent className="px-6">
        {contracts.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contract Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Renewal Reminder</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.map((contract) => {
                const daysUntilExpiry = getDaysUntilExpiry(contract.endDate);
                const isExpiringSoon = daysUntilExpiry <= 30 && daysUntilExpiry > 0;
                
                return (
                  <TableRow key={contract.id}>
                    <TableCell className="font-medium">{contract.title}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        {getStatusIcon(contract.status)}
                        <span className="capitalize">{contract.status}</span>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(contract.startDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        {new Date(contract.endDate).toLocaleDateString()}
                        {isExpiringSoon && (
                          <span className="bg-status-urgent/10 text-status-urgent text-xs rounded-full px-2 py-0.5 border border-status-urgent/20">
                            Expiring soon
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('en-US', { 
                        style: 'currency', 
                        currency: contract.currency 
                      }).format(contract.value)}
                    </TableCell>
                    <TableCell>
                      {contract.renewalReminder ? (
                        <div className="flex items-center gap-1.5">
                          <Bell className="h-4 w-4 text-muted-foreground" />
                          <span>{contract.renewalReminderDays} days before</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Not set</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" title="View Contract">
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="View Calendar">
                          <Calendar className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No contracts available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
