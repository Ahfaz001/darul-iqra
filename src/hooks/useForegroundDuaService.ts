import { useState, useEffect, useCallback } from 'react';
import { Capacitor, registerPlugin } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { getRandomDua } from '@/data/azkaar';

const STORAGE_KEY = 'foreground_dua_settings';

export interface ForegroundDuaSettings {
  enabled: boolean;
  intervalHours: number;
}

const DEFAULT_SETTINGS: ForegroundDuaSettings = {
  enabled: false,
  intervalHours: 1,
};

type PartialForegroundDuaSettings = Partial<ForegroundDuaSettings> & {
  intervalHours?: number | string;
  enabled?: boolean | string;
};

export const getForegroundDuaSettings = (): ForegroundDuaSettings => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as PartialForegroundDuaSettings;
      const intervalHoursRaw = parsed.intervalHours ?? DEFAULT_SETTINGS.intervalHours;
      const intervalHours = Number(intervalHoursRaw);

      return {
        enabled: Boolean(parsed.enabled ?? DEFAULT_SETTINGS.enabled),
        intervalHours: Number.isFinite(intervalHours) && intervalHours > 0 ? intervalHours : DEFAULT_SETTINGS.intervalHours,
      };
    }
  } catch (e) {
    console.error('Error loading foreground dua settings:', e);
  }
  return DEFAULT_SETTINGS;
};

export const saveForegroundDuaSettings = (settings: ForegroundDuaSettings): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving foreground dua settings:', e);
  }
};

// This interface matches what the native plugin expects
interface ForegroundDuaPlugin {
  startService(options: {
    arabic: string;
    transliteration: string;
    translation: string;
    intervalMs: number;
  }): Promise<void>;
  stopService(): Promise<void>;
  updateNotification(options: {
    arabic: string;
    transliteration: string;
    translation: string;
  }): Promise<void>;
  isRunning(): Promise<{ running: boolean }>;
}

const ForegroundDua = registerPlugin<ForegroundDuaPlugin>('ForegroundDua');

const ensureAndroidNotificationPermission = async (): Promise<boolean> => {
  if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'android') return true;

  try {
    const current = await LocalNotifications.checkPermissions();
    if (current.display === 'granted') return true;

    const requested = await LocalNotifications.requestPermissions();
    return requested.display === 'granted';
  } catch (e) {
    console.error('Error requesting notification permission:', e);
    return false;
  }
};

// Get the plugin from Capacitor Plugins
const getForegroundDuaPlugin = (): ForegroundDuaPlugin | null => {
  if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'android') {
    return null;
  }

  return ForegroundDua;
};

export const useForegroundDuaService = () => {
  const [settings, setSettings] = useState<ForegroundDuaSettings>(DEFAULT_SETTINGS);
  const [isRunning, setIsRunning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  // Load settings on mount
  useEffect(() => {
    setSettings(getForegroundDuaSettings());
    checkServiceStatus();
  }, []);

  const checkServiceStatus = useCallback(async () => {
    const plugin = getForegroundDuaPlugin();
    if (!plugin) return;

    try {
      const result = await plugin.isRunning();
      setIsRunning(result.running);
      setLastError(null);
    } catch (e) {
      console.error('Error checking service status:', e);
      setLastError(e instanceof Error ? e.message : String(e));
    }
  }, []);

  const startService = useCallback(async () => {
    const plugin = getForegroundDuaPlugin();
    if (!plugin) {
      const msg = 'Foreground service only works on native Android (installed app).';
      console.log(msg);
      setLastError(msg);
      return false;
    }

    setLoading(true);
    try {
      const hasPerm = await ensureAndroidNotificationPermission();
      if (!hasPerm) {
        const msg = 'Notification permission denied. Please allow notifications for this app.';
        console.error(msg);
        setLastError(msg);
        return false;
      }

      const intervalMs = Number(settings.intervalHours) * 60 * 60 * 1000;
      if (!Number.isFinite(intervalMs) || intervalMs <= 0) {
        const msg = 'Invalid interval. Please choose a valid time interval.';
        console.error(msg, { intervalHours: settings.intervalHours });
        setLastError(msg);
        return false;
      }

      const dua = getRandomDua();
      await plugin.startService({
        arabic: dua.arabic,
        transliteration: dua.transliteration,
        translation: dua.translation,
        intervalMs,
      });

      setIsRunning(true);
      const newSettings = { ...settings, enabled: true };
      setSettings(newSettings);
      saveForegroundDuaSettings(newSettings);

      setLastError(null);
      console.log('Foreground dua service started');
      return true;
    } catch (e) {
      console.error('Error starting foreground service:', e);
      const msg = e instanceof Error ? e.message : String(e);
      setLastError(msg);
      return false;
    } finally {
      setLoading(false);
    }
  }, [settings]);

  const stopService = useCallback(async () => {
    const plugin = getForegroundDuaPlugin();
    if (!plugin) {
      const msg = 'Foreground service only works on native Android (installed app).';
      setLastError(msg);
      return false;
    }

    setLoading(true);
    try {
      await plugin.stopService();

      setIsRunning(false);
      const newSettings = { ...settings, enabled: false };
      setSettings(newSettings);
      saveForegroundDuaSettings(newSettings);

      setLastError(null);
      console.log('Foreground dua service stopped');
      return true;
    } catch (e) {
      console.error('Error stopping foreground service:', e);
      const msg = e instanceof Error ? e.message : String(e);
      setLastError(msg);
      return false;
    } finally {
      setLoading(false);
    }
  }, [settings]);

  const toggleService = useCallback(async () => {
    if (isRunning) {
      return await stopService();
    } else {
      return await startService();
    }
  }, [isRunning, startService, stopService]);

  const updateInterval = useCallback(
    (hours: number) => {
      const newSettings = { ...settings, intervalHours: hours };
      setSettings(newSettings);
      saveForegroundDuaSettings(newSettings);
    },
    [settings]
  );

  const testNotification = useCallback(async () => {
    const plugin = getForegroundDuaPlugin();
    if (!plugin || !isRunning) return false;

    setLoading(true);
    try {
      const dua = getRandomDua();
      await plugin.updateNotification({
        arabic: dua.arabic,
        transliteration: dua.transliteration,
        translation: dua.translation,
      });
      setLastError(null);
      console.log('Notification updated with new dua');
      return true;
    } catch (e) {
      console.error('Error updating notification:', e);
      const msg = e instanceof Error ? e.message : String(e);
      setLastError(msg);
      return false;
    } finally {
      setLoading(false);
    }
  }, [isRunning]);

  // Auto-start service if it was enabled
  useEffect(() => {
    const autoStart = async () => {
      if (settings.enabled && !isRunning) {
        await startService();
      }
    };
    autoStart();
  }, [settings.enabled, isRunning, startService]);

  return {
    settings,
    isRunning,
    loading,
    lastError,
    startService,
    stopService,
    toggleService,
    updateInterval,
    testNotification,
    checkServiceStatus,
    isNativePlatform: Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android',
  };
};
