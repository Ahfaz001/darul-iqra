import { useCallback, useEffect, useRef, useState } from "react";
import madrasaLogo from "@/assets/madrasa-logo.jpg";

type SplashScreenProps = {
  minDurationMs?: number;
  onFinished?: () => void;
};

const SplashScreen = ({ minDurationMs = 6000, onFinished }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [logoVisible, setLogoVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [nameVisible, setNameVisible] = useState(false);
  const [audioPlayed, setAudioPlayed] = useState(false);

  const [minTimeDone, setMinTimeDone] = useState(false);
  const [audioDone, setAudioDone] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const finishedRef = useRef(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onFinished?.();
  }, [onFinished]);

  const playAudio = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || audioPlayed) return;

    try {
      // Resume AudioContext if suspended (required for mobile)
      if (audioContextRef.current?.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      audio.muted = false;
      audio.currentTime = 0;
      await audio.play();
      setAudioPlayed(true);
      console.log("[splash] bismillah playing");
    } catch (err) {
      console.log("[splash] play failed:", err);
    }
  }, [audioPlayed]);

  useEffect(() => {
    // Create AudioContext for better mobile support
    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.log("[splash] AudioContext not supported");
    }

    const audio = new Audio("/sounds/bismillah.mp3");
    audio.preload = "auto";
    audio.volume = 1;
    audio.muted = false;
    (audio as any).playsInline = true;
    (audio as any).webkitPlaysinline = true;
    audioRef.current = audio;

    const handleEnded = () => setAudioDone(true);
    const handleError = (e: Event) => {
      console.log("[splash] audio error:", e);
      setAudioDone(true); // Continue even if audio fails
    };

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    // Try multiple autoplay approaches
    const tryAutoplay = async () => {
      try {
        // First, try to resume AudioContext
        if (audioContextRef.current?.state === 'suspended') {
          await audioContextRef.current.resume();
        }

        // Try playing audio
        audio.muted = false;
        await audio.play();
        setAudioPlayed(true);
        console.log("[splash] autoplay success");
      } catch (err) {
        console.log("[splash] autoplay blocked, tap to play");
        
        // Try with muted first (some browsers allow this)
        try {
          audio.muted = true;
          await audio.play();
          audio.pause();
          audio.currentTime = 0;
          audio.muted = false;
          await audio.play();
          setAudioPlayed(true);
          console.log("[splash] muted trick worked");
        } catch (e) {
          console.log("[splash] muted trick failed");
        }
      }
    };

    // Load and try to play
    audio.addEventListener("canplaythrough", tryAutoplay, { once: true });
    audio.load();

    // Also try on loadeddata
    audio.addEventListener("loadeddata", tryAutoplay, { once: true });

    // Start animations
    setIsVisible(true);
    const a1 = window.setTimeout(() => setLogoVisible(true), 150);
    const a2 = window.setTimeout(() => setTextVisible(true), 500);
    const a3 = window.setTimeout(() => setNameVisible(true), 900);

    const minTimer = window.setTimeout(() => setMinTimeDone(true), minDurationMs);

    return () => {
      window.clearTimeout(minTimer);
      window.clearTimeout(a1);
      window.clearTimeout(a2);
      window.clearTimeout(a3);

      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, [minDurationMs]);

  useEffect(() => {
    if (!minTimeDone) return;

    // Wait minimum time, then:
    // - if audio never started, finish
    // - if audio started, wait for it to end
    if (!audioPlayed || audioDone) {
      finish();
    }
  }, [audioDone, audioPlayed, finish, minTimeDone]);

  const handleTap = () => {
    if (!audioPlayed) playAudio();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden cursor-pointer select-none"
      style={{ backgroundColor: "#1a1a2e" }}
      onClick={handleTap}
      onTouchStart={handleTap}
      onTouchEnd={(e) => e.preventDefault()}
    >
      {/* Geometric Islamic Pattern Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30z' fill='%23c9a227' fill-opacity='0.4'/%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Content Container */}
      <div
        className={`relative z-10 flex flex-col items-center justify-center px-8 transition-opacity duration-500 pointer-events-none ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Logo */}
        <div
          className={`mb-8 transition-all duration-700 ${
            logoVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
          }`}
        >
          <div className="relative">
            {/* Glow Effect */}
            <div
              className="absolute inset-0 rounded-full blur-xl opacity-40"
              style={{ backgroundColor: "#c9a227", transform: "scale(1.3)" }}
            />

            {/* Logo Image */}
            <img
              src={madrasaLogo}
              alt="Idarah Tarjumat-ul-Qur'an Wa Sunnah"
              className="relative w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 shadow-2xl"
              style={{ borderColor: "#c9a227" }}
              loading="eager"
            />
          </div>
        </div>

        {/* Bismillah Arabic Text */}
        <div
          className={`mb-5 transition-all duration-700 ${
            textVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
        >
          <p
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-center leading-relaxed"
            style={{
              color: "#c9a227",
              fontFamily: "'Amiri', 'Traditional Arabic', serif",
              textShadow: "0 0 20px rgba(201, 162, 39, 0.3)",
            }}
          >
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
        </div>

        {/* Decorative Line */}
        <div className={`mb-5 transition-all duration-500 ${textVisible ? "opacity-100" : "opacity-0"}`}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-px" style={{ backgroundColor: "#c9a227" }} />
            <div className="w-2 h-2 rotate-45" style={{ backgroundColor: "#c9a227" }} />
            <div className="w-12 h-px" style={{ backgroundColor: "#c9a227" }} />
          </div>
        </div>

        {/* Madrasa Name */}
        <div
          className={`text-center transition-all duration-700 ${
            nameVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
        >
          <p
            className="text-xl md:text-2xl font-bold mb-2 tracking-wide"
            style={{
              color: "#ffffff",
              textShadow: "0 2px 8px rgba(0,0,0,0.4)",
            }}
          >
            إِدَارَةُ تَرْجُمَةِ الْقُرْآنِ وَالسُّنَّةِ
          </p>
          <p className="text-lg md:text-xl font-semibold mb-1" style={{ color: "#c9a227" }}>
            Idarah Tarjumat-ul-Qur'an
          </p>
          <p className="text-base md:text-lg font-medium mb-2" style={{ color: "#e5d5a8" }}>
            Wa Sunnah
          </p>
          <p className="text-sm md:text-base tracking-widest uppercase" style={{ color: "#888888" }}>
            KALYAN
          </p>
        </div>

        {/* Loading Indicator */}
        <div className={`mt-10 transition-opacity duration-500 ${nameVisible ? "opacity-100" : "opacity-0"}`}>
          <div className="flex items-center gap-2">
            {[0, 150, 300].map((delay, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full animate-bounce"
                style={{ backgroundColor: "#c9a227", animationDelay: `${delay}ms` }}
              />
            ))}
          </div>
        </div>

        {/* Tap hint - shows if audio hasn't played */}
        {!audioPlayed && (
          <p className="mt-6 text-sm animate-pulse" style={{ color: "#888888" }}>
            بسم اللہ سننے کے لیے تھپتھپائیں
          </p>
        )}
      </div>

      {/* Bottom Decorative Pattern */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1 pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, #c9a227, transparent)" }}
      />

      {/* App Version */}
      <div className="absolute bottom-6 text-center">
        <p className="text-xs" style={{ color: "#555555" }}>
          Version 1.0.0
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;
