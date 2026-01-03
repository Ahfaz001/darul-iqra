import React, { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import StudentLayout from '@/components/StudentLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Sunrise, 
  Moon, 
  BedDouble, 
  AlarmClock, 
  HandHeart,
  BookOpen,
  Repeat,
  Quote,
  Church,
  UtensilsCrossed,
  Plane,
  Droplets,
  Heart,
  Settings,
  CircleDot
} from 'lucide-react';
import { 
  allAzkaarCategories, 
  Dhikr, 
  AzkaarCategory, 
  getDhikrTranslation, 
  getDhikrVirtue,
  getCategoryTitle,
  getCategoryDescription
} from '@/data/azkaar';
import DhikrCounterCard from '@/components/DhikrCounterCard';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ReactNode> = {
  '🌅': <Sunrise className="h-6 w-6" />,
  '🌙': <Moon className="h-6 w-6" />,
  '😴': <BedDouble className="h-6 w-6" />,
  '⏰': <AlarmClock className="h-6 w-6" />,
  '🤲': <HandHeart className="h-6 w-6" />,
  '🕌': <Church className="h-6 w-6" />,
  '🍽️': <UtensilsCrossed className="h-6 w-6" />,
  '✈️': <Plane className="h-6 w-6" />,
  '🚿': <Droplets className="h-6 w-6" />,
  '💚': <Heart className="h-6 w-6" />,
  '📿': <CircleDot className="h-6 w-6" />,
};

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  tasbeeh: { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/20' },
  morning: { bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500/20' },
  evening: { bg: 'bg-indigo-500/10', text: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-500/20' },
  sleeping: { bg: 'bg-purple-500/10', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-500/20' },
  waking: { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/20' },
  salah: { bg: 'bg-teal-500/10', text: 'text-teal-600 dark:text-teal-400', border: 'border-teal-500/20' },
  eating: { bg: 'bg-orange-500/10', text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-500/20' },
  travel: { bg: 'bg-sky-500/10', text: 'text-sky-600 dark:text-sky-400', border: 'border-sky-500/20' },
  toilet: { bg: 'bg-slate-500/10', text: 'text-slate-600 dark:text-slate-400', border: 'border-slate-500/20' },
  'visiting-sick': { bg: 'bg-pink-500/10', text: 'text-pink-600 dark:text-pink-400', border: 'border-pink-500/20' },
  general: { bg: 'bg-rose-500/10', text: 'text-rose-600 dark:text-rose-400', border: 'border-rose-500/20' },
};

interface DhikrCardProps {
  dhikr: Dhikr;
  index: number;
  language: Language;
  showCounter?: boolean;
  onComplete?: () => void;
}

const DhikrCard: React.FC<DhikrCardProps> = ({ dhikr, index, language, showCounter = false, onComplete }) => {
  const [expanded, setExpanded] = useState(false);
  const translation = getDhikrTranslation(dhikr, language);
  const virtue = getDhikrVirtue(dhikr, language);
  const isUrdu = language === 'ur';

  if (showCounter) {
    return (
      <DhikrCounterCard 
        dhikr={dhikr} 
        language={language} 
        onComplete={onComplete}
        showCounter={true}
      />
    );
  }

  return (
    <Card className="mb-4 border-border/50 hover:shadow-lg transition-all duration-300">
      <CardContent className="p-4 sm:p-6">
        {/* Arabic Text */}
        <div className="text-right mb-4">
          <p className="text-xl sm:text-2xl leading-loose font-arabic text-foreground" dir="rtl">
            {dhikr.arabic}
          </p>
        </div>

        {/* Transliteration */}
        <div className="mb-3 p-3 rounded-lg bg-muted/50">
          <p className="text-sm sm:text-base text-muted-foreground italic">
            {dhikr.transliteration}
          </p>
        </div>

        {/* Translation */}
        <div className="mb-4" dir={isUrdu ? 'rtl' : 'ltr'}>
          <p className={cn(
            "text-sm sm:text-base text-foreground/80",
            isUrdu && "font-urdu"
          )}>
            {translation}
          </p>
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            <BookOpen className="h-3 w-3 mr-1" />
            {dhikr.reference}
          </Badge>
          {dhikr.repetition && dhikr.repetition > 1 && (
            <Badge variant="outline" className="text-xs">
              <Repeat className="h-3 w-3 mr-1" />
              {dhikr.repetition}x
            </Badge>
          )}
        </div>

        {/* Virtue */}
        {virtue && (
          <div 
            className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/10 cursor-pointer"
            onClick={() => setExpanded(!expanded)}
          >
            <div className="flex items-start gap-2" dir={isUrdu ? 'rtl' : 'ltr'}>
              <Quote className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <p className={cn(
                "text-sm text-primary/80",
                !expanded && "line-clamp-2",
                isUrdu && "font-urdu"
              )}>
                {virtue}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface CategoryViewProps {
  category: AzkaarCategory;
  language: Language;
  counterMode: boolean;
}

const CategoryView: React.FC<CategoryViewProps> = ({ category, language, counterMode }) => {
  const colors = colorMap[category.id] || colorMap.general;
  const title = getCategoryTitle(category, language);
  const description = getCategoryDescription(category, language);
  const isUrdu = language === 'ur';
  
  // Track completed duas
  const [completedDuas, setCompletedDuas] = useState<Set<string>>(new Set());
  
  // UI labels based on language
  const duasLabel = language === 'ur' ? 'دعائیں' : language === 'roman' ? 'Duain' : 'Duas';
  const completedLabel = language === 'ur' ? 'مکمل' : language === 'roman' ? 'Mukammal' : 'Completed';

  const handleDuaComplete = useCallback((duaId: string) => {
    setCompletedDuas(prev => {
      const newSet = new Set(prev);
      newSet.add(duaId);
      return newSet;
    });
  }, []);

  // Filter out completed duas in counter mode
  const visibleDuas = counterMode 
    ? category.duas.filter(d => !completedDuas.has(d.id))
    : category.duas;

  const allCompleted = counterMode && visibleDuas.length === 0;

  return (
    <div>
      <div className={cn(
        "p-4 rounded-xl border mb-6",
        colors.bg,
        colors.border
      )}>
        <div className="flex items-center gap-3 mb-2">
          <div className={cn("p-2 rounded-lg", colors.bg, colors.text)}>
            {iconMap[category.icon]}
          </div>
          <div>
            <h2 className={cn(
              "text-xl font-semibold",
              colors.text,
              isUrdu && "font-urdu"
            )} dir={isUrdu ? 'rtl' : 'ltr'}>
              {title}
            </h2>
            <p className="text-lg font-arabic text-muted-foreground" dir="rtl">{category.titleArabic}</p>
          </div>
        </div>
        <p className={cn(
          "text-sm text-muted-foreground mt-2",
          isUrdu && "font-urdu"
        )} dir={isUrdu ? 'rtl' : 'ltr'}>
          {description}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="secondary">
            {category.duas.length} {duasLabel}
          </Badge>
          {counterMode && completedDuas.size > 0 && (
            <Badge variant="outline" className="text-emerald-600">
              {completedDuas.size} {completedLabel}
            </Badge>
          )}
        </div>
      </div>

      {allCompleted ? (
        <Card className="p-8 text-center border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/20">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className={cn(
            "text-xl font-bold text-emerald-600 dark:text-emerald-400 mb-2",
            isUrdu && "font-urdu"
          )}>
            {language === 'ur' ? 'ماشاء اللہ! سب مکمل ہو گئے' : language === 'roman' ? 'MashaAllah! Sab mukammal ho gaye' : 'MashaAllah! All completed!'}
          </h3>
          <p className="text-muted-foreground">
            {language === 'ur' ? 'اللہ آپ کے اذکار قبول فرمائے' : language === 'roman' ? 'Allah aap ke azkaar qabool farmaye' : 'May Allah accept your dhikr'}
          </p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => setCompletedDuas(new Set())}
          >
            {language === 'ur' ? 'دوبارہ شروع کریں' : language === 'roman' ? 'Dobara shuru karein' : 'Start Again'}
          </Button>
        </Card>
      ) : (
        <ScrollArea className="h-[calc(100vh-400px)]">
          {visibleDuas.map((dhikr, index) => (
            <DhikrCard 
              key={dhikr.id} 
              dhikr={dhikr} 
              index={index} 
              language={language}
              showCounter={counterMode && (dhikr.repetition ? dhikr.repetition > 1 : false)}
              onComplete={() => handleDuaComplete(dhikr.id)}
            />
          ))}
        </ScrollArea>
      )}
    </div>
  );
};

const StudentAzkaar: React.FC = () => {
  const { isRTL, language } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('tasbeeh');
  const [counterMode, setCounterMode] = useState(true);

  // UI translations
  const pageTitle = language === 'ur' ? 'اذکار المسلم' : language === 'roman' ? 'Azkaar ul Muslim' : 'أذكار المسلم';
  const pageSubtitle = language === 'ur' 
    ? 'حصن المسلم سے مستند دعائیں' 
    : language === 'roman' 
    ? 'Hisnul Muslim se mustanad duain' 
    : 'Authentic supplications from Hisnul Muslim (Fortress of the Muslim)';
  const settingsLabel = language === 'ur' ? 'ترتیبات' : language === 'roman' ? 'Settings' : 'Settings';
  const counterModeLabel = language === 'ur' ? 'گنتی موڈ' : language === 'roman' ? 'Counter Mode' : 'Counter Mode';

  return (
    <StudentLayout>
      <Helmet>
        <title>Azkaar | Daily Supplications from Hisnul Muslim</title>
        <meta name="description" content="Complete collection of authentic Islamic supplications from Hisnul Muslim - Morning, Evening, Sleeping, and General Duas with interactive counter." />
      </Helmet>

      {/* Decorative Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-primary/5 to-secondary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-500/5 to-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className={cn(
              "text-3xl font-display font-bold text-foreground mb-2",
              isRTL && "font-urdu"
            )} dir={isRTL ? 'rtl' : 'ltr'}>
              {pageTitle}
            </h1>
            <p className={cn(
              "text-muted-foreground",
              isRTL && "font-urdu"
            )} dir={isRTL ? 'rtl' : 'ltr'}>
              {pageSubtitle}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/prayer-settings')}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">{settingsLabel}</span>
          </Button>
        </div>

        {/* Counter Mode Toggle */}
        <div className="flex items-center justify-end gap-2 mb-4 p-3 rounded-lg bg-muted/50">
          <Label htmlFor="counter-mode" className={cn(
            "text-sm",
            isRTL && "font-urdu"
          )}>
            {counterModeLabel}
          </Label>
          <Switch
            id="counter-mode"
            checked={counterMode}
            onCheckedChange={setCounterMode}
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <ScrollArea className="w-full whitespace-nowrap mb-6">
            <TabsList className="inline-flex w-max gap-1 p-1">
              {allAzkaarCategories.map((category) => {
                const colors = colorMap[category.id] || colorMap.general;
                const tabTitle = getCategoryTitle(category, language);
                return (
                  <TabsTrigger 
                    key={category.id} 
                    value={category.id}
                    className={cn(
                      "flex flex-col items-center gap-1 py-3 px-4 min-w-[70px]",
                      activeTab === category.id && colors.bg
                    )}
                  >
                    <div className={activeTab === category.id ? colors.text : 'text-muted-foreground'}>
                      {iconMap[category.icon]}
                    </div>
                    <span className={cn(
                      "text-xs whitespace-nowrap",
                      isRTL && "font-urdu"
                    )}>
                      {tabTitle.split(' ')[0]}
                    </span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </ScrollArea>

          {allAzkaarCategories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <CategoryView 
                category={category} 
                language={language} 
                counterMode={counterMode}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </StudentLayout>
  );
};

export default StudentAzkaar;
