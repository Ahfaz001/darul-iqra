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
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import madrasaLogo from '@/assets/madrasa-logo.jpg';
import { ArrowLeft, Calendar as CalendarIcon, Check, X, Clock, AlertCircle, Save } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

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
}

const AttendanceManagement: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Map<string, AttendanceRecord>>(new Map());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
          notes: record.notes || undefined
        });
      });
      
      // Initialize unmarked students as present by default
      students.forEach(student => {
        if (!attendanceMap.has(student.user_id)) {
          attendanceMap.set(student.user_id, {
            student_id: student.user_id,
            status: 'present'
          });
        }
      });
      
      setAttendance(attendanceMap);
    } catch (error: any) {
      console.error('Error fetching attendance:', error);
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
      const records = Array.from(attendance.values()).map(record => ({
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
        <title>Attendance Management | Dar-ul-Ulum</title>
        <meta name="description" content="Mark and manage student attendance" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
        <header className="bg-white border-b border-border/50 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate('/admin')}
                  className="mr-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <img 
                  src={madrasaLogo} 
                  alt="Madrasa Logo" 
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h1 className="font-display font-bold text-primary text-lg">
                    Attendance Management
                  </h1>
                  <p className="text-xs text-muted-foreground">Mark daily student attendance</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      {format(selectedDate, 'PPP')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                
                <Button 
                  onClick={saveAttendance} 
                  disabled={saving || students.length === 0}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : students.length === 0 ? (
            <Card className="bg-white border-border/30">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Students Found</h3>
                <p className="text-muted-foreground text-center">
                  There are no students registered in the system yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-white border-border/30">
              <CardHeader>
                <CardTitle className="text-lg">
                  Student Attendance - {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">#</TableHead>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.map((student, index) => {
                        const record = attendance.get(student.user_id);
                        const status = record?.status || 'present';
                        
                        return (
                          <TableRow key={student.user_id}>
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            <TableCell className="font-medium">{student.full_name}</TableCell>
                            <TableCell className="text-muted-foreground">{student.email || '-'}</TableCell>
                            <TableCell>
                              <div className="flex justify-center">
                                <Select
                                  value={status}
                                  onValueChange={(value) => updateAttendance(student.user_id, value as AttendanceStatus)}
                                >
                                  <SelectTrigger className={cn("w-[130px]", getStatusColor(status))}>
                                    <div className="flex items-center gap-2">
                                      {getStatusIcon(status)}
                                      <SelectValue />
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
