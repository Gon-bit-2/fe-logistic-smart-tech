import Navbar from "@/components/landing-page/Navbar";
import HeroSection from "@/components/landing-page/HeroSection";
import StatBar from "@/components/landing-page/StatBar";
import SocialProof from "@/components/landing-page/SocialProof";
import FeaturesSection from "@/components/landing-page/FeaturesSection";
import SustainabilitySection from "@/components/landing-page/SustainabilitySection";
import TestimonialSection from "@/components/landing-page/TestimonialSection";
import CallToAction from "@/components/landing-page/CallToAction";
import Footer from "@/components/landing-page/Footer";

export default function Home() {
  return (
    <div className="bg-background text-on-background selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <StatBar />
        <SocialProof />
        <FeaturesSection />
        <SustainabilitySection />
        <TestimonialSection />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}
