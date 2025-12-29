import { useState, useEffect, useCallback, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { morningAzkaar, eveningAzkaar, Dhikr } from '@/data/azkaar';
import { cn } from '@/lib/utils';

interface FloatingDuaOverlayProps {
  autoHideSeconds?: number;
}

// Time periods (24-hour format)
const FAJR_START = 5;    // 5 AM
const MAGHRIB_START = 18; // 6 PM

const getTimeInfo = () => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();
  
  const isMorningPeriod = currentHour >= FAJR_START && currentHour < MAGHRIB_START;
  
  // Calculate minutes remaining in current period
  let minutesRemaining: number;
  if (isMorningPeriod) {
    // Minutes until Maghrib (6 PM)
    minutesRemaining = (MAGHRIB_START - currentHour) * 60 - currentMinutes;
  } else {
    // Minutes until Fajr (5 AM next day or same day)
    if (currentHour >= MAGHRIB_START) {
      // After Maghrib - until next Fajr
      minutesRemaining = ((24 - currentHour) + FAJR_START) * 60 - currentMinutes;
    } else {
      // Before Fajr - until Fajr
      minutesRemaining = (FAJR_START - currentHour) * 60 - currentMinutes;
    }
  }
  
  return {
    isMorningPeriod,
    minutesRemaining: Math.max(minutesRemaining, 1),
    currentDuas: isMorningPeriod ? morningAzkaar : eveningAzkaar
  };
};

export const FloatingDuaOverlay = ({ 
  autoHideSeconds = 20 
}: FloatingDuaOverlayProps) => {
  const [currentDuaIndex, setCurrentDuaIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentDuas, setCurrentDuas] = useState<Dhikr[]>([]);
  const [intervalMs, setIntervalMs] = useState(20 * 60 * 1000); // Default 20 min
  
  // Swipe handling
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate interval and set duas based on time period
  const updateSchedule = useCallback(() => {
    const { isMorningPeriod, minutesRemaining, currentDuas: duas } = getTimeInfo();
    
    setCurrentDuas(duas);
    
    // Calculate interval: spread all duas evenly across remaining time
    const duaCount = duas.length;
    const intervalMinutes = Math.max(Math.floor(minutesRemaining / duaCount), 5); // Min 5 minutes
    setIntervalMs(intervalMinutes * 60 * 1000);
    
    console.log(`${isMorningPeriod ? 'Morning' : 'Evening'} period: ${duaCount} duas, ${intervalMinutes} min interval`);
  }, []);

  // Initialize and update on time period change
  useEffect(() => {
    updateSchedule();
    
    // Check every hour if period changed
    const checkInterval = setInterval(() => {
      updateSchedule();
    }, 60 * 60 * 1000);
    
    return () => clearInterval(checkInterval);
  }, [updateSchedule]);

  const showNextDua = useCallback(() => {
    if (currentDuas.length === 0) return;
    
    setCurrentDuaIndex(prev => {
      const next = (prev + 1) % currentDuas.length;
      return next;
    });
    setIsVisible(true);
    setIsExpanded(false);
  }, [currentDuas.length]);

  const hideDua = useCallback(() => {
    setIsVisible(false);
    setIsExpanded(false);
  }, []);

  // Show dua on interval
  useEffect(() => {
    if (currentDuas.length === 0) return;
    
    // Show first dua after 3 seconds
    const initialTimeout = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    // Then show next dua on calculated interval
    const interval = setInterval(showNextDua, intervalMs);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [intervalMs, showNextDua, currentDuas.length]);

  // Auto-hide after autoHideSeconds (only if not expanded)
  useEffect(() => {
    if (isVisible && !isExpanded) {
      const timeout = setTimeout(hideDua, autoHideSeconds * 1000);
      return () => clearTimeout(timeout);
    }
  }, [isVisible, isExpanded, autoHideSeconds, hideDua]);

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const deltaX = touchEndX - touchStartX.current;
    const deltaY = touchEndY - touchStartY.current;
    
    // Check if horizontal swipe (more horizontal than vertical)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      hideDua(); // Swipe left or right to dismiss
    }
    
    // Swipe up to dismiss
    if (deltaY < -50 && Math.abs(deltaY) > Math.abs(deltaX)) {
      hideDua();
    }
  };

  const currentDua = currentDuas[currentDuaIndex];
  
  if (!isVisible || !currentDua) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none">
      <div 
        ref={containerRef}
        className={cn(
          "pointer-events-auto mx-4 mt-4 max-w-md transition-all duration-500 ease-out relative",
          "bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400",
          "border-2 border-amber-500 rounded-xl shadow-2xl",
          "animate-in slide-in-from-top-5 fade-in duration-500",
          "cursor-grab active:cursor-grabbing"
        )}
        onClick={() => setIsExpanded(!isExpanded)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Close button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            hideDua();
          }}
          className="absolute -top-2 -right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Progress indicator */}
        <div className="absolute top-2 left-2 flex items-center gap-1 text-xs opacity-60" style={{ color: '#4a4a4a' }}>
          <span>{currentDuaIndex + 1}/{currentDuas.length}</span>
        </div>

        {/* Swipe indicators */}
        <div className="absolute left-1 top-1/2 -translate-y-1/2 opacity-30">
          <ChevronLeft className="w-4 h-4" style={{ color: '#4a4a4a' }} />
        </div>
        <div className="absolute right-1 top-1/2 -translate-y-1/2 opacity-30">
          <ChevronRight className="w-4 h-4" style={{ color: '#4a4a4a' }} />
        </div>

        <div className="p-4 pt-6">
          {/* Arabic text */}
          <p 
            className={cn(
              "text-center font-arabic leading-relaxed transition-all duration-300",
              isExpanded ? "text-xl" : "text-lg line-clamp-2"
            )}
            style={{ 
              fontFamily: '"Amiri", "Traditional Arabic", serif',
              color: '#1a1a1a',
              textShadow: '0 1px 2px rgba(255,255,255,0.5)'
            }}
            dir="rtl"
          >
            {currentDua.arabic}
          </p>

          {/* Reference */}
          {isExpanded && currentDua.reference && (
            <p 
              className="text-center text-xs mt-2 opacity-70"
              style={{ color: '#4a4a4a' }}
            >
              📖 {currentDua.reference}
            </p>
          )}

          {/* Repetitions */}
          {isExpanded && currentDua.repetition && currentDua.repetition > 1 && (
            <p 
              className="text-center text-xs mt-1 opacity-70"
              style={{ color: '#4a4a4a' }}
            >
              🔄 عدد المرات: {currentDua.repetition}
            </p>
          )}

          {/* Swipe hint */}
          {!isExpanded && (
            <p 
              className="text-center text-xs mt-2 opacity-50"
              style={{ color: '#4a4a4a' }}
            >
              ← سحب للإغلاق | اضغط للمزيد →
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
