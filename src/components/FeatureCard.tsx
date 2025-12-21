import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }: FeatureCardProps) => {
  return (
    <div 
      className="group relative bg-card rounded-xl p-8 shadow-card border border-border/50 card-hover overflow-hidden"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Decorative corner */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-gold opacity-10 rounded-bl-[100%] group-hover:opacity-20 transition-opacity duration-300"></div>
      
      {/* Icon container */}
      <div className="relative w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:shadow-soft transition-all duration-300">
        <Icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
      </div>

      {/* Content */}
      <h3 className="font-display font-semibold text-xl text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
        {title}
      </h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
    </div>
  );
};

export default FeatureCard;
