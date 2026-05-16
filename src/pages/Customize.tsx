import Navbar from "@/components/luxury/Navbar";
import Footer from "@/components/luxury/Footer";
import BookingForm from "@/components/luxury/booking/BookingForm";
import { useSearchParams } from "react-router-dom";

const VALID = ["sports", "leisure", "volunteering"] as const;
type Slug = (typeof VALID)[number];

const Customize = () => {
  const [params] = useSearchParams();
  const raw = params.get("category");
  const initial = (VALID as readonly string[]).includes(raw ?? "")
    ? (raw as Slug)
    : undefined;

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-40 pb-32 md:pt-48 md:pb-44">
        <div className="container-luxury">
          <div className="mb-16 max-w-2xl">
            <span className="eyebrow mb-6">Plan Your Journey</span>
            <h1 className="text-4xl md:text-6xl leading-[1.05] text-foreground">
              Design your
              <span className="italic text-gold"> Sri Lankan </span>
              itinerary.
            </h1>
            <p className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed">
              Pick your category, your cities, and the stops worth your time — the island reveals itself on the map.
            </p>
          </div>
          <BookingForm initialCategory={initial} />
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default Customize;
