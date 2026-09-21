import { Hero } from "@/components/marketing/Hero";
import { ProblemSection } from "@/components/marketing/ProblemSection";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { PersonalisationSection } from "@/components/marketing/PersonalisationSection";
import { ArchitectureSection } from "@/components/marketing/ArchitectureSection";
import { FeaturesSection } from "@/components/marketing/FeaturesSection";
import { PrivacySectionMarketing } from "@/components/marketing/PrivacySectionMarketing";
import { ResearchApproachSection } from "@/components/marketing/ResearchApproachSection";
import { FAQSection } from "@/components/marketing/FAQSection";
import { CTASection } from "@/components/marketing/CTASection";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <ProblemSection />
      <HowItWorks />
      <PersonalisationSection />
      <ArchitectureSection />
      <FeaturesSection />
      <PrivacySectionMarketing />
      <ResearchApproachSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
