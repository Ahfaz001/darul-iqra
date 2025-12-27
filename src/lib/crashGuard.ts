/**
 * Crash Guard - Detects crash loops and enables safe mode
 */

const CRASH_KEY = "app_crash_count";
const CRASH_TS_KEY = "app_crash_ts";
const SAFE_MODE_KEY = "app_safe_mode";
const LAST_ERROR_KEY = "app_last_error";
const CRASH_WINDOW_MS = 30_000; // 30 seconds
const MAX_CRASHES = 2;

export type CrashInfo = {
  message: string;
  stack?: string;
  ts: number;
};

const storage = {
  get: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch {
      // ignore
    }
  },
  remove: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
  },
};

export const isSafeMode = (): boolean => storage.get(SAFE_MODE_KEY) === "1";

export const enableSafeMode = () => storage.set(SAFE_MODE_KEY, "1");

export const disableSafeMode = () => {
  storage.remove(SAFE_MODE_KEY);
  storage.remove(CRASH_KEY);
  storage.remove(CRASH_TS_KEY);
};

export const getLastError = (): CrashInfo | null => {
  const raw = storage.get(LAST_ERROR_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as CrashInfo;
  } catch {
    return null;
  }
};

export const clearLastError = () => storage.remove(LAST_ERROR_KEY);

const recordError = (info: CrashInfo) => {
  storage.set(LAST_ERROR_KEY, JSON.stringify(info));
};

const recordCrash = () => {
  const now = Date.now();
  const lastTs = parseInt(storage.get(CRASH_TS_KEY) || "0", 10);
  let count = parseInt(storage.get(CRASH_KEY) || "0", 10);

  // Reset count if outside crash window

if (now - lastTs > CRASH_WINDOW_MS) {
    count = 0;
  }

  count += 1;
  storage.set(CRASH_KEY, String(count));
  storage.set(CRASH_TS_KEY, String(now));

  if (count >= MAX_CRASHES) {
    enableSafeMode();
  }
};

export const markBootSuccess = () => {
  // Called after app successfully renders; reset crash counter
  storage.remove(CRASH_KEY);
  storage.remove(CRASH_TS_KEY);
};

export const initCrashGuard = () => {
  // Record a potential crash on boot
  recordCrash();

  // Capture unhandled errors
  const handleError = (event: ErrorEvent) => {
    recordError({
      message: event.message || "Unknown error",
      stack: event.error?.stack,
      ts: Date.now(),
    });
    recordCrash();
  };

  const handleRejection = (event: PromiseRejectionEvent) => {
    const reason = event.reason;
    recordError({
      message: reason?.message || String(reason) || "Unhandled rejection",
      stack: reason?.stack,
      ts: Date.now(),
    });
    recordCrash();
  };

  window.addEventListener("error", handleError);
  window.addEventListener("unhandledrejection", handleRejection);

  return () => {
    window.removeEventListener("error", handleError);
    window.removeEventListener("unhandledrejection", handleRejection);
  };
};
