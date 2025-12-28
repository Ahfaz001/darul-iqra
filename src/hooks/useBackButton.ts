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

    const getUrlPath = () => {
      const hash = window.location.hash || '';
      // HashRouter uses "#/path".
      if (hash.startsWith('#')) {
        const p = hash.slice(1) || '/';
        return p.startsWith('/') ? p : `/${p}`;
      }
      return window.location.pathname || '/';
    };

    const isRootHistoryEntry = () => {
      const idx = (window.history.state as any)?.idx;
      return typeof idx === 'number' ? idx === 0 : false;
    };

    const hasExitLock = () => Boolean((window.history.state as any)?.__exitLock);

    const pushExitLock = () => {
      // Only add a lock on the first history entry. This prevents trapping users
      // when they actually have in-app history.
      if (!isRootHistoryEntry()) return;
      if (hasExitLock()) return;

      try {
        const currentIdx = (window.history.state as any)?.idx;
        const nextIdx = typeof currentIdx === 'number' ? currentIdx + 1 : 1;

        window.history.pushState(
          { ...(window.history.state ?? {}), __exitLock: true, idx: nextIdx },
          document.title,
          window.location.href
        );
      } catch {
        // ignore
      }
    };

    const ensureBackLock = () => {
      // Ensure there's always at least one WebView history entry so Android back
      // doesn't immediately close the Activity when navigation used "replace".
      pushExitLock();
    };

    const onWebHistoryBack = () => {
      const path = getUrlPath();

      // If we are not on the root history entry, let normal back navigation happen.
      if (!isRootHistoryEntry()) return;

      // No history: route back to the section home first
      if (path.startsWith('/admin') && path !== '/admin') {
        navigate('/admin', { replace: true });
        setTimeout(ensureBackLock, 0);
        return;
      }

      if (!path.startsWith('/admin') && path !== '/dashboard' && path !== '/') {
        navigate('/dashboard', { replace: true });
        setTimeout(ensureBackLock, 0);
        return;
      }

      const now = Date.now();
      if (now - lastExitAttemptRef.current < EXIT_CONFIRM_MS) {
        void App.exitApp();
        return;
      }

      lastExitAttemptRef.current = now;
      toast('Exit app', { description: 'Press back again to close.' });
      ensureBackLock();
    };

    // Fallback for cases where the native backButton event doesn't fire.
    window.addEventListener('popstate', onWebHistoryBack);
    window.addEventListener('hashchange', onWebHistoryBack);

    // Ensure lock at startup for ANY route (important on Android)
    ensureBackLock();

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

      // Ensure Capacitor's back button handler is ENABLED so the JS `backButton`
      // event fires (our listener will override the default back behavior).
      try {
        await App.toggleBackButtonHandler({ enabled: true });
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
          // Also add the web-history lock so even default WebView back won't instantly close.
          ensureBackLock();
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

      window.removeEventListener('popstate', onWebHistoryBack);
      window.removeEventListener('hashchange', onWebHistoryBack);

      const listener = listenerRef.current;
      listenerRef.current = null;
      if (listener) void listener.remove();
    };
  }, [navigate]);
};

