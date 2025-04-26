
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { BarChart, FileText } from "lucide-react";
import { Label } from "@/components/ui/label";

export function ReportBuilder() {
  const [reportType, setReportType] = useState<string>("");
  const [dateRange, setDateRange] = useState<string>("");
  
  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Report Parameters</CardTitle>
          <CardDescription>Configure your custom report</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="report-type">Report Type</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger id="report-type">
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="equipment-inventory">Equipment Inventory</SelectItem>
                <SelectItem value="compliance-status">Compliance Status</SelectItem>
                <SelectItem value="maintenance-history">Maintenance History</SelectItem>
                <SelectItem value="document-expiry">Document Expiry</SelectItem>
                <SelectItem value="vendor-performance">Vendor Performance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date-range">Date Range</Label>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger id="date-range">
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="past-30-days">Past 30 Days</SelectItem>
                <SelectItem value="past-90-days">Past 90 Days</SelectItem>
                <SelectItem value="past-6-months">Past 6 Months</SelectItem>
                <SelectItem value="past-year">Past Year</SelectItem>
                <SelectItem value="current-year">Current Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Data Fields</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="field-id" />
                <label htmlFor="field-id" className="text-sm">Equipment ID</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="field-name" defaultChecked />
                <label htmlFor="field-name" className="text-sm">Name</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="field-model" defaultChecked />
                <label htmlFor="field-model" className="text-sm">Model</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="field-serial" />
                <label htmlFor="field-serial" className="text-sm">Serial No.</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="field-status" defaultChecked />
                <label htmlFor="field-status" className="text-sm">Status</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="field-category" defaultChecked />
                <label htmlFor="field-category" className="text-sm">Category</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="field-compliance" />
                <label htmlFor="field-compliance" className="text-sm">Compliance</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="field-inspection" />
                <label htmlFor="field-inspection" className="text-sm">Inspection Date</label>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">
            <BarChart className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </CardFooter>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Report Preview</CardTitle>
          <CardDescription>Preview your report before generating</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
          {reportType && dateRange ? (
            <div className="text-center">
              <BarChart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Report Ready to Generate</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Your {reportType.replace("-", " ")} report for {dateRange.replace("-", " ")} is ready to generate.
              </p>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Download Preview
              </Button>
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              <p>Select report parameters to see a preview</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
