import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import SplashScreen from "@/components/splash/SplashScreen";

const SplashPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Splash | Idarah Tarjumat-ul-Qur'an</title>
        <meta name="robots" content="noindex" />
        <link rel="canonical" href="/splash" />
      </Helmet>

      <SplashScreen onFinished={() => navigate("/", { replace: true })} />
    </>
  );
};

export default SplashPage;

