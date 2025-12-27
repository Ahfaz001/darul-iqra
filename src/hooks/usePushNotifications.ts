import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { PushNotifications, Token, PushNotificationSchema, ActionPerformed } from '@capacitor/push-notifications';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const usePushNotifications = () => {
  const [token, setToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<PushNotificationSchema | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      console.log('Push notifications only work on native platforms');
      return;
    }

    const setupPushNotifications = async () => {
      try {
        // Request permission
        const permStatus = await PushNotifications.checkPermissions();
        
        if (permStatus.receive === 'prompt') {
          const result = await PushNotifications.requestPermissions();
          if (result.receive !== 'granted') {
            console.log('Push notification permission denied');
            return;
          }
        }

        if (permStatus.receive === 'denied') {
          console.log('Push notification permission denied');
          return;
        }

        // Register for push notifications
        await PushNotifications.register();

        // On registration success
        PushNotifications.addListener('registration', async (token: Token) => {
          console.log('Push registration success, token:', token.value);
          setToken(token.value);
          
          // Save token to database if user is logged in
          if (user?.id) {
            await savePushToken(token.value);
          }
        });

        // On registration error
        PushNotifications.addListener('registrationError', (error) => {
          console.error('Push registration error:', error);
        });

        // On push notification received
        PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
          console.log('Push notification received:', notification);
          setNotification(notification);
        });

        // On push notification action performed
        PushNotifications.addListener('pushNotificationActionPerformed', (action: ActionPerformed) => {
          console.log('Push notification action performed:', action);
          // Handle notification tap - navigate to specific screen based on data
          handleNotificationAction(action);
        });

      } catch (error) {
        console.error('Error setting up push notifications:', error);
      }
    };

    setupPushNotifications();

    return () => {
      PushNotifications.removeAllListeners();
    };
  }, [user?.id]);

  const savePushToken = async (fcmToken: string) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ fcm_token: fcmToken } as any)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error saving push token:', error);
      } else {
        console.log('Push token saved successfully');
      }
    } catch (error) {
      console.error('Error saving push token:', error);
    }
  };

  const handleNotificationAction = (action: ActionPerformed) => {
    const data = action.notification.data;
    
    // Navigate based on notification type
    if (data?.type === 'exam') {
      window.location.href = '/student/exams';
    } else if (data?.type === 'result') {
      window.location.href = '/student/results';
    } else if (data?.type === 'attendance') {
      window.location.href = '/student/attendance';
    }
  };

  return { token, notification };
};
