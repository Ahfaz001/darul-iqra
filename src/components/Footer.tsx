import { Link } from "react-router-dom";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Facebook, 
  Youtube, 
  MessageCircle 
} from "lucide-react";
import madrasaLogo from "@/assets/madrasa-logo.jpg";

const Footer = () => {
  const quickLinks = [
    { name: "About Us", href: "#about" },
    { name: "Programs", href: "#programs" },
    { name: "Admissions", href: "#" },
    { name: "Student Portal", href: "#" },
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
    <footer className="bg-primary text-primary-foreground islamic-pattern">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-secondary/30 bg-card shadow-soft">
                <img
                  src={madrasaLogo}
                  alt="Madrasa Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-display font-bold text-xl">Dar-ul-Ulum</h3>
                <p className="text-primary-foreground/70 text-sm">Al-Qur'an Wa Sunnah</p>
              </div>
            </div>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              Established in 2008, we are dedicated to providing authentic Islamic education 
              based on the Quran and Sunnah, nurturing the next generation of Muslim scholars.
            </p>
            <div className="flex gap-4">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-all duration-300"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-all duration-300"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-6 flex items-center gap-2">
              <span className="text-secondary">✦</span> Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-primary-foreground/70 hover:text-secondary transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-6 flex items-center gap-2">
              <span className="text-secondary">✦</span> Our Programs
            </h4>
            <ul className="space-y-3">
              {programs.map((program) => (
                <li key={program.name}>
                  <a
                    href={program.href}
                    className="text-primary-foreground/70 hover:text-secondary transition-colors duration-200 text-sm"
                  >
                    {program.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-6 flex items-center gap-2">
              <span className="text-secondary">✦</span> Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <span className="text-primary-foreground/80 text-sm">
                  Kalyan, Maharashtra, India
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-secondary shrink-0" />
                <span className="text-primary-foreground/80 text-sm">
                  +91 XXXX XXXXXX
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-secondary shrink-0" />
                <span className="text-primary-foreground/80 text-sm">
                  info@darululum-kalyan.edu
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <div className="text-primary-foreground/80 text-sm">
                  <p>Mon - Sat: 8:00 AM - 5:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-primary-foreground/60">
            <p>
              © {new Date().getFullYear()} Dar-ul-Ulum Al-Qur'an Wa Sunnah Kalyan. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              <span className="font-arabic text-lg">بسم الله الرحمن الرحيم</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
