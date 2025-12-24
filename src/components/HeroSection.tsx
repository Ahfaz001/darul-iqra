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
      {/* Clean Turquoise gradient background */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-teal-400 to-turquoise-500 dark:from-cyan-800 dark:via-teal-800 dark:to-slate-900"
        style={{ transform: `translateY(${scrollY * 0.1}px)` }}
      ></div>
      
      {/* Subtle overlay for depth - NO blur */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-cyan-600/20 dark:from-black/20 dark:to-teal-900/40"></div>
      
      {/* Decorative circles - NO blur */}
      <div 
        className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-amber-300/40 to-orange-400/30 rounded-full animate-float"
        style={{ transform: `translateY(${scrollY * 0.3}px) translateX(${scrollY * -0.1}px)` }}
      ></div>
      <div 
        className="absolute bottom-40 left-10 w-80 h-80 bg-gradient-to-tr from-white/30 to-cyan-200/20 rounded-full"
        style={{ transform: `translateY(${scrollY * 0.25}px) translateX(${scrollY * 0.05}px)` }}
      ></div>
      <div 
        className="absolute top-1/3 left-1/4 w-56 h-56 bg-gradient-to-br from-teal-200/30 to-cyan-300/20 rounded-full animate-pulse"
      ></div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.5'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}></div>

      <div className="container mx-auto px-4 pt-28 pb-16 relative z-10 flex-1 flex flex-col">
        {/* Logo at Top Center - CLEAR, NO blur */}
        <div className="flex flex-col items-center mb-8 animate-fade-up">
          <div className="relative">
            {/* Clean glow effect - NO blur */}
            <div className="absolute -inset-4 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full opacity-50 animate-pulse"></div>
            
            {/* Logo container - SHARP & CLEAR */}
            <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden border-4 border-white shadow-2xl ring-4 ring-amber-400/50">
              <img
                src={madrasaLogo}
                alt="Dar-ul-Ulum Al-Qur'an Wa Sunnah Kalyan Logo"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Decorative ring */}
            <div className="absolute inset-0 rounded-full border-2 border-amber-400/40 scale-150 animate-ping opacity-20"></div>
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

          {/* Main Heading - Clear text with shadow for readability */}
          <div className="space-y-4 animate-fade-up delay-100 mb-6">
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-xl">
              {t('instituteName')}
              <span className="block bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-400 bg-clip-text text-transparent mt-2 drop-shadow-none">
                {t('waSunnah')}
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white font-urdu drop-shadow-lg">
              {t('instituteUrdu')}
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="h-1 w-20 bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-full"></div>
              <p className="text-base text-amber-200 font-arabic drop-shadow-md">
                {t('obeySunnah')}
              </p>
              <div className="h-1 w-20 bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-full"></div>
            </div>
            <p className="text-white/90 text-sm md:text-base flex items-center justify-center gap-2 drop-shadow-md">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400"></span>
              {t('location')}
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400"></span>
            </p>
          </div>

          {/* Description */}
          <p className={`text-white/95 text-base md:text-lg max-w-2xl mx-auto animate-fade-up delay-200 mb-8 leading-relaxed drop-shadow-md ${isRTL ? 'font-urdu' : ''}`}>
            {t('heroDescription')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up delay-300 mb-10">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 hover:from-amber-500 hover:to-orange-600 shadow-xl hover:shadow-2xl hover:shadow-amber-500/30 transition-all duration-300 gap-2 text-base px-8 py-6 font-bold border-2 border-white/50"
            >
              <GraduationCap className="w-5 h-5" />
              {t('enrollNow')}
              <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-3 border-white text-white bg-white/20 hover:bg-white/40 hover:text-teal-800 gap-2 text-base px-8 py-6 transition-all duration-300 font-semibold shadow-lg"
            >
              <BookOpen className="w-5 h-5" />
              {t('learnMore')}
            </Button>
          </div>

          {/* Stats - Clean solid cards, NO blur */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 w-full max-w-2xl animate-fade-up delay-400">
            <div className="group bg-white/95 dark:bg-slate-800/95 rounded-2xl p-4 md:p-6 border-2 border-amber-400/50 shadow-xl hover:shadow-2xl hover:border-amber-400 transition-all duration-300 hover:-translate-y-2">
              <div className="font-display text-2xl md:text-4xl font-bold text-teal-600 dark:text-cyan-400 mb-1">17+</div>
              <div className={`text-teal-700/80 dark:text-cyan-300/80 text-xs md:text-sm font-medium ${isRTL ? 'font-urdu' : ''}`}>{t('yearsLegacy')}</div>
            </div>
            <div className="group bg-white/95 dark:bg-slate-800/95 rounded-2xl p-4 md:p-6 border-2 border-amber-400/50 shadow-xl hover:shadow-2xl hover:border-amber-400 transition-all duration-300 hover:-translate-y-2">
              <div className="font-display text-2xl md:text-4xl font-bold text-teal-600 dark:text-cyan-400 mb-1">500+</div>
              <div className={`text-teal-700/80 dark:text-cyan-300/80 text-xs md:text-sm font-medium ${isRTL ? 'font-urdu' : ''}`}>{t('students')}</div>
            </div>
            <div className="group bg-white/95 dark:bg-slate-800/95 rounded-2xl p-4 md:p-6 border-2 border-amber-400/50 shadow-xl hover:shadow-2xl hover:border-amber-400 transition-all duration-300 hover:-translate-y-2">
              <div className="font-display text-2xl md:text-4xl font-bold text-teal-600 dark:text-cyan-400 mb-1">20+</div>
              <div className={`text-teal-700/80 dark:text-cyan-300/80 text-xs md:text-sm font-medium ${isRTL ? 'font-urdu' : ''}`}>{t('scholars')}</div>
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