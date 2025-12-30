import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import madrasaLogo from '@/assets/madrasa-logo.jpg';
import { ArrowLeft, Calendar as CalendarIcon, Check, X, Clock, AlertCircle, Save, Download, FileSpreadsheet } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';
import { notifyAttendance } from '@/hooks/useSendNotification';
import AdminMobileNav from '@/components/admin/AdminMobileNav';

type AttendanceStatus = Database['public']['Enums']['attendance_status'];

interface Student {
  user_id: string;
  full_name: string;
  email: string | null;
}

interface AttendanceRecord {
  id?: string;
  student_id: string;
  status: AttendanceStatus;
  notes?: string;
  created_at?: string;
}

const AttendanceManagement: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Map<string, AttendanceRecord>>(new Map());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [reportStartDate, setReportStartDate] = useState<Date>(new Date());
  const [reportEndDate, setReportEndDate] = useState<Date>(new Date());
  const [downloadingReport, setDownloadingReport] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (students.length > 0) {
      fetchAttendance();
    }
  }, [selectedDate, students]);

  const fetchStudents = async () => {
    try {
      const { data: studentRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'student');

      if (rolesError) throw rolesError;

      const studentIds = studentRoles?.map(r => r.user_id) || [];
      
      if (studentIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('user_id, full_name, email')
          .in('user_id', studentIds);

        if (profilesError) throw profilesError;
        setStudents(profiles || []);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch students",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendance = async () => {
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('date', dateStr);

      if (error) throw error;

      const attendanceMap = new Map<string, AttendanceRecord>();
      data?.forEach(record => {
        attendanceMap.set(record.student_id, {
          id: record.id,
          student_id: record.student_id,
          status: record.status as AttendanceStatus,
          notes: record.notes || undefined,
          created_at: record.created_at
        });
      });
      
      // Don't set default status - leave unmarked students without any status
      setAttendance(attendanceMap);
    } catch (error: any) {
      console.error('Error fetching attendance:', error);
    }
  };

  const downloadReport = async () => {
    setDownloadingReport(true);
    try {
      const startStr = format(reportStartDate, 'yyyy-MM-dd');
      const endStr = format(reportEndDate, 'yyyy-MM-dd');
      
      // Fetch all attendance records in date range
      const { data: attendanceData, error: attendanceError } = await supabase
        .from('attendance')
        .select('*')
        .gte('date', startStr)
        .lte('date', endStr)
        .order('date', { ascending: true });

      if (attendanceError) throw attendanceError;

      // Create student name map
      const studentMap = new Map<string, string>();
      students.forEach(s => studentMap.set(s.user_id, s.full_name));

      // Create CSV content
      const headers = ['Date', 'Time Saved', 'Student Name', 'Status', 'Notes'];
      const rows = attendanceData?.map(record => [
        format(new Date(record.date), 'dd/MM/yyyy'),
        format(new Date(record.created_at), 'hh:mm a'),
        studentMap.get(record.student_id) || 'Unknown',
        record.status.charAt(0).toUpperCase() + record.status.slice(1),
        record.notes || '-'
      ]) || [];

      const csvContent = [
        `Attendance Report - ${format(reportStartDate, 'dd/MM/yyyy')} to ${format(reportEndDate, 'dd/MM/yyyy')}`,
        '',
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `Attendance_Report_${startStr}_to_${endStr}.csv`;
      link.click();
      URL.revokeObjectURL(link.href);

      toast({
        title: "Report Downloaded",
        description: `Attendance report from ${format(reportStartDate, 'dd MMM yyyy')} to ${format(reportEndDate, 'dd MMM yyyy')}`
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to download report",
        variant: "destructive"
      });
    } finally {
      setDownloadingReport(false);
    }
  };

  const updateAttendance = (studentId: string, status: AttendanceStatus) => {
    setAttendance(prev => {
      const newMap = new Map(prev);
      const existing = newMap.get(studentId);
      newMap.set(studentId, {
        ...existing,
        student_id: studentId,
        status
      });
      return newMap;
    });
  };

  const saveAttendance = async () => {
    setSaving(true);
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const displayDate = format(selectedDate, 'dd MMM yyyy');
      
      // Only save records that have been explicitly set (exist in the attendance map)
      const recordsToSave = Array.from(attendance.values());
      
      if (recordsToSave.length === 0) {
        toast({
          title: "No Attendance Marked",
          description: "Please mark attendance for at least one student",
          variant: "destructive"
        });
        setSaving(false);
        return;
      }
      
      const records = recordsToSave.map(record => ({
        student_id: record.student_id,
        date: dateStr,
        status: record.status,
        marked_by: user?.id,
        notes: record.notes || null
      }));

      // Upsert all attendance records
      const { error } = await supabase
        .from('attendance')
        .upsert(records, {
          onConflict: 'student_id,date'
        });

      if (error) throw error;

      // Send push notifications for ALL attendance statuses including present
      const notificationPromises = records.map(record => {
        const student = students.find(s => s.user_id === record.student_id);
        if (student) {
          return notifyAttendance(
            record.student_id,
            student.full_name,
            record.status as 'present' | 'absent' | 'late' | 'excused',
            displayDate
          );
        }
        return Promise.resolve();
      });

      await Promise.allSettled(notificationPromises);

      toast({
        title: "Success",
        description: "Attendance saved successfully"
      });
      
      fetchAttendance();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save attendance",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const getStatusIcon = (status: AttendanceStatus) => {
    switch (status) {
      case 'present': return <Check className="h-4 w-4 text-green-600" />;
      case 'absent': return <X className="h-4 w-4 text-red-600" />;
      case 'late': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'excused': return <AlertCircle className="h-4 w-4 text-blue-600" />;
    }
  };

  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-700 border-green-200';
      case 'absent': return 'bg-red-100 text-red-700 border-red-200';
      case 'late': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'excused': return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  return (
    <>
      <Helmet>
        <title>Attendance Management | Idarah Tarjumat-ul-Qur'an</title>
        <meta name="description" content="Mark and manage student attendance" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <header className="bg-card border-b border-border/50 sticky top-0 z-50">
          <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
            <div className="flex flex-col gap-3">
              {/* Top row - Logo and title */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <AdminMobileNav />
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => navigate('/admin')}
                    className="h-8 w-8 sm:h-9 sm:w-9 shrink-0"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <img 
                    src={madrasaLogo} 
                    alt="Madrasa Logo" 
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full shrink-0"
                  />
                  <div className="min-w-0">
                    <h1 className="font-display font-bold text-primary text-sm sm:text-lg truncate">
                      Attendance
                    </h1>
                    <p className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">Mark daily student attendance</p>
                  </div>
                </div>
                
                {/* Save button always visible */}
                <Button 
                  onClick={saveAttendance} 
                  disabled={saving || students.length === 0}
                  size="sm"
                  className="bg-primary hover:bg-primary/90"
                >
                  <Save className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">{saving ? 'Saving...' : 'Save'}</span>
                </Button>
              </div>
              
              {/* Bottom row - Date picker and download */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs sm:text-sm shrink-0">
                      <CalendarIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span className="hidden xs:inline">{format(selectedDate, 'PPP')}</span>
                      <span className="xs:hidden">{format(selectedDate, 'dd MMM')}</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs sm:text-sm shrink-0">
                      <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Download Report</span>
                      <span className="sm:hidden">Report</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md max-w-[95vw]">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
                        <FileSpreadsheet className="h-4 w-4 sm:h-5 sm:w-5" />
                        Download Attendance Report
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Start Date</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start gap-2 text-sm">
                              <CalendarIcon className="h-4 w-4" />
                              {format(reportStartDate, 'PPP')}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={reportStartDate}
                              onSelect={(date) => date && setReportStartDate(date)}
                              initialFocus
                              className={cn("p-3 pointer-events-auto")}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">End Date</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start gap-2 text-sm">
                              <CalendarIcon className="h-4 w-4" />
                              {format(reportEndDate, 'PPP')}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={reportEndDate}
                              onSelect={(date) => date && setReportEndDate(date)}
                              initialFocus
                              className={cn("p-3 pointer-events-auto")}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <Button 
                        onClick={downloadReport} 
                        disabled={downloadingReport}
                        className="w-full"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        {downloadingReport ? 'Downloading...' : 'Download CSV Report'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : students.length === 0 ? (
            <Card className="bg-card border-border/30">
              <CardContent className="flex flex-col items-center justify-center py-12 px-4">
                <AlertCircle className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mb-4" />
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 text-center">No Students Found</h3>
                <p className="text-sm text-muted-foreground text-center">
                  There are no students registered in the system yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-card border-border/30">
              <CardHeader className="px-3 sm:px-6 py-3 sm:py-4">
                <CardTitle className="text-sm sm:text-lg">
                  <span className="hidden sm:inline">Student Attendance - {format(selectedDate, 'EEEE, MMMM d, yyyy')}</span>
                  <span className="sm:hidden">Attendance - {format(selectedDate, 'MMM d')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 sm:px-6">
                <div className="overflow-x-auto -mx-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[40px] pl-3 sm:pl-4">#</TableHead>
                        <TableHead className="min-w-[120px]">Name</TableHead>
                        <TableHead className="hidden md:table-cell">Email</TableHead>
                        <TableHead className="text-center min-w-[130px]">Status</TableHead>
                        <TableHead className="text-center hidden sm:table-cell min-w-[100px]">Saved</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.map((student, index) => {
                        const record = attendance.get(student.user_id);
                        const status = record?.status; // undefined if not marked
                        const hasStatus = status !== undefined;
                        
                        return (
                          <TableRow key={student.user_id}>
                            <TableCell className="font-medium pl-3 sm:pl-4 text-sm">{index + 1}</TableCell>
                            <TableCell className="font-medium text-sm">{student.full_name}</TableCell>
                            <TableCell className="text-muted-foreground text-sm hidden md:table-cell">{student.email || '-'}</TableCell>
                            <TableCell>
                              <div className="flex justify-center">
                                <Select
                                  value={status || ''}
                                  onValueChange={(value) => updateAttendance(student.user_id, value as AttendanceStatus)}
                                >
                                  <SelectTrigger className={cn("w-[110px] sm:w-[130px] text-xs sm:text-sm h-8 sm:h-9", hasStatus ? getStatusColor(status!) : 'bg-muted text-muted-foreground border-dashed')}>
                                    <div className="flex items-center gap-1.5 sm:gap-2">
                                      {hasStatus ? getStatusIcon(status!) : null}
                                      <SelectValue placeholder="Select" />
                                    </div>
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="present">
                                      <div className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-green-600" />
                                        Present
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="absent">
                                      <div className="flex items-center gap-2">
                                        <X className="h-4 w-4 text-red-600" />
                                        Absent
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="late">
                                      <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-yellow-600" />
                                        Late
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="excused">
                                      <div className="flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4 text-blue-600" />
                                        Excused
                                      </div>
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </TableCell>
                            <TableCell className="text-center text-xs sm:text-sm text-muted-foreground hidden sm:table-cell">
                              {record?.created_at ? (
                                <div className="flex flex-col items-center">
                                  <span>{format(new Date(record.created_at), 'dd/MM/yy')}</span>
                                  <span className="text-[10px] sm:text-xs">{format(new Date(record.created_at), 'hh:mm a')}</span>
                                </div>
                              ) : (
                                <span className="text-xs italic">Not saved</span>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </>
  );
};

export default AttendanceManagement;
