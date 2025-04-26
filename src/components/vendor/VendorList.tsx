
import { useState } from "react";
import {
  Search,
  Plus,
  Filter,
} from "lucide-react";
import { Vendor, VendorCategory, VendorStatus, VENDOR_CATEGORY_CONFIG, VENDOR_STATUS_CONFIG } from "@/types/vendor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { VendorCategoryBadge } from "./VendorCategoryBadge";
import { VendorStatusBadge } from "./VendorStatusBadge";
import { formatDistanceToNow } from "date-fns";

interface VendorListProps {
  vendors: Vendor[];
  onSelectVendor: (vendor: Vendor) => void;
}

export function VendorList({ vendors, onSelectVendor }: VendorListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<VendorStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<VendorCategory | "all">("all");

  // Filter vendors based on search query and filters
  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          vendor.contactPerson.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || vendor.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || vendor.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <Card>
      <CardHeader className="px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Vendors</CardTitle>
            <CardDescription>
              Manage your vendors and service providers
            </CardDescription>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Vendor
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search vendors..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="whitespace-nowrap">
                  <Filter className="h-4 w-4 mr-2" />
                  Status
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem 
                    onClick={() => setStatusFilter("all")}
                    className="flex items-center gap-2"
                  >
                    All Statuses
                  </DropdownMenuItem>
                  {Object.entries(VENDOR_STATUS_CONFIG).map(([status, config]) => (
                    <DropdownMenuItem 
                      key={status}
                      onClick={() => setStatusFilter(status as VendorStatus)}
                      className="flex items-center gap-2"
                    >
                      <VendorStatusBadge status={status as VendorStatus} />
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="whitespace-nowrap">
                  <Filter className="h-4 w-4 mr-2" />
                  Category
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem 
                    onClick={() => setCategoryFilter("all")}
                    className="flex items-center gap-2"
                  >
                    All Categories
                  </DropdownMenuItem>
                  {Object.entries(VENDOR_CATEGORY_CONFIG).map(([category, config]) => (
                    <DropdownMenuItem 
                      key={category}
                      onClick={() => setCategoryFilter(category as VendorCategory)}
                      className="flex items-center gap-2"
                    >
                      <VendorCategoryBadge category={category as VendorCategory} />
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead>Contracts</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVendors.length > 0 ? (
                filteredVendors.map(vendor => (
                  <TableRow 
                    key={vendor.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => onSelectVendor(vendor)}
                  >
                    <TableCell className="font-medium">{vendor.name}</TableCell>
                    <TableCell>
                      <VendorCategoryBadge category={vendor.category} />
                    </TableCell>
                    <TableCell>
                      <VendorStatusBadge status={vendor.status} />
                    </TableCell>
                    <TableCell>{vendor.contactPerson}</TableCell>
                    <TableCell>
                      {new Date(vendor.registrationDate).toLocaleDateString()}
                      <span className="text-xs text-muted-foreground ml-1">
                        ({formatDistanceToNow(new Date(vendor.registrationDate), { addSuffix: true })})
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="bg-muted text-muted-foreground text-xs rounded-full px-2 py-1">
                        {vendor.contracts.length} active
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        ...
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No vendors found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
