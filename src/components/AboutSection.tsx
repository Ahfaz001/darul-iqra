import { CheckCircle, BookOpen, Star, Users } from "lucide-react";
import { AnimatedSection, StaggeredChildren } from "@/hooks/use-scroll-animation";

const AboutSection = () => {
  const highlights = [
    "Authentic Islamic Education based on Quran & Sunnah",
    "Qualified scholars with traditional Ijazah certification",
    "Modern facilities with digital learning tools",
    "Separate classes for male and female students",
    "Affordable fees with scholarship programs",
    "Multilingual instruction in Urdu, Hindi & English",
  ];

  return (
    <section id="about" className="py-24 bg-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 islamic-pattern opacity-50"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <AnimatedSection animation="fade-up">
              <span className="inline-block px-4 py-2 rounded-full bg-secondary/20 text-secondary-foreground font-medium text-sm mb-4">
                ✦ About Us
              </span>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                A Legacy of 
                <span className="text-primary"> Islamic Knowledge</span>
              </h2>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={100}>
              <div className="space-y-4 text-muted-foreground">
                <p className="text-lg leading-relaxed">
                  <strong className="text-foreground">Idarah Tarjumat-ul-Qur'an Wa Sunnah</strong>, 
                  established in 2008 in Kalyan, Maharashtra, is dedicated to providing authentic 
                  Islamic education rooted in the teachings of the Holy Quran and the Sunnah of 
                  Prophet Muhammad (ﷺ).
                </p>
                <p className="leading-relaxed">
                  Our institution offers comprehensive programs including Hifz-ul-Quran, Alim & 
                  Fazil courses, Arabic language studies, and Islamic jurisprudence. We combine 
                  traditional teaching methodologies with modern educational tools to nurture 
                  well-rounded Muslim scholars.
                </p>
              </div>
            </AnimatedSection>

            {/* Highlights */}
            <StaggeredChildren className="grid sm:grid-cols-2 gap-3" staggerDelay={80}>
              {highlights.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-sm text-foreground">{item}</span>
                </div>
              ))}
            </StaggeredChildren>
          </div>

          {/* Right Side - Stats Cards */}
          <div className="grid grid-cols-2 gap-6">
            <AnimatedSection animation="scale-up" delay={0}>
              <div className="bg-card rounded-2xl p-8 shadow-card border border-border card-hover">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div className="font-display text-4xl font-bold text-foreground mb-2">2008</div>
                <p className="text-muted-foreground text-sm">Year Established</p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="scale-up" delay={100}>
              <div className="bg-card rounded-2xl p-8 shadow-card border border-border card-hover mt-8">
                <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-secondary" />
                </div>
                <div className="font-display text-4xl font-bold text-foreground mb-2">500+</div>
                <p className="text-muted-foreground text-sm">Students Enrolled</p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="scale-up" delay={200}>
              <div className="bg-card rounded-2xl p-8 shadow-card border border-border card-hover">
                <div className="w-12 h-12 rounded-xl bg-accent/30 flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-accent-foreground" />
                </div>
                <div className="font-display text-4xl font-bold text-foreground mb-2">50+</div>
                <p className="text-muted-foreground text-sm">Huffaz Graduated</p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="scale-up" delay={300}>
              <div className="bg-primary rounded-2xl p-8 shadow-card card-hover mt-8">
                <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center mb-4">
                  <span className="font-arabic text-2xl text-primary-foreground">القرآن</span>
                </div>
                <div className="font-display text-4xl font-bold text-primary-foreground mb-2">20+</div>
                <p className="text-primary-foreground/70 text-sm">Qualified Teachers</p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
