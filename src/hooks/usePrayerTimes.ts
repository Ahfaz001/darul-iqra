import { useState, useEffect, useCallback } from 'react';

export interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

interface PrayerTimesState {
  times: PrayerTimes | null;
  loading: boolean;
  error: string | null;
  location: { lat: number; lng: number } | null;
}

// Convert "HH:MM" to Date object for today
const timeToDate = (timeStr: string): Date => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
};

// Default times if API fails (approximate for most locations)
const DEFAULT_TIMES: PrayerTimes = {
  Fajr: '05:00',
  Sunrise: '06:30',
  Dhuhr: '12:30',
  Asr: '15:30',
  Maghrib: '18:30',
  Isha: '20:00'
};

export const usePrayerTimes = () => {
  const [state, setState] = useState<PrayerTimesState>({
    times: null,
    loading: true,
    error: null,
    location: null
  });

  const fetchPrayerTimes = useCallback(async (lat: number, lng: number) => {
    try {
      const today = new Date();
      const dateStr = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
      
      // Using Aladhan API - free, no API key needed
      // Method 2 = Islamic Society of North America (ISNA), works well globally
      const response = await fetch(
        `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${lat}&longitude=${lng}&method=2`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch prayer times');
      }
      
      const data = await response.json();
      const timings = data.data.timings;
      
      setState(prev => ({
        ...prev,
        times: {
          Fajr: timings.Fajr,
          Sunrise: timings.Sunrise,
          Dhuhr: timings.Dhuhr,
          Asr: timings.Asr,
          Maghrib: timings.Maghrib,
          Isha: timings.Isha
        },
        loading: false,
        error: null
      }));
      
      console.log('Prayer times loaded:', timings);
    } catch (error) {
      console.error('Error fetching prayer times:', error);
      setState(prev => ({
        ...prev,
        times: DEFAULT_TIMES,
        loading: false,
        error: 'Using default times'
      }));
    }
  }, []);

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      console.log('Geolocation not supported, using defaults');
      setState(prev => ({
        ...prev,
        times: DEFAULT_TIMES,
        loading: false,
        error: 'Geolocation not supported'
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log('Location obtained:', latitude, longitude);
        setState(prev => ({
          ...prev,
          location: { lat: latitude, lng: longitude }
        }));
        fetchPrayerTimes(latitude, longitude);
      },
      (error) => {
        console.log('Geolocation error, using defaults:', error.message);
        setState(prev => ({
          ...prev,
          times: DEFAULT_TIMES,
          loading: false,
          error: 'Location access denied'
        }));
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 3600000 // Cache for 1 hour
      }
    );
  }, [fetchPrayerTimes]);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  // Helper to check current prayer period
  const getCurrentPeriod = useCallback((): 'morning' | 'evening' | 'night' => {
    const times = state.times || DEFAULT_TIMES;
    const now = new Date();
    
    const fajr = timeToDate(times.Fajr);
    const maghrib = timeToDate(times.Maghrib);
    const isha = timeToDate(times.Isha);
    
    if (now >= fajr && now < maghrib) {
      return 'morning'; // Fajr to Maghrib = Morning Azkaar
    } else if (now >= maghrib && now < isha) {
      return 'evening'; // Maghrib to Isha = Evening Azkaar
    } else {
      return 'night'; // After Isha or before Fajr
    }
  }, [state.times]);

  // Get minutes until next period
  const getMinutesUntilNextPeriod = useCallback((): number => {
    const times = state.times || DEFAULT_TIMES;
    const now = new Date();
    
    const fajr = timeToDate(times.Fajr);
    const maghrib = timeToDate(times.Maghrib);
    const isha = timeToDate(times.Isha);
    
    let targetTime: Date;
    const period = getCurrentPeriod();
    
    if (period === 'morning') {
      targetTime = maghrib;
    } else if (period === 'evening') {
      targetTime = isha;
    } else {
      // Night - target is next Fajr
      if (now > isha) {
        // After Isha, Fajr is tomorrow
        targetTime = new Date(fajr);
        targetTime.setDate(targetTime.getDate() + 1);
      } else {
        targetTime = fajr;
      }
    }
    
    const diffMs = targetTime.getTime() - now.getTime();
    return Math.max(Math.floor(diffMs / 60000), 1);
  }, [state.times, getCurrentPeriod]);

  return {
    ...state,
    getCurrentPeriod,
    getMinutesUntilNextPeriod,
    refresh: getLocation
  };
};
