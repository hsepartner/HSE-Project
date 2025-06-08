import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Users, BarChart3, Search, MoreHorizontal, Lightbulb, Info, Plus, X, Upload, Calendar, Building, User, Hash, Tag, Fuel, Clock, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const initialProjects = [
  { id: 1, name: "Downtown Infrastructure", manager: "Alex Johnson", status: "Active", progress: 75, startDate: "2024-01-15", endDate: "2024-12-20" },
  { id: 2, name: "Smart City Initiative", manager: "Sarah Chen", status: "Planning", progress: 25, startDate: "2024-03-01", endDate: "2025-02-28" },
  { id: 3, name: "Green Energy Project", manager: "Mohammed Ali", status: "Completed", progress: 100, startDate: "2023-06-01", endDate: "2024-01-30" },
  { id: 4, name: "Highway Expansion", manager: "Emma Wilson", status: "Active", progress: 60, startDate: "2024-02-10", endDate: "2024-11-15" },
  { id: 5, name: "Water Treatment Plant", manager: "David Kim", status: "Planning", progress: 15, startDate: "2024-04-01", endDate: "2025-03-30" },
];

const ProjectsPage = () => {
  const [projects, setProjects] = useState(initialProjects);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [subContractors, setSubContractors] = useState([""]);
  
  const [form, setForm] = useState({
    projectName: "",
    projectId: "CAT-" + Math.floor(Math.random() * 10000),
    projectNumber: "",
    projectDetails: "",
    startDate: "",
    completionDate: "",
    otherDetails: "",
    fuelType: "",
    clientName: "",
    consultantName: "",
    mainContractor: "",
    subContractors: [""],
    logos: [null, null, null, null],
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.manager.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogoUpload = (idx, file) => {
    const newLogos = [...form.logos];
    newLogos[idx] = file;
    setForm({ ...form, logos: newLogos });
  };

  const addSubContractor = () => {
    setSubContractors([...subContractors, ""]);
    setForm({ ...form, subContractors: [...form.subContractors, ""] });
  };

  const removeSubContractor = (idx) => {
    if (form.subContractors.length > 1) {
      const updated = form.subContractors.filter((_, i) => i !== idx);
      setForm({ ...form, subContractors: updated });
    }
  };

  const updateSubContractor = (idx, value) => {
    const updated = [...form.subContractors];
    updated[idx] = value;
    setForm({ ...form, subContractors: updated });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Active": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "Planning": return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "Completed": return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default: return <XCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800 border-green-200";
      case "Planning": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Completed": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Validation function
  const validateForm = () => {
    const errors = {};
    if (!form.projectName.trim()) errors.projectName = "Project Name is required";
    if (!form.projectNumber.trim()) errors.projectNumber = "Project Number is required";
    return errors;
  };

  // Reset form to initial state
  const resetForm = () => {
    setForm({
      projectName: "",
      projectId: "CAT-" + Math.floor(Math.random() * 10000),
      projectNumber: "",
      projectDetails: "",
      startDate: "",
      completionDate: "",
      otherDetails: "",
      fuelType: "",
      clientName: "",
      consultantName: "",
      mainContractor: "",
      subContractors: [""],
      logos: [null, null, null, null],
    });
    setFormErrors({});
    setIsEditing(false);
    setEditIndex(null);
  };

  // Handle Save (Add or Edit)
  const handleSaveProject = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const errors = validateForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      setIsSubmitting(false);
      return;
    }
    const newProject = {
      id: isEditing && editIndex !== null ? projects[editIndex].id : projects.length ? Math.max(...projects.map(p => p.id)) + 1 : 1,
      name: form.projectName,
      manager: form.clientName || "-",
      status: "Planning",
      progress: 0,
      startDate: form.startDate || new Date().toISOString().slice(0, 10),
      endDate: form.completionDate || new Date().toISOString().slice(0, 10),
    };
    if (isEditing && editIndex !== null) {
      const updated = [...projects];
      updated[editIndex] = newProject;
      setProjects(updated);
    } else {
      setProjects([...projects, newProject]);
    }
    setIsSubmitting(false);
    setModalOpen(false);
    resetForm();
  };

  // Handle Edit
  const handleEditProject = (idx) => {
    const p = projects[idx];
    setForm({
      projectName: p.name,
      projectId: p.id,
      projectNumber: p.projectNumber || "",
      projectDetails: p.projectDetails || "",
      startDate: p.startDate,
      completionDate: p.endDate,
      otherDetails: p.otherDetails || "",
      fuelType: p.fuelType || "",
      clientName: p.manager || "",
      consultantName: p.consultantName || "",
      mainContractor: p.mainContractor || "",
      subContractors: p.subContractors || [""],
      logos: p.logos || [null, null, null, null],
    });
    setIsEditing(true);
    setEditIndex(idx);
    setModalOpen(true);
  };

  // Handle Delete
  const handleDeleteProject = () => {
    if (deleteIndex !== null) {
      const updated = projects.filter((_, idx) => idx !== deleteIndex);
      setProjects(updated);
      setShowDeleteDialog(false);
      setDeleteIndex(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-black">
              Project Registry
            </h1>
            <p className="text-muted-foreground text-lg text-black/70">
              Manage and track all your construction projects efficiently
            </p>
          </div>
          
          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-3 text-base font-semibold">
                <Plus className="h-5 w-5 mr-2" />
                Add New Project
              </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-6xl h-[90vh] overflow-hidden bg-white border-0 shadow-2xl">
              <DialogHeader className="border-b border-primary/20 pb-6">
                <DialogTitle className="text-2xl font-bold text-center text-primary">
                  Project Details
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSaveProject} className="flex-1 overflow-y-auto p-6">
                <div className="space-y-8">
                  {/* Basic Information Section */}
                  <Card className="border-primary/20 shadow-sm">
                    <CardHeader className="bg-primary/5 border-b border-primary/20">
                      <CardTitle className="text-lg font-semibold text-primary flex items-center gap-2">
                        <Info className="h-5 w-5 text-primary" />
                        Basic Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="projectName" className="text-sm font-medium text-slate-700 flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            Project Name <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="projectName"
                            placeholder="Enter project name"
                            value={form.projectName}
                            onChange={e => setForm({ ...form, projectName: e.target.value })}
                            className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="projectId" className="text-sm font-medium text-slate-700 flex items-center gap-1">
                            <Hash className="h-4 w-4" />
                            Project ID (Auto-generated)
                          </Label>
                          <Input
                            id="projectId"
                            value={form.projectId}
                            disabled
                            className="bg-slate-100 border-slate-300 text-slate-600"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="projectNumber" className="text-sm font-medium text-slate-700 flex items-center gap-1">
                            <Tag className="h-4 w-4" />
                            Project Number <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="projectNumber"
                            placeholder="e.g. CAT320-45678"
                            value={form.projectNumber}
                            onChange={e => setForm({ ...form, projectNumber: e.target.value })}
                            className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="projectDetails" className="text-sm font-medium text-slate-700 flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            Project Details
                          </Label>
                          <Input
                            id="projectDetails"
                            placeholder="e.g. ABC-123"
                            value={form.projectDetails}
                            onChange={e => setForm({ ...form, projectDetails: e.target.value })}
                            className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="startDate" className="text-sm font-medium text-slate-700 flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Start Date
                          </Label>
                          <Input
                            id="startDate"
                            type="date"
                            value={form.startDate}
                            onChange={e => setForm({ ...form, startDate: e.target.value })}
                            className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="completionDate" className="text-sm font-medium text-slate-700 flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            Completion Date
                          </Label>
                          <Input
                            id="completionDate"
                            type="date"
                            value={form.completionDate}
                            onChange={e => setForm({ ...form, completionDate: e.target.value })}
                            className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="otherDetails" className="text-sm font-medium text-slate-700">
                            Equipment Type
                          </Label>
                          <Select value={form.otherDetails} onValueChange={v => setForm({ ...form, otherDetails: v })}>
                            <SelectTrigger className="border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                              <SelectValue placeholder="Select equipment type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Heavy Equipment">Heavy Equipment</SelectItem>
                              <SelectItem value="Light Equipment">Light Equipment</SelectItem>
                              <SelectItem value="Vehicles">Vehicles</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="fuelType" className="text-sm font-medium text-slate-700 flex items-center gap-1">
                            <Fuel className="h-4 w-4" />
                            Fuel Type
                          </Label>
                          <Select value={form.fuelType} onValueChange={v => setForm({ ...form, fuelType: v })}>
                            <SelectTrigger className="border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                              <SelectValue placeholder="Select fuel type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Diesel">Diesel</SelectItem>
                              <SelectItem value="Petrol">Petrol</SelectItem>
                              <SelectItem value="Electric">Electric</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Stakeholders & Logos Section */}
                  <Card className="border-primary/20 shadow-sm">
                    <CardHeader className="bg-primary/5 border-b border-primary/20">
                      <CardTitle className="text-lg font-semibold text-primary flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        Stakeholders & Logos
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Stakeholder Information */}
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <Label htmlFor="clientName" className="text-sm font-medium text-slate-700 flex items-center gap-1">
                              <Building className="h-4 w-4" />
                              Client Name
                            </Label>
                            <Input
                              id="clientName"
                              placeholder="Enter client name"
                              value={form.clientName}
                              onChange={e => setForm({ ...form, clientName: e.target.value })}
                              className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="consultantName" className="text-sm font-medium text-slate-700 flex items-center gap-1">
                              <User className="h-4 w-4" />
                              Consultant Name
                            </Label>
                            <Input
                              id="consultantName"
                              placeholder="Enter consultant name"
                              value={form.consultantName}
                              onChange={e => setForm({ ...form, consultantName: e.target.value })}
                              className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="mainContractor" className="text-sm font-medium text-slate-700 flex items-center gap-1">
                              <Building className="h-4 w-4" />
                              Main Contractor
                            </Label>
                            <Input
                              id="mainContractor"
                              placeholder="Enter main contractor name"
                              value={form.mainContractor}
                              onChange={e => setForm({ ...form, mainContractor: e.target.value })}
                              className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                          
                          <div className="space-y-4">
                            <Label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              Sub-Contractors
                            </Label>
                            {form.subContractors.map((sc, idx) => (
                              <div key={idx} className="flex gap-2">
                                <Input
                                  placeholder="Enter sub-contractor name"
                                  value={sc}
                                  onChange={e => updateSubContractor(idx, e.target.value)}
                                  className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                                {form.subContractors.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removeSubContractor(idx)}
                                    className="px-3"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                )}
                                {idx === form.subContractors.length - 1 && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addSubContractor}
                                    className="px-3"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Logo Upload Section */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {[
                            { label: "Client Logo", icon: Building },
                            { label: "Consultant Logo", icon: User },
                            { label: "Contractor Logo", icon: Building },
                            { label: "Sub-Contractor Logo", icon: Users }
                          ].map(({ label, icon: Icon }, idx) => (
                            <div key={label} className="space-y-2">
                              <Label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                                <Icon className="h-4 w-4" />
                                {label}
                              </Label>
                              <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                                <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                                <p className="text-xs text-slate-500 mb-2">
                                  Drag & drop or click to browse
                                </p>
                                <p className="text-xs text-slate-400 mb-3">
                                  JPG, PNG, DOC, DOCX up to 10MB
                                </p>
                                <input
                                  type="file"
                                  accept=".jpg,.jpeg,.png,.doc,.docx"
                                  className="hidden"
                                  id={`logo-upload-${idx}`}
                                  onChange={e => handleLogoUpload(idx, e.target.files?.[0] || null)}
                                />
                                <label htmlFor={`logo-upload-${idx}`}>
                                  <Button type="button" variant="outline" size="sm" className="w-full">
                                    Select Files
                                  </Button>
                                </label>
                                {form.logos[idx] && (
                                  <p className="text-xs text-green-600 mt-2 truncate">
                                    {form.logos[idx].name}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </form>
              
              <DialogFooter className="border-t border-primary/20 p-6">
                <DialogClose asChild>
                  <Button variant="outline" className="px-6" type="button" onClick={resetForm}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button className="bg-primary text-white px-8" type="submit" disabled={isSubmitting}>
                  {isEditing ? "Update Project" : "Save Project"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-primary/20 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground text-black/70">Total Projects</p>
                  <p className="text-2xl font-bold text-black">{projects.length}</p>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-primary/20 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground text-black/70">Active Projects</p>
                  <p className="text-2xl font-bold text-black">
                    {projects.filter(p => p.status === "Active").length}
                  </p>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-primary/20 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground text-black/70">In Planning</p>
                  <p className="text-2xl font-bold text-black">
                    {projects.filter(p => p.status === "Planning").length}
                  </p>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-primary/20 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground text-black/70">Completed</p>
                  <p className="text-2xl font-bold text-black">
                    {projects.filter(p => p.status === "Completed").length}
                  </p>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Tips */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                <Lightbulb className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-primary">Project Management Tips</h3>
                  <p className="text-muted-foreground">Follow these best practices for successful project delivery</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {["Assign clear roles and responsibilities to team members","Set realistic timelines and milestones for tracking progress","Maintain regular communication with all stakeholders"].map((tip, idx) => (
                    <div key={idx} className="bg-background rounded-lg p-4 border border-primary/10">
                      <div className="flex items-start gap-3">
                        <div className="h-6 w-6 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-primary font-semibold text-sm">{idx + 1}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{tip}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projects List */}
        <Card className="border-primary/20 shadow-sm">
          <CardHeader className="bg-primary/5 border-b border-primary/20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-xl font-semibold text-primary flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Project Directory
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Comprehensive list of all registered projects
                </CardDescription>
              </div>
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects or managers..."
                  className="pl-10 border-primary/20 focus:border-primary focus:ring-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-semibold text-black">Project</TableHead>
                    <TableHead className="font-semibold text-black">Manager</TableHead>
                    <TableHead className="font-semibold text-black">Status</TableHead>
                    <TableHead className="font-semibold text-black">Progress</TableHead>
                    <TableHead className="font-semibold text-black">Timeline</TableHead>
                    <TableHead className="font-semibold text-black text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.length > 0 ? (
                    filteredProjects.map((project, idx) => (
                      <TableRow key={project.id} className="hover:bg-slate-50 transition-colors">
                        <TableCell>
                          <div className="font-medium text-black">{project.name}</div>
                          <div className="text-sm text-slate-500">ID: {project.id}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm font-medium">
                                {project.manager.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <span className="text-black">{project.manager}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border bg-gray-100 text-black border-gray-200`}>
                            {getStatusIcon(project.status)}
                            {project.status}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600">{project.progress}%</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${project.progress}%` }}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm space-y-1">
                            <div className="text-slate-900 font-medium text-black">
                              {new Date(project.startDate).toLocaleDateString()}
                            </div>
                            <div className="text-slate-500">
                              to {new Date(project.endDate).toLocaleDateString()}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right flex gap-2 justify-end">
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => handleEditProject(idx)}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-1.414.828l-4 1a1 1 0 01-1.263-1.263l1-4a4 4 0 01.828-1.414z" /></svg>
                          </Button>
                          <Button variant="destructive" size="sm" className="h-8 w-8 p-0" onClick={() => { setDeleteIndex(idx); setShowDeleteDialog(true); }}>
                            <X className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12">
                        <div className="space-y-2">
                          <FileText className="h-12 w-12 text-slate-300 mx-auto" />
                          <p className="text-slate-500 font-medium">No projects found</p>
                          <p className="text-slate-400 text-sm">Try adjusting your search criteria</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
          </DialogHeader>
          <div className="py-4">Are you sure you want to delete this project?</div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteProject}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default ProjectsPage;