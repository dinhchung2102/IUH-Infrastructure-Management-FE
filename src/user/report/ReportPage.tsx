import {
  ReportHeroSection,
  ReportStatsSection,
  ReportForm,
  ReportSidebar,
} from "./components";

export default function ReportPage() {
  return (
    <div className="flex flex-col">
      <ReportHeroSection />
      <ReportStatsSection />

      {/* Report Form */}
      <section className="container py-16">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-8 lg:grid-cols-3">
            <ReportForm />
            <ReportSidebar />
          </div>
        </div>
      </section>
    </div>
  );
}
