import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Globe, User, BookOpen, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import madrasaLogo from "@/assets/madrasa-logo.jpg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("English");
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Programs", href: "#programs" },
    { name: "Features", href: "#features" },
    { name: "Contact", href: "#contact" },
  ];

  const languages = [
    { code: "en", name: "English" },
    { code: "ur", name: "اردو" },
    { code: "roman", name: "Roman Urdu" },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getDashboardPath = () => {
    if (role === 'admin' || role === 'teacher') {
      return '/admin';
    }
    return '/dashboard';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary/20 shadow-soft group-hover:border-secondary transition-colors duration-300">
              <img
                src={madrasaLogo}
                alt="Dar-ul-Ulum Al-Qur'an Wa Sunnah Kalyan"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-display font-semibold text-foreground text-lg leading-tight">
                Dar-ul-Ulum
              </h1>
              <p className="text-xs text-muted-foreground">Al-Qur'an Wa Sunnah</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-foreground/80 hover:text-primary font-medium transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-secondary hover:after:w-full after:transition-all after:duration-300"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 text-foreground/80 hover:text-primary">
                  <Globe className="w-4 h-4" />
                  <span className="text-sm">{currentLang}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[140px]">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setCurrentLang(lang.name)}
                    className={`cursor-pointer ${lang.code === "ur" ? "font-urdu text-right" : ""}`}
                  >
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {user ? (
              <>
                <Button 
                  size="sm" 
                  className="gap-2 bg-primary hover:bg-primary/90 shadow-soft"
                  onClick={() => navigate(getDashboardPath())}
                >
                  <BookOpen className="w-4 h-4" />
                  {role === 'admin' || role === 'teacher' ? 'Dashboard' : 'Student Portal'}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2 border-primary/30 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
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
                  Login
                </Button>
                <Button 
                  size="sm" 
                  className="gap-2 bg-primary hover:bg-primary/90 shadow-soft"
                  onClick={() => navigate('/auth')}
                >
                  <BookOpen className="w-4 h-4" />
                  Student Portal
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
                  className="px-4 py-3 text-foreground/80 hover:text-primary hover:bg-muted/50 rounded-lg transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <div className="border-t border-border my-2"></div>
              <div className="flex flex-col gap-2 px-4">
                {user ? (
                  <>
                    <Button 
                      className="w-full justify-center gap-2 bg-primary"
                      onClick={() => {
                        navigate(getDashboardPath());
                        setIsOpen(false);
                      }}
                    >
                      <BookOpen className="w-4 h-4" />
                      {role === 'admin' || role === 'teacher' ? 'Dashboard' : 'Student Portal'}
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
                      Logout
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
                      Login
                    </Button>
                    <Button 
                      className="w-full justify-center gap-2 bg-primary"
                      onClick={() => {
                        navigate('/auth');
                        setIsOpen(false);
                      }}
                    >
                      <BookOpen className="w-4 h-4" />
                      Student Portal
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
