import { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { getRandomDua, getTimeAppropriateDuas, Dhikr } from '@/data/azkaar';
import { cn } from '@/lib/utils';

interface FloatingDuaOverlayProps {
  intervalMinutes?: number;
  autoHideSeconds?: number;
}

export const FloatingDuaOverlay = ({ 
  intervalMinutes = 60, 
  autoHideSeconds = 30 
}: FloatingDuaOverlayProps) => {
  const [currentDua, setCurrentDua] = useState<Dhikr | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const showNewDua = useCallback(() => {
    const duas = getTimeAppropriateDuas();
    const randomIndex = Math.floor(Math.random() * duas.length);
    setCurrentDua(duas[randomIndex] || getRandomDua());
    setIsVisible(true);
    setIsExpanded(false);
  }, []);

  const hideDua = useCallback(() => {
    setIsVisible(false);
    setIsExpanded(false);
  }, []);

  // Show dua on interval
  useEffect(() => {
    // Show first dua after 5 seconds
    const initialTimeout = setTimeout(showNewDua, 5000);

    // Then show every intervalMinutes
    const interval = setInterval(showNewDua, intervalMinutes * 60 * 1000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [intervalMinutes, showNewDua]);

  // Auto-hide after autoHideSeconds (only if not expanded)
  useEffect(() => {
    if (isVisible && !isExpanded) {
      const timeout = setTimeout(hideDua, autoHideSeconds * 1000);
      return () => clearTimeout(timeout);
    }
  }, [isVisible, isExpanded, autoHideSeconds, hideDua]);

  if (!isVisible || !currentDua) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none">
      <div 
        className={cn(
          "pointer-events-auto mx-auto mt-4 max-w-md transition-all duration-500 ease-out",
          "bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400",
          "border-2 border-amber-500 rounded-xl shadow-2xl",
          "animate-in slide-in-from-top-5 fade-in duration-500",
          isExpanded ? "mx-4" : "mx-4"
        )}
        onClick={() => setIsExpanded(!isExpanded)}
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

        <div className="p-4">
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

          {/* Tap hint */}
          {!isExpanded && (
            <p 
              className="text-center text-xs mt-2 opacity-60"
              style={{ color: '#4a4a4a' }}
            >
              اضغط للمزيد...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
