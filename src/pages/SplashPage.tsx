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
    // Create and play audio immediately
    const playBismillah = async () => {
      if (hasPlayedRef.current) return;
      
      try {
        // Create audio element
        const audio = new Audio();
        audio.src = '/sounds/bismillah.mp3';
        audio.volume = 1.0;
        audio.preload = 'auto';
        audioRef.current = audio;

        // Wait for audio to be ready
        await new Promise((resolve) => {
          audio.addEventListener('canplaythrough', resolve, { once: true });
          audio.load();
        });

        // Play audio
        await audio.play();
        hasPlayedRef.current = true;
      } catch (error) {
        console.log('Audio autoplay:', error);
        // Fallback: try playing with muted first then unmute (trick for some browsers)
        try {
          if (audioRef.current) {
            audioRef.current.muted = true;
            await audioRef.current.play();
            audioRef.current.muted = false;
            audioRef.current.currentTime = 0;
            await audioRef.current.play();
            hasPlayedRef.current = true;
          }
        } catch (e) {
          console.log('Fallback also failed:', e);
        }
      }
    };

    // Play audio immediately
    playBismillah();

    // Start animations immediately
    setIsVisible(true);
    setTimeout(() => setLogoVisible(true), 150);
    setTimeout(() => setTextVisible(true), 500);
    setTimeout(() => setNameVisible(true), 900);

    // Navigate to home after 6 seconds
    const timer = setTimeout(() => {
      navigate('/', { replace: true });
    }, 6000);

    return () => {
      clearTimeout(timer);
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
      
      {/* Hidden audio element for better autoplay support */}
      <audio 
        src="/sounds/bismillah.mp3" 
        autoPlay 
        playsInline
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default SplashPage;
