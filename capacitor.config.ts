import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.daruliqra.madrasa',
  appName: 'Darul Iqra',
  webDir: 'dist',
  // Remove server URL for production - app will use local bundled files
  // Uncomment below for development/hot-reload only:
  // server: {
  //   url: 'https://fbbd0977-53d6-49a0-b314-53502bf2dd53.lovableproject.com?forceHideBadge=true',
  //   cleartext: true
  // },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1a1a2e',
      showSpinner: false,
      androidSpinnerStyle: 'small',
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#1a1a2e'
    }
  }
};

export default config;
