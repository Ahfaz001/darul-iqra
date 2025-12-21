import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  ClipboardList
} from 'lucide-react';

const AdminPanel: React.FC = () => {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const stats = [
    { label: 'Total Students', value: '156', change: '+12 this month', icon: Users },
    { label: 'Active Exams', value: '8', change: '3 pending review', icon: FileText },
    { label: 'Avg Attendance', value: '89%', change: '+2% from last week', icon: Calendar },
    { label: 'Total Teachers', value: '12', change: 'All active', icon: UserPlus },
  ];

  const adminModules = [
    { 
      title: 'User Management', 
      description: 'Add, edit, or remove students and teachers', 
      icon: Users,
      href: '/admin/users',
      color: 'bg-primary/10 text-primary',
      adminOnly: true
    },
    { 
      title: 'Exam Management', 
      description: 'Create and manage exams and papers', 
      icon: FileText,
      href: '/admin/exams',
      color: 'bg-emerald-100 text-emerald-700',
      adminOnly: false
    },
    { 
      title: 'Attendance', 
      description: 'Mark and view student attendance', 
      icon: ClipboardList,
      href: '/admin/attendance',
      color: 'bg-gold/20 text-gold-dark',
      adminOnly: false
    },
    { 
      title: 'Hadith Section', 
      description: 'Manage daily Hadith content', 
      icon: BookOpen,
      href: '/admin/hadith',
      color: 'bg-rose-100 text-rose-700',
      adminOnly: true
    },
    { 
      title: 'Content Uploads', 
      description: 'Upload PDFs and learning materials', 
      icon: Upload,
      href: '/admin/content',
      color: 'bg-blue-100 text-blue-700',
      adminOnly: false
    },
    { 
      title: 'Reports & Analytics', 
      description: 'View performance reports', 
      icon: BarChart3,
      href: '/admin/reports',
      color: 'bg-purple-100 text-purple-700',
      adminOnly: true
    },
  ];

  const filteredModules = role === 'admin' 
    ? adminModules 
    : adminModules.filter(m => !m.adminOnly);

  return (
    <>
      <Helmet>
        <title>{role === 'admin' ? 'Admin Panel' : 'Teacher Dashboard'} | Dar-ul-Ulum</title>
        <meta name="description" content="Manage students, exams, attendance, and content for Idarah Tarjumat-ul-Qur'an Wa Sunnah." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
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
                  <h1 className="font-display font-bold text-primary text-lg">
                    {role === 'admin' ? 'Admin Panel' : 'Teacher Portal'}
                  </h1>
                  <p className="text-xs text-muted-foreground">Idarah Tarjumat-ul-Qur'an Wa Sunnah</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-foreground">{user?.email}</p>
                  <p className="text-xs text-muted-foreground capitalize">{role}</p>
                </div>
                {role === 'admin' && (
                  <Button variant="outline" size="sm" className="border-border/50">
                    <Settings className="h-4 w-4" />
                  </Button>
                )}
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
          {/* Welcome */}
          <div className="mb-8">
            <h2 className="text-2xl font-display font-bold text-foreground mb-2">
              Welcome, {role === 'admin' ? 'Administrator' : 'Teacher'}
            </h2>
            <p className="text-muted-foreground">
              Manage your madrasa operations from this dashboard.
            </p>
          </div>

          {/* Stats Grid */}
          {role === 'admin' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, index) => (
                <Card key={index} className="bg-white border-border/30">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
                        <p className="text-xs text-primary mt-1">{stat.change}</p>
                      </div>
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <stat.icon className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Module Grid */}
          <h3 className="text-lg font-semibold text-foreground mb-4">Management Modules</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredModules.map((module, index) => (
              <Card 
                key={index} 
                className="bg-white hover:shadow-lg transition-all duration-300 cursor-pointer group border-border/30"
                onClick={() => navigate(module.href)}
              >
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-xl ${module.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <module.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-base mb-1">{module.title}</CardTitle>
                  <CardDescription className="text-sm">{module.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <Card className="mt-8 bg-white border-border/30">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button className="bg-primary hover:bg-primary/90">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Student
                </Button>
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Create Exam
                </Button>
                <Button variant="outline">
                  <ClipboardList className="h-4 w-4 mr-2" />
                  Mark Attendance
                </Button>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Content
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
};

export default AdminPanel;
