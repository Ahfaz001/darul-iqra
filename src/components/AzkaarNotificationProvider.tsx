import { useAzkaarNotifications } from '@/hooks/useAzkaarNotifications';
import { FloatingDuaOverlay } from './FloatingDuaOverlay';

interface AzkaarNotificationProviderProps {
  children: React.ReactNode;
}

export const AzkaarNotificationProvider = ({ children }: AzkaarNotificationProviderProps) => {
  // Initialize native notifications for when app is closed
  useAzkaarNotifications();

  return (
    <>
      {children}
      {/* Floating overlay - morning duas from Fajr to Maghrib, evening duas from Maghrib to Fajr */}
      <FloatingDuaOverlay autoHideSeconds={25} />
    </>
  );
};
