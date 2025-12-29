import { useState, useEffect, useCallback, useRef } from 'react';
import { Capacitor, registerPlugin } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { usePrayerTimes } from './usePrayerTimes';

const AZAN_SETTINGS_KEY = 'azan_service_settings';

export interface AzanSettings {
  enabled: boolean;
  playAudio: boolean;
  notifyBeforeMinutes: number;
}

const DEFAULT_AZAN_SETTINGS: AzanSettings = {
  enabled: true,
  playAudio: true,
  notifyBeforeMinutes: 0,
};

// Prayer names for display
export const PRAYER_NAMES = {
  en: { Fajr: 'Fajr', Dhuhr: 'Dhuhr', Asr: 'Asr', Maghrib: 'Maghrib', Isha: 'Isha' },
  ur: { Fajr: 'فجر', Dhuhr: 'ظہر', Asr: 'عصر', Maghrib: 'مغرب', Isha: 'عشاء' },
  roman: { Fajr: 'Fajr', Dhuhr: 'Zuhr', Asr: 'Asr', Maghrib: 'Maghrib', Isha: 'Isha' },
};

// Native Azan Service plugin interface
interface AzanServicePlugin {
  scheduleAzan(options: {
    prayerName: string;
    timeMs: number;
    playAudio: boolean;
    notificationTitle: string;
    notificationBody: string;
  }): Promise<void>;
  cancelAllAzans(): Promise<void>;
  isServiceRunning(): Promise<{ running: boolean }>;
}

let _azanPlugin: AzanServicePlugin | null = null;

const getAzanPlugin = (): AzanServicePlugin | null => {
  if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'android') {
    return null;
  }
  if (!_azanPlugin) {
    _azanPlugin = registerPlugin<AzanServicePlugin>('AzanService');
  }
  return _azanPlugin;
};

