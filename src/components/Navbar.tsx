import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Globe, User, BookOpen, LogOut, ChevronDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import ThemeToggle from "@/components/ThemeToggle";
import madrasaLogo from "@/assets/madrasa-logo.jpg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, role, signOut } = useAuth();
  const { language, setLanguage, t, isRTL } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handlePortalClick = () => {
    if (user) {
      if (role === 'student') {
        navigate('/dashboard');
      } else {
        navigate('/dashboard');
      }
    } else {
      navigate('/auth');
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-card/95 backdrop-blur-xl border-b border-border shadow-lg' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className={`flex items-center justify-between h-20 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* Logo */}
          <Link to="/" className={`flex items-center gap-2 sm:gap-3 group ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-amber-500 shadow-lg flex-shrink-0">
              <img
                src={madrasaLogo}
                alt="Idarah Tarjumat-ul-Qur'an Wa Sunnah Kalyan"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <h1 className={`font-display font-semibold text-xs sm:text-sm md:text-base leading-tight ${scrolled ? 'text-foreground' : 'text-slate-800 dark:text-white'}`}>
                <span className="hidden xs:inline">Idarah </span>Tarjumat-ul-Qur'an
              </h1>
              <p className={`text-[10px] sm:text-xs flex items-center gap-1 ${scrolled ? 'text-muted-foreground' : 'text-slate-600 dark:text-white/70'}`}>
                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-secondary" />
                Wa Sunnah • Kalyan
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className={`hidden lg:flex items-center gap-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`font-medium transition-all duration-300 relative group ${
                  scrolled ? 'text-foreground/80 hover:text-primary' : 'text-slate-800 dark:text-white/90 hover:text-teal-600 dark:hover:text-white'
                } ${isRTL ? 'font-urdu' : ''}`}
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-secondary group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className={`hidden lg:flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`gap-2 ${scrolled ? 'text-foreground/80 hover:text-primary' : 'text-slate-800 dark:text-white/90 hover:text-teal-600 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/10'}`}
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-sm font-medium">{currentLangLabel}</span>
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[160px] bg-card/95 backdrop-blur-xl border-border">
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
                  className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg"
                  onClick={handlePortalClick}
                >
                  <BookOpen className="w-4 h-4" />
                  {isRTL ? t('studentPortal') : 'Portal'}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`gap-2 ${scrolled ? 'border-border hover:bg-destructive hover:text-destructive-foreground hover:border-destructive' : 'border-slate-600 dark:border-white/30 text-slate-800 dark:text-white hover:bg-slate-200/50 dark:hover:bg-white/10'}`}
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`gap-2 ${scrolled ? 'border-border hover:bg-primary hover:text-primary-foreground' : 'border-slate-600 dark:border-white/30 text-slate-800 dark:text-white hover:bg-slate-200/50 dark:hover:bg-white/10'}`}
                  onClick={() => navigate('/auth')}
                >
                  <User className="w-4 h-4" />
                  {t('login')}
                </Button>
                <Button 
                  size="sm" 
                  className="gap-2 bg-gradient-to-r from-secondary to-gold hover:from-secondary/90 hover:to-gold/90 text-secondary-foreground shadow-lg"
                  onClick={() => navigate('/auth')}
                >
                  <BookOpen className="w-4 h-4" />
                  {t('studentPortal')}
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-lg transition-colors ${scrolled ? 'hover:bg-muted' : 'hover:bg-slate-200/50 dark:hover:bg-white/10'}`}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className={`w-6 h-6 ${scrolled ? 'text-foreground' : 'text-slate-800 dark:text-white'}`} />
              ) : (
                <Menu className={`w-6 h-6 ${scrolled ? 'text-foreground' : 'text-slate-800 dark:text-white'}`} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-border/50 bg-card/95 backdrop-blur-xl animate-fade-in rounded-b-2xl">
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
                      className="w-full justify-center gap-2 bg-gradient-to-r from-primary to-primary/80"
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
                      className="w-full justify-center gap-2 bg-gradient-to-r from-secondary to-gold text-secondary-foreground"
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
