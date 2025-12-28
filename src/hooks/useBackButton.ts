import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { toast } from 'sonner';

// Pages where back button should allow exiting the app (only when there is NO history)
const EXIT_PAGES = ['/', '/splash', '/dashboard', '/admin'];
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

      const getHistoryIndex = () => {
        const state = window.history.state as any;
        return typeof state?.idx === 'number' ? state.idx : 0;
      };

      const listener = await App.addListener('backButton', () => {
        const currentPath = pathnameRef.current;
        const canGoBackInApp = getHistoryIndex() > 0;

        // Only go back when React Router actually has a previous entry.
        // (window.history.length can be misleading in Android WebView and can cause app-close)
        if (canGoBackInApp) {
          navigate(-1);
          return;
        }

        // No history: allow exit on specific pages, but confirm with double-press
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

        // No history and not an exit page: go to section home
        if (currentPath.startsWith('/admin')) {
          navigate('/admin', { replace: true });
          return;
        }

        // Default to student dashboard instead of landing page
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

