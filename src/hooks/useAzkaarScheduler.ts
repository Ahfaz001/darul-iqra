import { useState, useEffect, useCallback } from 'react';
import { Capacitor, registerPlugin } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { morningAzkaar, eveningAzkaar, Dhikr, getDhikrTranslation } from '@/data/azkaar';
import { usePrayerTimes } from './usePrayerTimes';

const AZKAAR_SETTINGS_KEY = 'azkaar_scheduler_settings';
const AZKAAR_CHANNEL_ID = 'azkaar_channel';

export interface AzkaarSchedulerSettings {
  enabled: boolean;
  morningEnabled: boolean;
  eveningEnabled: boolean;
  notifyEachAzkaar: boolean;
  delayBetweenMinutes: number;
}

const DEFAULT_SETTINGS: AzkaarSchedulerSettings = {
  enabled: true,
  morningEnabled: true,
  eveningEnabled: true,
  notifyEachAzkaar: true,
  delayBetweenMinutes: 2,
};

// Native Azkaar Service plugin interface
interface AzkaarServicePlugin {
  scheduleMorningAzkaar(options: {
    azkaarList: Array<{ arabic: string; translation: string; repetition: number }>;
    startTimeMs: number;
    delayBetweenMs: number;
  }): Promise<void>;
  scheduleEveningAzkaar(options: {
    azkaarList: Array<{ arabic: string; translation: string; repetition: number }>;
    startTimeMs: number;
    delayBetweenMs: number;
  }): Promise<void>;
  cancelAllAzkaar(): Promise<void>;
}

let _azkaarPlugin: AzkaarServicePlugin | null = null;

const getAzkaarPlugin = (): AzkaarServicePlugin | null => {
  if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'android') {
    return null;
  }
  // If native plugin isn't installed/registered, gracefully fall back to LocalNotifications
  if (!Capacitor.isPluginAvailable('AzkaarService')) {
    return null;
  }
  if (!_azkaarPlugin) {
    _azkaarPlugin = registerPlugin<AzkaarServicePlugin>('AzkaarService');
  }
  return _azkaarPlugin;
};

export const getAzkaarSchedulerSettings = (): AzkaarSchedulerSettings => {
  try {
    const saved = localStorage.getItem(AZKAAR_SETTINGS_KEY);
    if (saved) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Error loading azkaar scheduler settings:', e);
  }
  return DEFAULT_SETTINGS;
};

export const saveAzkaarSchedulerSettings = (settings: AzkaarSchedulerSettings): void => {
  try {
    localStorage.setItem(AZKAAR_SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving azkaar scheduler settings:', e);
  }
};

// Convert "HH:MM" to Date object for today
const timeToDate = (timeStr: string): Date => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
};

const ensureAzkaarNotificationAccess = async (): Promise<boolean> => {
  if (!Capacitor.isNativePlatform()) return false;

  try {
    const perm = await LocalNotifications.requestPermissions();
    if (perm.display !== 'granted') return false;

    if (Capacitor.getPlatform() === 'android') {
      await LocalNotifications.createChannel({
        id: AZKAAR_CHANNEL_ID,
        name: 'Azkaar',
        description: 'Morning and evening azkaar notifications',
        importance: 4, // High
        visibility: 1, // Public
        sound: 'default',
        vibration: true,
      });
    }

    return true;
  } catch (e) {
    console.error('Error ensuring azkaar notification access:', e);
    return false;
  }
};

