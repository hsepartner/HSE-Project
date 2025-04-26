
import { VendorDocument } from "@/types/vendor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Download, FileCheck, FileMinus, FileWarning } from "lucide-react";

interface VendorDocumentListProps {
  documents: VendorDocument[];
}

export function VendorDocumentList({ documents }: VendorDocumentListProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <FileCheck className="h-4 w-4 text-status-valid" />;
      case 'rejected':
        return <FileWarning className="h-4 w-4 text-status-expired" />;
      case 'pending':
      default:
        return <FileMinus className="h-4 w-4 text-status-warning" />;
    }
  };

  return (
    <Card>
      <CardHeader className="px-6 py-4">
        <CardTitle className="text-lg">Vendor Documents</CardTitle>
      </CardHeader>
      <CardContent className="px-6">
        {documents.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">{doc.name}</TableCell>
                  <TableCell className="capitalize">{doc.type}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {getStatusIcon(doc.status)}
                      <span className="capitalize">{doc.status}</span>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(doc.issueDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {doc.expiryDate 
                      ? new Date(doc.expiryDate).toLocaleDateString()
                      : "No expiry"
                    }
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" title="View Document">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Download Document">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No documents available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
