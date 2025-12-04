import {
  AboutHeroSection,
  MissionSection,
  VisionSection,
  FunctionsSection,
  FunctionsDetailSection,
  ResponsibilitiesSection,
  TeamSection,
} from "./components";

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      <AboutHeroSection />
      <FunctionsSection />
      <MissionSection />
      <VisionSection />
      <FunctionsDetailSection />
      <ResponsibilitiesSection />
      <TeamSection />
    </div>
  );
}
