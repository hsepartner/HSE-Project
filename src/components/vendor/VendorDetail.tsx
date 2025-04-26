
import { 
  Building, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Star, 
  StarHalf, 
  Calendar,
  FileText,
  ClipboardList
} from "lucide-react";
import { Vendor } from "@/types/vendor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VendorCategoryBadge } from "./VendorCategoryBadge";
import { VendorStatusBadge } from "./VendorStatusBadge";
import { VendorDocumentList } from "./VendorDocumentList";
import { VendorContractList } from "./VendorContractList";
import { VendorServiceHistory } from "./VendorServiceHistory";

interface VendorDetailProps {
  vendor: Vendor;
}

export function VendorDetail({ vendor }: VendorDetailProps) {
  // Generate star rating
  const renderRating = (rating: number = 0) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-star-${i}`} className="h-4 w-4 text-muted-foreground/30" />);
    }
    
    return stars;
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-2 md:mb-0">
              <CardTitle className="text-2xl">{vendor.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <VendorCategoryBadge category={vendor.category} />
                <VendorStatusBadge status={vendor.status} />
                {vendor.verificationStatus === "verified" && (
                  <span className="bg-green-500/10 text-green-500 text-xs rounded-full px-2 py-0.5 border border-green-500/20">
                    Verified
                  </span>
                )}
                <div className="flex items-center ml-1">
                  {renderRating(vendor.rating)}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Contact:</span>
              <span className="text-sm font-medium">{vendor.contactPerson}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Email:</span>
              <a href={`mailto:${vendor.email}`} className="text-sm font-medium text-primary">
                {vendor.email}
              </a>
            </div>
            
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Phone:</span>
              <span className="text-sm font-medium">{vendor.phone}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Address:</span>
              <span className="text-sm font-medium">{vendor.address}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Website:</span>
              {vendor.website ? (
                <a 
                  href={vendor.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-primary"
                >
                  {vendor.website.replace(/(^\w+:|^)\/\//, '')}
                </a>
              ) : (
                <span className="text-sm">-</span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Registration:</span>
              <span className="text-sm font-medium">
                {new Date(vendor.registrationDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="documents" className="w-full">
        <TabsList>
          <TabsTrigger value="documents">
            <FileText className="h-4 w-4 mr-2" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="contracts">
            <ClipboardList className="h-4 w-4 mr-2" />
            Contracts
          </TabsTrigger>
          <TabsTrigger value="service-history">
            <Building className="h-4 w-4 mr-2" />
            Service History
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="documents" className="mt-4">
          <VendorDocumentList documents={vendor.documents} />
        </TabsContent>
        
        <TabsContent value="contracts" className="mt-4">
          <VendorContractList contracts={vendor.contracts} />
        </TabsContent>
        
        <TabsContent value="service-history" className="mt-4">
          <VendorServiceHistory serviceRecords={vendor.serviceHistory} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
