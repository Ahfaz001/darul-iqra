import { useEffect, useMemo, useState, useRef } from "react";
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
  const { user, loading: authLoading } = useAuth();
  const initRef = useRef(false);

  const routesByType = useMemo<Record<NotificationType, string>>(
    () => ({
      exam: "/exams",
      result: "/results",
      attendance: "/attendance",
    }),
    []
  );

  useEffect(() => {
    // Skip if not native
    if (!Capacitor.isNativePlatform()) {
      dbg.setPushPermission("unknown");
      return;
    }

    // Wait for auth to settle
    if (authLoading) return;

    // Only init once
    if (initRef.current) return;
    initRef.current = true;

    let cancelled = false;
    const handles: Removable[] = [];

    const setup = async () => {
      try {
        // Delay to let app stabilize
        await new Promise((r) => setTimeout(r, 1000));

        if (cancelled) return;

        // Check permissions first
        let permStatus;
        try {
          permStatus = await PushNotifications.checkPermissions();
          dbg.setPushPermission(mapPerm((permStatus as any)?.receive));
        } catch (err: any) {
          dbg.setPushLastError("checkPermissions failed: " + (err?.message || String(err)));
          return;
        }

        if (cancelled) return;

        // Request permission if not granted
        if ((permStatus as any)?.receive !== "granted") {
          try {
            const result = await PushNotifications.requestPermissions();
            dbg.setPushPermission(mapPerm((result as any)?.receive));
            
            // Delay after permission dialog
            await new Promise((r) => setTimeout(r, 800));

            if (cancelled) return;

            if ((result as any)?.receive !== "granted") {
              dbg.setPushLastError("Permission denied by user");
              return;
            }
          } catch (err: any) {
            dbg.setPushLastError("requestPermissions failed: " + (err?.message || String(err)));
            return;
          }
        }

        if (cancelled) return;

        // Add listeners BEFORE register
        try {
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
              dbg.setPushLastError("registrationError: " + msg);
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
        } catch (err: any) {
          dbg.setPushLastError("addListener failed: " + (err?.message || String(err)));
          return;
        }

        if (cancelled) return;

        // Delay before register
        await new Promise((r) => setTimeout(r, 500));

        if (cancelled) return;

        // Register for push
        try {
          await PushNotifications.register();
        } catch (err: any) {
          dbg.setPushLastError("register failed: " + (err?.message || String(err)));
        }
      } catch (error: any) {
        dbg.setPushLastError("setup error: " + (error?.message ?? String(error)));
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
  }, [authLoading]);

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
