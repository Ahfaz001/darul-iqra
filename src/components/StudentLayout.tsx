import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import StudentSidebar from './StudentSidebar';
import ThemeToggle from './ThemeToggle';
import LanguageSelector from './LanguageSelector';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StudentLayoutProps {
  children: React.ReactNode;
  pendingCount?: number;
}

const StudentLayout: React.FC<StudentLayoutProps> = ({ children, pendingCount = 0 }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <StudentSidebar />
        
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Header */}
          <header className="bg-card/80 backdrop-blur-xl border-b border-border sticky top-0 z-50">
            <div className="px-4 py-3 flex items-center justify-between">
              <SidebarTrigger className="mr-2" />
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="relative">
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
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default StudentLayout;
