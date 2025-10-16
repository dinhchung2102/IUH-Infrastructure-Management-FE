import { ReportForm, ReportHeroSection } from "./components";

export default function ReportPage() {
  return (
    <>
      <ReportHeroSection />
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-b from-background to-muted/50 py-12 px-4">
        <div className="w-full max-w-3xl">
          <ReportForm />
        </div>
      </div>
    </>
  );
}
