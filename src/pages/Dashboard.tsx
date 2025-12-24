import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageSelector from '@/components/LanguageSelector';
import madrasaLogo from '@/assets/madrasa-logo.jpg';
import { 
  BookOpen, 
  Calendar, 
  FileText, 
  LogOut, 
  User, 
  GraduationCap,
  Clock,
  BookMarked,
  TrendingUp,
  Award,
  Bell,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface DashboardStats {
  attendanceRate: number;
  examsCompleted: number;
  totalExams: number;
  avgScore: number;
  pendingExams: number;
}

interface UpcomingExam {
  id: string;
  title: string;
  subject: string;
  exam_date: string;
}

const Dashboard: React.FC = () => {
  const { user, role, signOut, loading } = useAuth();
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    attendanceRate: 0,
    examsCompleted: 0,
    totalExams: 0,
    avgScore: 0,
    pendingExams: 0
  });
  const [upcomingExams, setUpcomingExams] = useState<UpcomingExam[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!loading && role && (role === 'admin' || role === 'teacher')) {
      navigate('/admin');
    }
  }, [role, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;
    
    try {
      // Fetch attendance stats
      const { data: attendance } = await supabase
        .from('attendance')
        .select('status')
        .eq('student_id', user.id);

      const totalAttendance = attendance?.length || 0;
      const presentCount = attendance?.filter(a => a.status === 'present' || a.status === 'late').length || 0;
      const attendanceRate = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0;

      // Fetch exam results
      const { data: results } = await supabase
        .from('exam_results')
        .select('marks_obtained, exam:exams(total_marks)')
        .eq('student_id', user.id)
        .eq('is_published', true);

      const examsCompleted = results?.length || 0;
      let avgScore = 0;
      if (results && results.length > 0) {
        const totalPercentage = results.reduce((acc, r) => {
          const exam = Array.isArray(r.exam) ? r.exam[0] : r.exam;
          const totalMarks = exam?.total_marks || 100;
          return acc + (r.marks_obtained / totalMarks) * 100;
        }, 0);
        avgScore = Math.round(totalPercentage / results.length);
      }

      // Fetch assigned exams (pending)
      const { data: assignments } = await supabase
        .from('exam_assignments')
        .select('id, status')
        .eq('student_id', user.id);

      const pendingExams = assignments?.filter(a => a.status === 'pending' || a.status === 'in_progress').length || 0;
      const totalExams = assignments?.length || 0;

      // Fetch upcoming exams
      const today = new Date().toISOString().split('T')[0];
      const { data: upcoming } = await supabase
        .from('exam_assignments')
        .select('exam:exams(id, title, subject, exam_date)')
        .eq('student_id', user.id)
        .eq('status', 'pending')
        .limit(3);

      const upcomingExamsList = (upcoming || [])
        .map(a => Array.isArray(a.exam) ? a.exam[0] : a.exam)
        .filter(Boolean) as UpcomingExam[];

      setStats({
        attendanceRate,
        examsCompleted,
        totalExams,
        avgScore,
        pendingExams
      });
      setUpcomingExams(upcomingExamsList);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const quickStats = [
    { label: t('attendanceRate'), value: `${stats.attendanceRate}%`, icon: Calendar, color: 'from-emerald-500 to-teal-500', bgColor: 'bg-emerald-500/10' },
    { label: t('examsCompleted'), value: `${stats.examsCompleted}`, icon: FileText, color: 'from-amber-500 to-orange-500', bgColor: 'bg-amber-500/10' },
    { label: t('averageScore'), value: `${stats.avgScore}%`, icon: TrendingUp, color: 'from-purple-500 to-pink-500', bgColor: 'bg-purple-500/10' },
    { label: t('pendingExams'), value: `${stats.pendingExams}`, icon: Award, color: 'from-blue-500 to-cyan-500', bgColor: 'bg-blue-500/10' },
  ];

  const menuItems = [
    { 
      title: t('myExams'), 
      description: t('viewTakeExams'), 
      icon: FileText,
      href: '/exams',
      gradient: 'from-primary/20 to-primary/5',
      iconBg: 'bg-primary/20 text-primary'
    },
    { 
      title: t('myResults'), 
      description: t('viewResults'), 
      icon: GraduationCap,
      href: '/results',
      gradient: 'from-amber-500/20 to-amber-500/5',
      iconBg: 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
    },
    { 
      title: t('attendance'), 
      description: t('viewAttendance'), 
      icon: Calendar,
      href: '/attendance',
      gradient: 'from-emerald-500/20 to-emerald-500/5',
      iconBg: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
    },
    { 
      title: t('dailyHadith'), 
      description: t('readTodayHadith'), 
      icon: BookMarked,
      href: '/hadith',
      gradient: 'from-rose-500/20 to-rose-500/5',
      iconBg: 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
    },
    { 
      title: t('booksLibrary'), 
      description: t('readBooks'), 
      icon: BookOpen,
      href: '/books',
      gradient: 'from-indigo-500/20 to-indigo-500/5',
      iconBg: 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400'
    },
    { 
      title: t('myProfile'), 
      description: t('manageAccount'), 
      icon: User,
      href: '/profile',
      gradient: 'from-blue-500/20 to-blue-500/5',
      iconBg: 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
    },
  ];

  return (
    <>
      <Helmet>
        <title>Student Dashboard | Idarah Tarjumat-ul-Qur'an Wa Sunnah</title>
        <meta name="description" content="Access your student dashboard to view exams, attendance, and Islamic learning resources." />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Decorative Background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-primary/5 to-secondary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-500/5 to-blue-500/5 rounded-full blur-3xl"></div>
        </div>

        {/* Header */}
        <header className="bg-card/80 backdrop-blur-xl border-b border-border sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-30"></div>
                  <img 
                    src={madrasaLogo} 
                    alt="Madrasa Logo" 
                    className="relative w-11 h-11 rounded-full ring-2 ring-primary/20"
                  />
                </div>
                <div>
                  <h1 className="font-display font-bold text-primary text-lg flex items-center gap-2">
                    {t('studentPortal')}
                    <Sparkles className="w-4 h-4 text-secondary" />
                  </h1>
                  <p className="text-xs text-muted-foreground">Idarah Tarjumat-ul-Qur'an Wa Sunnah</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {stats.pendingExams > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] rounded-full flex items-center justify-center">
                      {stats.pendingExams}
                    </span>
                  )}
                </Button>
                <LanguageSelector />
                <ThemeToggle />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleSignOut}
                  className="border-border hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
                >
                  <LogOut className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">{t('logout')}</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className={`text-3xl font-display font-bold text-foreground mb-2 ${isRTL ? 'font-urdu' : ''}`}>
              {t('assalamuAlaikum')}
              <span className="inline-block ml-2 animate-pulse">👋</span>
            </h2>
            <p className={`text-muted-foreground text-lg ${isRTL ? 'font-urdu' : ''}`}>
              {t('welcomePortal')}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {quickStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card key={index} className="group relative overflow-hidden border-border/50 hover:shadow-xl transition-all duration-300">
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                      <IconComponent className={`h-6 w-6 ${
                        stat.color.includes('emerald') ? 'text-emerald-600' : 
                        stat.color.includes('amber') ? 'text-amber-600' : 
                        stat.color.includes('purple') ? 'text-purple-600' : 
                        'text-blue-600'
                      }`} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {loadingStats ? '...' : stat.value}
                      </p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Daily Hadith Card */}
          <Card className="mb-8 relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-card to-secondary/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-2xl"></div>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <BookMarked className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg font-display">{t('hadithOfDay')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <blockquote className="text-foreground/90 text-lg italic border-l-4 border-secondary pl-4 py-2">
                "The best among you are those who learn the Quran and teach it."
              </blockquote>
              <p className="text-sm text-muted-foreground mt-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                Sahih al-Bukhari 5027
              </p>
            </CardContent>
          </Card>

          {/* Menu Grid */}
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-xl font-semibold text-foreground ${isRTL ? 'font-urdu' : ''}`}>{t('quickAccess')}</h3>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              {t('viewAll')} <ChevronRight className={`w-4 h-4 ${isRTL ? 'mr-1 rotate-180' : 'ml-1'}`} />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {menuItems.map((item, index) => (
              <Card 
                key={index} 
                className={`group relative overflow-hidden bg-gradient-to-br ${item.gradient} border-border/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer`}
                onClick={() => navigate(item.href)}
              >
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-xl ${item.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-base mb-1 group-hover:text-primary transition-colors">{item.title}</CardTitle>
                  <CardDescription className="text-sm">{item.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Upcoming Section */}
          <Card className="mt-8 border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-muted">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-lg">{t('upcomingExams')}</CardTitle>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate('/exams')}>{t('viewAll')}</Button>
              </div>
            </CardHeader>
            <CardContent>
              {loadingStats ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : upcomingExams.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">{t('noUpcomingExams')}</p>
              ) : (
                <div className="space-y-3">
                  {upcomingExams.map((exam, index) => (
                    <div 
                      key={exam.id}
                      className={`flex items-center justify-between p-4 rounded-xl bg-gradient-to-r ${
                        index === 0 ? 'from-primary/5 to-transparent border border-primary/10 hover:border-primary/20' : 
                        'from-amber-500/5 to-transparent border border-amber-500/10 hover:border-amber-500/20'
                      } transition-colors cursor-pointer`}
                      onClick={() => navigate('/exams')}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-1 h-12 rounded-full bg-gradient-to-b ${
                          index === 0 ? 'from-primary to-primary/50' : 'from-amber-500 to-amber-500/50'
                        }`} />
                        <div>
                          <p className="font-medium text-foreground">{exam.title}</p>
                          <p className="text-sm text-muted-foreground">{exam.subject}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 text-sm font-medium ${
                        index === 0 ? 'text-primary bg-primary/10' : 'text-amber-600 dark:text-amber-400 bg-amber-500/10'
                      } rounded-full`}>
                        {new Date(exam.exam_date).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
