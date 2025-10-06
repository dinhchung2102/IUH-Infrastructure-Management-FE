import {
  HeroSection,
  StatsSection,
  FeaturesSection,
  RecentNewsSection,
  CTASection,
} from "./components";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <RecentNewsSection />
      <CTASection />
    </div>
  );
}
