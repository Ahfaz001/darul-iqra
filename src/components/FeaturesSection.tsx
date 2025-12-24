import { BookOpen, Users, Calendar, Award, Heart, Sparkles } from "lucide-react";
import FeatureCard from "./FeatureCard";
import { AnimatedSection } from "@/hooks/use-scroll-animation";

const features = [
  {
    icon: BookOpen,
    title: "Quranic Studies",
    description: "Comprehensive Hifz and Tajweed programs with certified teachers, helping students memorize and understand the Holy Quran.",
  },
  {
    icon: Users,
    title: "Student Portal",
    description: "Access exam papers, attendance records, and learning materials through our digital platform with multilingual support.",
  },
  {
    icon: Calendar,
    title: "Attendance Tracking",
    description: "Real-time attendance management system for parents and administrators to monitor student participation.",
  },
  {
    icon: Award,
    title: "Examinations",
    description: "Online MCQ tests and downloadable PDF papers with instant results and performance analytics.",
  },
  {
    icon: Heart,
    title: "Hadith Collection",
    description: "Access authentic Hadiths with translations in English, Urdu, and Roman Urdu for daily spiritual guidance.",
  },
  {
    icon: Sparkles,
    title: "PDF Converter",
    description: "Convert Urdu documents to Roman Urdu using AI-powered transliteration for easier reading.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-background islamic-pattern relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <AnimatedSection animation="fade-up" className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
            ✦ Our Features
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Empowering Islamic Education
          </h2>
          <p className="text-muted-foreground text-lg">
            Modern digital tools combined with traditional Islamic values to provide 
            a comprehensive learning experience for our students and parents.
          </p>
        </AnimatedSection>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <AnimatedSection
              key={feature.title}
              animation="scale-up"
              delay={index * 100}
            >
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={0}
              />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
