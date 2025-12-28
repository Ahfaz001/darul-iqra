import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Generate a unique session token for this device/browser instance
const generateSessionToken = () => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
};

// Get or create a session token for this browser instance
const getSessionToken = () => {
  let token = sessionStorage.getItem('device_session_token');
  if (!token) {
    token = generateSessionToken();
    sessionStorage.setItem('device_session_token', token);
  }
  return token;
};

export const useSingleDeviceLogin = () => {
  const { user, signOut } = useAuth();
  const currentSessionToken = useRef<string | null>(null);
  const isCheckingSession = useRef(false);

  const updateSessionToken = useCallback(async (userId: string, token: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          session_token: token,
          session_updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) {
        console.error('Error updating session token:', error);
      }
    } catch (err) {
      console.error('Failed to update session token:', err);
    }
  }, []);

  const checkSessionValidity = useCallback(async (userId: string, myToken: string) => {
    if (isCheckingSession.current) return true;
    isCheckingSession.current = true;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('session_token')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error checking session:', error);
        isCheckingSession.current = false;
        return true;
      }

      // If no profile or no session token stored yet, this is valid
      if (!data || !data.session_token) {
        isCheckingSession.current = false;
        return true;
      }

      // If tokens match, session is valid
      if (data.session_token === myToken) {
        isCheckingSession.current = false;
        return true;
      }

      // Tokens don't match - another device logged in
      isCheckingSession.current = false;
      return false;
    } catch (err) {
      console.error('Session check failed:', err);
      isCheckingSession.current = false;
      return true;
    }
  }, []);

  useEffect(() => {
    if (!user) {
      currentSessionToken.current = null;
      return;
    }

    const myToken = getSessionToken();
    currentSessionToken.current = myToken;

    // Register this session
    updateSessionToken(user.id, myToken);

    // Periodically check if session is still valid
    const intervalId = setInterval(async () => {
      if (!user) return;
      
      const isValid = await checkSessionValidity(user.id, myToken);
      if (!isValid) {
        toast.error('You have been logged out because your account was accessed from another device.');
        signOut();
      }
    }, 30000); // Check every 30 seconds

    return () => {
      clearInterval(intervalId);
    };
  }, [user, updateSessionToken, checkSessionValidity, signOut]);
};
