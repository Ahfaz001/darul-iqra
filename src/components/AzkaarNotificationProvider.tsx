import { useEffect } from 'react';
import { useAzkaarNotifications } from '@/hooks/useAzkaarNotifications';

interface AzkaarNotificationProviderProps {
  children: React.ReactNode;
}

export const AzkaarNotificationProvider = ({ children }: AzkaarNotificationProviderProps) => {
  // Initialize Azkaar notifications
  useAzkaarNotifications();

  return <>{children}</>;
};
