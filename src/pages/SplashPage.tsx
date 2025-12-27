import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import madrasaLogo from '@/assets/madrasa-logo.jpg';

const SplashPage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [logoVisible, setLogoVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [nameVisible, setNameVisible] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    const AUDIO_SRC = '/sounds/bismillah.mp3';

    const tryPlay = async () => {
      const audio = audioRef.current;
      if (!audio || hasPlayedRef.current) return;

      try {
        await audio.play();
        hasPlayedRef.current = true;
        console.log('[splash] bismillah playing');
      } catch (err) {
        console.log('[splash] autoplay blocked / failed:', err);
      }
    };

    // Create audio element
    const audio = new Audio(AUDIO_SRC);
    audio.preload = 'auto';
    audio.volume = 1;
    audioRef.current = audio;

    // Debug: ensure file is reachable (will show in network)
    fetch(AUDIO_SRC, { method: 'HEAD' })
      .then((r) => console.log('[splash] audio HEAD status:', r.status))
      .catch((e) => console.log('[splash] audio HEAD failed:', e));

    const onCanPlay = () => {
      console.log('[splash] audio canplay');
      void tryPlay();
    };

    const onError = () => {
      console.log('[splash] audio error:', audio.error);
      // still try once in case the browser delays load
      void tryPlay();
    };

    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('error', onError);

    // Kickstart loading
    audio.load();

    // Try immediately + retry once (helps on some WebViews)
    const t1 = window.setTimeout(() => void tryPlay(), 120);
    const t2 = window.setTimeout(() => void tryPlay(), 700);

    // Start animations immediately
    setIsVisible(true);
    const a1 = window.setTimeout(() => setLogoVisible(true), 150);
    const a2 = window.setTimeout(() => setTextVisible(true), 500);
    const a3 = window.setTimeout(() => setNameVisible(true), 900);

    // Navigate to home after 6 seconds
    const navTimer = window.setTimeout(() => {
      navigate('/', { replace: true });
    }, 6000);

    return () => {
      window.clearTimeout(navTimer);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(a1);
      window.clearTimeout(a2);
      window.clearTimeout(a3);

      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('error', onError);

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [navigate]);

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#1a1a2e' }}
    >
      {/* Geometric Islamic Pattern Background */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30z' fill='%23c9a227' fill-opacity='0.4'/%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }} 
        />
      </div>

      {/* Content Container */}
      <div className={`relative z-10 flex flex-col items-center justify-center px-8 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* Logo */}
        <div className={`mb-8 transition-all duration-700 ${logoVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
          <div className="relative">
            {/* Glow Effect */}
            <div 
              className="absolute inset-0 rounded-full blur-xl opacity-40"
              style={{ backgroundColor: '#c9a227', transform: 'scale(1.3)' }} 
            />
            
            {/* Logo Image */}
            <img 
              src={madrasaLogo} 
              alt="Idarah Tarjumat-ul-Qur'an Wa Sunnah"
              className="relative w-28 h-28 md:w-36 md:h-36 rounded-full object-cover border-4 shadow-2xl"
              style={{ borderColor: '#c9a227' }}
              loading="eager"
            />
          </div>
        </div>

        {/* Bismillah Arabic Text */}
        <div className={`mb-5 transition-all duration-700 ${textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
          <p 
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-center leading-relaxed"
            style={{ 
              color: '#c9a227',
              fontFamily: "'Amiri', 'Traditional Arabic', serif",
              textShadow: '0 0 20px rgba(201, 162, 39, 0.3)'
            }}
          >
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
        </div>

        {/* Decorative Line */}
        <div className={`mb-5 transition-all duration-500 ${textVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-px" style={{ backgroundColor: '#c9a227' }} />
            <div className="w-2 h-2 rotate-45" style={{ backgroundColor: '#c9a227' }} />
            <div className="w-12 h-px" style={{ backgroundColor: '#c9a227' }} />
          </div>
        </div>

        {/* Madrasa Name */}
        <div className={`text-center transition-all duration-700 ${nameVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
          <h1 
            className="text-xl md:text-2xl font-bold mb-2 tracking-wide"
            style={{ 
              color: '#ffffff',
              textShadow: '0 2px 8px rgba(0,0,0,0.4)'
            }}
          >
            إِدَارَةُ تَرْجُمَةِ الْقُرْآنِ وَالسُّنَّةِ
          </h1>
          <h2 
            className="text-lg md:text-xl font-semibold mb-1"
            style={{ color: '#c9a227' }}
          >
            Idarah Tarjumat-ul-Qur'an
          </h2>
          <h3 
            className="text-base md:text-lg font-medium mb-2"
            style={{ color: '#e5d5a8' }}
          >
            Wa Sunnah
          </h3>
          <p 
            className="text-sm md:text-base tracking-widest uppercase"
            style={{ color: '#888888' }}
          >
            KALYAN
          </p>
        </div>

        {/* Loading Indicator */}
        <div className={`mt-10 transition-opacity duration-500 ${nameVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center gap-2">
            {[0, 150, 300].map((delay, i) => (
              <div 
                key={i}
                className="w-2 h-2 rounded-full animate-bounce" 
                style={{ 
                  backgroundColor: '#c9a227', 
                  animationDelay: `${delay}ms` 
                }} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Decorative Pattern */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{ 
          background: 'linear-gradient(90deg, transparent, #c9a227, transparent)'
        }} 
      />
      
    </div>
  );
};

export default SplashPage;
