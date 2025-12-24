import { ArrowRight, BookOpen, GraduationCap, Star, Sparkles } from "lucide-react";
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
      {/* Ultra Lite Turquoise gradient background */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-cyan-100 via-teal-100 to-cyan-200 dark:from-cyan-900 dark:via-teal-900 dark:to-slate-900"
        style={{ transform: `translateY(${scrollY * 0.1}px)` }}
      ></div>
      
      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-cyan-200/30 dark:from-black/20 dark:to-teal-900/40"></div>
      
      {/* Subtle geometric shapes - no circles behind logo */}
      <div 
        className="absolute top-20 right-10 w-40 h-40 bg-gradient-to-br from-amber-300/15 to-orange-400/10 rotate-45"
        style={{ transform: `translateY(${scrollY * 0.3}px) rotate(45deg)` }}
      ></div>
      <div 
        className="absolute bottom-40 left-10 w-32 h-32 bg-gradient-to-tr from-white/30 to-cyan-200/15 rotate-12"
        style={{ transform: `translateY(${scrollY * 0.25}px) rotate(12deg)` }}
      ></div>
      
      {/* Clean grid pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M0 0h1v40H0zM39 0h1v40h-1zM0 0h40v1H0zM0 39h40v1H0z'/%3E%3C/g%3E%3C/svg%3E")`,
      }}></div>

      <div className="container mx-auto px-4 pt-28 pb-16 relative z-10 flex-1 flex flex-col">
        {/* Logo at Top Center - Circular, bigger, clean */}
        <div className="flex flex-col items-center mb-8 animate-fade-up">
          <div className="w-40 h-40 md:w-52 md:h-52 rounded-full overflow-hidden border-4 border-white shadow-2xl">
            <img
              src={madrasaLogo}
              alt="Dar-ul-Ulum Al-Qur'an Wa Sunnah Kalyan Logo"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Main Content - Centered */}
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
          {/* Arabic Bismillah - Clean solid background */}
          <div className="animate-fade-up mb-6">
            <div className="inline-flex items-center gap-3 bg-white/90 dark:bg-slate-800/90 px-6 py-3 rounded-full border-2 border-amber-400 shadow-lg">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="font-arabic text-xl md:text-2xl text-teal-700 dark:text-amber-400">
                {t('bismillah')}
              </span>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>
          </div>

          {/* Main Heading - Bold vibrant colors */}
          <div className="space-y-4 animate-fade-up delay-100 mb-6">
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
              <span className="text-slate-900 dark:text-white drop-shadow-lg">{t('instituteName')}</span>
              <span className="block text-amber-500 dark:text-amber-400 mt-2">
                {t('waSunnah')}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-800 dark:text-cyan-100 font-urdu font-bold">
              {t('instituteUrdu')}
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="h-1 w-16 bg-amber-500 dark:bg-amber-400 rounded-full"></div>
              <p className="text-base text-slate-700 dark:text-amber-300 font-arabic font-semibold">
                {t('obeySunnah')}
              </p>
              <div className="h-1 w-16 bg-amber-500 dark:bg-amber-400 rounded-full"></div>
            </div>
            <p className="text-slate-700 dark:text-cyan-200 text-sm md:text-base flex items-center justify-center gap-2 font-medium">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-500"></span>
              {t('location')}
              <span className="inline-block w-2 h-2 rounded-full bg-amber-500"></span>
            </p>
          </div>

          {/* Description */}
          <p className={`text-slate-700 dark:text-cyan-100 text-base md:text-lg max-w-2xl mx-auto animate-fade-up delay-200 mb-8 leading-relaxed font-medium ${isRTL ? 'font-urdu' : ''}`}>
            {t('heroDescription')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up delay-300 mb-10">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700 shadow-xl hover:shadow-2xl transition-all duration-300 gap-2 text-base px-8 py-6 font-bold"
            >
              <GraduationCap className="w-5 h-5" />
              {t('enrollNow')}
              <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-slate-800 dark:border-white text-slate-800 dark:text-white bg-white/50 dark:bg-white/10 hover:bg-slate-800 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 gap-2 text-base px-8 py-6 transition-all duration-300 font-bold"
            >
              <BookOpen className="w-5 h-5" />
              {t('learnMore')}
            </Button>
          </div>

          {/* Stats - Clean solid cards */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 w-full max-w-2xl animate-fade-up delay-400">
            <div className="group bg-white dark:bg-slate-800 rounded-xl p-4 md:p-6 border-2 border-amber-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="font-display text-2xl md:text-4xl font-extrabold text-teal-600 dark:text-cyan-400 mb-1">17+</div>
              <div className={`text-slate-700 dark:text-slate-300 text-xs md:text-sm font-bold ${isRTL ? 'font-urdu' : ''}`}>{t('yearsLegacy')}</div>
            </div>
            <div className="group bg-white dark:bg-slate-800 rounded-xl p-4 md:p-6 border-2 border-amber-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="font-display text-2xl md:text-4xl font-extrabold text-teal-600 dark:text-cyan-400 mb-1">500+</div>
              <div className={`text-slate-700 dark:text-slate-300 text-xs md:text-sm font-bold ${isRTL ? 'font-urdu' : ''}`}>{t('students')}</div>
            </div>
            <div className="group bg-white dark:bg-slate-800 rounded-xl p-4 md:p-6 border-2 border-amber-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="font-display text-2xl md:text-4xl font-extrabold text-teal-600 dark:text-cyan-400 mb-1">20+</div>
              <div className={`text-slate-700 dark:text-slate-300 text-xs md:text-sm font-bold ${isRTL ? 'font-urdu' : ''}`}>{t('scholars')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="relative z-10">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path 
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;