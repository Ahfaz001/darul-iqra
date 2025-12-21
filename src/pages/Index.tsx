import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProgramsSection from "@/components/ProgramsSection";
import FeaturesSection from "@/components/FeaturesSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Dar-ul-Ulum Al-Qur'an Wa Sunnah Kalyan | Islamic Education Since 2008</title>
        <meta 
          name="description" 
          content="Dar-ul-Ulum Al-Qur'an Wa Sunnah Kalyan offers authentic Islamic education including Hifz-ul-Quran, Alim courses, and Arabic language programs. Established in 2008." 
        />
        <meta 
          name="keywords" 
          content="Islamic education, Madrasa, Quran, Hifz, Kalyan, Maharashtra, Islamic studies, Arabic language" 
        />
        <link rel="canonical" href="https://darululum-kalyan.edu" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <HeroSection />
          <AboutSection />
          <ProgramsSection />
          <FeaturesSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
