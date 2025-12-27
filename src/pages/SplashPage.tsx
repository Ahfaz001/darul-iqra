import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/contexts/AuthContext";
import SplashScreen from "@/components/splash/SplashScreen";

const SplashPage = () => {
  const navigate = useNavigate();
  const { user, role, loading } = useAuth();

  const handleFinished = useCallback(() => {
    if (loading) {
      navigate("/", { replace: true });
      return;
    }

    if (!user) {
      navigate("/", { replace: true });
      return;
    }

    if (role === "admin" || role === "teacher") {
      navigate("/admin", { replace: true });
      return;
    }

    navigate("/dashboard", { replace: true });
  }, [loading, navigate, role, user]);

  return (
    <>
      <Helmet>
        <title>Splash | Idarah Tarjumat-ul-Qur'an</title>
        <meta name="robots" content="noindex" />
        <link rel="canonical" href="/splash" />
      </Helmet>

      <SplashScreen onFinished={handleFinished} />
    </>
  );
};

export default SplashPage;

