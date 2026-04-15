import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import {
  CallToAction,
  FeaturesSection,
  HeroSection,
  SocialProof,
  StatBar,
  SustainabilitySection,
  TestimonialSection,
} from "@/features/landing";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-on-background selection:bg-primary-fixed selection:text-on-primary-fixed">
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
