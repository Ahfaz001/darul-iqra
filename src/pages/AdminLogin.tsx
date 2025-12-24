import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/AuthContext';
import { AuthForm } from '@/components/auth/AuthForm';
import madrasaLogo from '@/assets/madrasa-logo.jpg';
import { Shield } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  const toggleMode = () => {
    setMode((m) => (m === 'login' ? 'signup' : 'login'));
  };

  useEffect(() => {
    if (user && !loading) {
      if (role === 'admin' || role === 'teacher') {
        navigate('/admin');
      } else {
        // If logged in but not admin/teacher, redirect to dashboard
        navigate('/dashboard');
      }
    }
  }, [user, role, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="animate-pulse">
          <Shield className="h-12 w-12 text-gold" />
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Login | Idarah Tarjumat-ul-Qur'an Wa Sunnah</title>
        <meta 
          name="description" 
          content="Admin portal login for Idarah Tarjumat-ul-Qur'an Wa Sunnah Kalyan management system." 
        />
      </Helmet>

      <div className="min-h-screen flex">
        {/* Left side - Decorative (Admin themed) */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
          {/* Geometric Pattern Overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
            <div className="bg-gold/20 p-4 rounded-full mb-6">
              <Shield className="h-16 w-16 text-gold" />
            </div>
            <img 
              src={madrasaLogo} 
              alt="Dar-ul-Ulum Al-Qur'an Wa Sunnah Logo" 
              className="w-24 h-24 rounded-full mb-6 shadow-2xl border-4 border-gold/30"
            />
            <h1 className="text-3xl font-display font-bold text-center mb-2">
              Admin Portal
            </h1>
            <p className="text-lg text-white/70 text-center mb-4">
              Idarah Tarjumat-ul-Qur'an Wa Sunnah
            </p>
            <p className="text-gold font-medium">KALYAN • Estd. 2008</p>
            
            <div className="mt-12 max-w-md text-center">
              <p className="text-white/80 text-lg leading-relaxed">
                Management & Administration System
              </p>
              <p className="text-white/60 mt-2 text-sm">
                Authorized Personnel Only
              </p>
            </div>

            <div className="mt-auto flex items-center gap-2 text-white/50 text-sm">
              <Shield className="h-4 w-4" />
              <span>Secure Admin Access</span>
            </div>
          </div>
        </div>

        {/* Right side - Auth Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-slate-100 to-white">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden flex flex-col items-center mb-8">
              <div className="bg-slate-800 p-3 rounded-full mb-4">
                <Shield className="h-8 w-8 text-gold" />
              </div>
              <h1 className="text-xl font-display font-bold text-slate-800 text-center">
                Admin Portal
              </h1>
              <p className="text-sm text-muted-foreground">Authorized Access Only</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-display font-bold text-slate-800">
                  {mode === 'login' ? 'Administrator Login' : 'Create Account'}
                </h2>
                <p className="text-muted-foreground mt-2">
                  {mode === 'login'
                    ? 'Sign in with your admin credentials'
                    : 'Create an account first; admin access will be enabled after approval.'}
                </p>
              </div>

              <AuthForm mode={mode} onToggleMode={toggleMode} userType="admin" />
            </div>

            <p className="text-center text-sm text-muted-foreground mt-6">
              This area is restricted to authorized administrators only.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
