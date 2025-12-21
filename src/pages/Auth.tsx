import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/AuthContext';
import { AuthForm } from '@/components/auth/AuthForm';
import madrasaLogo from '@/assets/madrasa-logo.jpg';
import { BookOpen } from 'lucide-react';

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-cream">
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
        <meta 
          name="description" 
          content="Access your student portal at Idarah Tarjumat-ul-Qur'an Wa Sunnah Kalyan. Login or create an account to view exams, attendance, and more." 
        />
      </Helmet>

      <div className="min-h-screen flex">
        {/* Left side - Decorative */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-emerald-600 to-emerald-800 relative overflow-hidden">
          {/* Islamic Pattern Overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
            <img 
              src={madrasaLogo} 
              alt="Dar-ul-Ulum Al-Qur'an Wa Sunnah Logo" 
              className="w-32 h-32 rounded-full mb-8 shadow-2xl border-4 border-white/20"
            />
            <h1 className="text-3xl font-display font-bold text-center mb-4">
              Idarah Tarjumat-ul-Qur'an Wa Sunnah
            </h1>
            <p className="text-xl text-white/80 text-center font-urdu mb-2">
              ادارة ترجمة القرآن والسنة
            </p>
            <p className="text-base text-white/70 text-center font-arabic mb-2">
              اطيعوا الله واطيعوا الرسول
            </p>
            <p className="text-lg text-gold font-medium">KALYAN • كليان • Estd. 2008</p>
            
            <div className="mt-12 max-w-md text-center">
              <p className="text-white/90 text-lg leading-relaxed">
                "Seek knowledge from the cradle to the grave"
              </p>
              <p className="text-white/70 mt-2 font-urdu">
                علم حاصل کرو گہوارے سے لحد تک
              </p>
            </div>

            <div className="mt-auto flex items-center gap-2 text-white/60 text-sm">
              <BookOpen className="h-4 w-4" />
              <span>Student & Teacher Portal</span>
            </div>
          </div>
        </div>

        {/* Right side - Auth Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-cream to-white">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden flex flex-col items-center mb-8">
              <img 
                src={madrasaLogo} 
                alt="Dar-ul-Ulum Logo" 
                className="w-20 h-20 rounded-full shadow-lg mb-4"
              />
              <h1 className="text-xl font-display font-bold text-primary text-center">
                Idarah Tarjumat-ul-Qur'an Wa Sunnah
              </h1>
              <p className="text-sm text-muted-foreground">KALYAN • Estd. 2008</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 border border-border/30">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-display font-bold text-foreground">
                  {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-muted-foreground mt-2">
                  {mode === 'login' 
                    ? 'Sign in to access your portal' 
                    : 'Register to join our learning community'}
                </p>
              </div>

              <AuthForm mode={mode} onToggleMode={toggleMode} />
            </div>

            <p className="text-center text-sm text-muted-foreground mt-6">
              By continuing, you agree to our terms of service and privacy policy.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;
