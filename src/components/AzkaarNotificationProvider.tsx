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
      {/* Floating overlay that shows duas on screen every hour */}
      <FloatingDuaOverlay intervalMinutes={60} autoHideSeconds={30} />
    </>
  );
};
