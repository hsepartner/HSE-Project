import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { UserPlus, Users, Shield, UserCheck, Search, MoreHorizontal, Lightbulb, Video, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";

const initialUsers = [
  { id: 1, name: "Alex Johnson", email: "alex@example.com", role: "Admin", status: "Active" },
  { id: 2, name: "Sarah Chen", email: "sarah@example.com", role: "Operator", status: "Active" },
  { id: 3, name: "Mohammed Ali", email: "mohammed@example.com", role: "Maintenance", status: "Active" },
  { id: 4, name: "Julia Smith", email: "julia@example.com", role: "Viewer", status: "Inactive" },
  { id: 5, name: "Carlos Rodriguez", email: "carlos@example.com", role: "Operator", status: "Active" },
];

const UsersPage = () => {
  const { t, currentLanguage } = useLanguage();
  const isRTL = currentLanguage === 'ar';
  const [users, setUsers] = useState(initialUsers);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = isRTL ? "الاسم مطلوب" : "Name is required";
    if (!formData.email.trim()) {
      errors.email = isRTL ? "البريد الإلكتروني مطلوب" : "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = isRTL ? "البريد الإلكتروني غير صالح" : "Invalid email format";
    }
    if (!isEditUserModalOpen) {
      if (!formData.password) {
        errors.password = isRTL ? "كلمة المرور مطلوبة" : "Password is required";
      } else if (formData.password.length < 6) {
        errors.password = isRTL ? "كلمة المرور يجب أن تكون 6 أحرف على الأقل" : "Password must be at least 6 characters";
      }
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = isRTL ? "كلمات المرور غير متطابقة" : "Passwords do not match";
      }
    }
    if (!formData.role) errors.role = isRTL ? "الدور مطلوب" : "Role is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleRoleChange = (value) => {
    setFormData(prev => ({ ...prev, role: value }));
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newUser = {
      id: users.length + 1,
      name: formData.name,
      email: formData.email,
      role: formData.role,
      status: "Active",
    };

    setUsers([...users, newUser]);
    setIsAddUserModalOpen(false);
    setFormData({ name: "", email: "", role: "", password: "", confirmPassword: "" });
    setFormErrors({});
    toast.success(isRTL ? "تمت إضافة المستخدم بنجاح" : "User added successfully");
  };

  const handleEditUser = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setUsers(users.map(user =>
      user.id === selectedUser.id
        ? { ...user, name: formData.name, email: formData.email, role: formData.role }
        : user
    ));
    setIsEditUserModalOpen(false);
    setFormData({ name: "", email: "", role: "", password: "", confirmPassword: "" });
    setFormErrors({});
    setSelectedUser(null);
    toast.success(isRTL ? "تم تحديث المستخدم بنجاح" : "User updated successfully");
  };

  const handleDeleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
    toast.success(isRTL ? "تم حذف المستخدم بنجاح" : "User deleted successfully");
  };

  const handleChangeRole = (userId, newRole) => {
    setUsers(users.map(user =>
      user.id === userId ? { ...user, role: newRole } : user
    ));
    toast.success(isRTL ? "تم تغيير الدور بنجاح" : "Role changed successfully");
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      password: "",
      confirmPassword: "",
    });
    setIsEditUserModalOpen(true);
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", role: "", password: "", confirmPassword: "" });
    setFormErrors({});
    setSelectedUser(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isRTL ? "المستخدمين" : "Users"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isRTL
                ? "إدارة المستخدمين وأذوناتهم بسهولة وأمان"
                : "Easily manage users and their permissions securely"}
            </p>
          </div>
          <Button
            onClick={() => setIsAddUserModalOpen(true)}
            className="shrink-0 flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            {isRTL ? "إضافة مستخدم" : "Add User"}
          </Button>
        </div>

        {/* Quick Tips Section */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <div className="rounded-full bg-primary/10 p-3 shrink-0">
                <Lightbulb className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">
                  {isRTL ? "نصائح سريعة" : "Quick Tips"}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {isRTL
                    ? "تعرف على كيفية إدارة المستخدمين بفعالية"
                    : "Learn how to manage users effectively"}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="bg-background rounded-lg p-3 flex items-start gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-primary font-medium text-sm">1</span>
                    </div>
                    <p className="text-sm">
                      {isRTL
                        ? "قم بتعيين الأدوار المناسبة لكل مستخدم"
                        : "Assign appropriate roles to each user"}
                    </p>
                  </div>
                  <div className="bg-background rounded-lg p-3 flex items-start gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-primary font-medium text-sm">2</span>
                    </div>
                    <p className="text-sm">
                      {isRTL
                        ? "راجع حالة المستخدم بانتظام"
                        : "Review user status regularly"}
                    </p>
                  </div>
                  <div className="bg-background rounded-lg p-3 flex items-start gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-primary font-medium text-sm">3</span>
                    </div>
                    <p className="text-sm">
                      {isRTL
                        ? "استخدم كلمات مرور قوية للأمان"
                        : "Use strong passwords for security"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* User Statistics */}
          <Card className="border-primary/20 hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="bg-primary/5 rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                {isRTL ? "إحصائيات المستخدمين" : "User Statistics"}
              </CardTitle>
              <CardDescription>
                {isRTL ? "نظرة عامة على إحصائيات المستخدمين" : "Overview of user statistics"}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>{isRTL ? "مجموع المستخدمين" : "Total Users"}</span>
                  <span className="font-semibold text-lg">{users.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>{isRTL ? "نشط" : "Active"}</span>
                  <span className="font-semibold text-lg text-green-600">{users.filter(u => u.status === "Active").length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>{isRTL ? "غير نشط" : "Inactive"}</span>
                  <span className="font-semibold text-lg text-amber-600">{users.filter(u => u.status === "Inactive").length}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Roles */}
          <Card className="border-primary/20 hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="bg-primary/5 rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                {isRTL ? "أدوار المستخدمين" : "User Roles"}
              </CardTitle>
              <CardDescription>
                {isRTL ? "توزيع أدوار المستخدمين" : "Distribution of user roles"}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    {isRTL ? "مدير" : "Admin"}
                  </span>
                  <span className="font-semibold text-lg">{users.filter(u => u.role === "Admin").length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    {isRTL ? "مشغل" : "Operator"}
                  </span>
                  <span className="font-semibold text-lg">{users.filter(u => u.role === "Operator").length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    {isRTL ? "فني صيانة" : "Maintenance"}
                  </span>
                  <span className="font-semibold text-lg">{users.filter(u => u.role === "Maintenance").length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                    {isRTL ? "مراقب" : "Viewer"}
                  </span>
                  <span className="font-semibold text-lg">{users.filter(u => u.role === "Viewer").length}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-primary/20 hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="bg-primary/5 rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-primary" />
                {isRTL ? "النشاط الأخير" : "Recent Activity"}
              </CardTitle>
              <CardDescription>
                {isRTL ? "آخر أنشطة المستخدمين" : "Latest user activities"}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>{isRTL ? "تسجيلات الدخول اليوم" : "Logins Today"}</span>
                  <span className="font-semibold text-lg">18</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>{isRTL ? "مستخدمون جدد هذا الأسبوع" : "New Users This Week"}</span>
                  <span className="font-semibold text-lg">{users.filter(u => u.id > initialUsers.length).length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>{isRTL ? "طلبات إعادة تعيين كلمة المرور" : "Password Reset Requests"}</span>
                  <span className="font-semibold text-lg">2</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users List Section */}
        <Card className="mt-8 border-primary/20">
          <CardHeader className="bg-primary/5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  {isRTL ? "قائمة المستخدمين" : "Users List"}
                </CardTitle>
                <CardDescription>
                  {isRTL ? "عرض وإدارة جميع المستخدمين" : "View and manage all users"}
                </CardDescription>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={isRTL ? "بحث..." : "Search users..."}
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label={isRTL ? "بحث المستخدمين" : "Search users"}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{isRTL ? "اسم" : "Name"}</TableHead>
                    <TableHead>{isRTL ? "بريد إلكتروني" : "Email"}</TableHead>
                    <TableHead>{isRTL ? "دور" : "Role"}</TableHead>
                    <TableHead>{isRTL ? "حالة" : "Status"}</TableHead>
                    <TableHead className="w-16">{isRTL ? "إجراءات" : "Actions"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              user.role === "Admin" ? "bg-purple-100 text-purple-800 border-purple-200" :
                              user.role === "Operator" ? "bg-blue-100 text-blue-800 border-blue-200" :
                              user.role === "Maintenance" ? "bg-green-100 text-green-800 border-green-200" :
                              "bg-gray-100 text-gray-800 border-gray-200"
                            }
                          >
                            {isRTL ? (
                              user.role === "Admin" ? "مدير" :
                              user.role === "Operator" ? "مشغل" :
                              user.role === "Maintenance" ? "فني صيانة" : "مراقب"
                            ) : user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.status === "Active" ? "success" : "secondary"}>
                            {isRTL ? (user.status === "Active" ? "نشط" : "غير نشط") : user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0" aria-label={isRTL ? `خيارات ${user.name}` : `Options for ${user.name}`}>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>{isRTL ? "إجراءات" : "Actions"}</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => openEditModal(user)}>
                                {isRTL ? "تحرير المستخدم" : "Edit User"}
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <div>
                                  {isRTL ? "تغيير الدور" : "Change Role"}
                                  <Select
                                    onValueChange={(value) => handleChangeRole(user.id, value)}
                                    value={user.role}
                                  >
                                    <SelectTrigger className="hidden" />
                                    <SelectContent>
                                      <SelectItem value="Admin">{isRTL ? "مدير" : "Admin"}</SelectItem>
                                      <SelectItem value="Operator">{isRTL ? "مشغل" : "Operator"}</SelectItem>
                                      <SelectItem value="Maintenance">{isRTL ? "فني صيانة" : "Maintenance"}</SelectItem>
                                      <SelectItem value="Viewer">{isRTL ? "مراقب" : "Viewer"}</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                {isRTL ? "حذف المستخدم" : "Delete User"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                        {isRTL ? "لم يتم العثور على مستخدمين" : "No users found"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* User Activity Preview Section */}
        <Card className="mt-6 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-primary" />
              {isRTL ? "معاينة نشاط المستخدم" : "User Activity Preview"}
            </CardTitle>
            <CardDescription>
              {isRTL ? "مثال على أنشطة المستخدم الأخيرة" : "Example of recent user activities"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg bg-background p-4">
                <h4 className="font-medium text-sm mb-3 flex items-center">
                  <UserCheck size={16} className="mr-2 text-blue-600" />
                  {isRTL ? "تسجيل دخول المستخدم" : "User Login"}
                </h4>
                <div className="bg-blue-50 p-3 rounded-md">
                  <p className="text-sm font-medium">
                    {isRTL ? "أليكس جونسون قام بتسجيل الدخول" : "Alex Johnson logged in"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    2025-04-26 09:15 AM
                  </p>
                </div>
              </div>
              <div className="border rounded-lg bg-background p-4">
                <h4 className="font-medium text-sm mb-3 flex items-center">
                  <UserPlus size={16} className="mr-2 text-blue-600" />
                  {isRTL ? "إضافة مستخدم جديد" : "New User Added"}
                </h4>
                <div className="bg-blue-50 p-3 rounded-md">
                  <p className="text-sm font-medium">
                    {isRTL ? "سارة تشين أُضيفت كمشغل" : "Sarah Chen added as Operator"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    2025-04-25 03:45 PM
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add User Modal */}
        <Dialog open={isAddUserModalOpen} onOpenChange={(open) => { setIsAddUserModalOpen(open); if (!open) resetForm(); }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{isRTL ? "إضافة مستخدم جديد" : "Add New User"}</DialogTitle>
              <DialogDescription>
                {isRTL
                  ? "أدخل تفاصيل المستخدم الجديد لإضافته إلى النظام"
                  : "Enter the details of the new user to add them to the system"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddUser} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className={isRTL ? "text-right" : "text-left"}>
                  {isRTL ? "اسم" : "Name"}
                </Label>
                <div className="col-span-3">
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={isRTL ? "اسم المستخدم" : "User name"}
                    aria-label={isRTL ? "اسم المستخدم" : "User name"}
                  />
                  {formErrors.name && <p className="text-red-600 text-xs mt-1">{formErrors.name}</p>}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className={isRTL ? "text-right" : "text-left"}>
                  {isRTL ? "بريد إلكتروني" : "Email"}
                </Label>
                <div className="col-span-3">
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="email@example.com"
                    aria-label={isRTL ? "بريد إلكتروني" : "Email"}
                  />
                  {formErrors.email && <p className="text-red-600 text-xs mt-1">{formErrors.email}</p>}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className={isRTL ? "text-right" : "text-left"}>
                  {isRTL ? "دور" : "Role"}
                </Label>
                <div className="col-span-3">
                  <Select onValueChange={handleRoleChange} value={formData.role}>
                    <SelectTrigger>
                      <SelectValue placeholder={isRTL ? "حدد دورًا" : "Select a role"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">{isRTL ? "مدير" : "Admin"}</SelectItem>
                      <SelectItem value="Operator">{isRTL ? "مشغل" : "Operator"}</SelectItem>
                      <SelectItem value="Maintenance">{isRTL ? "فني صيانة" : "Maintenance"}</SelectItem>
                      <SelectItem value="Viewer">{isRTL ? "مراقب" : "Viewer"}</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.role && <p className="text-red-600 text-xs mt-1">{formErrors.role}</p>}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className={isRTL ? "text-right" : "text-left"}>
                  {isRTL ? "كلمة المرور" : "Password"}
                </Label>
                <div className="col-span-3">
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    aria-label={isRTL ? "كلمة المرور" : "Password"}
                  />
                  {formErrors.password && <p className="text-red-600 text-xs mt-1">{formErrors.password}</p>}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="confirm-password" className={isRTL ? "text-right" : "text-left"}>
                  {isRTL ? "تأكيد كلمة المرور" : "Confirm Password"}
                </Label>
                <div className="col-span-3">
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    aria-label={isRTL ? "تأكيد كلمة المرور" : "Confirm Password"}
                  />
                  {formErrors.confirmPassword && <p className="text-red-600 text-xs mt-1">{formErrors.confirmPassword}</p>}
                </div>
              </div>
              <div className="bg-primary/5 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Info className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">
                      {isRTL ? "نصيحة" : "Tip"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {isRTL
                        ? "استخدم كلمة مرور قوية تحتوي على مزيج من الأحرف والأرقام والرموز."
                        : "Use a strong password with a mix of letters, numbers, and symbols."}
                    </p>
                  </div>
                </div>
              </div>
              <DialogFooter className="sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => { setIsAddUserModalOpen(false); resetForm(); }}
                >
                  {isRTL ? "إلغاء" : "Cancel"}
                </Button>
                <Button type="submit">
                  {isRTL ? "إضافة" : "Add"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit User Modal */}
        <Dialog open={isEditUserModalOpen} onOpenChange={(open) => { setIsEditUserModalOpen(open); if (!open) resetForm(); }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{isRTL ? "تحرير المستخدم" : "Edit User"}</DialogTitle>
              <DialogDescription>
                {isRTL
                  ? "قم بتحديث تفاصيل المستخدم"
                  : "Update the user's details"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditUser} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className={isRTL ? "text-right" : "text-left"}>
                  {isRTL ? "اسم" : "Name"}
                </Label>
                <div className="col-span-3">
                  <Input
                    id="name"
                    value={formData.name}
                    ondoubleclick={() => console.log(formData)}
                    onChange={handleInputChange}
                    placeholder={isRTL ? "اسم المستخدم" : "User name"}
                    aria-label={isRTL ? "اسم المستخدم" : "User name"}
                  />
                  {formErrors.name && <p className="text-red-600 text-xs mt-1">{formErrors.name}</p>}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className={isRTL ? "text-right" : "text-left"}>
                  {isRTL ? "بريد إلكتروني" : "Email"}
                </Label>
                <div className="col-span-3">
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="email@example.com"
                    aria-label={isRTL ? "بريد إلكتروني" : "Email"}
                  />
                  {formErrors.email && <p className="text-red-600 text-xs mt-1">{formErrors.email}</p>}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className={isRTL ? "text-right" : "text-left"}>
                  {isRTL ? "دور" : "Role"}
                </Label>
                <div className="col-span-3">
                  <Select onValueChange={handleRoleChange} value={formData.role}>
                    <SelectTrigger>
                      <SelectValue placeholder={isRTL ? "حدد دورًا" : "Select a role"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">{isRTL ? "مدير" : "Admin"}</SelectItem>
                      <SelectItem value="Operator">{isRTL ? "مشغل" : "Operator"}</SelectItem>
                      <SelectItem value="Maintenance">{isRTL ? "فني صيانة" : "Maintenance"}</SelectItem>
                      <SelectItem value="Viewer">{isRTL ? "مراقب" : "Viewer"}</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.role && <p className="text-red-600 text-xs mt-1">{formErrors.role}</p>}
                </div>
              </div>
              <div className="bg-primary/5 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Info className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">
                      {isRTL ? "نصيحة" : "Tip"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {isRTL
                        ? "تأكد من تحديث الدور المناسب للمستخدم."
                        : "Ensure you select the appropriate role for the user."}
                    </p>
                  </div>
                </div>
              </div>
              <DialogFooter className="sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => { setIsEditUserModalOpen(false); resetForm(); }}
                >
                  {isRTL ? "إلغاء" : "Cancel"}
                </Button>
                <Button type="submit">
                  {isRTL ? "تحديث" : "Update"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Footer Actions */}
        <div className="flex justify-between items-center mt-6">
          <Button variant="outline" className="flex gap-2">
            <Video className="h-4 w-4" />
            {isRTL ? "شاهد الفيديو التعليمي" : "Watch Tutorial"}
          </Button>
          <Button
            onClick={() => setIsAddUserModalOpen(true)}
            className="flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            {isRTL ? "إضافة مستخدم" : "Add User"}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UsersPage;