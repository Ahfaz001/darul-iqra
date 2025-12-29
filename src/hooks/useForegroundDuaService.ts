import { useState, useEffect, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { getRandomDua, Dhikr } from '@/data/azkaar';

const STORAGE_KEY = 'foreground_dua_settings';

export interface ForegroundDuaSettings {
  enabled: boolean;
  intervalHours: number;
}

const DEFAULT_SETTINGS: ForegroundDuaSettings = {
  enabled: false,
  intervalHours: 1
};

export const getForegroundDuaSettings = (): ForegroundDuaSettings => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
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

// Get the plugin from Capacitor Plugins
const getForegroundDuaPlugin = (): ForegroundDuaPlugin | null => {
  if (!Capacitor.isNativePlatform()) {
    return null;
  }
  
  try {
    // The plugin will be registered as 'ForegroundDua' in native code
    const plugins = (Capacitor as any).Plugins;
    return plugins?.ForegroundDua || null;
  } catch (e) {
    console.error('ForegroundDua plugin not available:', e);
    return null;
  }
};

export const useForegroundDuaService = () => {
  const [settings, setSettings] = useState<ForegroundDuaSettings>(DEFAULT_SETTINGS);
  const [isRunning, setIsRunning] = useState(false);
  const [loading, setLoading] = useState(false);

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
    } catch (e) {
      console.error('Error checking service status:', e);
    }
  }, []);

  const startService = useCallback(async () => {
    const plugin = getForegroundDuaPlugin();
    if (!plugin) {
      console.log('Foreground service only works on native Android');
      return false;
    }

    setLoading(true);
    try {
      const dua = getRandomDua();
      await plugin.startService({
        arabic: dua.arabic,
        transliteration: dua.transliteration,
        translation: dua.translation,
        intervalMs: settings.intervalHours * 60 * 60 * 1000 // Convert hours to ms
      });
      
      setIsRunning(true);
      const newSettings = { ...settings, enabled: true };
      setSettings(newSettings);
      saveForegroundDuaSettings(newSettings);
      
      console.log('Foreground dua service started');
      return true;
    } catch (e) {
      console.error('Error starting foreground service:', e);
      return false;
    } finally {
      setLoading(false);
    }
  }, [settings]);

  const stopService = useCallback(async () => {
    const plugin = getForegroundDuaPlugin();
    if (!plugin) return false;

    setLoading(true);
    try {
      await plugin.stopService();
      
      setIsRunning(false);
      const newSettings = { ...settings, enabled: false };
      setSettings(newSettings);
      saveForegroundDuaSettings(newSettings);
      
      console.log('Foreground dua service stopped');
      return true;
    } catch (e) {
      console.error('Error stopping foreground service:', e);
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

  const updateInterval = useCallback((hours: number) => {
    const newSettings = { ...settings, intervalHours: hours };
    setSettings(newSettings);
    saveForegroundDuaSettings(newSettings);
  }, [settings]);

  // Auto-start service if it was enabled
  useEffect(() => {
    const autoStart = async () => {
      if (Capacitor.isNativePlatform() && settings.enabled && !isRunning) {
        await startService();
      }
    };
    autoStart();
  }, []);

  return {
    settings,
    isRunning,
    loading,
    startService,
    stopService,
    toggleService,
    updateInterval,
    checkServiceStatus,
    isNativePlatform: Capacitor.isNativePlatform()
  };
};
