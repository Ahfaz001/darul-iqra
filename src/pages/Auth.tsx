import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/AuthContext';
import { AuthForm } from '@/components/auth/AuthForm';
import ThemeToggle from '@/components/ThemeToggle';
import madrasaLogo from '@/assets/madrasa-logo.jpg';
import { BookOpen, Sparkles } from 'lucide-react';

const Auth: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse">
          <BookOpen className="h-12 w-12 text-primary" />
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{mode === 'login' ? 'Login' : 'Sign Up'} | Idarah Tarjumat-ul-Qur'an Wa Sunnah</title>
        <meta name="description" content="Access your student portal at Idarah Tarjumat-ul-Qur'an Wa Sunnah Kalyan." />
      </Helmet>

      <div className="min-h-screen flex bg-background">
        {/* Left side - Decorative */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary/90 to-navy-dark relative overflow-hidden">
          <div className="absolute inset-0 islamic-pattern opacity-20"></div>
          <div className="absolute top-20 right-10 w-72 h-72 bg-secondary/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>

          <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-secondary to-gold rounded-full blur-xl opacity-50"></div>
              <img 
                src={madrasaLogo} 
                alt="Logo" 
                className="relative w-32 h-32 rounded-full shadow-2xl border-4 border-white/20"
              />
            </div>
            <h1 className="text-3xl font-display font-bold text-center mb-4">
              Idarah Tarjumat-ul-Qur'an Wa Sunnah
            </h1>
            <p className="text-xl text-white/80 text-center font-urdu mb-2">ادارة ترجمة القرآن والسنة</p>
            <p className="text-lg text-secondary font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              KALYAN • Estd. 2008
            </p>
            
            <div className="mt-12 max-w-md text-center p-6 bg-white/5 backdrop-blur rounded-2xl border border-white/10">
              <p className="text-white/90 text-lg leading-relaxed italic">
                "Seek knowledge from the cradle to the grave"
              </p>
              <p className="text-white/70 mt-2 font-urdu">علم حاصل کرو گہوارے سے لحد تک</p>
            </div>

            <div className="mt-auto flex items-center gap-2 text-white/60 text-sm">
              <BookOpen className="h-4 w-4" />
              <span>Student & Teacher Portal</span>
            </div>
          </div>
        </div>

        {/* Right side - Auth Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
          <div className="absolute top-4 right-4">
            <ThemeToggle />
          </div>
          
          <div className="w-full max-w-md">
            <div className="lg:hidden flex flex-col items-center mb-8">
              <img src={madrasaLogo} alt="Logo" className="w-20 h-20 rounded-full shadow-lg mb-4" />
              <h1 className="text-xl font-display font-bold text-primary text-center">
                Idarah Tarjumat-ul-Qur'an Wa Sunnah
              </h1>
            </div>

            <div className="bg-card rounded-2xl shadow-xl p-8 border border-border/50">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-display font-bold text-foreground">
                  {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-muted-foreground mt-2">
                  {mode === 'login' ? 'Sign in to access your portal' : 'Register to join our community'}
                </p>
              </div>
              <AuthForm mode={mode} onToggleMode={toggleMode} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;
