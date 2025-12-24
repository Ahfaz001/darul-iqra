import { Link } from "react-router-dom";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Facebook, 
  Youtube, 
  MessageCircle,
  ArrowUpRight,
  Heart,
  Sparkles
} from "lucide-react";
import madrasaLogo from "@/assets/madrasa-logo.jpg";

const Footer = () => {
  const quickLinks = [
    { name: "About Us", href: "#about" },
    { name: "Programs", href: "#programs" },
    { name: "Admissions", href: "#" },
    { name: "Student Portal", href: "/auth" },
    { name: "Contact", href: "#contact" },
  ];

  const programs = [
    { name: "Hifz-ul-Quran", href: "#" },
    { name: "Alim Course", href: "#" },
    { name: "Fazil Course", href: "#" },
    { name: "Arabic Language", href: "#" },
    { name: "Islamic Studies", href: "#" },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-primary to-navy-dark text-primary-foreground overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
      <div className="absolute inset-0 islamic-pattern opacity-10"></div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-secondary to-gold rounded-full blur-lg opacity-50"></div>
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-secondary/30 bg-card shadow-lg">
                  <img
                    src={madrasaLogo}
                    alt="Madrasa Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div>
                <h3 className="font-display font-bold text-lg leading-tight">Idarah Tarjumat-ul-Qur'an</h3>
                <p className="text-primary-foreground/70 text-sm flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-secondary" />
                  Wa Sunnah • KALYAN
                </p>
              </div>
            </div>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              Established in 2008, we are dedicated to providing authentic Islamic education 
              based on the Quran and Sunnah, nurturing the next generation of Muslim scholars.
            </p>
            <div className="flex gap-3">
              <a 
                href="#" 
                className="group w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center hover:bg-secondary hover:scale-110 transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 group-hover:text-secondary-foreground" />
              </a>
              <a 
                href="#" 
                className="group w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center hover:bg-secondary hover:scale-110 transition-all duration-300"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5 group-hover:text-secondary-foreground" />
              </a>
              <a 
                href="#" 
                className="group w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center hover:bg-secondary hover:scale-110 transition-all duration-300"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5 group-hover:text-secondary-foreground" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-6 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-gradient-to-r from-secondary to-gold rounded-full"></span>
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="group text-primary-foreground/70 hover:text-secondary transition-all duration-200 text-sm flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary/50 group-hover:bg-secondary transition-colors"></span>
                    {link.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-6 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-gradient-to-r from-secondary to-gold rounded-full"></span>
              Our Programs
            </h4>
            <ul className="space-y-3">
              {programs.map((program) => (
                <li key={program.name}>
                  <a
                    href={program.href}
                    className="group text-primary-foreground/70 hover:text-secondary transition-all duration-200 text-sm flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary/50 group-hover:bg-secondary transition-colors"></span>
                    {program.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-6 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-gradient-to-r from-secondary to-gold rounded-full"></span>
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-secondary/20 transition-colors">
                  <MapPin className="w-4 h-4 text-secondary" />
                </div>
                <span className="text-primary-foreground/80 text-sm pt-1">
                  Kalyan, Maharashtra, India
                </span>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-secondary/20 transition-colors">
                  <Phone className="w-4 h-4 text-secondary" />
                </div>
                <span className="text-primary-foreground/80 text-sm pt-1">
                  +91 XXXX XXXXXX
                </span>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-secondary/20 transition-colors">
                  <Mail className="w-4 h-4 text-secondary" />
                </div>
                <span className="text-primary-foreground/80 text-sm pt-1">
                  info@darululum-kalyan.edu
                </span>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-secondary/20 transition-colors">
                  <Clock className="w-4 h-4 text-secondary" />
                </div>
                <div className="text-primary-foreground/80 text-sm pt-1">
                  <p>Mon - Sat: 8:00 AM - 5:00 PM</p>
                  <p className="text-primary-foreground/60">Sunday: Closed</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 relative z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <p className="text-primary-foreground/60 flex items-center gap-1">
              © {new Date().getFullYear()} Idarah Tarjumat-ul-Qur'an Wa Sunnah Kalyan. Made with 
              <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
            </p>
            <div className="flex items-center gap-3">
              <span className="font-arabic text-xl bg-gradient-to-r from-secondary to-gold bg-clip-text text-transparent">
                بسم الله الرحمن الرحيم
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
