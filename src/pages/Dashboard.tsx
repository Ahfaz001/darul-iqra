import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import madrasaLogo from '@/assets/madrasa-logo.jpg';
import { 
  BookOpen, 
  Calendar, 
  FileText, 
  LogOut, 
  User, 
  GraduationCap,
  Clock,
  BookMarked
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, role, signOut, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect admins and teachers to admin panel
    if (!loading && role && (role === 'admin' || role === 'teacher')) {
      navigate('/admin');
    }
  }, [role, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const quickStats = [
    { label: 'Attendance Rate', value: '92%', icon: Calendar, color: 'text-emerald-600' },
    { label: 'Exams Completed', value: '12', icon: FileText, color: 'text-gold' },
    { label: 'Courses Enrolled', value: '5', icon: BookOpen, color: 'text-primary' },
  ];

  const menuItems = [
    { 
      title: 'My Exams', 
      description: 'View and take assigned exams', 
      icon: FileText,
      href: '/exams',
      color: 'bg-primary/10 text-primary'
    },
    { 
      title: 'Attendance', 
      description: 'View your attendance records', 
      icon: Calendar,
      href: '/attendance',
      color: 'bg-emerald-100 text-emerald-700'
    },
    { 
      title: 'Daily Hadith', 
      description: 'Read today\'s Hadith', 
      icon: BookMarked,
      href: '/hadith',
      color: 'bg-gold/20 text-gold-dark'
    },
    { 
      title: 'My Profile', 
      description: 'Manage your account settings', 
      icon: User,
      href: '/profile',
      color: 'bg-rose-100 text-rose-700'
    },
  ];

  return (
    <>
      <Helmet>
        <title>Student Dashboard | Idarah Tarjumat-ul-Qur'an Wa Sunnah</title>
        <meta name="description" content="Access your student dashboard to view exams, attendance, and Islamic learning resources." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-cream via-white to-emerald-50">
        {/* Header */}
        <header className="bg-white border-b border-border/50 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img 
                  src={madrasaLogo} 
                  alt="Madrasa Logo" 
                  className="w-10 h-10 rounded-full"
                />
                <div>
                <h1 className="font-display font-bold text-primary text-lg">Student Portal</h1>
                <p className="text-xs text-muted-foreground">Idarah Tarjumat-ul-Qur'an Wa Sunnah</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-foreground">{user?.email}</p>
                  <p className="text-xs text-muted-foreground capitalize">{role || 'Student'}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleSignOut}
                  className="border-border/50"
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
            <h2 className="text-2xl font-display font-bold text-foreground mb-2">
              Assalamu Alaikum! 👋
            </h2>
            <p className="text-muted-foreground">
              Welcome back to your learning portal. Here's your overview for today.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {quickStats.map((stat, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur border-border/30">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className={`p-3 rounded-xl bg-muted/50`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
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
          <Card className="mb-8 bg-gradient-to-r from-primary/5 to-emerald-50 border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BookMarked className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Hadith of the Day</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <blockquote className="text-foreground/90 italic border-l-4 border-primary pl-4">
                "The best among you are those who learn the Quran and teach it."
              </blockquote>
              <p className="text-sm text-muted-foreground mt-3">
                — Sahih al-Bukhari 5027
              </p>
            </CardContent>
          </Card>

          {/* Menu Grid */}
          <h3 className="text-lg font-semibold text-foreground mb-4">Quick Access</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {menuItems.map((item, index) => (
              <Card 
                key={index} 
                className="bg-white hover:shadow-lg transition-all duration-300 cursor-pointer group border-border/30"
                onClick={() => navigate(item.href)}
              >
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-base mb-1">{item.title}</CardTitle>
                  <CardDescription className="text-sm">{item.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Upcoming Section */}
          <Card className="mt-8 bg-white/80 border-border/30">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-lg">Upcoming</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <div>
                      <p className="font-medium text-foreground">Quran Recitation Exam</p>
                      <p className="text-sm text-muted-foreground">Surah Al-Baqarah (1-50)</p>
                    </div>
                  </div>
                  <span className="text-sm text-primary font-medium">Tomorrow</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-gold" />
                    <div>
                      <p className="font-medium text-foreground">Hadith Class</p>
                      <p className="text-sm text-muted-foreground">Sahih Bukhari - Chapter 3</p>
                    </div>
                  </div>
                  <span className="text-sm text-gold-dark font-medium">In 3 days</span>
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
