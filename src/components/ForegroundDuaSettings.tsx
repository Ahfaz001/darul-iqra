import { Bell, Clock, Smartphone, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useForegroundDuaService } from '@/hooks/useForegroundDuaService';
import { toast } from 'sonner';

const INTERVAL_OPTIONS = [
  { value: '1', label: 'كل ساعة', labelEn: 'Every hour' },
  { value: '2', label: 'كل ساعتين', labelEn: 'Every 2 hours' },
  { value: '3', label: 'كل 3 ساعات', labelEn: 'Every 3 hours' },
  { value: '4', label: 'كل 4 ساعات', labelEn: 'Every 4 hours' },
  { value: '6', label: 'كل 6 ساعات', labelEn: 'Every 6 hours' },
];

export const ForegroundDuaSettings = () => {
  const {
    settings,
    isRunning,
    loading,
    toggleService,
    updateInterval,
    isNativePlatform
  } = useForegroundDuaService();

  const handleToggle = async () => {
    const success = await toggleService();
    if (success) {
      if (!isRunning) {
        toast.success('تم تفعيل عرض الأذكار الدائم');
      } else {
        toast.success('تم إيقاف عرض الأذكار الدائم');
      }
    } else {
      toast.error('حدث خطأ أثناء تغيير الإعدادات');
    }
  };

  const handleIntervalChange = (value: string) => {
    updateInterval(parseInt(value, 10));
    toast.success('تم تحديث الفترة الزمنية');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2" dir="rtl">
          <Bell className="h-5 w-5 text-primary" />
          الأذكار خارج التطبيق
        </CardTitle>
        <CardDescription dir="rtl">
          عرض الأذكار كإشعار دائم حتى عند إغلاق التطبيق
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Info alert for non-native */}
        {!isNativePlatform && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription dir="rtl">
              هذه الميزة متاحة فقط على تطبيق الأندرويد. قم بتثبيت التطبيق للاستفادة منها.
            </AlertDescription>
          </Alert>
        )}

        {/* Feature description */}
        <div className="p-4 bg-muted/50 rounded-lg space-y-2" dir="rtl">
          <div className="flex items-center gap-2 text-sm">
            <Smartphone className="h-4 w-4 text-primary" />
            <span>إشعار دائم لا يمكن مسحه</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-primary" />
            <span>يتغير تلقائياً كل فترة</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Bell className="h-4 w-4 text-primary" />
            <span>يعمل حتى بعد إعادة تشغيل الجهاز</span>
          </div>
        </div>

        {/* Enable/Disable Toggle */}
        <div className="flex items-center justify-between p-4 border rounded-lg" dir="rtl">
          <div>
            <Label className="text-base font-medium">
              {isRunning ? 'الأذكار مفعلة' : 'تفعيل الأذكار الدائمة'}
            </Label>
            <p className="text-sm text-muted-foreground">
              {isRunning 
                ? 'الأذكار تظهر الآن خارج التطبيق' 
                : 'اضغط لتفعيل عرض الأذكار الدائم'
              }
            </p>
          </div>
          <Switch
            checked={isRunning}
            onCheckedChange={handleToggle}
            disabled={loading || !isNativePlatform}
          />
        </div>

        {/* Interval Selection */}
        {isNativePlatform && (
          <div className="space-y-2" dir="rtl">
            <Label>مدة تغيير الدعاء</Label>
            <Select
              value={settings.intervalHours.toString()}
              onValueChange={handleIntervalChange}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر الفترة الزمنية" />
              </SelectTrigger>
              <SelectContent>
                {INTERVAL_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value} dir="rtl">
                    <div className="flex flex-col">
                      <span>{option.label}</span>
                      <span className="text-xs text-muted-foreground">{option.labelEn}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Status indicator */}
        {isNativePlatform && (
          <div className={`p-3 rounded-lg flex items-center gap-2 ${
            isRunning ? 'bg-green-500/10 text-green-600' : 'bg-muted text-muted-foreground'
          }`} dir="rtl">
            <div className={`h-2 w-2 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground'}`} />
            <span className="text-sm font-medium">
              {isRunning ? 'الخدمة تعمل في الخلفية' : 'الخدمة متوقفة'}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
