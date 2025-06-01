import { Document, DocumentStatus, DocumentType } from "@/types/equipment";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DocumentStatusBadge } from "./DocumentStatusBadge";
import { DocumentTypeBadge } from "./DocumentTypeBadge";
import { StatusPill } from "@/components/status/StatusPill";
import { getStatusFromDays } from "@/types/status";
import { PlusIcon, FilterIcon, SearchIcon, SortAscIcon, FileIcon, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";

interface DocumentListProps {
  documents: Document[];
  className?: string;
}

export function DocumentList({ documents: initialDocuments, className }: DocumentListProps) {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<DocumentType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | "all">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    type: "manual" as DocumentType,
    status: "pending" as DocumentStatus,
    issueDate: "",
    expiryDate: "",
    issuedBy: "",
    file: null as File | null,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Calculate days until expiry
  const getDaysUntilExpiry = (expiryDate: string): number => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const differenceInTime = expiry.getTime() - today.getTime();
    return Math.ceil(differenceInTime / (1000 * 3600 * 24));
  };
  
  // Filter documents based on search and filters
  const filteredDocuments = documents.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, file: e.target.files ? e.target.files[0] : null }));
  };

  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.issueDate || !form.expiryDate) return;
    const newDoc: Document = {
      id: `doc-${Date.now()}`,
      name: form.name,
      type: form.type,
      status: form.status,
      issueDate: form.issueDate,
      expiryDate: form.expiryDate,
      issuedBy: form.issuedBy,
      fileUrl: form.file ? URL.createObjectURL(form.file) : undefined,
    };
    setDocuments([newDoc, ...documents]);
    setIsModalOpen(false);
    setForm({ name: "", type: "manual", status: "pending", issueDate: "", expiryDate: "", issuedBy: "", file: null });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-col md:flex-row gap-2 justify-between">
        <div className="flex gap-2 items-center">
          <h2 className="text-xl font-semibold">Documents</h2>
          <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)}>
            <PlusIcon className="h-4 w-4 mr-1" />
            Add Document
          </Button>
        </div>
        
        <div className="flex gap-2 items-center">
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              className="pl-8 w-[200px] md:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Button variant="outline" size="icon">
            <FilterIcon className="h-4 w-4" />
          </Button>
          
          <Button variant="outline" size="icon">
            <SortAscIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button 
          variant={typeFilter === "all" ? "default" : "outline"} 
          size="sm"
          onClick={() => setTypeFilter("all")}
        >
          All Types
        </Button>
        <DocumentTypeBadge 
          type="certificate" 
          size="sm" 
          className={`cursor-pointer ${typeFilter === "certificate" ? "ring-2 ring-blue-500" : ""}`}
          onClick={() => setTypeFilter(typeFilter === "certificate" ? "all" : "certificate")}
        />
        <DocumentTypeBadge 
          type="manual" 
          size="sm" 
          className={`cursor-pointer ${typeFilter === "manual" ? "ring-2 ring-purple-500" : ""}`}
          onClick={() => setTypeFilter(typeFilter === "manual" ? "all" : "manual")}
        />
        <DocumentTypeBadge 
          type="inspection" 
          size="sm" 
          className={`cursor-pointer ${typeFilter === "inspection" ? "ring-2 ring-orange-500" : ""}`}
          onClick={() => setTypeFilter(typeFilter === "inspection" ? "all" : "inspection")}
        />
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button 
          variant={statusFilter === "all" ? "default" : "outline"} 
          size="sm"
          onClick={() => setStatusFilter("all")}
        >
          All Status
        </Button>
        <DocumentStatusBadge 
          status="verified" 
          size="sm" 
          className={`cursor-pointer ${statusFilter === "verified" ? "ring-2 ring-status-valid" : ""}`}
          onClick={() => setStatusFilter(statusFilter === "verified" ? "all" : "verified")}
        />
        <DocumentStatusBadge 
          status="pending" 
          size="sm" 
          className={`cursor-pointer ${statusFilter === "pending" ? "ring-2 ring-status-warning" : ""}`}
          onClick={() => setStatusFilter(statusFilter === "pending" ? "all" : "pending")}
        />
        <DocumentStatusBadge 
          status="rejected" 
          size="sm" 
          className={`cursor-pointer ${statusFilter === "rejected" ? "ring-2 ring-status-expired" : ""}`}
          onClick={() => setStatusFilter(statusFilter === "rejected" ? "all" : "rejected")}
        />
      </div>
      
      <div className="rounded-md border">
        <div className="bg-muted/50 py-2 px-4 text-sm font-medium grid grid-cols-12 gap-2 items-center">
          <div className="col-span-4">Document</div>
          <div className="col-span-2">Type</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Issued</div>
          <div className="col-span-2">Expires</div>
        </div>
        <div className="divide-y">
          {filteredDocuments.length > 0 ? (
            filteredDocuments.map((item) => {
              const daysToExpiry = getDaysUntilExpiry(item.expiryDate);
              const status = getStatusFromDays(daysToExpiry);
              
              return (
                <div 
                  key={item.id} 
                  className={cn(
                    "py-3 px-4 grid grid-cols-12 gap-2 items-center hover:bg-muted/50 cursor-pointer",
                    `border-l-4 border-l-status-${status}`
                  )}
                >
                  <div className="col-span-4">
                    <div className="flex items-center gap-2">
                      <FileIcon className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.issuedBy || 'Unknown issuer'}
                        </div>
                      </div>
                      {item.fileUrl && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="ml-2"
                          asChild
                          title="Preview/Download"
                        >
                          <a href={item.fileUrl} target="_blank" rel="noopener noreferrer">
                            <Eye className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <DocumentTypeBadge type={item.type} size="sm" />
                  </div>
                  <div className="col-span-2">
                    <DocumentStatusBadge status={item.status} size="sm" />
                  </div>
                  <div className="col-span-2 text-sm">
                    {new Date(item.issueDate).toLocaleDateString()}
                  </div>
                  <div className="col-span-2">
                    <StatusPill 
                      daysToExpiry={daysToExpiry} 
                      size="sm" 
                      showDays={true}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              No documents found matching your filters.
            </div>
          )}
        </div>
      </div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <form onSubmit={handleAddDocument} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Add Document</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <Input name="name" placeholder="Document Name" value={form.name} onChange={handleFormChange} required />
              <div className="flex gap-2">
                <select name="type" value={form.type} onChange={handleFormChange} className="border rounded px-2 py-1 flex-1">
                  <option value="manual">Manual</option>
                  <option value="certificate">Certificate</option>
                  <option value="inspection">Inspection</option>
                </select>
                <select name="status" value={form.status} onChange={handleFormChange} className="border rounded px-2 py-1 flex-1">
                  <option value="pending">Pending</option>
                  <option value="verified">Verified</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Input name="issueDate" type="date" value={form.issueDate} onChange={handleFormChange} required className="flex-1" />
                <Input name="expiryDate" type="date" value={form.expiryDate} onChange={handleFormChange} required className="flex-1" />
              </div>
              <Input name="issuedBy" placeholder="Issued By" value={form.issuedBy} onChange={handleFormChange} />
              <Input name="file" type="file" accept="application/pdf,image/*" onChange={handleFileChange} ref={fileInputRef} />
            </div>
            <DialogFooter>
              <Button type="submit">Add</Button>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
