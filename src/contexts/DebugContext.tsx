import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Capacitor } from "@capacitor/core";

export type PushPermission = "granted" | "denied" | "prompt" | "unknown";

export type NavEntry = {
  pathname: string;
  search: string;
  hash: string;
  ts: number;
};

export type DebugState = {
  isNative: boolean;
  platform: string;

  splashShowing: boolean;
  splashFinished: boolean;
  splashSeen: boolean;

  pushPermission: PushPermission;
  pushRegistered: boolean;
  pushToken: string | null;
  pushLastError: string | null;

  lastNavigation: NavEntry | null;
  navigationHistory: NavEntry[];

  setSplashShowing: (v: boolean) => void;
  markSplashFinished: () => void;
  refreshSplashSeen: () => void;

  setPushPermission: (p: PushPermission) => void;
  setPushRegistered: (v: boolean) => void;
  setPushToken: (t: string | null) => void;
  setPushLastError: (e: string | null) => void;
};

const DebugContext = createContext<DebugState | null>(null);

const SPLASH_KEY = "splash_seen";

const readSplashSeen = () => {
  try {
    return sessionStorage.getItem(SPLASH_KEY) === "1";
  } catch {
    return false;
  }
};

export const DebugProvider = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [splashShowing, setSplashShowing] = useState(false);
  const [splashFinished, setSplashFinished] = useState(readSplashSeen());
  const [splashSeen, setSplashSeen] = useState(readSplashSeen());

  const [pushPermission, setPushPermission] = useState<PushPermission>("unknown");
  const [pushRegistered, setPushRegistered] = useState(false);
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [pushLastError, setPushLastError] = useState<string | null>(null);

  const [navigationHistory, setNavigationHistory] = useState<NavEntry[]>([]);

  const isNative = Capacitor.isNativePlatform();
  const platform = Capacitor.getPlatform?.() ?? "web";

  useEffect(() => {
    const entry: NavEntry = {
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
      ts: Date.now(),
    };

    setNavigationHistory((prev) => {
      const last = prev[0];
      if (last && last.pathname === entry.pathname && last.search === entry.search && last.hash === entry.hash) {
        return prev;
      }
      return [entry, ...prev].slice(0, 20);
    });
  }, [location.hash, location.pathname, location.search]);

  const lastNavigation = navigationHistory[0] ?? null;

  const refreshSplashSeen = useCallback(() => {
    setSplashSeen(readSplashSeen());
  }, []);

  const markSplashFinished = useCallback(() => {
    setSplashFinished(true);
    refreshSplashSeen();
  }, [refreshSplashSeen]);

  const value = useMemo<DebugState>(
    () => ({
      isNative,
      platform,

      splashShowing,
      splashFinished,
      splashSeen,

      pushPermission,
      pushRegistered,
      pushToken,
      pushLastError,

      lastNavigation,
      navigationHistory,

      setSplashShowing,
      markSplashFinished,
      refreshSplashSeen,

      setPushPermission,
      setPushRegistered,
      setPushToken,
      setPushLastError,
    }),
    [
      isNative,
      platform,
      splashShowing,
      splashFinished,
      splashSeen,
      pushPermission,
      pushRegistered,
      pushToken,
      pushLastError,
      lastNavigation,
      navigationHistory,
      markSplashFinished,
      refreshSplashSeen,
    ]
  );

  return <DebugContext.Provider value={value}>{children}</DebugContext.Provider>;
};

export const useDebugState = () => {
  const ctx = useContext(DebugContext);
  if (!ctx) throw new Error("useDebugState must be used within DebugProvider");
  return ctx;
};
