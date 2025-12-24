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
      {/* Modern gradient background - Emerald to Teal */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 dark:from-emerald-900 dark:via-teal-900 dark:to-slate-900"
        style={{ transform: `translateY(${scrollY * 0.1}px)` }}
      ></div>
      
      {/* Mesh gradient overlay */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-emerald-500/20 via-transparent to-cyan-500/20"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-teal-600/10 to-emerald-900/30"></div>
      </div>
      
      {/* Animated orbs */}
      <div 
        className="absolute top-20 right-10 w-80 h-80 bg-gradient-to-br from-amber-400/30 to-orange-500/20 rounded-full blur-3xl animate-float"
        style={{ transform: `translateY(${scrollY * 0.3}px) translateX(${scrollY * -0.1}px)` }}
      ></div>
      <div 
        className="absolute bottom-40 left-10 w-96 h-96 bg-gradient-to-tr from-cyan-400/20 to-teal-300/10 rounded-full blur-3xl"
        style={{ transform: `translateY(${scrollY * 0.25}px) translateX(${scrollY * 0.05}px)` }}
      ></div>
      <div 
        className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-br from-emerald-300/20 to-green-400/10 rounded-full blur-3xl animate-pulse"
      ></div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}></div>

      <div className="container mx-auto px-4 pt-28 pb-16 relative z-10 flex-1 flex flex-col">
        {/* Logo at Top Center */}
        <div className="flex flex-col items-center mb-8 animate-fade-up">
          <div className="relative">
            {/* Multiple glow rings */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full blur-2xl scale-125 opacity-40"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-amber-300 to-yellow-400 rounded-full blur-xl scale-110 opacity-30 animate-pulse"></div>
            
            {/* Logo container */}
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-amber-400/60 shadow-2xl ring-4 ring-white/10">
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
          {/* Arabic Bismillah */}
          <div className="animate-fade-up mb-6">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full border border-white/20">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="font-arabic text-xl md:text-2xl text-amber-300">
                {t('bismillah')}
              </span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
          </div>

          {/* Main Heading */}
          <div className="space-y-4 animate-fade-up delay-100 mb-6">
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-lg">
              {t('instituteName')}
              <span className="block bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-400 bg-clip-text text-transparent mt-2">
                {t('waSunnah')}
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 font-urdu">
              {t('instituteUrdu')}
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent"></div>
              <p className="text-base text-amber-300/90 font-arabic">
                {t('obeySunnah')}
              </p>
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent"></div>
            </div>
            <p className="text-white/60 text-sm md:text-base flex items-center justify-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400/60"></span>
              {t('location')}
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400/60"></span>
            </p>
          </div>

          {/* Description */}
          <p className={`text-white/70 text-base md:text-lg max-w-2xl mx-auto animate-fade-up delay-200 mb-8 leading-relaxed ${isRTL ? 'font-urdu' : ''}`}>
            {t('heroDescription')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up delay-300 mb-10">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 hover:from-amber-500 hover:to-orange-600 shadow-lg hover:shadow-xl hover:shadow-amber-500/25 transition-all duration-300 gap-2 text-base px-8 py-6 font-semibold"
            >
              <GraduationCap className="w-5 h-5" />
              {t('enrollNow')}
              <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-white/30 text-white bg-white/5 hover:bg-white/15 hover:border-white/50 backdrop-blur-sm gap-2 text-base px-8 py-6 transition-all duration-300"
            >
              <BookOpen className="w-5 h-5" />
              {t('learnMore')}
            </Button>
          </div>

          {/* Stats - Glassmorphism Cards */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 w-full max-w-2xl animate-fade-up delay-400">
            <div className="group bg-white/10 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-white/20 hover:bg-white/20 hover:border-amber-400/30 transition-all duration-300 hover:-translate-y-1">
              <div className="font-display text-2xl md:text-4xl font-bold bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent mb-1">17+</div>
              <div className={`text-white/60 text-xs md:text-sm ${isRTL ? 'font-urdu' : ''}`}>{t('yearsLegacy')}</div>
            </div>
            <div className="group bg-white/10 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-white/20 hover:bg-white/20 hover:border-amber-400/30 transition-all duration-300 hover:-translate-y-1">
              <div className="font-display text-2xl md:text-4xl font-bold bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent mb-1">500+</div>
              <div className={`text-white/60 text-xs md:text-sm ${isRTL ? 'font-urdu' : ''}`}>{t('students')}</div>
            </div>
            <div className="group bg-white/10 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-white/20 hover:bg-white/20 hover:border-amber-400/30 transition-all duration-300 hover:-translate-y-1">
              <div className="font-display text-2xl md:text-4xl font-bold bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent mb-1">20+</div>
              <div className={`text-white/60 text-xs md:text-sm ${isRTL ? 'font-urdu' : ''}`}>{t('scholars')}</div>
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
