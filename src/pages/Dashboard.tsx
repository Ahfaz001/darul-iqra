import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ThemeToggle from '@/components/ThemeToggle';
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

const Dashboard: React.FC = () => {
  const { user, role, signOut, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && role && (role === 'admin' || role === 'teacher')) {
      navigate('/admin');
    }
  }, [role, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const quickStats = [
    { label: 'Attendance Rate', value: '92%', icon: Calendar, color: 'from-emerald-500 to-teal-500', bgColor: 'bg-emerald-500/10' },
    { label: 'Exams Completed', value: '12', icon: FileText, color: 'from-amber-500 to-orange-500', bgColor: 'bg-amber-500/10' },
    { label: 'Current Rank', value: '#5', icon: TrendingUp, color: 'from-purple-500 to-pink-500', bgColor: 'bg-purple-500/10' },
    { label: 'Achievements', value: '8', icon: Award, color: 'from-blue-500 to-cyan-500', bgColor: 'bg-blue-500/10' },
  ];

  const menuItems = [
    { 
      title: 'My Exams', 
      description: 'View and take assigned exams', 
      icon: FileText,
      href: '/exams',
      gradient: 'from-primary/20 to-primary/5',
      iconBg: 'bg-primary/20 text-primary'
    },
    { 
      title: 'My Results', 
      description: 'View your exam results and grades', 
      icon: GraduationCap,
      href: '/results',
      gradient: 'from-amber-500/20 to-amber-500/5',
      iconBg: 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
    },
    { 
      title: 'Attendance', 
      description: 'View your attendance records', 
      icon: Calendar,
      href: '/attendance',
      gradient: 'from-emerald-500/20 to-emerald-500/5',
      iconBg: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
    },
    { 
      title: 'Daily Hadith', 
      description: "Read today's Hadith", 
      icon: BookMarked,
      href: '/hadith',
      gradient: 'from-rose-500/20 to-rose-500/5',
      iconBg: 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
    },
    { 
      title: 'Books Library', 
      description: 'Read Islamic books', 
      icon: BookOpen,
      href: '/books',
      gradient: 'from-indigo-500/20 to-indigo-500/5',
      iconBg: 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400'
    },
    { 
      title: 'My Profile', 
      description: 'Manage your account settings', 
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
                    Student Portal
                    <Sparkles className="w-4 h-4 text-secondary" />
                  </h1>
                  <p className="text-xs text-muted-foreground">Idarah Tarjumat-ul-Qur'an Wa Sunnah</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] rounded-full flex items-center justify-center">3</span>
                </Button>
                <ThemeToggle />
                <div className="hidden sm:block text-right px-3 py-1 rounded-lg bg-muted/50">
                  <p className="text-sm font-medium text-foreground">{user?.email?.split('@')[0]}</p>
                  <p className="text-xs text-muted-foreground capitalize">{role || 'Student'}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleSignOut}
                  className="border-border hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-display font-bold text-foreground mb-2">
              Assalamu Alaikum! 
              <span className="inline-block ml-2 animate-pulse">👋</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Welcome back to your learning portal. Here's your overview for today.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {quickStats.map((stat, index) => (
              <Card key={index} className="group relative overflow-hidden border-border/50 hover:shadow-xl transition-all duration-300">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
                <CardContent className="flex items-center gap-4 p-5">
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 bg-gradient-to-br ${stat.color} bg-clip-text`} style={{color: 'transparent', backgroundImage: `linear-gradient(to bottom right, ${stat.color.includes('emerald') ? '#10b981, #14b8a6' : stat.color.includes('amber') ? '#f59e0b, #f97316' : stat.color.includes('purple') ? '#a855f7, #ec4899' : '#3b82f6, #06b6d4'})`}} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Daily Hadith Card */}
          <Card className="mb-8 relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-card to-secondary/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-2xl"></div>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <BookMarked className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg font-display">Hadith of the Day</CardTitle>
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
            <h3 className="text-xl font-semibold text-foreground">Quick Access</h3>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              View All <ChevronRight className="w-4 h-4 ml-1" />
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
                  <CardTitle className="text-lg">Upcoming Schedule</CardTitle>
                </div>
                <Button variant="ghost" size="sm">View Calendar</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-primary/5 to-transparent border border-primary/10 hover:border-primary/20 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-1 h-12 rounded-full bg-gradient-to-b from-primary to-primary/50" />
                    <div>
                      <p className="font-medium text-foreground">Quran Recitation Exam</p>
                      <p className="text-sm text-muted-foreground">Surah Al-Baqarah (1-50)</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 text-sm font-medium text-primary bg-primary/10 rounded-full">Tomorrow</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-amber-500/5 to-transparent border border-amber-500/10 hover:border-amber-500/20 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-1 h-12 rounded-full bg-gradient-to-b from-amber-500 to-amber-500/50" />
                    <div>
                      <p className="font-medium text-foreground">Hadith Class</p>
                      <p className="text-sm text-muted-foreground">Sahih Bukhari - Chapter 3</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 text-sm font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 rounded-full">In 3 days</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
