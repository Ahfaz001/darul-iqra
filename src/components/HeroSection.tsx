import { ArrowRight, BookOpen, GraduationCap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import madrasaLogo from "@/assets/madrasa-logo.jpg";
import { useEffect, useState } from "react";

const HeroSection = () => {
  const { t, isRTL } = useLanguage();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background with enhanced gradient - parallax layer */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-[hsl(220,55%,22%)] via-[hsl(220,55%,25%)] to-[hsl(220,60%,18%)]"
        style={{ transform: `translateY(${scrollY * 0.1}px)` }}
      ></div>
      <div 
        className="absolute inset-0 islamic-pattern opacity-20"
        style={{ transform: `translateY(${scrollY * 0.15}px)` }}
      ></div>
      
      {/* Decorative elements with parallax */}
      <div 
        className="absolute top-20 right-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl animate-float"
        style={{ transform: `translateY(${scrollY * 0.3}px) translateX(${scrollY * -0.1}px)` }}
      ></div>
      <div 
        className="absolute bottom-40 left-10 w-96 h-96 bg-gold/5 rounded-full blur-3xl"
        style={{ transform: `translateY(${scrollY * 0.25}px) translateX(${scrollY * 0.05}px)` }}
      ></div>
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary/5 rounded-full blur-3xl"
        style={{ transform: `translate(-50%, calc(-50% + ${scrollY * 0.2}px))` }}
      ></div>

      <div className="container mx-auto px-4 pt-28 pb-16 relative z-10 flex-1 flex flex-col">
        {/* Logo at Top Center */}
        <div className="flex flex-col items-center mb-8 animate-fade-up">
          <div className="relative">
            {/* Glow effect behind logo */}
            <div className="absolute inset-0 bg-secondary/30 rounded-full blur-2xl scale-110"></div>
            
            {/* Logo container */}
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-secondary/50 shadow-2xl">
              <img
                src={madrasaLogo}
                alt="Dar-ul-Ulum Al-Qur'an Wa Sunnah Kalyan Logo"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Decorative ring */}
            <div className="absolute inset-0 rounded-full border-2 border-secondary/30 scale-125 animate-pulse"></div>
          </div>
        </div>

        {/* Main Content - Centered */}
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
          {/* Arabic Bismillah */}
          <div className="animate-fade-up mb-6">
            <div className="inline-flex items-center gap-3">
              <Star className="w-4 h-4 text-secondary" fill="currentColor" />
              <span className="font-arabic text-2xl md:text-3xl text-secondary/90">
                {t('bismillah')}
              </span>
              <Star className="w-4 h-4 text-secondary" fill="currentColor" />
            </div>
          </div>

          {/* Main Heading */}
          <div className="space-y-4 animate-fade-up delay-100 mb-6">
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight">
              {t('instituteName')}
              <span className="block text-secondary mt-2">{t('waSunnah')}</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 font-urdu">
              {t('instituteUrdu')}
            </p>
            <div className="flex items-center justify-center gap-2">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-secondary/60"></div>
              <p className="text-base text-secondary/90 font-arabic">
                {t('obeySunnah')}
              </p>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-secondary/60"></div>
            </div>
            <p className="text-primary-foreground/60 text-sm md:text-base flex items-center justify-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-secondary/60"></span>
              {t('location')}
              <span className="inline-block w-2 h-2 rounded-full bg-secondary/60"></span>
            </p>
          </div>

          {/* Description */}
          <p className={`text-primary-foreground/70 text-base md:text-lg max-w-2xl mx-auto animate-fade-up delay-200 mb-8 leading-relaxed ${isRTL ? 'font-urdu' : ''}`}>
            {t('heroDescription')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up delay-300 mb-10">
            <Button 
              size="lg" 
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-lg hover:shadow-xl transition-all duration-300 gap-2 text-base px-8 py-6"
            >
              <GraduationCap className="w-5 h-5" />
              {t('enrollNow')}
              <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-primary-foreground/40 text-primary-foreground bg-primary-foreground/5 hover:bg-primary-foreground/15 hover:border-primary-foreground/60 gap-2 text-base px-8 py-6 transition-all duration-300"
            >
              <BookOpen className="w-5 h-5" />
              {t('learnMore')}
            </Button>
          </div>

          {/* Stats - Enhanced Cards */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 w-full max-w-2xl animate-fade-up delay-400">
            <div className="bg-primary-foreground/5 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-primary-foreground/10 hover:border-secondary/30 transition-all duration-300">
              <div className="font-display text-2xl md:text-4xl font-bold text-secondary mb-1">17+</div>
              <div className={`text-primary-foreground/60 text-xs md:text-sm ${isRTL ? 'font-urdu' : ''}`}>{t('yearsLegacy')}</div>
            </div>
            <div className="bg-primary-foreground/5 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-primary-foreground/10 hover:border-secondary/30 transition-all duration-300">
              <div className="font-display text-2xl md:text-4xl font-bold text-secondary mb-1">500+</div>
              <div className={`text-primary-foreground/60 text-xs md:text-sm ${isRTL ? 'font-urdu' : ''}`}>{t('students')}</div>
            </div>
            <div className="bg-primary-foreground/5 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-primary-foreground/10 hover:border-secondary/30 transition-all duration-300">
              <div className="font-display text-2xl md:text-4xl font-bold text-secondary mb-1">20+</div>
              <div className={`text-primary-foreground/60 text-xs md:text-sm ${isRTL ? 'font-urdu' : ''}`}>{t('scholars')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="relative z-10">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path 
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
            fill="hsl(40, 35%, 97%)"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