export const useAzkaarScheduler = () => {
  const [settings, setSettings] = useState<AzkaarSchedulerSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  const { times: prayerTimes } = usePrayerTimes();

  // Load settings on mount
  useEffect(() => {
    setSettings(getAzkaarSchedulerSettings());
  }, []);

  // Schedule local notifications for each azkaar (fallback)
  const scheduleLocalAzkaarNotifications = useCallback(
    async (language: 'en' | 'ur' | 'roman' = 'en') => {
      if (!prayerTimes) return;

      if (!Capacitor.isNativePlatform()) {
        setLastError('Azkaar notifications only work in the installed mobile app.');
        return;
      }

      try {
        const hasAccess = await ensureAzkaarNotificationAccess();
        if (!hasAccess) {
          setLastError('Notification permission not granted. Please enable notifications for this app.');
          return;
        }

        // Cancel existing azkaar notifications (IDs 100-300)
        const cancelIds = [];
        for (let i = 100; i <= 300; i++) {
          cancelIds.push({ id: i });
        }
        await LocalNotifications.cancel({ notifications: cancelIds });

        const now = new Date();
        let notificationId = 100;
        const delayMs = settings.delayBetweenMinutes * 60 * 1000;

        // Morning Azkaar (after Fajr)
        if (settings.morningEnabled) {
          let morningTime = timeToDate(prayerTimes.Fajr);
          morningTime.setMinutes(morningTime.getMinutes() + 15); // 15 min after Fajr

          if (morningTime <= now) {
            morningTime.setDate(morningTime.getDate() + 1);
          }

          for (let i = 0; i < morningAzkaar.length && i < 50; i++) {
            const dhikr = morningAzkaar[i];
            const scheduledTime = new Date(morningTime.getTime() + i * delayMs);

            const title =
              language === 'ur'
                ? '☀️ صبح کا ذکر'
                : language === 'roman'
                  ? '☀️ Subah ka Dhikr'
                  : '☀️ Morning Dhikr';
            const body = getDhikrTranslation(dhikr, language);

            await LocalNotifications.schedule({
              notifications: [
                {
                  id: notificationId++,
                  title,
                  body: body.substring(0, 200),
                  schedule: { at: scheduledTime, allowWhileIdle: true },
                  channelId: AZKAAR_CHANNEL_ID,
                },
              ],
            });
          }
        }

        // Evening Azkaar (after Maghrib)
        if (settings.eveningEnabled) {
          let eveningTime = timeToDate(prayerTimes.Maghrib);
          eveningTime.setMinutes(eveningTime.getMinutes() + 10); // 10 min after Maghrib

          if (eveningTime <= now) {
            eveningTime.setDate(eveningTime.getDate() + 1);
          }

          for (let i = 0; i < eveningAzkaar.length && i < 50; i++) {
            const dhikr = eveningAzkaar[i];
            const scheduledTime = new Date(eveningTime.getTime() + i * delayMs);

            const title =
              language === 'ur'
                ? '🌙 شام کا ذکر'
                : language === 'roman'
                  ? '🌙 Shaam ka Dhikr'
                  : '🌙 Evening Dhikr';
            const body = getDhikrTranslation(dhikr, language);

            await LocalNotifications.schedule({
              notifications: [
                {
                  id: notificationId++,
                  title,
                  body: body.substring(0, 200),
                  schedule: { at: scheduledTime, allowWhileIdle: true },
                  channelId: AZKAAR_CHANNEL_ID,
                },
              ],
            });
          }
        }

        setLastError(null);
        console.log('Azkaar notifications scheduled:', notificationId - 100);
      } catch (e) {
        console.error('Error scheduling azkaar notifications:', e);
        setLastError(e instanceof Error ? e.message : String(e));
      }
    },
    [prayerTimes, settings]
  );

  // Schedule using native service
  const scheduleNativeAzkaar = useCallback(
    async (language: 'en' | 'ur' | 'roman' = 'en') => {
      const plugin = getAzkaarPlugin();
      if (!plugin || !prayerTimes) {
        await scheduleLocalAzkaarNotifications(language);
        return;
      }

      setLoading(true);
      try {
        const hasAccess = await ensureAzkaarNotificationAccess();
        if (!hasAccess) {
          setLastError('Notification permission not granted. Please enable notifications for this app.');
          return;
        }

        await plugin.cancelAllAzkaar();

        const now = new Date();
        const delayMs = settings.delayBetweenMinutes * 60 * 1000;

        // Morning Azkaar
        if (settings.morningEnabled) {
          let morningTime = timeToDate(prayerTimes.Fajr);
          morningTime.setMinutes(morningTime.getMinutes() + 15);

          if (morningTime <= now) {
            morningTime.setDate(morningTime.getDate() + 1);
          }

          const morningList = morningAzkaar.slice(0, 20).map((d) => ({
            arabic: d.arabic,
            translation: getDhikrTranslation(d, language),
            repetition: d.repetition || 1,
          }));

          await plugin.scheduleMorningAzkaar({
            azkaarList: morningList,
            startTimeMs: morningTime.getTime(),
            delayBetweenMs: delayMs,
          });
        }

        // Evening Azkaar
        if (settings.eveningEnabled) {
          let eveningTime = timeToDate(prayerTimes.Maghrib);
          eveningTime.setMinutes(eveningTime.getMinutes() + 10);

          if (eveningTime <= now) {
            eveningTime.setDate(eveningTime.getDate() + 1);
          }

          const eveningList = eveningAzkaar.slice(0, 20).map((d) => ({
            arabic: d.arabic,
            translation: getDhikrTranslation(d, language),
            repetition: d.repetition || 1,
          }));

          await plugin.scheduleEveningAzkaar({
            azkaarList: eveningList,
            startTimeMs: eveningTime.getTime(),
            delayBetweenMs: delayMs,
          });
        }

        setLastError(null);
        console.log('Native azkaar scheduled');
      } catch (e) {
        console.error('Error scheduling native azkaar:', e);
        setLastError(e instanceof Error ? e.message : String(e));
        await scheduleLocalAzkaarNotifications(language);
      } finally {
        setLoading(false);
      }
    },
    [prayerTimes, settings, scheduleLocalAzkaarNotifications]
  );

  // Update settings
  const updateSettings = useCallback((newSettings: Partial<AzkaarSchedulerSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    saveAzkaarSchedulerSettings(updated);
  }, [settings]);

  // Toggle entire service
  const toggleEnabled = useCallback((enabled: boolean, language: 'en' | 'ur' | 'roman' = 'en') => {
    updateSettings({ enabled });
    if (enabled) {
      scheduleNativeAzkaar(language);
    } else {
      const plugin = getAzkaarPlugin();
      if (plugin) {
        plugin.cancelAllAzkaar().catch(console.error);
      }
      // Cancel local notifications
      const cancelIds = [];
      for (let i = 100; i <= 300; i++) {
        cancelIds.push({ id: i });
      }
      LocalNotifications.cancel({ notifications: cancelIds }).catch(console.error);
    }
  }, [updateSettings, scheduleNativeAzkaar]);

  // Auto-schedule when prayer times change
  useEffect(() => {
    if (settings.enabled && prayerTimes) {
      scheduleNativeAzkaar();
    }
  }, [prayerTimes, settings.enabled]);

  return {
    settings,
    loading,
    lastError,
    prayerTimes,
    updateSettings,
    toggleEnabled,
    scheduleNativeAzkaar,
    scheduleLocalAzkaarNotifications,
    isNativePlatform: Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android',
  };
};
