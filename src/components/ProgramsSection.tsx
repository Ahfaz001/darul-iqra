import { GraduationCap, BookMarked, Languages, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const programs = [
  {
    icon: GraduationCap,
    title: "Hifz-ul-Quran",
    duration: "3-4 Years",
    description: "Complete memorization of the Holy Quran with Tajweed under qualified Huffaz.",
    features: ["Full Quran memorization", "Tajweed certification", "Regular revision classes"],
    color: "primary",
  },
  {
    icon: BookMarked,
    title: "Alim Course",
    duration: "6 Years",
    description: "Comprehensive Islamic scholarship program covering Hadith, Fiqh, Tafseer, and Arabic.",
    features: ["Hadith Sciences", "Islamic Jurisprudence", "Quranic Exegesis"],
    color: "secondary",
  },
  {
    icon: Languages,
    title: "Arabic Language",
    duration: "2 Years",
    description: "Master classical and modern Arabic for understanding Islamic texts.",
    features: ["Grammar & Morphology", "Classical texts", "Conversation skills"],
    color: "accent",
  },
  {
    icon: Clock,
    title: "Evening Classes",
    duration: "Flexible",
    description: "Part-time Islamic studies for working professionals and school students.",
    features: ["After school hours", "Weekend batches", "Basic Islamic knowledge"],
    color: "emerald",
  },
];

const ProgramsSection = () => {
  return (
    <section id="programs" className="py-24 bg-background relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-pattern"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4">
            ✦ Our Programs
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Paths to Islamic Knowledge
          </h2>
          <p className="text-muted-foreground text-lg">
            Choose from our range of comprehensive programs designed to build 
            a strong foundation in Islamic sciences.
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {programs.map((program, index) => (
            <div
              key={program.title}
              className="group relative bg-card rounded-2xl overflow-hidden shadow-card border border-border card-hover"
            >
              {/* Top accent bar */}
              <div className={`h-2 ${
                program.color === 'primary' ? 'bg-primary' :
                program.color === 'secondary' ? 'bg-secondary' :
                program.color === 'accent' ? 'bg-accent' : 'bg-emerald'
              }`}></div>

              <div className="p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                    program.color === 'primary' ? 'bg-primary/10' :
                    program.color === 'secondary' ? 'bg-secondary/20' :
                    program.color === 'accent' ? 'bg-accent/30' : 'bg-emerald/10'
                  }`}>
                    <program.icon className={`w-7 h-7 ${
                      program.color === 'primary' ? 'text-primary' :
                      program.color === 'secondary' ? 'text-secondary' :
                      program.color === 'accent' ? 'text-accent-foreground' : 'text-emerald'
                    }`} />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm font-medium">
                    {program.duration}
                  </span>
                </div>

                {/* Content */}
                <h3 className="font-display text-2xl font-bold text-foreground mb-3">
                  {program.title}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {program.description}
                </p>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {program.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button 
                  variant="outline" 
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300"
                >
                  Learn More
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection;
