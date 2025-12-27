import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import madrasaLogo from '@/assets/madrasa-logo.jpg';

const SplashPage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [logoVisible, setLogoVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [nameVisible, setNameVisible] = useState(false);

  useEffect(() => {
    // Start animations
    setTimeout(() => setIsVisible(true), 100);
    setTimeout(() => setLogoVisible(true), 300);
    setTimeout(() => setTextVisible(true), 800);
    setTimeout(() => setNameVisible(true), 1200);

    // Play Bismillah audio
    const audio = new Audio('/sounds/bismillah.mp3');
    audio.volume = 0.8;
    audio.play().catch(() => {
      // Audio autoplay might be blocked, continue anyway
      console.log('Audio autoplay blocked');
    });

    // Navigate to home after splash
    const timer = setTimeout(() => {
      navigate('/', { replace: true });
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#1a1a2e' }}>
      
      {/* Geometric Islamic Pattern Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a227' fill-opacity='0.4'%3E%3Cpath d='M30 0l30 30-30 30L0 30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Radial Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/40" />

      {/* Content Container */}
      <div className={`relative z-10 flex flex-col items-center justify-center px-8 transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* Logo */}
        <div className={`mb-8 transition-all duration-1000 ${logoVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
          <div className="relative">
            {/* Glow Effect */}
            <div className="absolute inset-0 rounded-full blur-2xl opacity-50"
              style={{ backgroundColor: '#c9a227', transform: 'scale(1.2)' }} />
            
            {/* Logo Image */}
            <img 
              src={madrasaLogo} 
              alt="Idarah Tarjumat-ul-Qur'an Wa Sunnah"
              className="relative w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 shadow-2xl"
              style={{ borderColor: '#c9a227' }}
            />
          </div>
        </div>

        {/* Bismillah Arabic Text */}
        <div className={`mb-6 transition-all duration-1000 delay-200 ${textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-center leading-relaxed"
            style={{ 
              color: '#c9a227',
              fontFamily: "'Amiri', 'Traditional Arabic', serif",
              textShadow: '0 0 30px rgba(201, 162, 39, 0.4)'
            }}>
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
        </div>

        {/* Decorative Line */}
        <div className={`mb-6 transition-all duration-1000 delay-300 ${textVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`}>
          <div className="flex items-center gap-4">
            <div className="w-16 h-px" style={{ backgroundColor: '#c9a227' }} />
            <div className="w-2 h-2 rotate-45" style={{ backgroundColor: '#c9a227' }} />
            <div className="w-16 h-px" style={{ backgroundColor: '#c9a227' }} />
          </div>
        </div>

        {/* Madrasa Name */}
        <div className={`text-center transition-all duration-1000 delay-500 ${nameVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h1 className="text-2xl md:text-3xl font-bold mb-2 tracking-wide"
            style={{ 
              color: '#ffffff',
              textShadow: '0 2px 10px rgba(0,0,0,0.5)'
            }}>
            إِدَارَةُ تَرْجُمَةِ الْقُرْآنِ وَالسُّنَّةِ
          </h1>
          <h2 className="text-xl md:text-2xl font-semibold mb-1"
            style={{ color: '#c9a227' }}>
            Idarah Tarjumat-ul-Qur'an
          </h2>
          <h3 className="text-lg md:text-xl font-medium mb-2"
            style={{ color: '#e5d5a8' }}>
            Wa Sunnah
          </h3>
          <p className="text-base md:text-lg tracking-widest uppercase"
            style={{ color: '#888888' }}>
            KALYAN
          </p>
        </div>

        {/* Loading Indicator */}
        <div className={`mt-12 transition-all duration-1000 delay-700 ${nameVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full animate-bounce" 
              style={{ backgroundColor: '#c9a227', animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full animate-bounce" 
              style={{ backgroundColor: '#c9a227', animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full animate-bounce" 
              style={{ backgroundColor: '#c9a227', animationDelay: '300ms' }} />
          </div>
        </div>
      </div>

      {/* Bottom Decorative Pattern */}
      <div className="absolute bottom-0 left-0 right-0 h-1"
        style={{ 
          background: 'linear-gradient(90deg, transparent, #c9a227, transparent)'
        }} />
    </div>
  );
};

export default SplashPage;
