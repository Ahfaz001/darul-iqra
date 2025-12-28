import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import StudentSidebar from './StudentSidebar';
import ThemeToggle from './ThemeToggle';
import LanguageSelector from './LanguageSelector';
import { useLanguage } from '@/contexts/LanguageContext';
import { Bell, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StudentLayoutProps {
  children: React.ReactNode;
  pendingCount?: number;
}

const getHistoryIndex = () => {
  const state = window.history.state as any;
  return typeof state?.idx === 'number' ? state.idx : 0;
};

const StudentLayout: React.FC<StudentLayoutProps> = ({ children, pendingCount = 0 }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isRTL } = useLanguage();

  const showBackButton = location.pathname !== '/dashboard';

  const handleBack = () => {
    if (getHistoryIndex() > 0) {
      navigate(-1);
      return;
    }
    navigate('/dashboard', { replace: true });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <StudentSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Header */}
          <header className="bg-card/80 backdrop-blur-xl border-b border-border sticky top-0 z-50">
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-1">
                {showBackButton && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleBack}
                    className="h-9 w-9"
                    aria-label="Back"
                  >
                    <ArrowLeft className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
                  </Button>
                )}
                <SidebarTrigger className="h-9 w-9" />
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
                  <Bell className="h-5 w-5" />
                  {pendingCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] rounded-full flex items-center justify-center">
                      {pendingCount}
                    </span>
                  )}
                </Button>
                <LanguageSelector />
                <ThemeToggle />
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default StudentLayout;
