import {
  FacilitiesHeroSection,
  FacilitiesStats,
  FacilitiesGrid,
  FacilitiesFilters,
} from "./components";

export default function FacilitiesPage() {
  return (
    <div className="flex flex-col">
      <FacilitiesHeroSection />
      <FacilitiesStats />
      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <FacilitiesFilters />
          </aside>
          <main className="lg:col-span-3">
            <FacilitiesGrid />
          </main>
        </div>
      </div>
    </div>
  );
}
