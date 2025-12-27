import { useEffect, useMemo, useState } from "react";
import { Capacitor } from "@capacitor/core";
import {
  PushNotifications,
  Token,
  PushNotificationSchema,
  ActionPerformed,
} from "@capacitor/push-notifications";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useDebugState, PushPermission } from "@/contexts/DebugContext";

type Removable = { remove: () => Promise<void> | void };

type NotificationType = "exam" | "result" | "attendance";

const toAppPath = (path: string) => (path.startsWith("/") ? path : `/${path}`);

const navigateApp = (path: string) => {
  const to = toAppPath(path);
  if (Capacitor.isNativePlatform()) {
    // HashRouter on native (do not reload)
    window.location.hash = `#${to}`;
    return;
  }
  window.location.assign(to);
};

const mapPerm = (receive: string | undefined): PushPermission => {
  if (receive === "granted") return "granted";
  if (receive === "denied") return "denied";
  if (receive === "prompt") return "prompt";
  return "unknown";
};

export const usePushNotifications = () => {
  const dbg = useDebugState();
  const [token, setToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<PushNotificationSchema | null>(null);
  const { user } = useAuth();

  const routesByType = useMemo<Record<NotificationType, string>>(
    () => ({
      exam: "/exams",
      result: "/results",
      attendance: "/attendance",
    }),
    []
  );

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      dbg.setPushPermission("unknown");
      return;
    }

    let cancelled = false;
    const handles: Removable[] = [];

    const setup = async () => {
      try {
        const permStatus = await PushNotifications.checkPermissions();
        dbg.setPushPermission(mapPerm((permStatus as any)?.receive));

        if ((permStatus as any)?.receive !== "granted") {
          const result = await PushNotifications.requestPermissions();
          dbg.setPushPermission(mapPerm((result as any)?.receive));

          // If user denied, do not continue.
          if ((result as any)?.receive !== "granted") {
            return;
          }
        }

        // IMPORTANT: Add listeners BEFORE register (stability on some Android builds)
        handles.push(
          await PushNotifications.addListener("registration", (t: Token) => {
            if (cancelled) return;
            setToken(t.value);
            dbg.setPushToken(t.value);
            dbg.setPushRegistered(true);
          })
        );

        handles.push(
          await PushNotifications.addListener("registrationError", (error) => {
            const msg = typeof error === "string" ? error : JSON.stringify(error);
            dbg.setPushLastError(msg);
            dbg.setPushRegistered(false);
          })
        );

        handles.push(
          await PushNotifications.addListener(
            "pushNotificationReceived",
            (n: PushNotificationSchema) => {
              if (cancelled) return;
              setNotification(n);
            }
          )
        );

        handles.push(
          await PushNotifications.addListener(
            "pushNotificationActionPerformed",
            (action: ActionPerformed) => {
              handleNotificationAction(action);
            }
          )
        );

        // Give WebView a moment to settle after permission prompt
        await new Promise((r) => setTimeout(r, 1200));

        await PushNotifications.register();
      } catch (error: any) {
        dbg.setPushLastError(error?.message ?? String(error));
      }
    };

    setup();

    return () => {
      cancelled = true;
      handles.forEach((h) => {
        try {
          h.remove();
        } catch {
          // ignore
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!token) return;
    if (!user?.id) return;

    const savePushToken = async (fcmToken: string) => {
      try {
        const { error } = await supabase
          .from("profiles")
          .update({ fcm_token: fcmToken } as any)
          .eq("user_id", user.id);

        if (error) {
          dbg.setPushLastError(error.message);
        }
      } catch (error: any) {
        dbg.setPushLastError(error?.message ?? String(error));
      }
    };

    savePushToken(token);
  }, [dbg, token, user?.id]);

  const handleNotificationAction = (action: ActionPerformed) => {
    const data = action?.notification?.data as any;
    const type = (data?.type as NotificationType | undefined) ?? undefined;

    if (!type) return;

    const path = routesByType[type];
    if (!path) return;

    navigateApp(path);
  };

  return { token, notification };
};

