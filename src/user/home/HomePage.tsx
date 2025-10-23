import {
  HeroSection,
  StatsSection,
  AboutIntroSection,
  RecentNewsSection,
  PageLayout,
} from "./components";

export default function HomePage() {
  return (
    <PageLayout>
      <div className="flex flex-col">
        <HeroSection />
        <StatsSection />
        <AboutIntroSection />
        <RecentNewsSection />
      </div>
    </PageLayout>
  );
}
