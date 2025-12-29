import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import StudentLayout from '@/components/StudentLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sunrise, 
  Moon, 
  BedDouble, 
  AlarmClock, 
  HandHeart,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Repeat,
  Quote,
  Church,
  UtensilsCrossed,
  Plane,
  Droplets,
  Heart,
  Settings
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
};

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
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

const DhikrCard: React.FC<{ dhikr: Dhikr; index: number; language: Language }> = ({ dhikr, index, language }) => {
  const [expanded, setExpanded] = useState(false);
  const translation = getDhikrTranslation(dhikr, language);
  const virtue = getDhikrVirtue(dhikr, language);
  const isUrdu = language === 'ur';

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
          <p className={`text-sm sm:text-base text-foreground/80 ${isUrdu ? 'font-urdu' : ''}`}>
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
              <p className={`text-sm text-primary/80 ${expanded ? '' : 'line-clamp-2'} ${isUrdu ? 'font-urdu' : ''}`}>
                {virtue}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const CategoryView: React.FC<{ category: AzkaarCategory; language: Language }> = ({ category, language }) => {
  const colors = colorMap[category.id] || colorMap.general;
  const title = getCategoryTitle(category, language);
  const description = getCategoryDescription(category, language);
  const isUrdu = language === 'ur';
  
  // UI labels based on language
  const duasLabel = language === 'ur' ? 'دعائیں' : language === 'roman' ? 'Duain' : 'Duas';

  return (
    <div>
      <div className={`p-4 rounded-xl ${colors.bg} ${colors.border} border mb-6`}>
        <div className="flex items-center gap-3 mb-2">
          <div className={`p-2 rounded-lg ${colors.bg} ${colors.text}`}>
            {iconMap[category.icon]}
          </div>
          <div>
            <h2 className={`text-xl font-semibold ${colors.text} ${isUrdu ? 'font-urdu' : ''}`} dir={isUrdu ? 'rtl' : 'ltr'}>
              {title}
            </h2>
            <p className="text-lg font-arabic text-muted-foreground" dir="rtl">{category.titleArabic}</p>
          </div>
        </div>
        <p className={`text-sm text-muted-foreground mt-2 ${isUrdu ? 'font-urdu' : ''}`} dir={isUrdu ? 'rtl' : 'ltr'}>
          {description}
        </p>
        <Badge variant="secondary" className="mt-2">
          {category.duas.length} {duasLabel}
        </Badge>
      </div>

      <ScrollArea className="h-[calc(100vh-400px)]">
        {category.duas.map((dhikr, index) => (
          <DhikrCard key={dhikr.id} dhikr={dhikr} index={index} language={language} />
        ))}
      </ScrollArea>
    </div>
  );
};

const StudentAzkaar: React.FC = () => {
  const { isRTL, language } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('morning');

  // UI translations
  const pageTitle = language === 'ur' ? 'اذکار المسلم' : language === 'roman' ? 'Azkaar ul Muslim' : 'أذكار المسلم';
  const pageSubtitle = language === 'ur' 
    ? 'حصن المسلم سے مستند دعائیں' 
    : language === 'roman' 
    ? 'Hisnul Muslim se mustanad duain' 
    : 'Authentic supplications from Hisnul Muslim (Fortress of the Muslim)';
  const settingsLabel = language === 'ur' ? 'ترتیبات' : language === 'roman' ? 'Settings' : 'Settings';

  return (
    <StudentLayout>
      <Helmet>
        <title>Azkaar | Daily Supplications from Hisnul Muslim</title>
        <meta name="description" content="Complete collection of authentic Islamic supplications from Hisnul Muslim - Morning, Evening, Sleeping, and General Duas." />
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
            <h1 className={`text-3xl font-display font-bold text-foreground mb-2 ${isRTL ? 'font-urdu' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
              {pageTitle}
            </h1>
            <p className={`text-muted-foreground ${isRTL ? 'font-urdu' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
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
                    className={`flex flex-col items-center gap-1 py-3 px-4 min-w-[70px] data-[state=active]:${colors.bg}`}
                  >
                    <div className={activeTab === category.id ? colors.text : 'text-muted-foreground'}>
                      {iconMap[category.icon]}
                    </div>
                    <span className={`text-xs whitespace-nowrap ${isRTL ? 'font-urdu' : ''}`}>
                      {tabTitle.split(' ')[0]}
                    </span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </ScrollArea>

          {allAzkaarCategories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <CategoryView category={category} language={language} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </StudentLayout>
  );
};

export default StudentAzkaar;
