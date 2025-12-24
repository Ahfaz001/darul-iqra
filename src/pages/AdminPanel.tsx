import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ThemeToggle from '@/components/ThemeToggle';
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
  Bell,
  ChevronRight,
  Sparkles,
  Shield,
  Activity
} from 'lucide-react';

const AdminPanel: React.FC = () => {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const stats = [
    { label: 'Total Students', value: '156', change: '+12 this month', icon: Users, gradient: 'from-blue-500 to-cyan-500', trend: 'up' },
    { label: 'Active Exams', value: '8', change: '3 pending review', icon: FileText, gradient: 'from-amber-500 to-orange-500', trend: 'up' },
    { label: 'Avg Attendance', value: '89%', change: '+2% from last week', icon: Calendar, gradient: 'from-emerald-500 to-teal-500', trend: 'up' },
    { label: 'Total Teachers', value: '12', change: 'All active', icon: UserPlus, gradient: 'from-purple-500 to-pink-500', trend: 'stable' },
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
      title: 'Content Uploads', 
      description: 'Upload PDFs and learning materials', 
      icon: Upload,
      href: '/admin/content',
      gradient: 'from-cyan-500/20 to-cyan-500/5',
      iconBg: 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400',
      adminOnly: false
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
    { label: 'Add Student', icon: UserPlus, variant: 'default' as const },
    { label: 'Create Exam', icon: FileText, variant: 'outline' as const },
    { label: 'Mark Attendance', icon: ClipboardList, variant: 'outline' as const },
    { label: 'Upload Content', icon: Upload, variant: 'outline' as const },
  ];

  return (
    <>
      <Helmet>
        <title>{role === 'admin' ? 'Admin Panel' : 'Teacher Dashboard'} | Dar-ul-Ulum</title>
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
                    {role === 'admin' ? 'Admin Panel' : 'Teacher Portal'}
                    <Shield className="w-4 h-4 text-secondary" />
                  </h1>
                  <p className="text-xs text-muted-foreground">Idarah Tarjumat-ul-Qur'an Wa Sunnah</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] rounded-full flex items-center justify-center">5</span>
                </Button>
                <ThemeToggle />
                <div className="hidden sm:block text-right px-3 py-1 rounded-lg bg-muted/50">
                  <p className="text-sm font-medium text-foreground">{user?.email?.split('@')[0]}</p>
                  <p className="text-xs text-muted-foreground capitalize flex items-center gap-1 justify-end">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    {role}
                  </p>
                </div>
                {role === 'admin' && (
                  <Button variant="outline" size="icon" className="border-border">
                    <Settings className="h-4 w-4" />
                  </Button>
                )}
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
          {/* Welcome */}
          <div className="mb-8">
            <h2 className="text-3xl font-display font-bold text-foreground mb-2 flex items-center gap-3">
              Welcome, {role === 'admin' ? 'Administrator' : 'Teacher'}
              <Sparkles className="w-6 h-6 text-secondary" />
            </h2>
            <p className="text-muted-foreground text-lg">
              Manage your madrasa operations from this dashboard.
            </p>
          </div>

          {/* Stats Grid */}
          {role === 'admin' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, index) => (
                <Card key={index} className="group relative overflow-hidden border-border/50 hover:shadow-xl transition-all duration-300">
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {stat.change}
                        </p>
                      </div>
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} bg-opacity-20`}>
                        <stat.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Module Grid */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-foreground">Management Modules</h3>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredModules.map((module, index) => (
              <Card 
                key={index} 
                className={`group relative overflow-hidden bg-gradient-to-br ${module.gradient} border-border/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer`}
                onClick={() => navigate(module.href)}
              >
                <CardContent className="p-6">
                  <div className={`w-14 h-14 rounded-xl ${module.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <module.icon className="h-7 w-7" />
                  </div>
                  <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">{module.title}</CardTitle>
                  <CardDescription className="text-sm">{module.description}</CardDescription>
                  <div className="mt-4 flex items-center text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Open <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <Card className="mt-8 border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-muted">
                  <Activity className="h-5 w-5 text-muted-foreground" />
                </div>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {quickActions.map((action, index) => (
                  <Button 
                    key={index} 
                    variant={action.variant}
                    className={action.variant === 'default' ? 'bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg' : ''}
                  >
                    <action.icon className="h-4 w-4 mr-2" />
                    {action.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="mt-8 border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-muted">
                    <Activity className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                </div>
                <Button variant="ghost" size="sm">View All</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <UserPlus className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New student enrolled</p>
                    <p className="text-xs text-muted-foreground">Ahmed Khan joined Hifz Program</p>
                  </div>
                  <span className="text-xs text-muted-foreground">2 hours ago</span>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Exam results published</p>
                    <p className="text-xs text-muted-foreground">Quran Recitation - Class 3</p>
                  </div>
                  <span className="text-xs text-muted-foreground">5 hours ago</span>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Attendance marked</p>
                    <p className="text-xs text-muted-foreground">45 students present today</p>
                  </div>
                  <span className="text-xs text-muted-foreground">Today</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
};

export default AdminPanel;
