
import { ServiceRecord } from "@/types/vendor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  Wrench,
  AlertTriangle,
  FileText
} from "lucide-react";

interface VendorServiceHistoryProps {
  serviceRecords: ServiceRecord[];
}

export function VendorServiceHistory({ serviceRecords }: VendorServiceHistoryProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-status-valid" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-status-expired" />;
      case 'in-progress':
        return <Wrench className="h-4 w-4 text-status-warning" />;
      case 'scheduled':
      default:
        return <Clock className="h-4 w-4 text-status-inactive" />;
    }
  };

  return (
    <Card>
      <CardHeader className="px-6 py-4">
        <CardTitle className="text-lg">Service History</CardTitle>
      </CardHeader>
      <CardContent className="px-6">
        {serviceRecords.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Equipment ID</TableHead>
                <TableHead>Service Type</TableHead>
                <TableHead>Service Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Follow-Up</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {serviceRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.equipmentId}</TableCell>
                  <TableCell className="capitalize">{record.serviceType}</TableCell>
                  <TableCell>{new Date(record.serviceDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {getStatusIcon(record.status)}
                      <span className="capitalize">{record.status}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('en-US', { 
                      style: 'currency', 
                      currency: record.currency 
                    }).format(record.cost)}
                  </TableCell>
                  <TableCell>
                    {record.followUpRequired ? (
                      <div className="flex items-center gap-1.5">
                        <AlertTriangle className="h-4 w-4 text-status-warning" />
                        <span>
                          {record.followUpDate 
                            ? new Date(record.followUpDate).toLocaleDateString()
                            : "Required"
                          }
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">None</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" title="View Service Details">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No service records available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
