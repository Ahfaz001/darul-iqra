import { ArrowRight, BookOpen, Sparkles, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import madrasaLogo from "@/assets/madrasa-logo.jpg";
import { useEffect, useState } from "react";

const HeroSection = () => {
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
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

      <div className="container mx-auto px-3 sm:px-4 pt-24 sm:pt-28 pb-12 sm:pb-16 relative z-10 flex-1 flex flex-col">
        {/* Logo at Top Center - Circular, responsive sizing */}
        <div className="flex flex-col items-center mb-6 sm:mb-8 animate-fade-up">
          <div className="w-28 h-28 xs:w-32 xs:h-32 sm:w-40 sm:h-40 md:w-52 md:h-52 rounded-full overflow-hidden border-3 sm:border-4 border-white shadow-2xl">
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
          <div className="animate-fade-up mb-4 sm:mb-6">
            <div className="inline-flex items-center gap-2 sm:gap-3 bg-white/90 dark:bg-slate-800/90 px-4 sm:px-6 py-2 sm:py-3 rounded-full border-2 border-amber-400 shadow-lg">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-amber-500" />
              <span className="font-arabic text-base sm:text-xl md:text-2xl text-teal-700 dark:text-amber-400">
                {t('bismillah')}
              </span>
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-amber-500" />
            </div>
          </div>

          {/* Main Heading - Bold vibrant colors with responsive sizing */}
          <div className="space-y-3 sm:space-y-4 animate-fade-up delay-100 mb-4 sm:mb-6">
            <h1 className="font-display text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight px-2">
              <span className="text-slate-900 dark:text-white drop-shadow-lg">{t('instituteName')}</span>
              <span className="block text-amber-500 dark:text-amber-400 mt-1 sm:mt-2">
                {t('waSunnah')}
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-slate-800 dark:text-cyan-100 font-urdu font-bold px-2">
              {t('instituteUrdu')}
            </p>
            <div className="flex items-center justify-center gap-2 sm:gap-3 px-2">
              <div className="h-0.5 sm:h-1 w-10 sm:w-16 bg-amber-500 dark:bg-amber-400 rounded-full"></div>
              <p className="text-sm sm:text-base text-slate-700 dark:text-amber-300 font-arabic font-semibold">
                {t('obeySunnah')}
              </p>
              <div className="h-0.5 sm:h-1 w-10 sm:w-16 bg-amber-500 dark:bg-amber-400 rounded-full"></div>
            </div>
            <p className="text-slate-700 dark:text-cyan-200 text-xs sm:text-sm md:text-base flex items-center justify-center gap-1 sm:gap-2 font-medium">
              <span className="inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-amber-500"></span>
              {t('location')}
              <span className="inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-amber-500"></span>
            </p>
          </div>

          {/* Description */}
          <p className={`text-slate-700 dark:text-cyan-100 text-sm sm:text-base md:text-lg max-w-2xl mx-auto animate-fade-up delay-200 mb-6 sm:mb-8 leading-relaxed font-medium px-2 ${isRTL ? 'font-urdu' : ''}`}>
            {t('heroDescription')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-fade-up delay-300 mb-8 sm:mb-10 w-full px-4 sm:px-0">
            <Button 
              size="lg" 
              onClick={() => navigate('/admission')}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 shadow-xl hover:shadow-2xl transition-all duration-300 gap-2 text-sm sm:text-base px-6 sm:px-8 py-5 sm:py-6 font-bold w-full sm:w-auto"
            >
              <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
              Apply for Admission
              <ArrowRight className={`w-3 h-3 sm:w-4 sm:h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-slate-800 dark:border-white text-slate-800 dark:text-white bg-white/50 dark:bg-white/10 hover:bg-slate-800 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 gap-2 text-sm sm:text-base px-6 sm:px-8 py-5 sm:py-6 transition-all duration-300 font-bold w-full sm:w-auto"
            >
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
              {t('learnMore')}
            </Button>
          </div>

          {/* Stats - Clean solid cards with responsive sizing */}
          <div className="grid grid-cols-3 gap-2 xs:gap-3 sm:gap-4 md:gap-8 w-full max-w-2xl animate-fade-up delay-400 px-2 sm:px-0">
            <div className="group bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl p-2 xs:p-3 sm:p-4 md:p-6 border-2 border-amber-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="font-display text-lg xs:text-xl sm:text-2xl md:text-4xl font-extrabold text-teal-600 dark:text-cyan-400 mb-0.5 sm:mb-1">17+</div>
              <div className={`text-slate-700 dark:text-slate-300 text-[10px] xs:text-xs md:text-sm font-bold ${isRTL ? 'font-urdu' : ''}`}>{t('yearsLegacy')}</div>
            </div>
            <div className="group bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl p-2 xs:p-3 sm:p-4 md:p-6 border-2 border-amber-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="font-display text-lg xs:text-xl sm:text-2xl md:text-4xl font-extrabold text-teal-600 dark:text-cyan-400 mb-0.5 sm:mb-1">500+</div>
              <div className={`text-slate-700 dark:text-slate-300 text-[10px] xs:text-xs md:text-sm font-bold ${isRTL ? 'font-urdu' : ''}`}>{t('students')}</div>
            </div>
            <div className="group bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl p-2 xs:p-3 sm:p-4 md:p-6 border-2 border-amber-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="font-display text-lg xs:text-xl sm:text-2xl md:text-4xl font-extrabold text-teal-600 dark:text-cyan-400 mb-0.5 sm:mb-1">20+</div>
              <div className={`text-slate-700 dark:text-slate-300 text-[10px] xs:text-xs md:text-sm font-bold ${isRTL ? 'font-urdu' : ''}`}>{t('scholars')}</div>
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