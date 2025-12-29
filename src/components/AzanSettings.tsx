import { Bell, Volume2, VolumeX, Clock, MapPin, AlertCircle, Play, Square } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useAzanService, PRAYER_NAMES } from '@/hooks/useAzanService';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

export const AzanSettings = () => {
  const { language, isRTL } = useLanguage();
  const dir = isRTL ? 'rtl' : 'ltr';

  const ui = {
    title: language === 'ur' ? 'اذان کی ترتیبات' : language === 'roman' ? 'Azan ki Settings' : 'Azan Settings',
    subtitle: language === 'ur' 
      ? 'نماز کے اوقات پر اذان کی آواز سنیں' 
      : language === 'roman' 
        ? 'Namaz ke auqaat par azan ki awaaz sunein' 
        : 'Hear azan at prayer times',
    
    enableAzan: language === 'ur' ? 'اذان فعال کریں' : language === 'roman' ? 'Azan enable karein' : 'Enable Azan',
    enableAzanDesc: language === 'ur' 
      ? 'نماز کے وقت نوٹیفکیشن اور آواز' 
      : language === 'roman' 
        ? 'Namaz ke waqt notification aur awaaz' 
        : 'Get notification and audio at prayer times',
    
    playAudio: language === 'ur' ? 'اذان کی آواز بجائیں' : language === 'roman' ? 'Azan ki awaaz bajayein' : 'Play Azan Audio',
    playAudioDesc: language === 'ur' 
      ? 'نماز کے وقت اذان کی آواز سنائی دے' 
      : language === 'roman' 
        ? 'Namaz ke waqt azan ki awaaz sunayi de' 
        : 'Play full azan audio at prayer time',
    
    prayerTimes: language === 'ur' ? 'آج کے نماز اوقات' : language === 'roman' ? 'Aaj ke namaz auqaat' : "Today's Prayer Times",
    location: language === 'ur' ? 'مقام: ممبئی، بھارت' : language === 'roman' ? 'Maqaam: Mumbai, India' : 'Location: Mumbai, India',
    
    testAzan: language === 'ur' ? 'اذان ٹیسٹ کریں' : language === 'roman' ? 'Azan test karein' : 'Test Azan',
    stopAzan: language === 'ur' ? 'بند کریں' : language === 'roman' ? 'Band karein' : 'Stop',
    
    nativeNote: language === 'ur' 
      ? 'ایپ بند ہونے پر بھی اذان بجے گی (صرف انسٹال شدہ ایپ)' 
      : language === 'roman' 
        ? 'App band honay par bhi azan bajegi (sirf installed app)' 
        : 'Azan will play even when app is closed (installed app only)',
    
    scheduled: language === 'ur' ? 'شیڈول شدہ:' : language === 'roman' ? 'Scheduled:' : 'Scheduled:',
    enabled: language === 'ur' ? 'اذان فعال ہے' : language === 'roman' ? 'Azan enable hai' : 'Azan enabled',
    disabled: language === 'ur' ? 'اذان غیر فعال ہے' : language === 'roman' ? 'Azan disabled hai' : 'Azan disabled',
  };

  const {
    settings,
    loading,
    lastError,
    scheduledPrayers,
    prayerTimes,
    toggleAzan,
    toggleAudio,
    playAzanAudio,
    stopAzanAudio,
    isNativePlatform,
  } = useAzanService();

  const handleToggleAzan = (enabled: boolean) => {
    toggleAzan(enabled);
    toast.success(enabled ? ui.enabled : ui.disabled);
  };

  const prayerNames = PRAYER_NAMES[language as keyof typeof PRAYER_NAMES] || PRAYER_NAMES.en;

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

        {/* Prayer Times Display */}
        {prayerTimes && (
          <div className="p-4 bg-muted/50 rounded-lg space-y-2" dir={dir}>
            <div className="flex items-center gap-2 text-sm font-medium mb-2">
              <Clock className="h-4 w-4 text-primary" />
              <span>{ui.prayerTimes}</span>
            </div>
            <div className="grid grid-cols-5 gap-2 text-center text-sm">
              {(['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const).map((prayer) => (
                <div key={prayer} className="bg-background rounded p-2">
                  <div className="font-medium text-xs">{prayerNames[prayer]}</div>
                  <div className="text-primary font-bold">{prayerTimes[prayer]}</div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
              <MapPin className="h-3 w-3" />
              <span>{ui.location}</span>
            </div>
          </div>
        )}

        {/* Enable Azan Toggle */}
        <div className="flex items-center justify-between p-4 border rounded-lg" dir={dir}>
          <div>
            <Label className="text-base font-medium">{ui.enableAzan}</Label>
            <p className="text-sm text-muted-foreground">{ui.enableAzanDesc}</p>
          </div>
          <Switch 
            checked={settings.enabled} 
            onCheckedChange={handleToggleAzan} 
            disabled={loading}
          />
        </div>

        {/* Play Audio Toggle */}
        {settings.enabled && (
          <div className="flex items-center justify-between p-4 border rounded-lg" dir={dir}>
            <div className="flex items-center gap-2">
              {settings.playAudio ? <Volume2 className="h-5 w-5 text-primary" /> : <VolumeX className="h-5 w-5 text-muted-foreground" />}
              <div>
                <Label className="text-base font-medium">{ui.playAudio}</Label>
                <p className="text-sm text-muted-foreground">{ui.playAudioDesc}</p>
              </div>
            </div>
            <Switch 
              checked={settings.playAudio} 
              onCheckedChange={toggleAudio} 
              disabled={loading}
            />
          </div>
        )}

        {/* Test Azan Button */}
        {settings.enabled && settings.playAudio && (
          <div className="flex gap-2" dir={dir}>
            <Button onClick={playAzanAudio} variant="outline" className="flex-1 gap-2">
              <Play className="h-4 w-4" />
              {ui.testAzan}
            </Button>
            <Button onClick={stopAzanAudio} variant="outline" className="gap-2">
              <Square className="h-4 w-4" />
              {ui.stopAzan}
            </Button>
          </div>
        )}

        {/* Native Note */}
        {isNativePlatform && settings.enabled && (
          <Alert>
            <Bell className="h-4 w-4" />
            <AlertDescription dir={dir}>{ui.nativeNote}</AlertDescription>
          </Alert>
        )}

        {/* Scheduled Prayers */}
        {scheduledPrayers.length > 0 && (
          <div className="p-3 rounded-lg bg-green-500/10 text-green-600 text-sm" dir={dir}>
            <span className="font-medium">{ui.scheduled} </span>
            {scheduledPrayers.join(', ')}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
