import { ArrowRight, BookOpen, Users, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import madrasaLogo from "@/assets/madrasa-logo.jpg";

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background with pattern */}
      <div className="absolute inset-0 hero-gradient"></div>
      <div className="absolute inset-0 islamic-pattern opacity-30"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-gold/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 pt-24 pb-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content Side */}
          <div className="text-center lg:text-left space-y-8">
            {/* Arabic Bismillah */}
            <div className="animate-fade-up">
              <span className="font-arabic text-3xl text-secondary/90 block mb-4">
                بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ
              </span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4 animate-fade-up delay-100">
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight">
                Dar-ul-Ulum
                <span className="block text-secondary">Al-Qur'an Wa Sunnah</span>
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/80 font-urdu">
                ادارہ ترجمۃ القرآن والسنۃ - کلیان
              </p>
            </div>

            {/* Description */}
            <p className="text-primary-foreground/70 text-lg max-w-xl mx-auto lg:mx-0 animate-fade-up delay-200">
              Nurturing minds with authentic Islamic education since 2008. 
              We provide comprehensive Quranic studies, Hadith sciences, 
              and Arabic language programs for students of all ages.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-up delay-300">
              <Button 
                size="lg" 
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-glow gap-2 text-base px-8"
              >
                <GraduationCap className="w-5 h-5" />
                Enroll Now
                <ArrowRight className="w-4 h-4" />
              </Button>
            <Button 
                size="lg" 
                variant="outline" 
                className="border-primary-foreground/50 text-primary-foreground bg-primary-foreground/5 hover:bg-primary-foreground/20 gap-2 text-base px-8"
              >
                <BookOpen className="w-5 h-5" />
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 animate-fade-up delay-400">
              <div className="text-center lg:text-left">
                <div className="font-display text-3xl md:text-4xl font-bold text-secondary">17+</div>
                <div className="text-primary-foreground/60 text-sm">Years Legacy</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="font-display text-3xl md:text-4xl font-bold text-secondary">500+</div>
                <div className="text-primary-foreground/60 text-sm">Students</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="font-display text-3xl md:text-4xl font-bold text-secondary">20+</div>
                <div className="text-primary-foreground/60 text-sm">Scholars</div>
              </div>
            </div>
          </div>

          {/* Logo Side */}
          <div className="flex justify-center lg:justify-end animate-fade-up delay-200">
            <div className="relative">
              {/* Glow effect behind logo */}
              <div className="absolute inset-0 bg-secondary/20 rounded-full blur-3xl scale-75"></div>
              
              {/* Logo container */}
              <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden border-4 border-secondary/30 shadow-elevated animate-float">
                <img
                  src={madrasaLogo}
                  alt="Dar-ul-Ulum Al-Qur'an Wa Sunnah Kalyan Logo"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Decorative rings */}
              <div className="absolute inset-0 rounded-full border-2 border-secondary/20 scale-110 animate-pulse"></div>
              <div className="absolute inset-0 rounded-full border border-secondary/10 scale-125"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path 
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
            fill="hsl(45, 30%, 97%)"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
