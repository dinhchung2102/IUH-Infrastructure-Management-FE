import { ReportForm, ReportGuideSection } from "./components";

export default function ReportPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-background to-muted/50 py-12 px-4">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form báo cáo - Bên trái */}
          <div className="lg:col-span-2">
            <ReportForm />
          </div>

          {/* Hướng dẫn - Bên phải */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <ReportGuideSection />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
