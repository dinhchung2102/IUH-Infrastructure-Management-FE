import {
  AboutHeroSection,
  AboutStatsSection,
  MissionVisionSection,
  FunctionsSection,
  TeamSection,
} from "./components";

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      <AboutHeroSection />
      <AboutStatsSection />
      <MissionVisionSection />
      <FunctionsSection />
      <TeamSection />
    </div>
  );
}
