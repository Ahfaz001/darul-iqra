import { PropsWithChildren, useCallback, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import SplashGate from "@/components/splash/SplashGate";

type AppRole = "admin" | "teacher" | "student";

const isAuthPage = (pathname: string) =>
  pathname === "/auth" || pathname === "/admin-login" || pathname === "/reset-password";

const isProtectedPage = (pathname: string) => {
  // Student protected pages
  const studentProtected = [
    "/dashboard",
    "/profile",
    "/hadith",
    "/books",
    "/quran",
    "/exams",
    "/attendance",
    "/results",
    "/support",
    "/contact",
  ];

  if (studentProtected.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return true;

  // Admin protected pages (but NOT admin-login)
  if (pathname === "/admin") return true;
  if (pathname.startsWith("/admin/") && pathname !== "/admin-login") return true;

  return false;
};

const SplashAppGate = ({ children }: PropsWithChildren) => {
  const { user, role, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const pendingAfterLoadRef = useRef(false);

  const runPostSplashRedirect = useCallback(() => {
    const pathname = location.pathname;

    // If user is explicitly on the splash route, don't interfere.
    if (pathname === "/splash") return;

    if (!user) {
      // Avoid getting stuck on auth pages when opening the native app - go to landing page
      if (isAuthPage(pathname) || isProtectedPage(pathname)) {
        navigate("/", { replace: true });
      }
      return;
    }

    // User exists - always redirect to appropriate dashboard
    const effectiveRole: AppRole = (role ?? "student") as AppRole;
    const isAdmin = effectiveRole === "admin" || effectiveRole === "teacher";

    if (isAdmin) {
      // Admin/teacher should always go to admin panel
      if (!pathname.startsWith("/admin") || pathname === "/admin-login") {
        navigate("/admin", { replace: true });
      }
      return;
    }

    // Student - always go to dashboard (not landing page)
    // This ensures after login, splash, or app reopen, student goes to dashboard
    if (pathname === "/" || pathname.startsWith("/admin") || isAuthPage(pathname)) {
      navigate("/dashboard", { replace: true });
    }
  }, [location.pathname, navigate, role, user]);

  const handleSplashFinished = useCallback(() => {
    if (loading) {
      pendingAfterLoadRef.current = true;
      return;
    }
    runPostSplashRedirect();
  }, [loading, runPostSplashRedirect]);

  useEffect(() => {
    if (!pendingAfterLoadRef.current) return;
    if (loading) return;

    pendingAfterLoadRef.current = false;
    runPostSplashRedirect();
  }, [loading, runPostSplashRedirect]);

  if (location.pathname === "/splash") return <>{children}</>;

  return <SplashGate onFinished={handleSplashFinished}>{children}</SplashGate>;
};

export default SplashAppGate;
