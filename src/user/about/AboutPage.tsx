import {
  AboutHeroSection,
  AboutStatsSection,
  MissionVisionSection,
  ValuesSection,
  TeamSection,
  AboutCTASection,
} from "./components";

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      <AboutHeroSection />
      <AboutStatsSection />
      <MissionVisionSection />
      <ValuesSection />
      <TeamSection />
      <AboutCTASection />
    </div>
  );
}
