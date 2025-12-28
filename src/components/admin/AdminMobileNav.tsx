import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import madrasaLogo from '@/assets/madrasa-logo.jpg';
import {
  Menu,
  Users,
  FileText,
  ClipboardList,
  BookOpen,
  Upload,
  UserPlus,
  BarChart3,
  Home,
  LogOut,
  ChevronRight,
  ArrowLeft,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminMobileNav = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { role, signOut } = useAuth();

  const adminModules = [
    { 
      title: 'Dashboard', 
      icon: Home,
      href: '/admin',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      adminOnly: false
    },
    { 
      title: 'User Management', 
      icon: Users,
      href: '/admin/users',
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
      adminOnly: true
    },
    { 
      title: 'Exam Management', 
      icon: FileText,
      href: '/admin/exams',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-500/10',
      adminOnly: false
    },
    { 
      title: 'Attendance', 
      icon: ClipboardList,
      href: '/admin/attendance',
      color: 'text-amber-600',
      bgColor: 'bg-amber-500/10',
      adminOnly: false
    },
    { 
      title: 'Hadith Section', 
      icon: BookOpen,
      href: '/admin/hadith',
      color: 'text-rose-600',
      bgColor: 'bg-rose-500/10',
      adminOnly: true
    },
    { 
      title: 'Books Library', 
      icon: BookOpen,
      href: '/admin/books',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-500/10',
      adminOnly: true
    },
    { 
      title: 'Quran Section', 
      icon: BookOpen,
      href: '/admin/quran',
      color: 'text-teal-600',
      bgColor: 'bg-teal-500/10',
      adminOnly: true
    },
    { 
      title: 'Content Uploads', 
      icon: Upload,
      href: '/admin/content',
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-500/10',
      adminOnly: false
    },
    { 
      title: 'Admissions', 
      icon: UserPlus,
      href: '/admin/admissions',
      color: 'text-violet-600',
      bgColor: 'bg-violet-500/10',
      adminOnly: true
    },
    {
      title: 'Reports',
      icon: BarChart3,
      href: '/admin/reports',
      color: 'text-purple-600',
      bgColor: 'bg-purple-500/10',
      adminOnly: true,
    },
  ];

  const filteredModules = role === 'admin' 
    ? adminModules 
    : adminModules.filter(m => !m.adminOnly);

  const handleNavigate = (href: string) => {
    navigate(href);
    setOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setOpen(false);
  };

  const isActive = (href: string) => {
    if (href === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(href);
  };

  const getHistoryIndex = () => {
    const state = window.history.state as any;
    return typeof state?.idx === 'number' ? state.idx : 0;
  };

  const handleBack = () => {
    if (getHistoryIndex() > 0) {
      navigate(-1);
      return;
    }
    navigate('/admin', { replace: true });
  };

  return (
    <div className="md:hidden flex items-center gap-1">
      {location.pathname !== '/admin' && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 sm:h-9 sm:w-9 text-foreground"
          onClick={handleBack}
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      )}

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] p-0 bg-card">
          <SheetHeader className="p-4 border-b border-border/50">
            <div className="flex items-center gap-3">
              <img
                src={madrasaLogo}
                alt="Madrasa Logo"
                className="w-10 h-10 rounded-full ring-2 ring-primary/20"
              />
              <div className="text-left">
                <SheetTitle className="text-sm font-bold text-primary">
                  {role === 'admin' ? 'Admin Panel' : 'Teacher Portal'}
                </SheetTitle>
                <p className="text-[10px] text-muted-foreground">Idarah Tarjumat-ul-Qur'an</p>
              </div>
            </div>
          </SheetHeader>

          <div className="flex flex-col h-[calc(100vh-80px)]">
            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto py-2">
              <div className="px-2 space-y-1">
                {filteredModules.map((module) => {
                  const active = isActive(module.href);
                  return (
                    <button
                      key={module.href}
                      onClick={() => handleNavigate(module.href)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all",
                        active ? "bg-primary/10 text-primary" : "hover:bg-muted text-foreground"
                      )}
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                          active ? "bg-primary/20" : module.bgColor
                        )}
                      >
                        <module.icon
                          className={cn(
                            "h-4 w-4",
                            active ? "text-primary" : module.color
                          )}
                        />
                      </div>
                      <span className="flex-1 text-sm font-medium truncate">{module.title}</span>
                      {active && <ChevronRight className="h-4 w-4 text-primary shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </nav>

            {/* Footer with Logout */}
            <div className="p-3 border-t border-border/50">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all hover:bg-destructive/10 text-destructive"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-destructive/10 shrink-0">
                  <LogOut className="h-4 w-4" />
                </div>
                <span className="flex-1 text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdminMobileNav;
