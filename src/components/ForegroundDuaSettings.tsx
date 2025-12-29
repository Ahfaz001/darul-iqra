import { Bell, Clock, Smartphone, AlertCircle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useForegroundDuaService } from '@/hooks/useForegroundDuaService';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

const INTERVAL_OPTIONS = [
  {
    value: '1',
    label: { en: 'Every hour', ur: 'ہر گھنٹے', roman: 'Har ghantay' },
  },
  {
    value: '2',
    label: { en: 'Every 2 hours', ur: 'ہر 2 گھنٹے', roman: 'Har 2 ghantay' },
  },
  {
    value: '3',
    label: { en: 'Every 3 hours', ur: 'ہر 3 گھنٹے', roman: 'Har 3 ghantay' },
  },
  {
    value: '4',
    label: { en: 'Every 4 hours', ur: 'ہر 4 گھنٹے', roman: 'Har 4 ghantay' },
  },
  {
    value: '6',
    label: { en: 'Every 6 hours', ur: 'ہر 6 گھنٹے', roman: 'Har 6 ghantay' },
  },
];

export const ForegroundDuaSettings = () => {
  const { language, isRTL } = useLanguage();
  const dir = isRTL ? 'rtl' : 'ltr';

  const ui = {
    title: language === 'ur' ? 'ایپ بند ہونے کے بعد اذکار' : language === 'roman' ? 'App band honay ke baad Azkaar' : 'Azkaar Outside App',
    subtitle:
      language === 'ur'
        ? 'ایپ بند ہونے کے بعد بھی مستقل نوٹیفکیشن میں دعا/ذکر دکھائیں'
        : language === 'roman'
          ? 'App band honay ke baad bhi persistent notification me dua/dhikr dikhayen'
          : 'Show a persistent dua/dhikr notification even after closing the app',

    nativeOnly:
      language === 'ur'
        ? 'یہ فیچر صرف Android کے انسٹال شدہ ایپ (native setup کے ساتھ) میں کام کرتا ہے۔'
        : language === 'roman'
          ? 'Yeh feature sirf Android installed app (native setup ke sath) mein kaam karta hai.'
          : 'This feature works only in the installed Android app (with native setup).',

    feature1: language === 'ur' ? 'مستقل نوٹیفکیشن (Delete نہیں ہوتا)' : language === 'roman' ? 'Persistent notification (delete nahi hota)' : 'Persistent notification (cannot be dismissed)',
    feature2: language === 'ur' ? 'مقررہ وقت کے بعد خودکار تبدیلی' : language === 'roman' ? 'Muqarrar waqt ke baad auto change' : 'Auto changes on interval',
    feature3: language === 'ur' ? 'فون ری اسٹارٹ کے بعد بھی چلتا ہے' : language === 'roman' ? 'Phone restart ke baad bhi chalta hai' : 'Works after device restart',

    toggleOn: language === 'ur' ? 'اذکار فعال ہیں' : language === 'roman' ? 'Azkaar active hain' : 'Azkaar enabled',
    toggleOff: language === 'ur' ? 'اذکار فعال کریں' : language === 'roman' ? 'Azkaar enable karein' : 'Enable azkaar',
    toggleOnDesc: language === 'ur' ? 'اب نوٹیفکیشن ایپ کے باہر بھی دکھے گا' : language === 'roman' ? 'Ab notification app ke bahar bhi dikhay ga' : 'Notification is now shown outside the app',
    toggleOffDesc: language === 'ur' ? 'سوئچ آن کر کے مستقل نوٹیفکیشن شروع کریں' : language === 'roman' ? 'Switch on kar ke persistent notification start karein' : 'Turn on to start a persistent notification',

    intervalLabel: language === 'ur' ? 'دعا بدلنے کا وقفہ' : language === 'roman' ? 'Dua badalne ka waqfa' : 'Change interval',
    intervalPlaceholder: language === 'ur' ? 'وقفہ منتخب کریں' : language === 'roman' ? 'Waqfa select karein' : 'Select interval',

    testNow: language === 'ur' ? 'ابھی ٹیسٹ دعا دکھائیں' : language === 'roman' ? 'Abhi test dua dikhayen' : 'Test dua now',

    statusRunning: language === 'ur' ? 'سروس بیک گراؤنڈ میں چل رہی ہے' : language === 'roman' ? 'Service background mein chal rahi hai' : 'Service is running in background',
    statusStopped: language === 'ur' ? 'سروس بند ہے' : language === 'roman' ? 'Service band hai' : 'Service is stopped',

    updated: language === 'ur' ? 'دعا اپڈیٹ ہو گئی' : language === 'roman' ? 'Dua update ho gayi' : 'Dua updated',
    updateFailed: language === 'ur' ? 'اپڈیٹ نہیں ہوئی (پہلے سروس آن کریں)' : language === 'roman' ? 'Update nahi hui (pehle service on karein)' : 'Update failed (enable the service first)',

    enabledToast: language === 'ur' ? 'اذکار نوٹیفکیشن فعال ہوگیا' : language === 'roman' ? 'Azkaar notification enable ho gaya' : 'Azkaar notification enabled',
    disabledToast: language === 'ur' ? 'اذکار نوٹیفکیشن بند ہوگیا' : language === 'roman' ? 'Azkaar notification band ho gaya' : 'Azkaar notification disabled',

    toggleError: language === 'ur' ? 'سیٹنگ تبدیل نہیں ہو سکی' : language === 'roman' ? 'Setting change nahi ho saki' : 'Could not change setting',
  } as const;

  const {
    settings,
    isRunning,
    loading,
    lastError,
    toggleService,
    updateInterval,
    testNotification,
    isNativePlatform,
  } = useForegroundDuaService();

  const handleTestDua = async () => {
    const success = await testNotification();
    if (success) toast.success(ui.updated);
    else toast.error(ui.updateFailed);
  };

  const handleToggle = async () => {
    const success = await toggleService();
    if (success) {
      if (!isRunning) toast.success(ui.enabledToast);
      else toast.success(ui.disabledToast);
    } else {
      toast.error(lastError ? `${ui.toggleError}: ${lastError}` : ui.toggleError);
    }
  };

  const handleIntervalChange = (value: string) => {
    updateInterval(parseInt(value, 10));
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
        {!isNativePlatform && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription dir={dir}>{ui.nativeOnly}</AlertDescription>
          </Alert>
        )}

        {!!lastError && isNativePlatform && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription dir={dir}>{lastError}</AlertDescription>
          </Alert>
        )}

        <div className="p-4 bg-muted/50 rounded-lg space-y-2" dir={dir}>
          <div className="flex items-center gap-2 text-sm">
            <Smartphone className="h-4 w-4 text-primary" />
            <span>{ui.feature1}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-primary" />
            <span>{ui.feature2}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Bell className="h-4 w-4 text-primary" />
            <span>{ui.feature3}</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg" dir={dir}>
          <div>
            <Label className="text-base font-medium">{isRunning ? ui.toggleOn : ui.toggleOff}</Label>
            <p className="text-sm text-muted-foreground">{isRunning ? ui.toggleOnDesc : ui.toggleOffDesc}</p>
          </div>
          <Switch checked={isRunning} onCheckedChange={handleToggle} disabled={loading || !isNativePlatform} />
        </div>

        {isNativePlatform && (
          <div className="space-y-2" dir={dir}>
            <Label>{ui.intervalLabel}</Label>
            <Select value={settings.intervalHours.toString()} onValueChange={handleIntervalChange} disabled={loading}>
              <SelectTrigger>
                <SelectValue placeholder={ui.intervalPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {INTERVAL_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value} dir={dir}>
                    {option.label[language]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {isNativePlatform && isRunning && (
          <Button onClick={handleTestDua} disabled={loading} variant="outline" className="w-full gap-2" dir={dir}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {ui.testNow}
          </Button>
        )}

        {isNativePlatform && (
          <div
            className={`p-3 rounded-lg flex items-center gap-2 ${
              isRunning ? 'bg-green-500/10 text-green-600' : 'bg-muted text-muted-foreground'
            }`}
            dir={dir}
          >
            <div
              className={`h-2 w-2 rounded-full ${
                isRunning ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground'
              }`}
            />
            <span className="text-sm font-medium">{isRunning ? ui.statusRunning : ui.statusStopped}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

