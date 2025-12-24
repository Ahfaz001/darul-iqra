import { useEffect, useRef, useState } from 'react';

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export const useScrollAnimation = (options: UseScrollAnimationOptions = {}) => {
  const { threshold = 0.1, rootMargin = '0px', triggerOnce = true } = options;
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isVisible };
};

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right' | 'scale-up' | 'fade-up-stagger';
  delay?: number;
  threshold?: number;
}

export const AnimatedSection = ({
  children,
  className = '',
  animation = 'fade-up',
  delay = 0,
  threshold = 0.1,
}: AnimatedSectionProps) => {
  const { ref, isVisible } = useScrollAnimation({ threshold });

  const getAnimationClasses = () => {
    const baseClasses = 'transition-all duration-700 ease-out';
    
    const animations = {
      'fade-up': {
        hidden: 'opacity-0 translate-y-8',
        visible: 'opacity-100 translate-y-0',
      },
      'fade-in': {
        hidden: 'opacity-0',
        visible: 'opacity-100',
      },
      'slide-left': {
        hidden: 'opacity-0 translate-x-8',
        visible: 'opacity-100 translate-x-0',
      },
      'slide-right': {
        hidden: 'opacity-0 -translate-x-8',
        visible: 'opacity-100 translate-x-0',
      },
      'scale-up': {
        hidden: 'opacity-0 scale-95',
        visible: 'opacity-100 scale-100',
      },
      'fade-up-stagger': {
        hidden: 'opacity-0 translate-y-8',
        visible: 'opacity-100 translate-y-0',
      },
    };

    const animationState = isVisible ? animations[animation].visible : animations[animation].hidden;
    return `${baseClasses} ${animationState}`;
  };

  return (
    <div
      ref={ref}
      className={`${getAnimationClasses()} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

interface StaggeredChildrenProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  threshold?: number;
}

export const StaggeredChildren = ({
  children,
  className = '',
  staggerDelay = 100,
  threshold = 0.1,
}: StaggeredChildrenProps) => {
  const { ref, isVisible } = useScrollAnimation({ threshold });

  return (
    <div ref={ref} className={className}>
      {Array.isArray(children)
        ? children.map((child, index) => (
            <div
              key={index}
              className={`transition-all duration-500 ease-out ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: `${index * staggerDelay}ms` }}
            >
              {child}
            </div>
          ))
        : children}
    </div>
  );
};
