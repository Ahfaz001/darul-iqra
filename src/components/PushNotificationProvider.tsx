import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { toast } from 'sonner';

interface PushNotificationProviderProps {
  children: React.ReactNode;
}

export const PushNotificationProvider = ({ children }: PushNotificationProviderProps) => {
  const { notification } = usePushNotifications();

  useEffect(() => {
    if (notification) {
      // Show toast when notification received while app is open
      toast(notification.title || 'New Notification', {
        description: notification.body,
      });
    }
  }, [notification]);

  return <>{children}</>;
};
