import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
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

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");

  return {
    title: t("homeTitle"),
    description: t("homeDescription"),
  };
}

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
