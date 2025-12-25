import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Download,
  Eye,
  FileText,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Share2,
  Trash2,
  Users,
} from "lucide-react";
import { format } from "date-fns";

interface Admission {
  id: string;
  full_name: string;
  father_name: string;
  husband_name: string | null;
  age: number;
  mobile_number: string;
  whatsapp_number: string | null;
  education_medium: string;
  declaration_agreed: boolean;
  submission_date: string;
  status: string;
  notes: string | null;
  created_at: string;
}

const AdmissionManagement = () => {
  const navigate = useNavigate();
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedAdmission, setSelectedAdmission] = useState<Admission | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  // Form states for editing/adding
  const [formData, setFormData] = useState({
    full_name: "",
    father_name: "",
    husband_name: "",
    age: "",
    mobile_number: "",
    whatsapp_number: "",
    education_medium: "",
    status: "pending",
    notes: "",
  });

  const fetchAdmissions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("admissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAdmissions(data || []);
    } catch (error: any) {
      console.error("Error fetching admissions:", error);
      toast.error("Failed to load admissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const filteredAdmissions = admissions.filter((admission) => {
    const matchesSearch =
      admission.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admission.father_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admission.mobile_number.includes(searchTerm);
    const matchesStatus = statusFilter === "all" || admission.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (admission: Admission) => {
    setSelectedAdmission(admission);
    setFormData({
      full_name: admission.full_name,
      father_name: admission.father_name,
      husband_name: admission.husband_name || "",
      age: admission.age.toString(),
      mobile_number: admission.mobile_number,
      whatsapp_number: admission.whatsapp_number || "",
      education_medium: admission.education_medium,
      status: admission.status,
      notes: admission.notes || "",
    });
    setEditDialogOpen(true);
  };

  const handleView = (admission: Admission) => {
    setSelectedAdmission(admission);
    setViewDialogOpen(true);
  };

  const sendStatusNotification = async (admission: Admission, newStatus: string) => {
    if (newStatus !== "approved" && newStatus !== "rejected") return;
    
    try {
      const { error } = await supabase.functions.invoke("send-admission-notification", {
        body: {
          studentName: admission.full_name,
          mobileNumber: admission.mobile_number,
          status: newStatus,
          notes: formData.notes || null,
        },
      });

      if (error) {
        console.error("Notification error:", error);
        toast.error("Failed to send notification");
      } else {
        toast.success(`Notification sent for ${newStatus} status`);
      }
    } catch (error: any) {
      console.error("Error sending notification:", error);
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedAdmission) return;

    const statusChanged = selectedAdmission.status !== formData.status;
    const newStatus = formData.status;

    try {
      const { error } = await supabase
        .from("admissions")
        .update({
          full_name: formData.full_name,
          father_name: formData.father_name,
          husband_name: formData.husband_name || null,
          age: parseInt(formData.age),
          mobile_number: formData.mobile_number,
          whatsapp_number: formData.whatsapp_number || null,
          education_medium: formData.education_medium,
          status: formData.status,
          notes: formData.notes || null,
        })
        .eq("id", selectedAdmission.id);

      if (error) throw error;

      toast.success("Admission updated successfully");
      
      // Send notification if status changed to approved/rejected
      if (statusChanged && (newStatus === "approved" || newStatus === "rejected")) {
        await sendStatusNotification(selectedAdmission, newStatus);
      }

      setEditDialogOpen(false);
      fetchAdmissions();
    } catch (error: any) {
      console.error("Error updating admission:", error);
      toast.error("Failed to update admission");
    }
  };

  const handleAdd = async () => {
    try {
      const { error } = await supabase.from("admissions").insert({
        full_name: formData.full_name,
        father_name: formData.father_name,
        husband_name: formData.husband_name || null,
        age: parseInt(formData.age),
        mobile_number: formData.mobile_number,
        whatsapp_number: formData.whatsapp_number || null,
        education_medium: formData.education_medium,
        status: formData.status,
        notes: formData.notes || null,
        declaration_agreed: true,
      });

      if (error) throw error;

      toast.success("Admission added successfully");
      setAddDialogOpen(false);
      resetForm();
      fetchAdmissions();
    } catch (error: any) {
      console.error("Error adding admission:", error);
      toast.error("Failed to add admission");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("admissions").delete().eq("id", id);

      if (error) throw error;

      toast.success("Admission deleted successfully");
      fetchAdmissions();
    } catch (error: any) {
      console.error("Error deleting admission:", error);
      toast.error("Failed to delete admission");
    }
  };

  const resetForm = () => {
    setFormData({
      full_name: "",
      father_name: "",
      husband_name: "",
      age: "",
      mobile_number: "",
      whatsapp_number: "",
      education_medium: "",
      status: "pending",
      notes: "",
    });
  };

  const downloadCSV = () => {
    const headers = [
      "Full Name",
      "Father Name",
      "Husband Name",
      "Age",
      "Mobile",
      "WhatsApp",
      "Education Medium",
      "Status",
      "Submission Date",
      "Notes",
    ];

    const csvData = filteredAdmissions.map((a) => [
      a.full_name,
      a.father_name,
      a.husband_name || "",
      a.age,
      a.mobile_number,
      a.whatsapp_number || "",
      a.education_medium,
      a.status,
      format(new Date(a.submission_date), "yyyy-MM-dd"),
      a.notes || "",
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `admissions_${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("CSV downloaded successfully");
  };

  const downloadPDF = (admission: Admission) => {
    // Create a printable HTML content
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Admission Form - ${admission.full_name}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
          h1 { text-align: center; color: #059669; }
          h2 { color: #333; border-bottom: 2px solid #059669; padding-bottom: 10px; }
          .info-row { display: flex; margin: 10px 0; }
          .label { font-weight: bold; width: 200px; }
          .value { flex: 1; }
          .header { text-align: center; margin-bottom: 30px; }
          .arabic { font-size: 1.5em; direction: rtl; }
        </style>
      </head>
      <body>
        <div class="header">
          <p class="arabic">خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ</p>
          <h1>Idarah Tarjamat-ul-Qur'an wa Sunnah</h1>
          <h2>Admission Form</h2>
        </div>
        
        <h2>1. Basic Information</h2>
        <div class="info-row"><span class="label">Full Name:</span><span class="value">${admission.full_name}</span></div>
        <div class="info-row"><span class="label">Father's Name:</span><span class="value">${admission.father_name}</span></div>
        <div class="info-row"><span class="label">Husband's Name:</span><span class="value">${admission.husband_name || "N/A"}</span></div>
        <div class="info-row"><span class="label">Age:</span><span class="value">${admission.age}</span></div>
        
        <h2>2. Contact Details</h2>
        <div class="info-row"><span class="label">Mobile Number:</span><span class="value">${admission.mobile_number}</span></div>
        <div class="info-row"><span class="label">WhatsApp Number:</span><span class="value">${admission.whatsapp_number || "N/A"}</span></div>
        
        <h2>3. Educational Background</h2>
        <div class="info-row"><span class="label">Medium of Education:</span><span class="value">${admission.education_medium}</span></div>
        
        <h2>4. Application Status</h2>
        <div class="info-row"><span class="label">Status:</span><span class="value">${admission.status.toUpperCase()}</span></div>
        <div class="info-row"><span class="label">Submission Date:</span><span class="value">${format(new Date(admission.submission_date), "dd MMM yyyy")}</span></div>
        ${admission.notes ? `<div class="info-row"><span class="label">Notes:</span><span class="value">${admission.notes}</span></div>` : ""}
      </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const shareAdmission = async (admission: Admission) => {
    const shareText = `
Admission Application
---------------------
Name: ${admission.full_name}
Father: ${admission.father_name}
Age: ${admission.age}
Mobile: ${admission.mobile_number}
WhatsApp: ${admission.whatsapp_number || "N/A"}
Education: ${admission.education_medium}
Status: ${admission.status}
Date: ${format(new Date(admission.submission_date), "dd MMM yyyy")}
    `.trim();

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Admission - ${admission.full_name}`,
          text: shareText,
        });
      } catch (error) {
        // User cancelled share
      }
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success("Admission details copied to clipboard");
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "secondary",
      approved: "default",
      rejected: "destructive",
    };
    const displayText = status.charAt(0).toUpperCase() + status.slice(1);
    return <Badge variant={variants[status] || "outline"}>{displayText}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/admin")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Users className="h-6 w-6 text-emerald-600" />
                New Admissions
              </h1>
              <p className="text-muted-foreground">
                Manage admission applications
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={fetchAdmissions}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" onClick={downloadCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Admission</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Full Name *</Label>
                    <Input
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Father's Name *</Label>
                    <Input
                      value={formData.father_name}
                      onChange={(e) => setFormData({ ...formData, father_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Husband's Name</Label>
                    <Input
                      value={formData.husband_name}
                      onChange={(e) => setFormData({ ...formData, husband_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Age *</Label>
                    <Input
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Mobile Number *</Label>
                    <Input
                      value={formData.mobile_number}
                      onChange={(e) => setFormData({ ...formData, mobile_number: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>WhatsApp Number</Label>
                    <Input
                      value={formData.whatsapp_number}
                      onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Education Medium *</Label>
                    <Select
                      value={formData.education_medium}
                      onValueChange={(value) => setFormData({ ...formData, education_medium: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select medium" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="urdu">Urdu</SelectItem>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="hindi">Hindi</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                  </div>
                  <Button onClick={handleAdd} className="w-full">
                    Add Admission
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-foreground">{admissions.length}</p>
              <p className="text-sm text-muted-foreground">Total Applications</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-amber-600">
                {admissions.filter((a) => a.status === "pending").length}
              </p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-emerald-600">
                {admissions.filter((a) => a.status === "approved").length}
              </p>
              <p className="text-sm text-muted-foreground">Approved</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-red-600">
                {admissions.filter((a) => a.status === "rejected").length}
              </p>
              <p className="text-sm text-muted-foreground">Rejected</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or mobile..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredAdmissions.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No admissions found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Father</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Mobile</TableHead>
                      <TableHead>Education</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAdmissions.map((admission) => (
                      <TableRow key={admission.id}>
                        <TableCell className="font-medium">{admission.full_name}</TableCell>
                        <TableCell>{admission.father_name}</TableCell>
                        <TableCell>{admission.age}</TableCell>
                        <TableCell>{admission.mobile_number}</TableCell>
                        <TableCell className="capitalize">{admission.education_medium}</TableCell>
                        <TableCell>{getStatusBadge(admission.status)}</TableCell>
                        <TableCell>
                          {format(new Date(admission.submission_date), "dd MMM yyyy")}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleView(admission)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(admission)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => downloadPDF(admission)}
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => shareAdmission(admission)}
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Admission?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently delete the admission for{" "}
                                    <strong>{admission.full_name}</strong>. This action cannot be
                                    undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(admission.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* View Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Admission Details</DialogTitle>
            </DialogHeader>
            {selectedAdmission && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium">{selectedAdmission.full_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Father's Name</p>
                    <p className="font-medium">{selectedAdmission.father_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Husband's Name</p>
                    <p className="font-medium">{selectedAdmission.husband_name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Age</p>
                    <p className="font-medium">{selectedAdmission.age}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Mobile</p>
                    <p className="font-medium">{selectedAdmission.mobile_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">WhatsApp</p>
                    <p className="font-medium">{selectedAdmission.whatsapp_number || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Education Medium</p>
                    <p className="font-medium capitalize">{selectedAdmission.education_medium}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    {getStatusBadge(selectedAdmission.status)}
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Submission Date</p>
                    <p className="font-medium">
                      {format(new Date(selectedAdmission.submission_date), "dd MMM yyyy")}
                    </p>
                  </div>
                  {selectedAdmission.notes && (
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">Notes</p>
                      <p className="font-medium">{selectedAdmission.notes}</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => downloadPDF(selectedAdmission)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => shareAdmission(selectedAdmission)}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Admission</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Full Name *</Label>
                <Input
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Father's Name *</Label>
                <Input
                  value={formData.father_name}
                  onChange={(e) => setFormData({ ...formData, father_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Husband's Name</Label>
                <Input
                  value={formData.husband_name}
                  onChange={(e) => setFormData({ ...formData, husband_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Age *</Label>
                <Input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Mobile Number *</Label>
                <Input
                  value={formData.mobile_number}
                  onChange={(e) => setFormData({ ...formData, mobile_number: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>WhatsApp Number</Label>
                <Input
                  value={formData.whatsapp_number}
                  onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Education Medium *</Label>
                <Select
                  value={formData.education_medium}
                  onValueChange={(value) => setFormData({ ...formData, education_medium: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select medium" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urdu">Urdu</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="hindi">Hindi</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
              <Button onClick={handleSaveEdit} className="w-full">
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdmissionManagement;
