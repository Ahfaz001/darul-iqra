import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calculator, Save, RotateCcw } from 'lucide-react';
import { ForegroundDuaSettings } from '@/components/ForegroundDuaSettings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import StudentLayout from '@/components/StudentLayout';

// Calculation methods from Aladhan API
const CALCULATION_METHODS = [
  { id: '1', name: 'جامعة أم القرى', nameEn: 'Umm Al-Qura University, Makkah' },
  { id: '2', name: 'ISNA (أمريكا الشمالية)', nameEn: 'Islamic Society of North America' },
  { id: '3', name: 'رابطة العالم الإسلامي', nameEn: 'Muslim World League' },
  { id: '4', name: 'مكة المكرمة', nameEn: 'Umm Al-Qura, Makkah' },
  { id: '5', name: 'الاتحاد الإسلامي الهندي', nameEn: 'Egyptian General Authority of Survey' },
  { id: '7', name: 'معهد الجيوفيزياء (طهران)', nameEn: 'Institute of Geophysics, Tehran' },
  { id: '8', name: 'منطقة الخليج', nameEn: 'Gulf Region' },
  { id: '9', name: 'الكويت', nameEn: 'Kuwait' },
  { id: '10', name: 'قطر', nameEn: 'Qatar' },
  { id: '11', name: 'سنغافورة', nameEn: 'Majlis Ugama Islam Singapura' },
  { id: '12', name: 'فرنسا', nameEn: 'Union Organization Islamic de France' },
  { id: '13', name: 'تركيا', nameEn: 'Diyanet İşleri Başkanlığı, Turkey' },
  { id: '14', name: 'روسيا', nameEn: 'Spiritual Administration of Muslims of Russia' },
  { id: '15', name: 'دبي', nameEn: 'Dubai (unofficial)' },
];

export interface PrayerTimeSettings {
  useAutoLocation: boolean;
  manualLatitude: string;
  manualLongitude: string;
  calculationMethod: string;
  cityName: string;
}

const DEFAULT_SETTINGS: PrayerTimeSettings = {
  useAutoLocation: true,
  manualLatitude: '',
  manualLongitude: '',
  calculationMethod: '2',
  cityName: ''
};

const STORAGE_KEY = 'prayer_time_settings';

export const getPrayerTimeSettings = (): PrayerTimeSettings => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Error loading prayer settings:', e);
  }
  return DEFAULT_SETTINGS;
};

export const savePrayerTimeSettings = (settings: PrayerTimeSettings): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving prayer settings:', e);
  }
};

const PrayerSettings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<PrayerTimeSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSettings(getPrayerTimeSettings());
  }, []);

  const handleSave = () => {
    // Validate manual coordinates if not using auto
    if (!settings.useAutoLocation) {
      const lat = parseFloat(settings.manualLatitude);
      const lng = parseFloat(settings.manualLongitude);
      
      if (isNaN(lat) || lat < -90 || lat > 90) {
        toast.error('خط العرض يجب أن يكون بين -90 و 90');
        return;
      }
      if (isNaN(lng) || lng < -180 || lng > 180) {
        toast.error('خط الطول يجب أن يكون بين -180 و 180');
        return;
      }
    }
    
    savePrayerTimeSettings(settings);
    toast.success('تم حفظ الإعدادات بنجاح');
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    savePrayerTimeSettings(DEFAULT_SETTINGS);
    toast.success('تم إعادة تعيين الإعدادات');
  };

  const handleGetCurrentLocation = () => {
    setLoading(true);
    
    if (!navigator.geolocation) {
      toast.error('المتصفح لا يدعم تحديد الموقع');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setSettings(prev => ({
          ...prev,
          manualLatitude: position.coords.latitude.toFixed(6),
          manualLongitude: position.coords.longitude.toFixed(6)
        }));
        toast.success('تم الحصول على الموقع الحالي');
        setLoading(false);
      },
      (error) => {
        toast.error('فشل في الحصول على الموقع: ' + error.message);
        setLoading(false);
      }
    );
  };

  return (
    <StudentLayout>
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">إعدادات مواقيت الصلاة</h1>
            <p className="text-muted-foreground text-sm">تخصيص حساب أوقات الصلاة والأذكار</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Location Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2" dir="rtl">
                <MapPin className="h-5 w-5 text-primary" />
                الموقع الجغرافي
              </CardTitle>
              <CardDescription dir="rtl">
                حدد موقعك لحساب أوقات الصلاة بدقة
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Auto Location Toggle */}
              <div className="flex items-center justify-between" dir="rtl">
                <div>
                  <Label>تحديد الموقع تلقائياً</Label>
                  <p className="text-sm text-muted-foreground">استخدام GPS للحصول على موقعك</p>
                </div>
                <Switch
                  checked={settings.useAutoLocation}
                  onCheckedChange={(checked) => 
                    setSettings(prev => ({ ...prev, useAutoLocation: checked }))
                  }
                />
              </div>

              {/* Manual Location */}
              {!settings.useAutoLocation && (
                <div className="space-y-4 pt-4 border-t">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="latitude">خط العرض (Latitude)</Label>
                      <Input
                        id="latitude"
                        type="number"
                        step="any"
                        placeholder="مثال: 21.4225"
                        value={settings.manualLatitude}
                        onChange={(e) => 
                          setSettings(prev => ({ ...prev, manualLatitude: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="longitude">خط الطول (Longitude)</Label>
                      <Input
                        id="longitude"
                        type="number"
                        step="any"
                        placeholder="مثال: 39.8262"
                        value={settings.manualLongitude}
                        onChange={(e) => 
                          setSettings(prev => ({ ...prev, manualLongitude: e.target.value }))
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cityName">اسم المدينة (اختياري)</Label>
                    <Input
                      id="cityName"
                      placeholder="مثال: مكة المكرمة"
                      value={settings.cityName}
                      onChange={(e) => 
                        setSettings(prev => ({ ...prev, cityName: e.target.value }))
                      }
                    />
                  </div>

                  <Button
                    variant="outline"
                    onClick={handleGetCurrentLocation}
                    disabled={loading}
                    className="w-full"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    {loading ? 'جاري تحديد الموقع...' : 'استخدام موقعي الحالي'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Calculation Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2" dir="rtl">
                <Calculator className="h-5 w-5 text-primary" />
                طريقة الحساب
              </CardTitle>
              <CardDescription dir="rtl">
                اختر طريقة حساب مواقيت الصلاة المناسبة لمنطقتك
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                value={settings.calculationMethod}
                onValueChange={(value) => 
                  setSettings(prev => ({ ...prev, calculationMethod: value }))
                }
              >
                <SelectTrigger dir="rtl">
                  <SelectValue placeholder="اختر طريقة الحساب" />
                </SelectTrigger>
                <SelectContent>
                  {CALCULATION_METHODS.map((method) => (
                    <SelectItem key={method.id} value={method.id} dir="rtl">
                      <div className="flex flex-col">
                        <span>{method.name}</span>
                        <span className="text-xs text-muted-foreground">{method.nameEn}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Foreground Dua Settings - Persistent Notification */}
          <ForegroundDuaSettings />

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button onClick={handleSave} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              حفظ الإعدادات
            </Button>
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              إعادة تعيين
            </Button>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};

export default PrayerSettings;
