import { PropsWithChildren, useCallback, useState } from "react";
import SplashScreen from "@/components/splash/SplashScreen";

const STORAGE_KEY = "splash_seen";

type SplashGateProps = PropsWithChildren<{
  onFinished?: () => void;
}>;

const SplashGate = ({ children, onFinished }: SplashGateProps) => {
  const [show, setShow] = useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY) !== "1";
    } catch {
      return true;
    }
  });

  const handleFinished = useCallback(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }

    // Important: run navigation/redirect logic BEFORE mounting children,
    // so protected routes don't redirect to /auth behind the splash.
    onFinished?.();

    setShow(false);
  }, [onFinished]);

  return (
    <>
      {!show && <>{children}</>}
      {show && <SplashScreen onFinished={handleFinished} />}
    </>
  );
};

export default SplashGate;
