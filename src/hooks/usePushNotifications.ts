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

export const usePushNotifications = () => {
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
      console.log("Push notifications only work on native platforms");
      return;
    }

    let cancelled = false;
    const handles: Removable[] = [];

    const setup = async () => {
      try {
        const permStatus = await PushNotifications.checkPermissions();

        if (permStatus.receive !== "granted") {
          const result = await PushNotifications.requestPermissions();
          if (result.receive !== "granted") {
            console.log("Push notification permission not granted");
            return;
          }
        }

        // Give WebView a moment to settle before native registration
        await new Promise((r) => setTimeout(r, 400));

        await PushNotifications.register();

        handles.push(
          await PushNotifications.addListener("registration", (t: Token) => {
            if (cancelled) return;
            console.log("Push registration success");
            setToken(t.value);
          })
        );

        handles.push(
          await PushNotifications.addListener("registrationError", (error) => {
            console.error("Push registration error:", error);
          })
        );

        handles.push(
          await PushNotifications.addListener(
            "pushNotificationReceived",
            (n: PushNotificationSchema) => {
              if (cancelled) return;
              console.log("Push notification received");
              setNotification(n);
            }
          )
        );

        handles.push(
          await PushNotifications.addListener(
            "pushNotificationActionPerformed",
            (action: ActionPerformed) => {
              console.log("Push notification action performed");
              handleNotificationAction(action);
            }
          )
        );
      } catch (error) {
        console.error("Error setting up push notifications:", error);
      }
    };

    setup();

    return () => {
      cancelled = true;
      // Remove only our listeners (avoid global removeAllListeners side effects)
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
          console.error("Error saving push token:", error);
        } else {
          console.log("Push token saved successfully");
        }
      } catch (error) {
        console.error("Error saving push token:", error);
      }
    };

    savePushToken(token);
  }, [token, user?.id]);

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
