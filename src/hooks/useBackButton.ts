import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { toast } from 'sonner';

// Pages where back button should allow exiting the app (only when there is NO history)
const EXIT_PAGES = ['/', '/dashboard', '/admin'];
const EXIT_CONFIRM_MS = 1800;

export const useBackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const listenerRef = useRef<{ remove: () => Promise<void> } | null>(null);
  const pathnameRef = useRef(location.pathname);
  const lastExitAttemptRef = useRef<number>(0);

  // Keep latest path without re-registering the native listener
  useEffect(() => {
    pathnameRef.current = location.pathname;
  }, [location.pathname]);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let cancelled = false;

    const setupListener = async () => {
      // Avoid stacking multiple listeners
      if (listenerRef.current) {
        try {
          await listenerRef.current.remove();
        } catch {
          // ignore
        }
        listenerRef.current = null;
      }

      // Disable Capacitor's default back handler so Android doesn't close the app
      // before our listener runs.
      try {
        await App.toggleBackButtonHandler({ enabled: false });
      } catch {
        // ignore
      }

      const listener = await App.addListener('backButton', (ev) => {
        const currentPath = pathnameRef.current;

        // If WebView has history, go back in browser history (recommended by Capacitor)
        if (ev?.canGoBack) {
          window.history.back();
          return;
        }

        // Don't allow a single back-press to close the app on splash
        if (currentPath === '/splash') {
          navigate('/', { replace: true });
          return;
        }

        // No history: route back to the section home first
        if (currentPath.startsWith('/admin') && currentPath !== '/admin') {
          navigate('/admin', { replace: true });
          return;
        }

        if (!currentPath.startsWith('/admin') && currentPath !== '/dashboard' && currentPath !== '/') {
          navigate('/dashboard', { replace: true });
          return;
        }

        // Still no history: allow exit on specific pages, but confirm with double-press
        if (EXIT_PAGES.includes(currentPath)) {
          const now = Date.now();
          if (now - lastExitAttemptRef.current < EXIT_CONFIRM_MS) {
            App.exitApp();
            return;
          }

          lastExitAttemptRef.current = now;
          toast('Exit app', { description: 'Press back again to close.' });
          return;
        }

        // Final fallback
        navigate('/dashboard', { replace: true });
      });

      if (cancelled) {
        await listener.remove();
        return;
      }

      listenerRef.current = listener;
    };

    setupListener();

    return () => {
      cancelled = true;
      const listener = listenerRef.current;
      listenerRef.current = null;
      if (listener) void listener.remove();
    };
  }, [navigate]);
};

