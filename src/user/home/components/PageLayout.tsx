import { type ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Main content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
