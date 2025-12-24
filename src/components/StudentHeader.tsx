import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageSelector from '@/components/LanguageSelector';
import { useLanguage } from '@/contexts/LanguageContext';
import madrasaLogo from '@/assets/madrasa-logo.jpg';
import { ArrowLeft } from 'lucide-react';

interface StudentHeaderProps {
  title: string;
  titleKey?: string;
  subtitle?: string;
  subtitleKey?: string;
  showBackButton?: boolean;
  backPath?: string;
}

export const StudentHeader: React.FC<StudentHeaderProps> = ({
  title,
  titleKey,
  subtitle,
  subtitleKey,
  showBackButton = true,
  backPath = '/dashboard'
}) => {
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();

  const displayTitle = titleKey ? t(titleKey) : title;
  const displaySubtitle = subtitleKey ? t(subtitleKey) : subtitle;

  return (
    <header className="bg-card/80 backdrop-blur-xl border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showBackButton && (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate(backPath)}
                className="mr-1"
              >
                <ArrowLeft className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
              </Button>
            )}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-30"></div>
              <img 
                src={madrasaLogo} 
                alt="Madrasa Logo" 
                className="relative w-10 h-10 rounded-full ring-2 ring-primary/20"
              />
            </div>
            <div>
              <h1 className={`font-display font-bold text-primary text-lg ${isRTL ? 'font-urdu' : ''}`}>
                {displayTitle}
              </h1>
              {displaySubtitle && (
                <p className={`text-xs text-muted-foreground ${isRTL ? 'font-urdu' : ''}`}>
                  {displaySubtitle}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <LanguageSelector />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default StudentHeader;
