import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Repeat, 
  Quote, 
  Check,
  RotateCcw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Dhikr, getDhikrTranslation, getDhikrVirtue } from '@/data/azkaar';
import { Language } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface DhikrCounterCardProps {
  dhikr: Dhikr;
  language: Language;
  onComplete?: () => void;
  showCounter?: boolean;
}

export const DhikrCounterCard: React.FC<DhikrCounterCardProps> = ({ 
  dhikr, 
  language, 
  onComplete,
  showCounter = true
}) => {
  const [count, setCount] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Swipe handling
  const touchStartX = useRef<number>(0);
  const touchCurrentX = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [swipeOffset, setSwipeOffset] = useState(0);

  const translation = getDhikrTranslation(dhikr, language);
  const virtue = getDhikrVirtue(dhikr, language);
  const isUrdu = language === 'ur';
  const targetCount = dhikr.repetition || 1;
  const progress = Math.min((count / targetCount) * 100, 100);

  const handleCountClick = () => {
    if (isCompleted) return;
    
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 150);
    
    const newCount = count + 1;
    setCount(newCount);
    
    if (newCount >= targetCount) {
      setIsCompleted(true);
      // Auto-complete after showing completion animation
      setTimeout(() => {
        onComplete?.();
      }, 1500);
    }
  };

  const handleReset = () => {
    setCount(0);
    setIsCompleted(false);
  };

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchCurrentX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchCurrentX.current = e.touches[0].clientX;
    const delta = touchCurrentX.current - touchStartX.current;
    setSwipeOffset(delta);
  };

  const handleTouchEnd = () => {
    const delta = touchCurrentX.current - touchStartX.current;
    
    // If swiped far enough, complete the dua
    if (Math.abs(delta) > 100 && !isCompleted && count >= targetCount) {
      setIsCompleted(true);
      setTimeout(() => {
        onComplete?.();
      }, 300);
    }
    
    setSwipeOffset(0);
    touchStartX.current = 0;
    touchCurrentX.current = 0;
  };

  // UI labels
  const countLabel = language === 'ur' ? 'گنتی' : language === 'roman' ? 'Count' : 'Count';
  const completedLabel = language === 'ur' ? 'مکمل!' : language === 'roman' ? 'Mukammal!' : 'Complete!';
  const tapToCountLabel = language === 'ur' ? 'گننے کے لیے تھپتھپائیں' : language === 'roman' ? 'Ginnay ke liye tap karein' : 'Tap to count';
  const swipeToNextLabel = language === 'ur' ? 'اگلے کے لیے سوائپ کریں' : language === 'roman' ? 'Aglay ke liye swipe karein' : 'Swipe to continue';

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative transition-all duration-300",
        isCompleted && "opacity-80"
      )}
      style={{ transform: `translateX(${swipeOffset}px)` }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Swipe indicators */}
      {isCompleted && (
        <>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-8 opacity-50">
            <ChevronLeft className="h-6 w-6 text-primary animate-pulse" />
          </div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 -mr-8 opacity-50">
            <ChevronRight className="h-6 w-6 text-primary animate-pulse" />
          </div>
        </>
      )}

      <Card className={cn(
        "mb-4 border-border/50 transition-all duration-300 overflow-hidden",
        isCompleted ? "border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/20" : "hover:shadow-lg"
      )}>
        {/* Progress bar */}
        {showCounter && targetCount > 1 && (
          <div className="h-1 bg-muted">
            <div 
              className={cn(
                "h-full transition-all duration-300",
                isCompleted ? "bg-emerald-500" : "bg-primary"
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <CardContent className="p-4 sm:p-6">
          {/* Counter Section - Clickable */}
          {showCounter && (
            <div 
              className={cn(
                "flex items-center justify-center mb-4 p-6 rounded-xl cursor-pointer select-none transition-all",
                isCompleted 
                  ? "bg-emerald-500/20" 
                  : "bg-primary/10 hover:bg-primary/20 active:scale-95",
                isAnimating && "scale-110"
              )}
              onClick={handleCountClick}
            >
              <div className="text-center">
                {isCompleted ? (
                  <div className="flex flex-col items-center gap-2">
                    <Check className="h-12 w-12 text-emerald-500" />
                    <span className={cn(
                      "text-xl font-bold text-emerald-600 dark:text-emerald-400",
                      isUrdu && "font-urdu"
                    )}>
                      {completedLabel}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {swipeToNextLabel}
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="text-5xl font-bold text-primary mb-1">
                      {count}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      / {targetCount}
                    </div>
                    {count === 0 && (
                      <div className={cn(
                        "text-xs text-muted-foreground mt-2",
                        isUrdu && "font-urdu"
                      )}>
                        {tapToCountLabel}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Reset button */}
          {showCounter && count > 0 && !isCompleted && (
            <div className="flex justify-center mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="text-muted-foreground"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset
              </Button>
            </div>
          )}

          {/* Arabic Text */}
          <div className="text-right mb-4">
            <p className="text-xl sm:text-2xl leading-loose font-arabic text-foreground" dir="rtl">
              {dhikr.arabic}
            </p>
          </div>

          {/* Transliteration */}
          <div className="mb-3 p-3 rounded-lg bg-muted/50">
            <p className="text-sm sm:text-base text-muted-foreground italic">
              {dhikr.transliteration}
            </p>
          </div>

          {/* Translation */}
          <div className="mb-4" dir={isUrdu ? 'rtl' : 'ltr'}>
            <p className={cn(
              "text-sm sm:text-base text-foreground/80",
              isUrdu && "font-urdu"
            )}>
              {translation}
            </p>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              <BookOpen className="h-3 w-3 mr-1" />
              {dhikr.reference}
            </Badge>
            {targetCount > 1 && (
              <Badge variant="outline" className="text-xs">
                <Repeat className="h-3 w-3 mr-1" />
                {targetCount}x
              </Badge>
            )}
          </div>

          {/* Virtue */}
          {virtue && (
            <div 
              className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/10 cursor-pointer"
              onClick={() => setExpanded(!expanded)}
            >
              <div className="flex items-start gap-2" dir={isUrdu ? 'rtl' : 'ltr'}>
                <Quote className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <p className={cn(
                  "text-sm text-primary/80",
                  !expanded && "line-clamp-2",
                  isUrdu && "font-urdu"
                )}>
                  {virtue}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DhikrCounterCard;
