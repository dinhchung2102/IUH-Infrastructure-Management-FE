import {
  ContactHeroSection,
  ContactMethodsSection,
  ContactForm,
  ContactSidebar,
  MapSection,
} from "./components";

export default function ContactPage() {
  return (
    <div className="flex flex-col">
      <ContactHeroSection />
      <ContactMethodsSection />

      {/* Form Section */}
      <section className="bg-muted/50 py-16 md:py-24">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-3">
            <ContactForm />
            <ContactSidebar />
          </div>
        </div>
      </section>

      <MapSection />
    </div>
  );
}
