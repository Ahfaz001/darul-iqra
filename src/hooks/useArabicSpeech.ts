import { useState, useCallback, useRef, useEffect } from 'react';

export const useArabicSpeech = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentDuaId, setCurrentDuaId] = useState<string | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = useCallback((text: string, duaId: string) => {
    if (!window.speechSynthesis) {
      console.warn('Speech synthesis not supported');
      return;
    }

    // If same dua is playing, stop it
    if (isPlaying && currentDuaId === duaId) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setCurrentDuaId(null);
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    // Try to find Arabic voice
    const voices = window.speechSynthesis.getVoices();
    const arabicVoice = voices.find(
      voice => voice.lang.startsWith('ar') || voice.name.toLowerCase().includes('arabic')
    );

    if (arabicVoice) {
      utterance.voice = arabicVoice;
    }

    // Configure for Arabic
    utterance.lang = 'ar-SA';
    utterance.rate = 0.8; // Slower for clarity
    utterance.pitch = 1;

    utterance.onstart = () => {
      setIsPlaying(true);
      setCurrentDuaId(duaId);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setCurrentDuaId(null);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setCurrentDuaId(null);
    };

    // Ensure voices are loaded (needed for some browsers)
    if (voices.length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        const newVoices = window.speechSynthesis.getVoices();
        const newArabicVoice = newVoices.find(
          voice => voice.lang.startsWith('ar') || voice.name.toLowerCase().includes('arabic')
        );
        if (newArabicVoice) {
          utterance.voice = newArabicVoice;
        }
        window.speechSynthesis.speak(utterance);
      };
    } else {
      window.speechSynthesis.speak(utterance);
    }
  }, [isPlaying, currentDuaId]);

  const stop = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setCurrentDuaId(null);
  }, []);

  return {
    speak,
    stop,
    isPlaying,
    currentDuaId
  };
};
