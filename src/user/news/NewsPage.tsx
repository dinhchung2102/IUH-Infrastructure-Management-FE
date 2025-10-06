import { NewsHeroSection, NewsSidebar, NewsGrid } from "./components";

export default function NewsPage() {
  return (
    <div className="flex flex-col">
      <NewsHeroSection />

      {/* Main Content */}
      <section className="container py-16">
        <div className="grid gap-8 lg:grid-cols-4">
          <NewsSidebar />
          <NewsGrid />
        </div>
      </section>
    </div>
  );
}
