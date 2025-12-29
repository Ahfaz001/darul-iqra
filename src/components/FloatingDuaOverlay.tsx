import { useState, useEffect, useCallback, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { morningAzkaar, eveningAzkaar, sleepingDuas, Dhikr } from '@/data/azkaar';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import { cn } from '@/lib/utils';

interface FloatingDuaOverlayProps {
  autoHideSeconds?: number;
}

export const FloatingDuaOverlay = ({ 
  autoHideSeconds = 20 
}: FloatingDuaOverlayProps) => {
  const [currentDuaIndex, setCurrentDuaIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentDuas, setCurrentDuas] = useState<Dhikr[]>([]);
  const [intervalMs, setIntervalMs] = useState(20 * 60 * 1000);
  const [periodLabel, setPeriodLabel] = useState('');
  
  const { times, loading, getCurrentPeriod, getMinutesUntilNextPeriod } = usePrayerTimes();
  
  // Swipe handling
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update schedule based on prayer times
  const updateSchedule = useCallback(() => {
    if (loading) return;
    
    const period = getCurrentPeriod();
    const minutesRemaining = getMinutesUntilNextPeriod();
    
    let duas: Dhikr[];
    let label: string;
    
    switch (period) {
      case 'morning':
        duas = morningAzkaar;
        label = `أذكار الصباح (${times?.Fajr} - ${times?.Maghrib})`;
        break;
      case 'evening':
        duas = eveningAzkaar;
        label = `أذكار المساء (${times?.Maghrib} - ${times?.Isha})`;
        break;
      case 'night':
        duas = sleepingDuas;
        label = 'أذكار النوم';
        break;
      default:
        duas = morningAzkaar;
        label = 'أذكار';
    }
    
    setCurrentDuas(duas);
    setPeriodLabel(label);
    
    // Calculate interval: spread duas evenly across remaining time
    const duaCount = duas.length;
    const intervalMinutes = Math.max(Math.floor(minutesRemaining / duaCount), 3);
    setIntervalMs(intervalMinutes * 60 * 1000);
    
    console.log(`${period} period: ${duaCount} duas, ${intervalMinutes} min interval, ${minutesRemaining} min remaining`);
  }, [loading, times, getCurrentPeriod, getMinutesUntilNextPeriod]);

  // Initialize and update on prayer times load
  useEffect(() => {
    if (!loading) {
      updateSchedule();
      
      // Check every 30 minutes if period changed
      const checkInterval = setInterval(updateSchedule, 30 * 60 * 1000);
      return () => clearInterval(checkInterval);
    }
  }, [loading, updateSchedule]);

  const showNextDua = useCallback(() => {
    if (currentDuas.length === 0) return;
    
    setCurrentDuaIndex(prev => (prev + 1) % currentDuas.length);
    setIsVisible(true);
    setIsExpanded(false);
  }, [currentDuas.length]);

  const hideDua = useCallback(() => {
    setIsVisible(false);
    setIsExpanded(false);
  }, []);

  // Show dua on interval
  useEffect(() => {
    if (currentDuas.length === 0 || loading) return;
    
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
  }, [intervalMs, showNextDua, currentDuas.length, loading]);

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
    
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      hideDua();
    }
    
    if (deltaY < -50 && Math.abs(deltaY) > Math.abs(deltaX)) {
      hideDua();
    }
  };

  const currentDua = currentDuas[currentDuaIndex];
  
  if (!isVisible || !currentDua || loading) return null;

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
          <MapPin className="w-3 h-3" />
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
          {/* Period label */}
          {isExpanded && periodLabel && (
            <p 
              className="text-center text-xs mb-2 opacity-70"
              style={{ color: '#4a4a4a' }}
              dir="rtl"
            >
              🕌 {periodLabel}
            </p>
          )}

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
