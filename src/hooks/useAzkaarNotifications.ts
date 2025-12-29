import { useEffect, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { LocalNotifications, ScheduleOptions } from '@capacitor/local-notifications';
import { getRandomDua, getTimeAppropriateDuas } from '@/data/azkaar';

const NOTIFICATION_CHANNEL_ID = 'azkaar-reminders';
const HOURLY_NOTIFICATION_ID = 1000;

export const useAzkaarNotifications = () => {
  // Request permissions
  const requestPermissions = useCallback(async () => {
    if (!Capacitor.isNativePlatform()) {
      console.log('Local notifications only work on native platforms');
      return false;
    }

    try {
      const permission = await LocalNotifications.requestPermissions();
      return permission.display === 'granted';
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }, []);

  // Create notification channel (Android only)
  const createNotificationChannel = useCallback(async () => {
    if (Capacitor.getPlatform() !== 'android') return;

    try {
      await LocalNotifications.createChannel({
        id: NOTIFICATION_CHANNEL_ID,
        name: 'Azkaar Reminders',
        description: 'Hourly Dua and Dhikr reminders',
        importance: 4, // High
        visibility: 1, // Public
        sound: 'default',
        vibration: true,
      });
    } catch (error) {
      console.error('Error creating notification channel:', error);
    }
  }, []);

  // Schedule hourly notifications
  const scheduleHourlyNotifications = useCallback(async () => {
    if (!Capacitor.isNativePlatform()) return;

    try {
      // Cancel existing notifications first
      await LocalNotifications.cancel({ notifications: [{ id: HOURLY_NOTIFICATION_ID }] });

      // Schedule notifications for the next 24 hours
      const notifications: ScheduleOptions['notifications'] = [];
      const now = new Date();

      for (let i = 1; i <= 24; i++) {
        const scheduledTime = new Date(now.getTime() + i * 60 * 60 * 1000);
        const dua = getRandomDua();

        notifications.push({
          id: HOURLY_NOTIFICATION_ID + i,
          title: '📿 أذكار المسلم',
          body: dua.arabic.substring(0, 100) + (dua.arabic.length > 100 ? '...' : ''),
          schedule: {
            at: scheduledTime,
            allowWhileIdle: true,
          },
          channelId: NOTIFICATION_CHANNEL_ID,
          smallIcon: 'ic_stat_icon',
          largeIcon: 'ic_launcher',
          actionTypeId: 'OPEN_AZKAAR',
          extra: {
            duaId: dua.id,
            type: 'azkaar',
          },
        });
      }

      await LocalNotifications.schedule({ notifications });
      console.log('Scheduled 24 hourly Azkaar notifications');
    } catch (error) {
      console.error('Error scheduling notifications:', error);
    }
  }, []);

  // Show immediate notification
  const showDuaNotification = useCallback(async () => {
    if (!Capacitor.isNativePlatform()) return;

    try {
      const dua = getRandomDua();
      
      await LocalNotifications.schedule({
        notifications: [
          {
            id: Date.now(),
            title: '📿 أذكار المسلم',
            body: dua.arabic,
            channelId: NOTIFICATION_CHANNEL_ID,
            smallIcon: 'ic_stat_icon',
            largeIcon: 'ic_launcher',
            extra: {
              duaId: dua.id,
              type: 'azkaar',
            },
          },
        ],
      });
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }, []);

  // Initialize notifications
  useEffect(() => {
    const initializeNotifications = async () => {
      if (!Capacitor.isNativePlatform()) return;

      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        console.log('Notification permission not granted');
        return;
      }

      await createNotificationChannel();
      await scheduleHourlyNotifications();

      // Listen for notification actions
      LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
        console.log('Notification action performed:', notification);
        if (notification.notification.extra?.type === 'azkaar') {
          // Navigate to Azkaar page - handled by app navigation
          window.location.href = '/azkaar';
        }
      });
    };

    initializeNotifications();

    return () => {
      LocalNotifications.removeAllListeners();
    };
  }, [requestPermissions, createNotificationChannel, scheduleHourlyNotifications]);

  // Reschedule notifications when app becomes active
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        scheduleHourlyNotifications();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [scheduleHourlyNotifications]);

  return {
    requestPermissions,
    scheduleHourlyNotifications,
    showDuaNotification,
  };
};
