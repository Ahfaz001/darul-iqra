import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import StudentLayout from '@/components/StudentLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, subMonths, addMonths } from 'date-fns';
import { Calendar, Check, X, Clock, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';

interface AttendanceRecord {
  id: string;
  date: string;
  status: string;
  notes: string | null;
}

const StudentAttendance: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    if (user) {
      fetchAttendance();
    }
  }, [user]);

  const fetchAttendance = async () => {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('student_id', user?.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setAttendance(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch attendance",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getAttendanceForDate = (date: Date) => {
    return attendance.find(a => isSameDay(new Date(a.date), date));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <Check className="h-4 w-4" />;
      case 'absent': return <X className="h-4 w-4" />;
      case 'late': return <Clock className="h-4 w-4" />;
      case 'excused': return <AlertCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-500 text-white';
      case 'absent': return 'bg-red-500 text-white';
      case 'late': return 'bg-yellow-500 text-white';
      case 'excused': return 'bg-blue-500 text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'present': return 'Present • حاضر';
      case 'absent': return 'Absent • غیر حاضر';
      case 'late': return 'Late • دیر سے';
      case 'excused': return 'Excused • معذرت';
      default: return status;
    }
  };

  // Calculate stats
  const stats = {
    total: attendance.length,
    present: attendance.filter(a => a.status === 'present').length,
    absent: attendance.filter(a => a.status === 'absent').length,
    late: attendance.filter(a => a.status === 'late').length,
    excused: attendance.filter(a => a.status === 'excused').length,
    percentage: attendance.length > 0 
      ? Math.round((attendance.filter(a => a.status === 'present' || a.status === 'late').length / attendance.length) * 100)
      : 0
  };

  // Get days for current month view
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get first day of week offset
  const firstDayOfWeek = monthStart.getDay();

  if (loading) {
    return (
      <StudentLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <Helmet>
        <title>My Attendance | Idarah Tarjumat-ul-Qur'an</title>
        <meta name="description" content="View your attendance history" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary to-accent py-6 px-4">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold mb-1 text-primary-foreground">📅 My Attendance</h1>
            <p className="text-primary-foreground/80">View your attendance history</p>
          </div>
        </div>

        <main className="container mx-auto px-4 py-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
            <Card className="bg-card border-border/30 col-span-2 sm:col-span-1">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-primary">{stats.percentage}%</p>
                <p className="text-xs text-muted-foreground">Overall • مجموعی</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border/30">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.present}</p>
                </div>
                <p className="text-xs text-muted-foreground">Present • حاضر</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border/30">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.absent}</p>
                </div>
                <p className="text-xs text-muted-foreground">Absent • غیر حاضر</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border/30">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.late}</p>
                </div>
                <p className="text-xs text-muted-foreground">Late • دیر سے</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border/30">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.excused}</p>
                </div>
                <p className="text-xs text-muted-foreground">Excused • معذرت</p>
              </CardContent>
            </Card>
          </div>

          {/* Calendar View */}
          <Card className="bg-card border-border/30 mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {format(currentMonth, 'MMMM yyyy')}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentMonth(new Date())}
                  >
                    Today
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Week Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center text-xs font-medium text-muted-foreground p-2">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Empty cells for offset */}
                {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}
                
                {/* Days */}
                {daysInMonth.map((day) => {
                  const record = getAttendanceForDate(day);
                  const isToday = isSameDay(day, new Date());
                  
                  return (
                    <div
                      key={day.toISOString()}
                      className={`aspect-square flex flex-col items-center justify-center rounded-lg border ${
                        isToday ? 'border-primary border-2' : 'border-border/30'
                      } ${record ? getStatusColor(record.status) : 'bg-muted/20'}`}
                    >
                      <span className={`text-sm font-medium ${record ? 'text-inherit' : 'text-foreground'}`}>
                        {format(day, 'd')}
                      </span>
                      {record && (
                        <span className="mt-0.5">
                          {getStatusIcon(record.status)}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {/* Legend */}
              <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-border/30">
                <span className="text-xs text-muted-foreground">Legend:</span>
                <span className="flex items-center gap-1 text-xs">
                  <div className="w-4 h-4 rounded bg-green-500 flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  Present
                </span>
                <span className="flex items-center gap-1 text-xs">
                  <div className="w-4 h-4 rounded bg-red-500 flex items-center justify-center">
                    <X className="h-3 w-3 text-white" />
                  </div>
                  Absent
                </span>
                <span className="flex items-center gap-1 text-xs">
                  <div className="w-4 h-4 rounded bg-yellow-500 flex items-center justify-center">
                    <Clock className="h-3 w-3 text-white" />
                  </div>
                  Late
                </span>
                <span className="flex items-center gap-1 text-xs">
                  <div className="w-4 h-4 rounded bg-blue-500 flex items-center justify-center">
                    <AlertCircle className="h-3 w-3 text-white" />
                  </div>
                  Excused
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Recent Records List */}
          <Card className="bg-card border-border/30">
            <CardHeader>
              <CardTitle className="text-lg">Recent Records • حالیہ ریکارڈ</CardTitle>
            </CardHeader>
            <CardContent>
              {attendance.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No attendance records yet • ابھی تک کوئی حاضری ریکارڈ نہیں
                </p>
              ) : (
                <div className="space-y-2">
                  {attendance.slice(0, 15).map((record) => (
                    <div 
                      key={record.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(record.status)}`}>
                          {getStatusIcon(record.status)}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {format(new Date(record.date), 'EEEE, MMMM d, yyyy')}
                          </p>
                          {record.notes && (
                            <p className="text-xs text-muted-foreground">{record.notes}</p>
                          )}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        record.status === 'present' ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' :
                        record.status === 'absent' ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300' :
                        record.status === 'late' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300' :
                        'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                      }`}>
                        {getStatusLabel(record.status)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </StudentLayout>
  );
};

export default StudentAttendance;