export const getAzanSettings = (): AzanSettings => {
  try {
    const saved = localStorage.getItem(AZAN_SETTINGS_KEY);
    if (saved) {
      return { ...DEFAULT_AZAN_SETTINGS, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Error loading azan settings:', e);
  }
  return DEFAULT_AZAN_SETTINGS;
};

export const saveAzanSettings = (settings: AzanSettings): void => {
  try {
    localStorage.setItem(AZAN_SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving azan settings:', e);
  }
};

// Convert "HH:MM" to Date object for today
const timeToDate = (timeStr: string): Date => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
};

export const useAzanService = () => {
  const [settings, setSettings] = useState<AzanSettings>(DEFAULT_AZAN_SETTINGS);
  const [loading, setLoading] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [scheduledPrayers, setScheduledPrayers] = useState<string[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const { times: prayerTimes } = usePrayerTimes();

  // Load settings on mount
  useEffect(() => {
    setSettings(getAzanSettings());
  }, []);

  // Schedule local notifications for prayer times (fallback for web/PWA)
  const scheduleLocalNotifications = useCallback(async () => {
    if (!prayerTimes) return;

    try {
      // Cancel existing notifications
      await LocalNotifications.cancel({ notifications: [
        { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }
      ]});

      const prayers: Array<{ name: string; time: string; id: number }> = [
        { name: 'Fajr', time: prayerTimes.Fajr, id: 1 },
        { name: 'Dhuhr', time: prayerTimes.Dhuhr, id: 2 },
        { name: 'Asr', time: prayerTimes.Asr, id: 3 },
        { name: 'Maghrib', time: prayerTimes.Maghrib, id: 4 },
        { name: 'Isha', time: prayerTimes.Isha, id: 5 },
      ];

      const now = new Date();
      const scheduled: string[] = [];

      for (const prayer of prayers) {
        let prayerDate = timeToDate(prayer.time);
        
        // If time has passed today, schedule for tomorrow
        if (prayerDate <= now) {
          prayerDate.setDate(prayerDate.getDate() + 1);
        }

        await LocalNotifications.schedule({
          notifications: [{
            id: prayer.id,
            title: `🕌 ${prayer.name} Time`,
            body: `It's time for ${prayer.name} prayer (${prayer.time})`,
            schedule: { at: prayerDate },
            sound: settings.playAudio ? 'azan.mp3' : undefined,
            channelId: 'azan_channel',
          }]
        });

        scheduled.push(prayer.name);
      }

      setScheduledPrayers(scheduled);
      console.log('Prayer notifications scheduled:', scheduled);
    } catch (e) {
      console.error('Error scheduling notifications:', e);
      setLastError(e instanceof Error ? e.message : String(e));
    }
  }, [prayerTimes, settings.playAudio]);

  // Schedule azans using native service (for background audio)
  const scheduleNativeAzans = useCallback(async (language: 'en' | 'ur' | 'roman' = 'en') => {
    const plugin = getAzanPlugin();
    if (!plugin || !prayerTimes) {
      // Fallback to local notifications
      await scheduleLocalNotifications();
      return;
    }

    setLoading(true);
    try {
      await plugin.cancelAllAzans();

      const prayers: Array<{ name: keyof typeof PRAYER_NAMES.en; time: string }> = [
        { name: 'Fajr', time: prayerTimes.Fajr },
        { name: 'Dhuhr', time: prayerTimes.Dhuhr },
        { name: 'Asr', time: prayerTimes.Asr },
        { name: 'Maghrib', time: prayerTimes.Maghrib },
        { name: 'Isha', time: prayerTimes.Isha },
      ];

      const now = new Date();
      const scheduled: string[] = [];

      for (const prayer of prayers) {
        let prayerDate = timeToDate(prayer.time);
        
        // If time has passed today, schedule for tomorrow
        if (prayerDate <= now) {
          prayerDate.setDate(prayerDate.getDate() + 1);
        }

        const prayerNameLocalized = PRAYER_NAMES[language][prayer.name];

        await plugin.scheduleAzan({
          prayerName: prayer.name,
          timeMs: prayerDate.getTime(),
          playAudio: settings.playAudio,
          notificationTitle: `🕌 ${prayerNameLocalized} Time`,
          notificationBody: language === 'ur' 
            ? `${prayerNameLocalized} کی نماز کا وقت ہوگیا (${prayer.time})`
            : language === 'roman'
              ? `${prayerNameLocalized} ki namaz ka waqt ho gaya (${prayer.time})`
              : `It's time for ${prayerNameLocalized} prayer (${prayer.time})`,
        });

        scheduled.push(prayer.name);
      }

      setScheduledPrayers(scheduled);
      setLastError(null);
      console.log('Native azans scheduled:', scheduled);
    } catch (e) {
      console.error('Error scheduling native azans:', e);
      setLastError(e instanceof Error ? e.message : String(e));
      // Fallback to local notifications
      await scheduleLocalNotifications();
    } finally {
      setLoading(false);
    }
  }, [prayerTimes, settings.playAudio, scheduleLocalNotifications]);

  // Play azan audio manually
  const playAzanAudio = useCallback(() => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio('/sounds/azan.mp3');
      }
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => {
        console.error('Error playing azan audio:', e);
      });
    } catch (e) {
      console.error('Error initializing azan audio:', e);
    }
  }, []);

  // Stop azan audio
  const stopAzanAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  // Toggle azan service
  const toggleAzan = useCallback((enabled: boolean) => {
    const newSettings = { ...settings, enabled };
    setSettings(newSettings);
    saveAzanSettings(newSettings);

    if (enabled) {
      scheduleNativeAzans();
    } else {
      const plugin = getAzanPlugin();
      if (plugin) {
        plugin.cancelAllAzans().catch(console.error);
      }
      LocalNotifications.cancel({ notifications: [
        { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }
      ]}).catch(console.error);
      setScheduledPrayers([]);
    }
  }, [settings, scheduleNativeAzans]);

  // Toggle audio
  const toggleAudio = useCallback((playAudio: boolean) => {
    const newSettings = { ...settings, playAudio };
    setSettings(newSettings);
    saveAzanSettings(newSettings);
  }, [settings]);

  // Auto-schedule when prayer times change
  useEffect(() => {
    if (settings.enabled && prayerTimes) {
      scheduleNativeAzans();
    }
  }, [prayerTimes, settings.enabled, scheduleNativeAzans]);

  return {
    settings,
    loading,
    lastError,
    scheduledPrayers,
    prayerTimes,
    toggleAzan,
    toggleAudio,
    playAzanAudio,
    stopAzanAudio,
    scheduleNativeAzans,
    isNativePlatform: Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android',
  };
};
