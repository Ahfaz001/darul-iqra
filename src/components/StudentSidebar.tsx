import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import madrasaLogo from '@/assets/madrasa-logo.jpg';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Home,
  FileText,
  GraduationCap,
  Calendar,
  BookMarked,
  BookOpen,
  User,
  LogOut,
  HeadphonesIcon,
  MessageCircle,
  Sparkles,
  HandHeart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const StudentSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();
  const { t, isRTL } = useLanguage();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  const menuItems = [
    { title: t('dashboard'), icon: Home, href: '/dashboard' },
    { title: t('myExams'), icon: FileText, href: '/exams' },
    { title: t('myResults'), icon: GraduationCap, href: '/results' },
    { title: t('attendance'), icon: Calendar, href: '/attendance' },
    { title: t('dailyHadith'), icon: BookMarked, href: '/hadith' },
    { title: t('booksLibrary'), icon: BookOpen, href: '/books' },
    { title: 'القرآن الكریم', icon: BookOpen, href: '/quran' },
    { title: 'أذكار المسلم', icon: HandHeart, href: '/azkaar' },
    { title: t('myProfile'), icon: User, href: '/profile' },
  ];

  const supportItems = [
    { title: 'Help & Support', icon: HeadphonesIcon, href: '/support' },
    { title: 'Contact Us', icon: MessageCircle, href: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50">
      {/* Header */}
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-r from-sidebar-primary/80 to-sidebar-accent rounded-full blur opacity-30" />
            <img
              src={madrasaLogo}
              alt="Idarah Logo"
              className="relative w-10 h-10 rounded-full ring-2 ring-sidebar-ring/30"
            />
          </div>

          {!collapsed && (
            <div className="min-w-0">
              <h1 className="font-display font-bold text-sidebar-foreground text-sm flex items-center gap-1 truncate">
                {t("studentPortal")}
                <Sparkles className="w-3 h-3 text-sidebar-primary flex-shrink-0" />
              </h1>
              <p className="text-[10px] text-sidebar-foreground/75 truncate">Idarah Tarjumat-ul-Qur'an</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={isActive(item.href)}
                    tooltip={item.title}
                    onClick={() => navigate(item.href)}
                    className="justify-start gap-3 [&>svg]:size-5"
                  >
                    <item.icon />
                    {!collapsed && <span className={isRTL ? "font-urdu" : ""}>{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Support Section */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>Support</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {supportItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={isActive(item.href)}
                    tooltip={item.title}
                    onClick={() => navigate(item.href)}
                    className="justify-start gap-3 [&>svg]:size-5"
                  >
                    <item.icon />
                    {!collapsed && <span>{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={
            "w-full justify-start gap-3 text-sidebar-foreground/80 hover:text-destructive hover:bg-destructive/10 " +
            (collapsed ? "px-0 justify-center" : "")
          }
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span>Logout</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default StudentSidebar;
