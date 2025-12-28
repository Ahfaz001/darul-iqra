import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';

// Pages where back button should exit the app
const EXIT_PAGES = ['/', '/splash', '/dashboard', '/admin'];

export const useBackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const listenerRef = useRef<{ remove: () => Promise<void> } | null>(null);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const setupListener = async () => {
      listenerRef.current = await App.addListener('backButton', ({ canGoBack }) => {
        const currentPath = location.pathname;
        
        // If on exit pages, minimize/exit the app
        if (EXIT_PAGES.includes(currentPath)) {
          App.exitApp();
          return;
        }

        // Otherwise, navigate back
        if (canGoBack || window.history.length > 1) {
          navigate(-1);
        } else {
          // If no history, go to dashboard or home
          navigate('/');
        }
      });
    };

    setupListener();

    return () => {
      if (listenerRef.current) {
        listenerRef.current.remove();
      }
    };
  }, [navigate, location.pathname]);
};

