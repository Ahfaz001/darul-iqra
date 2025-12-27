import type { CapacitorConfig } from '@capacitor/cli';

// For a FINAL APK build, you usually want to load the built web files from `dist`
// (so we should NOT hardcode `server.url`).
// If you still want live-reload during development, set an env var before building:
//   CAP_SERVER_URL="https://..." npx cap sync android
const SERVER_URL = process.env.CAP_SERVER_URL || process.env.CAPACITOR_SERVER_URL;

const config: CapacitorConfig = {
  appId: 'com.idarah.tarjumatulquran',
  appName: 'Idarah Tarjumat-ul-Quran',
  webDir: 'dist',
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false,
    // Note: true autoplay without user gesture is ultimately controlled by the WebView,
    // but we still try to optimize it on the web side.
    overrideUserAgent:
      'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
  },
  server: SERVER_URL
    ? {
        url: SERVER_URL,
        cleartext: true,
        androidScheme: 'https',
      }
    : undefined,
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
      backgroundColor: '#1a1a2e',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#1a1a2e',
    },
  },
};

export default config;
