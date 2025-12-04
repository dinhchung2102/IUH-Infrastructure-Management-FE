import {
  FacilitiesHeroSection,
  FacilitiesStats,
  FacilitiesOverviewSection,
} from "./components";

export default function FacilitiesPage() {
  return (
    <div className="flex flex-col">
      <FacilitiesHeroSection />
      <FacilitiesStats />
      <FacilitiesOverviewSection />
    </div>
  );
}
