import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Emerald Logistics | Giao Nhận Bền Vững",
  description: "Giải pháp logistics xanh và hiệu quả cho doanh nghiệp của bạn.",
};

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
