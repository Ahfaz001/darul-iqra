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
  const isRegistered = useRef(false);
  const lastUserId = useRef<string | null>(null);

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
        return false;
      }
      return true;
    } catch (err) {
      console.error('Failed to update session token:', err);
      return false;
    }
  }, []);

  const checkSessionValidity = useCallback(async (userId: string, myToken: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('session_token')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error checking session:', error);
        return true; // Don't logout on error
      }

      // If no profile or no session token stored yet, this is valid
      if (!data || !data.session_token) {
        return true;
      }

      // If tokens match, session is valid
      return data.session_token === myToken;
    } catch (err) {
      console.error('Session check failed:', err);
      return true; // Don't logout on error
    }
  }, []);

  useEffect(() => {
    if (!user) {
      currentSessionToken.current = null;
      isRegistered.current = false;
      lastUserId.current = null;
      return;
    }

    // If this is the same user, don't re-register (prevents false logouts on re-renders)
    if (lastUserId.current === user.id && isRegistered.current) {
      return;
    }

    const myToken = getSessionToken();
    currentSessionToken.current = myToken;
    lastUserId.current = user.id;

    // Register this session
    const registerSession = async () => {
      const success = await updateSessionToken(user.id, myToken);
      if (success) {
        isRegistered.current = true;
      }
    };
    
    registerSession();

    // Start checking only after a delay to ensure registration is complete
    let intervalId: ReturnType<typeof setInterval> | null = null;
    
    const startCheckingTimeout = setTimeout(() => {
      intervalId = setInterval(async () => {
        if (!user || !isRegistered.current) return;
        
        const isValid = await checkSessionValidity(user.id, myToken);
        if (!isValid) {
          toast.error('You have been logged out because your account was accessed from another device.');
          signOut();
        }
      }, 30000); // Check every 30 seconds
    }, 5000); // Wait 5 seconds before first check

    return () => {
      clearTimeout(startCheckingTimeout);
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [user, updateSessionToken, checkSessionValidity, signOut]);
};
