import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

interface Notification {
  id: string;
  type: 'exam' | 'result' | 'attendance' | 'book' | 'quran' | 'hadith' | 'general';
  title: string;
  message: string;
  date: Date;
  read: boolean;
}

interface NotificationBellProps {
  variant?: 'admin' | 'student';
}

const NotificationBell: React.FC<NotificationBellProps> = ({ variant = 'student' }) => {
  const { user, role } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const notificationsList: Notification[] = [];

      if (role === 'admin' || role === 'teacher') {
        // For admin/teacher - show recent activity
        const { data: recentExams } = await supabase
          .from('exams')
          .select('id, title, subject, created_at')
          .order('created_at', { ascending: false })
          .limit(5);

        recentExams?.forEach(exam => {
          notificationsList.push({
            id: `exam-${exam.id}`,
            type: 'exam',
            title: '📝 Exam Created',
            message: `${exam.title} - ${exam.subject}`,
            date: new Date(exam.created_at),
            read: false
          });
        });

        const { data: recentAttendance } = await supabase
          .from('attendance')
          .select('id, date, status, created_at')
          .order('created_at', { ascending: false })
          .limit(5);

        if (recentAttendance && recentAttendance.length > 0) {
          notificationsList.push({
            id: `attendance-summary`,
            type: 'attendance',
            title: '📋 Attendance Marked',
            message: `${recentAttendance.length} attendance records today`,
            date: new Date(recentAttendance[0].created_at),
            read: false
          });
        }
      } else {
        // For students - show their specific notifications
        const { data: examAssignments } = await supabase
          .from('exam_assignments')
          .select(`
            id,
            assigned_at,
            status,
            exams:exam_id (
              title,
              subject,
              exam_date
            )
          `)
          .eq('student_id', user.id)
          .order('assigned_at', { ascending: false })
          .limit(5);

        examAssignments?.forEach((assignment: any) => {
          if (assignment.exams) {
            notificationsList.push({
              id: `exam-assign-${assignment.id}`,
              type: 'exam',
              title: '📝 New Exam Assigned',
              message: `${assignment.exams.title} - ${assignment.exams.subject}`,
              date: new Date(assignment.assigned_at),
              read: assignment.status !== 'pending'
            });
          }
        });

        const { data: results } = await supabase
          .from('exam_results')
          .select(`
            id,
            marks_obtained,
            grade,
            created_at,
            is_published,
            exams:exam_id (
              title,
              total_marks
            )
          `)
          .eq('student_id', user.id)
          .eq('is_published', true)
          .order('created_at', { ascending: false })
          .limit(5);

        results?.forEach((result: any) => {
          if (result.exams) {
            notificationsList.push({
              id: `result-${result.id}`,
              type: 'result',
              title: '📊 Result Published',
              message: `${result.exams.title}: ${result.marks_obtained}/${result.exams.total_marks} (${result.grade || 'N/A'})`,
              date: new Date(result.created_at),
              read: false
            });
          }
        });

        const { data: attendance } = await supabase
          .from('attendance')
          .select('id, date, status, created_at')
          .eq('student_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        attendance?.forEach(record => {
          const statusEmoji = {
            present: '✅',
            absent: '❌',
            late: '⏰',
            excused: '📋'
          }[record.status] || '📋';

          notificationsList.push({
            id: `attendance-${record.id}`,
            type: 'attendance',
            title: `${statusEmoji} Attendance Update`,
            message: `Marked ${record.status} on ${format(new Date(record.date), 'dd MMM yyyy')}`,
            date: new Date(record.created_at),
            read: false
          });
        });
      }

      // Sort by date descending
      notificationsList.sort((a, b) => b.date.getTime() - a.date.getTime());
      setNotifications(notificationsList.slice(0, 10));
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'exam': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'result': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'attendance': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'book': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'quran': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'hadith': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={`relative ${variant === 'admin' ? 'h-8 w-8 sm:h-9 sm:w-9' : ''}`}
          aria-label="Notifications"
        >
          <Bell className={variant === 'admin' ? 'h-4 w-4 sm:h-5 sm:w-5' : 'h-5 w-5'} />
          {unreadCount > 0 && (
            <span className={`absolute ${variant === 'admin' ? '-top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 text-[8px] sm:text-[10px]' : '-top-1 -right-1 w-4 h-4 text-[10px]'} bg-destructive text-destructive-foreground rounded-full flex items-center justify-center`}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-3 border-b border-border">
          <h4 className="font-semibold text-sm">Notifications</h4>
          <p className="text-xs text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} new notifications` : 'No new notifications'}
          </p>
        </div>
        <ScrollArea className="h-[300px]">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Bell className="h-8 w-8 mb-2 opacity-50" />
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-3 hover:bg-muted/50 transition-colors ${!notification.read ? 'bg-muted/20' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${getTypeColor(notification.type)}`}>
                      {notification.type}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{notification.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{notification.message}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {format(notification.date, 'dd MMM yyyy, hh:mm a')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        {notifications.length > 0 && (
          <div className="p-2 border-t border-border">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full text-xs"
              onClick={() => {
                fetchNotifications();
              }}
            >
              Refresh Notifications
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;