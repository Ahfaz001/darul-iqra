import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ThemeToggle from '@/components/ThemeToggle';
import AdminMobileNav from '@/components/admin/AdminMobileNav';
import NotificationBell from '@/components/NotificationBell';
import madrasaLogo from '@/assets/madrasa-logo.jpg';
import { 
  Users, 
  FileText, 
  Calendar, 
  BookOpen, 
  Settings, 
  LogOut,
  BarChart3,
  Upload,
  UserPlus,
  ClipboardList,
  TrendingUp,
  ChevronRight,
  Sparkles,
  Shield,
  Activity
} from 'lucide-react';

interface AdminStats {
  totalStudents: number;
  totalTeachers: number;
  activeExams: number;
  avgAttendance: number;
  recentStudents: number;
}

interface RecentActivity {
  id: string;
  type: 'enrollment' | 'exam' | 'attendance';
  title: string;
  description: string;
  time: string;
}

const AdminPanel: React.FC = () => {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats>({
    totalStudents: 0,
    totalTeachers: 0,
    activeExams: 0,
    avgAttendance: 0,
    recentStudents: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      // Fetch student count
      const { data: studentRoles } = await supabase
        .from('user_roles')
        .select('id, created_at')
        .eq('role', 'student');

      const totalStudents = studentRoles?.length || 0;
      
      // Count students added this month
      const thisMonth = new Date();
      thisMonth.setDate(1);
      const recentStudents = studentRoles?.filter(s => 
        new Date(s.created_at) >= thisMonth
      ).length || 0;

      // Fetch teacher count
      const { data: teacherRoles } = await supabase
        .from('user_roles')
        .select('id')
        .eq('role', 'teacher');

      const totalTeachers = teacherRoles?.length || 0;

      // Fetch active exams (upcoming or today)
      const today = new Date().toISOString().split('T')[0];
      const { data: exams } = await supabase
        .from('exams')
        .select('id')
        .gte('exam_date', today);

      const activeExams = exams?.length || 0;

      // Fetch attendance stats for this month
      const monthStart = new Date();
      monthStart.setDate(1);
      const { data: attendance } = await supabase
        .from('attendance')
        .select('status')
        .gte('date', monthStart.toISOString().split('T')[0]);

      const totalAttendance = attendance?.length || 0;
      const presentCount = attendance?.filter(a => a.status === 'present' || a.status === 'late').length || 0;
      const avgAttendance = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0;

      setStats({
        totalStudents,
        totalTeachers,
        activeExams,
        avgAttendance,
        recentStudents
      });

      // Build recent activity
      const activities: RecentActivity[] = [];
      
      // Get recent exam results
      const { data: recentResults } = await supabase
        .from('exam_results')
        .select('id, created_at, exam:exams(title)')
        .order('created_at', { ascending: false })
        .limit(2);

      recentResults?.forEach(r => {
        const exam = Array.isArray(r.exam) ? r.exam[0] : r.exam;
        activities.push({
          id: r.id,
          type: 'exam',
          title: 'Exam results published',
          description: exam?.title || 'Exam',
          time: getRelativeTime(r.created_at)
        });
      });

      // Get recent attendance
      const { data: recentAttendance } = await supabase
        .from('attendance')
        .select('id, date, status')
        .order('created_at', { ascending: false })
        .limit(1);

      if (recentAttendance && recentAttendance.length > 0) {
        const todayAttendance = attendance?.filter(a => 
          a.status === 'present'
        ).length || 0;
        
        activities.push({
          id: recentAttendance[0].id,
          type: 'attendance',
          title: 'Attendance marked',
          description: `${todayAttendance} students present today`,
          time: 'Today'
        });
      }

      setRecentActivity(activities.slice(0, 3));
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const displayStats = [
    { 
      label: 'Total Students', 
      value: loading ? '...' : stats.totalStudents.toString(), 
      change: `+${stats.recentStudents} this month`, 
      icon: Users, 
      gradient: 'from-blue-500 to-cyan-500', 
      trend: 'up' 
    },
    { 
      label: 'Active Exams', 
      value: loading ? '...' : stats.activeExams.toString(), 
      change: 'Upcoming exams', 
      icon: FileText, 
      gradient: 'from-amber-500 to-orange-500', 
      trend: 'up' 
    },
    { 
      label: 'Avg Attendance', 
      value: loading ? '...' : `${stats.avgAttendance}%`, 
      change: 'This month', 
      icon: Calendar, 
      gradient: 'from-emerald-500 to-teal-500', 
      trend: 'up' 
    },
    { 
      label: 'Total Teachers', 
      value: loading ? '...' : stats.totalTeachers.toString(), 
      change: 'All active', 
      icon: UserPlus, 
      gradient: 'from-purple-500 to-pink-500', 
      trend: 'stable' 
    },
  ];

  const adminModules = [
    { 
      title: 'User Management', 
      description: 'Add, edit, or remove students and teachers', 
      icon: Users,
      href: '/admin/users',
      gradient: 'from-blue-500/20 to-blue-500/5',
      iconBg: 'bg-blue-500/20 text-blue-600 dark:text-blue-400',
      adminOnly: true
    },
    { 
      title: 'Exam Management', 
      description: 'Create and manage exams and papers', 
      icon: FileText,
      href: '/admin/exams',
      gradient: 'from-emerald-500/20 to-emerald-500/5',
      iconBg: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
      adminOnly: false
    },
    { 
      title: 'Attendance', 
      description: 'Mark and view student attendance', 
      icon: ClipboardList,
      href: '/admin/attendance',
      gradient: 'from-amber-500/20 to-amber-500/5',
      iconBg: 'bg-amber-500/20 text-amber-600 dark:text-amber-400',
      adminOnly: false
    },
    { 
      title: 'Hadith Section', 
      description: 'Manage daily Hadith content', 
      icon: BookOpen,
      href: '/admin/hadith',
      gradient: 'from-rose-500/20 to-rose-500/5',
      iconBg: 'bg-rose-500/20 text-rose-600 dark:text-rose-400',
      adminOnly: true
    },
    { 
      title: 'Books Library', 
      description: 'Upload and manage books', 
      icon: BookOpen,
      href: '/admin/books',
      gradient: 'from-indigo-500/20 to-indigo-500/5',
      iconBg: 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400',
      adminOnly: true
    },
    { 
      title: 'Quran Section', 
      description: 'Upload & manage Quran PDFs', 
      icon: BookOpen,
      href: '/admin/quran',
      gradient: 'from-emerald-500/20 to-emerald-500/5',
      iconBg: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
      adminOnly: true
    },
    { 
      title: 'Content Uploads', 
      description: 'Upload PDFs and learning materials', 
      icon: Upload,
      href: '/admin/content',
      gradient: 'from-cyan-500/20 to-cyan-500/5',
      iconBg: 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400',
      adminOnly: false
    },
    { 
      title: 'New Admissions', 
      description: 'View and manage admission applications', 
      icon: UserPlus,
      href: '/admin/admissions',
      gradient: 'from-teal-500/20 to-teal-500/5',
      iconBg: 'bg-teal-500/20 text-teal-600 dark:text-teal-400',
      adminOnly: true
    },
    { 
      title: 'Reports & Analytics', 
      description: 'View performance reports', 
      icon: BarChart3,
      href: '/admin/reports',
      gradient: 'from-purple-500/20 to-purple-500/5',
      iconBg: 'bg-purple-500/20 text-purple-600 dark:text-purple-400',
      adminOnly: true
    },
  ];

  const filteredModules = role === 'admin' 
    ? adminModules 
    : adminModules.filter(m => !m.adminOnly);

  const quickActions = [
    { label: 'Add Student', icon: UserPlus, variant: 'default' as const, href: '/admin/users' },
    { label: 'Create Exam', icon: FileText, variant: 'outline' as const, href: '/admin/exams' },
    { label: 'Mark Attendance', icon: ClipboardList, variant: 'outline' as const, href: '/admin/attendance' },
    { label: 'Upload Content', icon: Upload, variant: 'outline' as const, href: '/admin/content' },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'enrollment': return UserPlus;
      case 'exam': return FileText;
      case 'attendance': return Calendar;
      default: return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'enrollment': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
      case 'exam': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
      case 'attendance': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <>
      <Helmet>
        <title>{role === 'admin' ? 'Admin Panel' : 'Teacher Dashboard'} | Idarah Tarjumat-ul-Qur'an</title>
        <meta name="description" content="Manage students, exams, attendance, and content for Idarah Tarjumat-ul-Qur'an Wa Sunnah." />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Decorative Background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tr from-secondary/5 to-amber-500/5 rounded-full blur-3xl"></div>
        </div>

        {/* Header */}
        <header className="bg-card/80 backdrop-blur-xl border-b border-border sticky top-0 z-50">
          <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <AdminMobileNav />
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-30"></div>
                  <img 
                    src={madrasaLogo} 
                    alt="Madrasa Logo" 
                    className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-full ring-2 ring-primary/20"
                  />
                </div>
                <div className="min-w-0">
                  <h1 className="font-display font-bold text-primary text-sm sm:text-lg flex items-center gap-1 sm:gap-2">
                    <span className="truncate">{role === 'admin' ? 'Admin Panel' : 'Teacher'}</span>
                    <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-secondary shrink-0" />
                  </h1>
                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate hidden sm:block">Idarah Tarjumat-ul-Qur'an Wa Sunnah</p>
                </div>
              </div>
              
              <div className="flex items-center gap-1 sm:gap-3">
                <NotificationBell variant="admin" />
                <ThemeToggle />
                <div className="hidden md:block text-right px-2 sm:px-3 py-1 rounded-lg bg-muted/50">
                  <p className="text-xs sm:text-sm font-medium text-foreground">{user?.email?.split('@')[0]}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground capitalize flex items-center gap-1 justify-end">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500"></span>
                    {role}
                  </p>
                </div>
                {role === 'admin' && (
                  <Button variant="outline" size="icon" className="border-border h-8 w-8 sm:h-9 sm:w-9 hidden sm:flex">
                    <Settings className="h-4 w-4" />
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={handleSignOut}
                  className="border-border hover:bg-destructive hover:text-destructive-foreground hover:border-destructive h-8 w-8 sm:h-9 sm:w-9"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
          {/* Welcome */}
          <div className="mb-4 sm:mb-8">
            <h2 className="text-xl sm:text-3xl font-display font-bold text-foreground mb-1 sm:mb-2 flex items-center gap-2 sm:gap-3">
              Welcome, {role === 'admin' ? 'Admin' : 'Teacher'}
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-secondary" />
            </h2>
            <p className="text-sm sm:text-lg text-muted-foreground">
              Manage your madrasa operations from this dashboard.
            </p>
          </div>

          {/* Stats Grid */}
          {role === 'admin' && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-8">
              {displayStats.map((stat, index) => (
                <Card key={index} className="group relative overflow-hidden border-border/50 hover:shadow-xl transition-all duration-300">
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                  <CardContent className="p-3 sm:p-6">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0">
                        <p className="text-[10px] sm:text-sm text-muted-foreground truncate">{stat.label}</p>
                        <p className="text-xl sm:text-3xl font-bold text-foreground mt-0.5 sm:mt-1">{stat.value}</p>
                        <p className="text-[10px] sm:text-xs text-emerald-600 dark:text-emerald-400 mt-1 sm:mt-2 flex items-center gap-1">
                          <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" />
                          <span className="truncate">{stat.change}</span>
                        </p>
                      </div>
                      <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br ${stat.gradient} bg-opacity-20 shrink-0`}>
                        <stat.icon className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Module Grid */}
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-base sm:text-xl font-semibold text-foreground">Management Modules</h3>
            <Button variant="ghost" size="sm" className="text-muted-foreground text-xs sm:text-sm h-8">
              View All <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
            {filteredModules.map((module, index) => (
              <Card 
                key={index} 
                className={`group relative overflow-hidden bg-gradient-to-br ${module.gradient} border-border/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer`}
                onClick={() => navigate(module.href)}
              >
                <CardContent className="p-3 sm:p-6">
                  <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl ${module.iconBg} flex items-center justify-center mb-2 sm:mb-4 group-hover:scale-110 transition-transform`}>
                    <module.icon className="h-5 w-5 sm:h-7 sm:w-7" />
                  </div>
                  <CardTitle className="text-xs sm:text-lg mb-1 sm:mb-2 group-hover:text-primary transition-colors line-clamp-1">{module.title}</CardTitle>
                  <CardDescription className="text-[10px] sm:text-sm line-clamp-2">{module.description}</CardDescription>
                  <div className="mt-2 sm:mt-4 flex items-center text-[10px] sm:text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Open <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <Card className="mt-4 sm:mt-8 border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6">
              <div className="flex items-center gap-2">
                <div className="p-1.5 sm:p-2 rounded-lg bg-muted">
                  <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                </div>
                <CardTitle className="text-sm sm:text-lg">Quick Actions</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="px-3 sm:px-6">
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {quickActions.map((action, index) => (
                  <Button 
                    key={index} 
                    variant={action.variant}
                    size="sm"
                    className={`text-xs sm:text-sm ${action.variant === 'default' ? 'bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg' : ''}`}
                    onClick={() => navigate(action.href)}
                  >
                    <action.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-2" />
                    <span className="hidden sm:inline">{action.label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="mt-4 sm:mt-8 border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 sm:p-2 rounded-lg bg-muted">
                    <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-sm sm:text-lg">Recent Activity</CardTitle>
                </div>
                <Button variant="ghost" size="sm" className="text-xs sm:text-sm h-7 sm:h-8">View All</Button>
              </div>
            </CardHeader>
            <CardContent className="px-3 sm:px-6">
              {loading ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : recentActivity.length === 0 ? (
                <p className="text-muted-foreground text-center py-4 text-sm">No recent activity</p>
              ) : (
                <div className="space-y-2 sm:space-y-3">
                  {recentActivity.map((activity) => {
                    const IconComponent = getActivityIcon(activity.type);
                    return (
                      <div key={activity.id} className="flex items-center gap-2 sm:gap-4 p-2 sm:p-3 rounded-xl hover:bg-muted/50 transition-colors">
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 ${getActivityColor(activity.type)}`}>
                          <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium truncate">{activity.title}</p>
                          <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{activity.description}</p>
                        </div>
                        <span className="text-[10px] sm:text-xs text-muted-foreground shrink-0">{activity.time}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
};

export default AdminPanel;
