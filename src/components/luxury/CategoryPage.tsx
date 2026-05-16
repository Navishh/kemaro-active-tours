import Navbar from "@/components/luxury/Navbar";
import Footer from "@/components/luxury/Footer";
import CtaSection from "@/components/luxury/CtaSection";
import BookingForm from "@/components/luxury/booking/BookingForm";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Check } from "lucide-react";
import { Link } from "react-router-dom";

export type CategorySlug = "sports" | "leisure" | "volunteering";

export type Experience = {
  img: string;
  name: string;
  region: string;
  duration: string;
  from: string;
  intensity: string;
};

export type CategoryPageProps = {
  eyebrow: string;
  title: React.ReactNode;
  subtitle: string;
  heroImg: string;
  introHeading: React.ReactNode;
  introBody: string;
  stats: { v: string; l: string }[];
  experiences: Experience[];
  pillars: { title: string; text: string }[];
  pillarImg: string;
  category: CategorySlug;
};

const CategoryPage = ({
  category,
  eyebrow,
  title,
  subtitle,
  heroImg,
  introHeading,
  introBody,
  stats,
  experiences,
  pillars,
  pillarImg,
}: CategoryPageProps) => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* HERO */}
      <section className="relative h-[92svh] min-h-[640px] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt={`${eyebrow} hero`}
            className="h-full w-full object-cover animate-slow-zoom"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 overlay-hero" />
        </div>

        <div className="container-luxury relative z-10 flex h-full flex-col items-center justify-center text-center">
          <span className="reveal eyebrow mb-8 text-on-image-soft before:bg-on-image">{eyebrow}</span>
          <h1 className="reveal reveal-delay-1 max-w-5xl display-xl font-display text-on-image">
            {title}
          </h1>
          <p className="reveal reveal-delay-2 mt-10 max-w-xl text-base md:text-lg text-on-image-soft leading-relaxed">
            {subtitle}
          </p>
          <div className="reveal reveal-delay-3 mt-12 flex flex-col sm:flex-row gap-5">
            <Button variant="gold" size="xl" asChild>
              <Link to={`/customize?category=${category}`}>Begin Customization</Link>
            </Button>
            <Button variant="outlineGold" size="xl" asChild className="text-on-image border-on-image hover:bg-on-image hover:text-foreground">
              <a href="#experiences">View Experiences</a>
            </Button>
          </div>
        </div>
      </section>

      {/* INTRO + STATS */}
      <section className="py-32 md:py-44">
        <div className="container-luxury grid gap-16 md:grid-cols-12 md:gap-20 items-start">
          <div className="md:col-span-5">
            <span className="eyebrow mb-8">The Discipline</span>
            <h2 className="text-4xl md:text-6xl leading-[1.05] text-foreground">{introHeading}</h2>
          </div>
          <div className="md:col-span-7 md:pt-6">
            <p className="text-lg leading-loose text-muted-foreground">{introBody}</p>
            <div className="mt-16 grid grid-cols-3 gap-6 border-t border-border/60 pt-10">
              {stats.map((s) => (
                <div key={s.l}>
                  <div className="font-display text-3xl md:text-5xl text-gold">{s.v}</div>
                  <div className="mt-2 text-xs uppercase tracking-[0.25em] text-muted-foreground">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* EXPERIENCES GRID */}
      <section id="experiences" className="py-32 md:py-44 bg-secondary/40">
        <div className="container-luxury">
          <div className="mb-20 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div className="max-w-2xl">
              <span className="eyebrow mb-6">Signature Experiences</span>
              <h2 className="text-4xl md:text-6xl leading-[1.05] text-foreground">
                Curated
                <span className="italic text-gold"> journeys.</span>
              </h2>
            </div>
            <Link to={`/customize?category=${category}`} className="text-sm uppercase tracking-[0.3em] text-primary hover:text-primary-glow transition-colors">
              Build Your Own →
            </Link>
          </div>

          <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {experiences.map((e, i) => (
              <article
                key={e.name}
                className="reveal group"
                style={{ animationDelay: `${0.1 * i}s` }}
              >
                <div className="luxury-image relative rounded-2xl overflow-hidden mb-6 shadow-elegant corner-accents" style={{ aspectRatio: "4 / 5" }}>
                  <img src={e.img} alt={e.name} loading="lazy" width={1280} height={896} />
                  <div className="absolute inset-0 overlay-cinematic opacity-50" />
                  <div className="absolute top-5 left-5 rounded-full border-on-image bg-on-image-glass px-4 py-1.5 text-[10px] uppercase tracking-[0.25em] text-on-image">
                    {e.intensity}
                  </div>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-[0.3em] text-primary mb-2">{e.region}</div>
                    <h3 className="font-display text-2xl text-foreground mb-1">{e.name}</h3>
                    <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{e.duration}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">From</div>
                    <div className="font-display text-xl text-gold">{e.from}</div>
                  </div>
                </div>
                <Link
                  to={`/customize?category=${category}`}
                  className="mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-foreground/80 hover:text-primary transition-colors duration-500 ease-cinematic"
                >
                  Tailor this journey
                  <ArrowUpRight className="h-3 w-3 transition-transform duration-700 ease-cinematic group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PILLARS */}
      <section className="py-32 md:py-44">
        <div className="container-luxury grid gap-16 lg:grid-cols-12 lg:gap-20 items-center">
          <div className="lg:col-span-6 luxury-image group rounded-2xl shadow-float corner-accents relative" style={{ aspectRatio: "4 / 5" }}>
            <img src={pillarImg} alt="Category pillar" loading="lazy" width={1600} height={1280} />
          </div>
          <div className="lg:col-span-6">
            <span className="eyebrow mb-6">Our Method</span>
            <h2 className="text-4xl md:text-6xl leading-[1.05] text-foreground mb-12">
              How we
              <span className="italic text-gold"> design </span>
              every journey.
            </h2>

            <div className="space-y-8">
              {pillars.map((p, i) => (
                <div key={p.title} className="flex gap-5 group">
                  <div className="shrink-0 mt-1 flex h-10 w-10 items-center justify-center rounded-full border border-primary/40 text-gold transition-all duration-500 ease-cinematic group-hover:bg-primary group-hover:text-primary-foreground">
                    <Check className="h-4 w-4" strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.3em] text-primary/80 mb-2">
                      0{i + 1}
                    </div>
                    <h3 className="font-display text-2xl text-foreground mb-2">{p.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground max-w-md">{p.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* BOOKING — Sri Lanka map + multi-step form */}
      <section id="book" className="py-32 md:py-44 bg-secondary/30 border-y border-border/40">
        <div className="container-luxury">
          <div className="mb-16 max-w-2xl">
            <span className="eyebrow mb-6">Plan Your Journey</span>
            <h2 className="text-4xl md:text-6xl leading-[1.05] text-foreground">
              Design your
              <span className="italic text-gold"> Sri Lankan </span>
              itinerary.
            </h2>
            <p className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed">
              Pick your cities, hand-select the stops worth your time, and watch the island reveal itself on the map.
            </p>
          </div>
          <BookingForm category={category} />
        </div>
      </section>

      <CtaSection />
      <Footer />
    </main>
  );
};

export default CategoryPage;
