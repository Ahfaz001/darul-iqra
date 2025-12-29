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
import { useLanguage } from '@/contexts/LanguageContext';

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
  const { language, isRTL } = useLanguage();
  const [settings, setSettings] = useState<PrayerTimeSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(false);

  // UI translations
  const t = {
    pageTitle: language === 'ur' ? 'نماز اوقات کی ترتیبات' : language === 'roman' ? 'Namaz Auqat ki Settings' : 'Prayer Time Settings',
    pageSubtitle: language === 'ur' ? 'نماز اوقات اور اذکار کی ترتیب' : language === 'roman' ? 'Namaz auqat aur azkaar ki tarteeb' : 'Customize prayer times and azkaar calculations',
    location: language === 'ur' ? 'جغرافیائی مقام' : language === 'roman' ? 'Jughraafia Maqaam' : 'Geographic Location',
    locationDesc: language === 'ur' ? 'نماز اوقات کے حساب کے لیے مقام' : language === 'roman' ? 'Namaz auqat ke hisaab ke liye maqaam' : 'Set your location for accurate prayer times',
    autoLocation: language === 'ur' ? 'خودکار مقام' : language === 'roman' ? 'Khudkaar Maqaam' : 'Automatic Location',
    autoLocationDesc: language === 'ur' ? 'GPS استعمال کریں' : language === 'roman' ? 'GPS istemaal karein' : 'Use GPS to get your location',
    latitude: language === 'ur' ? 'عرض البلد' : language === 'roman' ? 'Latitude' : 'Latitude',
    longitude: language === 'ur' ? 'طول البلد' : language === 'roman' ? 'Longitude' : 'Longitude',
    cityName: language === 'ur' ? 'شہر کا نام (اختیاری)' : language === 'roman' ? 'Shehr ka naam (ikhtiari)' : 'City Name (optional)',
    useCurrentLocation: language === 'ur' ? 'موجودہ مقام استعمال کریں' : language === 'roman' ? 'Maujuda maqaam istemaal karein' : 'Use Current Location',
    gettingLocation: language === 'ur' ? 'مقام حاصل ہو رہا ہے...' : language === 'roman' ? 'Maqaam hasil ho raha hai...' : 'Getting location...',
    calculationMethod: language === 'ur' ? 'حساب کا طریقہ' : language === 'roman' ? 'Hisaab ka Tareeqa' : 'Calculation Method',
    calculationMethodDesc: language === 'ur' ? 'اپنے علاقے کے مطابق طریقہ منتخب کریں' : language === 'roman' ? 'Apne ilaaqe ke mutaabiq tareeqa muntakhab karein' : 'Select the calculation method suitable for your region',
    selectMethod: language === 'ur' ? 'طریقہ منتخب کریں' : language === 'roman' ? 'Tareeqa muntakhab karein' : 'Select calculation method',
    saveSettings: language === 'ur' ? 'ترتیبات محفوظ کریں' : language === 'roman' ? 'Settings mehfooz karein' : 'Save Settings',
    resetSettings: language === 'ur' ? 'ری سیٹ' : language === 'roman' ? 'Reset' : 'Reset',
    savedSuccess: language === 'ur' ? 'ترتیبات محفوظ ہو گئیں' : language === 'roman' ? 'Settings mehfooz ho gayin' : 'Settings saved successfully',
    resetSuccess: language === 'ur' ? 'ترتیبات ری سیٹ ہو گئیں' : language === 'roman' ? 'Settings reset ho gayin' : 'Settings have been reset',
    locationSuccess: language === 'ur' ? 'مقام حاصل ہو گیا' : language === 'roman' ? 'Maqaam hasil ho gaya' : 'Location obtained',
    latError: language === 'ur' ? 'عرض البلد -90 اور 90 کے درمیان ہونا چاہیے' : language === 'roman' ? 'Latitude -90 aur 90 ke darmiyaan hona chahiye' : 'Latitude must be between -90 and 90',
    lngError: language === 'ur' ? 'طول البلد -180 اور 180 کے درمیان ہونا چاہیے' : language === 'roman' ? 'Longitude -180 aur 180 ke darmiyaan hona chahiye' : 'Longitude must be between -180 and 180',
    browserNoGeo: language === 'ur' ? 'براؤزر مقام کی سہولت نہیں دیتا' : language === 'roman' ? 'Browser maqaam ki sahoolat nahi deta' : 'Browser does not support geolocation',
    locationError: language === 'ur' ? 'مقام حاصل کرنے میں ناکامی: ' : language === 'roman' ? 'Maqaam hasil karne mein nakami: ' : 'Failed to get location: ',
  };

  useEffect(() => {
    setSettings(getPrayerTimeSettings());
  }, []);

  const handleSave = () => {
    // Validate manual coordinates if not using auto
    if (!settings.useAutoLocation) {
      const lat = parseFloat(settings.manualLatitude);
      const lng = parseFloat(settings.manualLongitude);
      
      if (isNaN(lat) || lat < -90 || lat > 90) {
        toast.error(t.latError);
        return;
      }
      if (isNaN(lng) || lng < -180 || lng > 180) {
        toast.error(t.lngError);
        return;
      }
    }
    
    savePrayerTimeSettings(settings);
    toast.success(t.savedSuccess);
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    savePrayerTimeSettings(DEFAULT_SETTINGS);
    toast.success(t.resetSuccess);
  };

  const handleGetCurrentLocation = () => {
    setLoading(true);
    
    if (!navigator.geolocation) {
      toast.error(t.browserNoGeo);
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
        toast.success(t.locationSuccess);
        setLoading(false);
      },
      (error) => {
        toast.error(t.locationError + error.message);
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
            <h1 className={`text-2xl font-bold ${isRTL ? 'font-urdu' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
              {t.pageTitle}
            </h1>
            <p className={`text-muted-foreground text-sm ${isRTL ? 'font-urdu' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
              {t.pageSubtitle}
            </p>
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
