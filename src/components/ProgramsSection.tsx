import { BookOpen, BookMarked, ScrollText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/hooks/use-scroll-animation";
import { useNavigate } from "react-router-dom";

const programs = [
  {
    icon: BookOpen,
    title: "Ilm e Qur'an",
    duration: "5 Years",
    description: "Comprehensive Quranic education with translation, Tafseer, and Arabic grammar.",
    features: [
      "Qur'an word to word Translation & Tafseer",
      "Arabic Grammar",
      "Tajweed",
      "Hifz 30th Parah & Other Selected Surah"
    ],
    color: "primary",
  },
  {
    icon: BookMarked,
    title: "Ilm e Hadees",
    duration: "5 Years",
    description: "Study of Hadith sciences with sharah and word to word translation.",
    features: [
      "Bulugul Maram",
      "Riyaz us Sawliheen (Sharah & word to word Translation)",
      "Hifz e Hadees - 115 with meaning"
    ],
    color: "secondary",
  },
  {
    icon: ScrollText,
    title: "Other Subjects",
    duration: "5 Years",
    description: "Additional Islamic sciences including Aqeedah, Seerat, and Du'a memorization.",
    features: [
      "Aqeeday e Tawheed",
      "Seerat e Nabwi ﷺ",
      "Seerat e Sahaba & Sahabiyat",
      "Hifz e Du'a",
      "Saheeh Tarikhe Islam",
      "Minhaaj ul Arbia"
    ],
    color: "accent",
  },
];

const ProgramsSection = () => {
  const navigate = useNavigate();
  
  return (
    <section id="programs" className="py-24 bg-background relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-pattern"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <AnimatedSection animation="fade-up" className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
            ✦ Uloom e Shari'ah Course
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            "Uloom e Shari'ah Course"
          </h2>
          <p className="text-muted-foreground text-lg mb-4">
            For Females Only | Mode: Offline Only | Duration: 5 Years | Fee: Free
          </p>
          <p className="text-sm text-muted-foreground">
            Time: 4:30 to 6:00 PM | Instructor: Alimah Aayesha Muneer Khan
          </p>
        </AnimatedSection>

        {/* Programs Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {programs.map((program, index) => (
            <AnimatedSection
              key={program.title}
              animation="fade-up"
              delay={index * 100}
            >
              <div className="group relative bg-card rounded-2xl overflow-hidden shadow-card border border-border card-hover h-full">
                {/* Top accent bar */}
                <div className={`h-2 ${
                  program.color === 'primary' ? 'bg-primary' :
                  program.color === 'secondary' ? 'bg-secondary' :
                  'bg-accent'
                }`}></div>

                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      program.color === 'primary' ? 'bg-primary/10' :
                      program.color === 'secondary' ? 'bg-secondary/20' :
                      'bg-accent/30'
                    }`}>
                      <program.icon className={`w-6 h-6 ${
                        program.color === 'primary' ? 'text-primary' :
                        program.color === 'secondary' ? 'text-secondary' :
                        'text-accent-foreground'
                      }`} />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="font-display text-xl font-bold text-foreground mb-2">
                    {program.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {program.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2">
                    {program.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
        
        {/* Apply Button */}
        <AnimatedSection animation="fade-up" delay={400} className="text-center mt-12">
          <Button 
            size="lg"
            onClick={() => navigate('/admission')}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 shadow-xl"
          >
            Apply for Admission
          </Button>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default ProgramsSection;
