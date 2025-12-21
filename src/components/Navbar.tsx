import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Globe, User, BookOpen, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import madrasaLogo from "@/assets/madrasa-logo.jpg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, role, signOut } = useAuth();
  const { language, setLanguage, t, isRTL } = useLanguage();
  const navigate = useNavigate();

  const navLinks = [
    { name: t('home'), href: "#home" },
    { name: t('about'), href: "#about" },
    { name: t('programs'), href: "#programs" },
    { name: t('features'), href: "#features" },
    { name: t('contact'), href: "#contact" },
  ];

  const languages: { code: Language; name: string; label: string }[] = [
    { code: "en", name: "English", label: "EN" },
    { code: "ur", name: "اردو", label: "UR" },
    { code: "roman", name: "Roman Urdu", label: "RU" },
  ];

  const currentLangLabel = languages.find(l => l.code === language)?.label || "EN";
  const currentLangName = languages.find(l => l.code === language)?.name || "English";

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Only students go to dashboard from landing page
  const handlePortalClick = () => {
    if (user) {
      if (role === 'student') {
        navigate('/dashboard');
      } else {
        // Admin/teacher should use /admin directly, not from landing
        navigate('/dashboard');
      }
    } else {
      navigate('/auth');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-soft">
      <div className="container mx-auto px-4">
        <div className={`flex items-center justify-between h-20 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* Logo */}
          <Link to="/" className={`flex items-center gap-3 group ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary/20 shadow-soft group-hover:border-secondary transition-colors duration-300">
              <img
                src={madrasaLogo}
                alt="Idarah Tarjumat-ul-Qur'an Wa Sunnah Kalyan"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-display font-semibold text-foreground text-base leading-tight">
                Idarah Tarjumat-ul-Qur'an
              </h1>
              <p className="text-xs text-muted-foreground">Wa Sunnah • Kalyan</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className={`hidden lg:flex items-center gap-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-foreground/80 hover:text-primary font-medium transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-secondary hover:after:w-full after:transition-all after:duration-300 ${isRTL ? 'font-urdu' : ''}`}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className={`hidden lg:flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 text-foreground/80 hover:text-primary">
                  <Globe className="w-4 h-4" />
                  <span className="text-sm font-medium">{currentLangLabel}</span>
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[160px]">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`cursor-pointer justify-between ${language === lang.code ? 'bg-primary/10 text-primary' : ''} ${lang.code === "ur" ? "font-urdu text-right" : ""}`}
                  >
                    <span>{lang.name}</span>
                    <span className="text-xs text-muted-foreground">{lang.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {user ? (
              <>
                <Button 
                  size="sm" 
                  className="gap-2 bg-primary hover:bg-primary/90 shadow-soft"
                  onClick={handlePortalClick}
                >
                  <BookOpen className="w-4 h-4" />
                  {isRTL ? t('studentPortal') : 'Student Portal'}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2 border-primary/30 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4" />
                  {t('logout')}
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2 border-primary/30 hover:bg-primary hover:text-primary-foreground"
                  onClick={() => navigate('/auth')}
                >
                  <User className="w-4 h-4" />
                  {t('login')}
                </Button>
                <Button 
                  size="sm" 
                  className="gap-2 bg-primary hover:bg-primary/90 shadow-soft"
                  onClick={() => navigate('/auth')}
                >
                  <BookOpen className="w-4 h-4" />
                  {t('studentPortal')}
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 text-foreground/80 hover:text-primary hover:bg-muted/50 rounded-lg transition-colors ${isRTL ? 'text-right font-urdu' : ''}`}
                >
                  {link.name}
                </a>
              ))}
              
              {/* Mobile Language Switcher */}
              <div className="px-4 py-3">
                <p className="text-sm text-muted-foreground mb-2">Language / زبان</p>
                <div className="flex gap-2">
                  {languages.map((lang) => (
                    <Button
                      key={lang.code}
                      variant={language === lang.code ? "default" : "outline"}
                      size="sm"
                      onClick={() => setLanguage(lang.code)}
                      className={`flex-1 ${lang.code === "ur" ? "font-urdu" : ""}`}
                    >
                      {lang.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="border-t border-border my-2"></div>
              <div className="flex flex-col gap-2 px-4">
                {user ? (
                  <>
                    <Button 
                      className="w-full justify-center gap-2 bg-primary"
                      onClick={() => {
                        handlePortalClick();
                        setIsOpen(false);
                      }}
                    >
                      <BookOpen className="w-4 h-4" />
                      {t('studentPortal')}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-center gap-2"
                      onClick={() => {
                        handleSignOut();
                        setIsOpen(false);
                      }}
                    >
                      <LogOut className="w-4 h-4" />
                      {t('logout')}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="outline" 
                      className="w-full justify-center gap-2"
                      onClick={() => {
                        navigate('/auth');
                        setIsOpen(false);
                      }}
                    >
                      <User className="w-4 h-4" />
                      {t('login')}
                    </Button>
                    <Button 
                      className="w-full justify-center gap-2 bg-primary"
                      onClick={() => {
                        navigate('/auth');
                        setIsOpen(false);
                      }}
                    >
                      <BookOpen className="w-4 h-4" />
                      {t('studentPortal')}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
