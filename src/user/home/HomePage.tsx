import {
  HeroSection,
  StatsSection,
  AboutIntroSection,
  RecentNewsSection,
} from "./components";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <StatsSection />
      <AboutIntroSection />
      <RecentNewsSection />
    </div>
  );
}
