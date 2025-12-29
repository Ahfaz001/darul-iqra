import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft, Clock, MapPin, Settings, RefreshCw, Volume2 } from 'lucide-react';
import StudentLayout from '@/components/StudentLayout';

const PRAYER_NAMES = {
  Fajr: { en: 'Fajr', ur: 'فجر', roman: 'Fajr' },
  Sunrise: { en: 'Sunrise', ur: 'طلوع آفتاب', roman: 'Tulu Aftab' },
  Dhuhr: { en: 'Dhuhr', ur: 'ظہر', roman: 'Zuhr' },
  Asr: { en: 'Asr', ur: 'عصر', roman: 'Asr' },
  Maghrib: { en: 'Maghrib', ur: 'مغرب', roman: 'Maghrib' },
  Isha: { en: 'Isha', ur: 'عشاء', roman: 'Isha' }
};

const PRAYER_ICONS = {
  Fajr: '🌙',
  Sunrise: '🌅',
  Dhuhr: '☀️',
  Asr: '🌤️',
  Maghrib: '🌇',
  Isha: '🌃'
};

interface CountdownState {
  hours: number;
  minutes: number;
  seconds: number;
  nextPrayer: string;
  isCurrentPrayer: boolean;
}

const PrayerTimesPage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { times, loading, error, refresh } = usePrayerTimes();
  const [countdown, setCountdown] = useState<CountdownState>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    nextPrayer: 'Fajr',
    isCurrentPrayer: false
  });
  const [currentTime, setCurrentTime] = useState(new Date());

  const translations = {
    en: {
      title: 'Prayer Times',
      subtitle: 'Today\'s Prayer Schedule',
      nextPrayer: 'Next Prayer',
      timeRemaining: 'Time Remaining',
      settings: 'Settings',
      refresh: 'Refresh',
      loading: 'Loading prayer times...',
      error: 'Could not load prayer times',
      current: 'Current',
      mumbai: 'Mumbai, India'
    },
    ur: {
      title: 'نماز کے اوقات',
      subtitle: 'آج کا نماز کا شیڈول',
      nextPrayer: 'اگلی نماز',
      timeRemaining: 'باقی وقت',
      settings: 'ترتیبات',
      refresh: 'ریفریش',
      loading: 'نماز کے اوقات لوڈ ہو رہے ہیں...',
      error: 'نماز کے اوقات لوڈ نہیں ہو سکے',
      current: 'موجودہ',
      mumbai: 'ممبئی، انڈیا'
    },
    roman: {
      title: 'Namaz ke Awqaat',
      subtitle: 'Aaj ka Namaz Schedule',
      nextPrayer: 'Agli Namaz',
      timeRemaining: 'Baqi Waqt',
      settings: 'Settings',
      refresh: 'Refresh',
      loading: 'Namaz ke awqaat load ho rahe hain...',
      error: 'Namaz ke awqaat load nahi ho sake',
      current: 'Abhi',
      mumbai: 'Mumbai, India'
    }
  };

  const t = translations[language] || translations.en;

  // Convert time string to Date
  const timeToDate = (timeStr: string): Date => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate countdown to next prayer
  useEffect(() => {
    if (!times) return;

    const prayerOrder = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;
    const now = currentTime;

    let nextPrayer = 'Fajr';
    let nextPrayerTime: Date | null = null;

    // Find the next prayer
    for (const prayer of prayerOrder) {
      if (prayer === 'Sunrise') continue; // Skip sunrise for countdown
      const prayerTime = timeToDate(times[prayer]);
      if (prayerTime > now) {
        nextPrayer = prayer;
        nextPrayerTime = prayerTime;
        break;
      }
    }

    // If all prayers have passed, next prayer is Fajr tomorrow
    if (!nextPrayerTime) {
      nextPrayer = 'Fajr';
      nextPrayerTime = timeToDate(times.Fajr);
      nextPrayerTime.setDate(nextPrayerTime.getDate() + 1);
    }

    const diffMs = nextPrayerTime.getTime() - now.getTime();
    const totalSeconds = Math.floor(diffMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    setCountdown({
      hours: Math.max(0, hours),
      minutes: Math.max(0, minutes),
      seconds: Math.max(0, seconds),
      nextPrayer,
      isCurrentPrayer: false
    });
  }, [times, currentTime]);

  // Format countdown display
  const formatCountdown = () => {
    const { hours, minutes, seconds } = countdown;
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  // Format time to 12-hour format
  const formatTime12Hour = (time24: string): string => {
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  // Check if prayer is current (within prayer time window)
  const isCurrentPrayer = (prayerName: string): boolean => {
    if (!times) return false;
    const prayerOrder = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;
    const now = currentTime;

    const currentIndex = prayerOrder.indexOf(prayerName as any);
    if (currentIndex === -1) return false;

    const prayerTime = timeToDate(times[prayerName as keyof typeof times]);
    const nextPrayerName = prayerOrder[currentIndex + 1];
    const nextPrayerTime = nextPrayerName 
      ? timeToDate(times[nextPrayerName as keyof typeof times])
      : (() => { const d = timeToDate(times.Fajr); d.setDate(d.getDate() + 1); return d; })();

    return now >= prayerTime && now < nextPrayerTime;
  };

  const getPrayerName = (key: string) => {
    const names = PRAYER_NAMES[key as keyof typeof PRAYER_NAMES];
    if (!names) return key;
    return names[language as keyof typeof names] || names.en;
  };

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">{t.loading}</p>
          </div>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-8">
        {/* Header */}
        <div className="bg-primary text-primary-foreground p-6 rounded-b-3xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/dashboard')}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-xl font-bold">{t.title}</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/prayer-settings')}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <Settings className="w-6 h-6" />
            </Button>
          </div>

          {/* Location */}
          <div className="flex items-center justify-center gap-2 text-primary-foreground/80 text-sm mb-4">
            <MapPin className="w-4 h-4" />
            <span>{t.mumbai}</span>
          </div>

          {/* Countdown Card */}
          <Card className="bg-primary-foreground/10 border-primary-foreground/20 backdrop-blur">
            <CardContent className="p-6 text-center">
              <p className="text-primary-foreground/80 text-sm mb-2">{t.nextPrayer}</p>
              <div className="flex items-center justify-center gap-3 mb-3">
                <span className="text-3xl">{PRAYER_ICONS[countdown.nextPrayer as keyof typeof PRAYER_ICONS]}</span>
                <h2 className="text-3xl font-bold text-primary-foreground">
                  {getPrayerName(countdown.nextPrayer)}
                </h2>
              </div>
              <div className="bg-primary-foreground/20 rounded-xl py-4 px-6 inline-block">
                <p className="text-primary-foreground/60 text-xs mb-1">{t.timeRemaining}</p>
                <p className="text-4xl font-mono font-bold text-primary-foreground tracking-wider">
                  {formatCountdown()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Prayer Times List */}
        <div className="p-4 space-y-3 mt-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-foreground">{t.subtitle}</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={refresh}
              className="text-muted-foreground"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              {t.refresh}
            </Button>
          </div>

          {times && Object.entries(times).map(([key, time]) => {
            const isCurrent = isCurrentPrayer(key);
            const isNext = countdown.nextPrayer === key;

            return (
              <Card 
                key={key}
                className={`transition-all duration-300 ${
                  isCurrent 
                    ? 'bg-primary/10 border-primary shadow-md scale-[1.02]' 
                    : isNext 
                      ? 'bg-accent/50 border-accent'
                      : 'bg-card hover:bg-accent/20'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{PRAYER_ICONS[key as keyof typeof PRAYER_ICONS]}</span>
                      <div>
                        <p className={`font-semibold ${isCurrent ? 'text-primary' : 'text-foreground'}`}>
                          {getPrayerName(key)}
                        </p>
                        {isCurrent && (
                          <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                            {t.current}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className={`text-lg font-mono font-semibold ${isCurrent ? 'text-primary' : 'text-foreground'}`}>
                        {formatTime12Hour(time)}
                      </p>
                      {key !== 'Sunrise' && (
                        <Volume2 className={`w-5 h-5 ${isCurrent ? 'text-primary' : 'text-muted-foreground'}`} />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {error && (
          <div className="px-4">
            <p className="text-sm text-muted-foreground text-center">{error}</p>
          </div>
        )}
      </div>
    </StudentLayout>
  );
};

export default PrayerTimesPage;
