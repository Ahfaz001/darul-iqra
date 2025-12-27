import { PropsWithChildren, useCallback, useState } from "react";
import SplashScreen from "@/components/splash/SplashScreen";

const STORAGE_KEY = "splash_seen";

const SplashGate = ({ children }: PropsWithChildren) => {
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
    setShow(false);
  }, []);

  return (
    <>
      <div aria-hidden={show} className={show ? "pointer-events-none select-none" : ""}>
        {children}
      </div>
      {show && <SplashScreen onFinished={handleFinished} />}
    </>
  );
};

export default SplashGate;
