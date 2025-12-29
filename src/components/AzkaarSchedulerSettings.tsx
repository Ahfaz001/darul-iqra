import { Sun, Moon, Bell, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAzkaarScheduler } from '@/hooks/useAzkaarScheduler';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

export const AzkaarSchedulerSettings = () => {
  const { language, isRTL } = useLanguage();
  const dir = isRTL ? 'rtl' : 'ltr';

  const ui = {
    title: language === 'ur' ? 'صبح و شام کے اذکار' : language === 'roman' ? 'Subah o Shaam ke Azkaar' : 'Morning & Evening Azkaar',
    subtitle: language === 'ur' 
      ? 'فجر اور مغرب کے بعد خود بخود اذکار کی نوٹیفکیشن' 
      : language === 'roman' 
        ? 'Fajr aur Maghrib ke baad khud-ba-khud azkaar ki notification' 
        : 'Automatic azkaar notifications after Fajr and Maghrib',
    
    enableAll: language === 'ur' ? 'اذکار نوٹیفکیشن فعال کریں' : language === 'roman' ? 'Azkaar notifications enable karein' : 'Enable Azkaar Notifications',
    enableAllDesc: language === 'ur' 
      ? 'ہر ذکر علیحدہ نوٹیفکیشن میں آئے گا' 
      : language === 'roman' 
        ? 'Har dhikr alag notification mein aayega' 
        : 'Each dhikr will appear as a separate notification',
    
    morningAzkaar: language === 'ur' ? 'صبح کے اذکار' : language === 'roman' ? 'Subah ke Azkaar' : 'Morning Azkaar',
    morningDesc: language === 'ur' 
      ? 'فجر کے 15 منٹ بعد شروع ہوں گے' 
      : language === 'roman' 
        ? 'Fajr ke 15 minute baad shuru honge' 
        : 'Starts 15 min after Fajr',
    
    eveningAzkaar: language === 'ur' ? 'شام کے اذکار' : language === 'roman' ? 'Shaam ke Azkaar' : 'Evening Azkaar',
    eveningDesc: language === 'ur' 
      ? 'مغرب کے 10 منٹ بعد شروع ہوں گے' 
      : language === 'roman' 
        ? 'Maghrib ke 10 minute baad shuru honge' 
        : 'Starts 10 min after Maghrib',
    
    delayBetween: language === 'ur' ? 'نوٹیفکیشن کے درمیان وقفہ' : language === 'roman' ? 'Notification ke darmiyaan waqfa' : 'Delay between notifications',
    minutes: language === 'ur' ? 'منٹ' : language === 'roman' ? 'minute' : 'min',
    
    enabled: language === 'ur' ? 'اذکار فعال ہوگئے' : language === 'roman' ? 'Azkaar enable ho gaye' : 'Azkaar enabled',
    disabled: language === 'ur' ? 'اذکار غیر فعال ہوگئے' : language === 'roman' ? 'Azkaar disabled ho gaye' : 'Azkaar disabled',
    
    howItWorks: language === 'ur' ? 'یہ کیسے کام کرتا ہے:' : language === 'roman' ? 'Yeh kaise kaam karta hai:' : 'How it works:',
    feature1: language === 'ur' ? 'ہر ذکر الگ نوٹیفکیشن میں آئے گا' : language === 'roman' ? 'Har dhikr alag notification mein aayega' : 'Each dhikr comes as a separate notification',
    feature2: language === 'ur' ? 'عربی متن اور ترجمہ دونوں' : language === 'roman' ? 'Arabic matn aur tarjuma dono' : 'Arabic text with translation',
    feature3: language === 'ur' ? 'ایپ بند ہونے پر بھی' : language === 'roman' ? 'App band honay par bhi' : 'Works even when app is closed',
  };

  const {
    settings,
    loading,
    lastError,
    updateSettings,
    toggleEnabled,
  } = useAzkaarScheduler();

  const handleToggleEnabled = (enabled: boolean) => {
    toggleEnabled(enabled, language);
    toast.success(enabled ? ui.enabled : ui.disabled);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2" dir={dir}>
          <Bell className="h-5 w-5 text-primary" />
          {ui.title}
        </CardTitle>
        <CardDescription dir={dir}>{ui.subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {lastError && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription dir={dir}>{lastError}</AlertDescription>
          </Alert>
        )}

        {/* How it works */}
        <div className="p-4 bg-muted/50 rounded-lg space-y-2" dir={dir}>
          <div className="font-medium text-sm mb-2">{ui.howItWorks}</div>
          <div className="flex items-center gap-2 text-sm">
            <Bell className="h-4 w-4 text-primary" />
            <span>{ui.feature1}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-primary" />
            <span>{ui.feature2}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Sun className="h-4 w-4 text-primary" />
            <span>{ui.feature3}</span>
          </div>
        </div>

        {/* Enable All Toggle */}
        <div className="flex items-center justify-between p-4 border rounded-lg" dir={dir}>
          <div>
            <Label className="text-base font-medium">{ui.enableAll}</Label>
            <p className="text-sm text-muted-foreground">{ui.enableAllDesc}</p>
          </div>
          <Switch 
            checked={settings.enabled} 
            onCheckedChange={handleToggleEnabled} 
            disabled={loading}
          />
        </div>

        {settings.enabled && (
          <>
            {/* Morning Azkaar Toggle */}
            <div className="flex items-center justify-between p-4 border rounded-lg" dir={dir}>
              <div className="flex items-center gap-2">
                <Sun className="h-5 w-5 text-yellow-500" />
                <div>
                  <Label className="text-base font-medium">{ui.morningAzkaar}</Label>
                  <p className="text-sm text-muted-foreground">{ui.morningDesc}</p>
                </div>
              </div>
              <Switch 
                checked={settings.morningEnabled} 
                onCheckedChange={(v) => updateSettings({ morningEnabled: v })} 
                disabled={loading}
              />
            </div>

            {/* Evening Azkaar Toggle */}
            <div className="flex items-center justify-between p-4 border rounded-lg" dir={dir}>
              <div className="flex items-center gap-2">
                <Moon className="h-5 w-5 text-indigo-500" />
                <div>
                  <Label className="text-base font-medium">{ui.eveningAzkaar}</Label>
                  <p className="text-sm text-muted-foreground">{ui.eveningDesc}</p>
                </div>
              </div>
              <Switch 
                checked={settings.eveningEnabled} 
                onCheckedChange={(v) => updateSettings({ eveningEnabled: v })} 
                disabled={loading}
              />
            </div>

            {/* Delay Slider */}
            <div className="space-y-3 p-4 border rounded-lg" dir={dir}>
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">{ui.delayBetween}</Label>
                <span className="text-sm font-medium text-primary">
                  {settings.delayBetweenMinutes} {ui.minutes}
                </span>
              </div>
              <Slider
                value={[settings.delayBetweenMinutes]}
                onValueChange={([v]) => updateSettings({ delayBetweenMinutes: v })}
                min={1}
                max={10}
                step={1}
                disabled={loading}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1 {ui.minutes}</span>
                <span>10 {ui.minutes}</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
