import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Sparkles } from "lucide-react";

const styles: { label: string; slug: "sports" | "leisure" | "volunteering" }[] = [
  { label: "Sports", slug: "sports" },
  { label: "Sports & Leisure", slug: "leisure" },
  { label: "Volunteering", slug: "volunteering" },
];

const Customization = () => {
  const [active, setActive] = useState(styles[0]);

  return (
    <section id="customize" className="py-32 md:py-44">
      <div className="container-luxury grid gap-20 lg:grid-cols-12 items-center">
        <div className="lg:col-span-5">
          <span className="eyebrow mb-6">Design Your Journey</span>
          <h2 className="display-lg font-display text-foreground mb-8">
            A trip,
            <span className="italic text-shimmer-gold"> shaped </span>
            entirely around you.
          </h2>
          <p className="text-lg leading-loose text-muted-foreground">
            Tell us where your imagination wanders. Our curators will compose a
            private itinerary — destinations, residences, experiences — within 24 hours.
          </p>
        </div>

        <div className="lg:col-span-7">
          <div className="glass-card p-8 md:p-10 shadow-float">
            <div className="flex flex-wrap gap-2 mb-8">
              {styles.map((s) => (
                <button
                  key={s.slug}
                  onClick={() => setActive(s)}
                  className={`rounded-full px-5 py-2 text-xs uppercase tracking-[0.25em] border transition-all duration-500 ease-cinematic ${
                    active.slug === s.slug
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:text-primary hover:border-primary/60"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <Field icon={MapPin} label="Destination" placeholder="Maldives, Kyoto…" />
              <Field icon={Calendar} label="Travel Dates" placeholder="Select window" />
              <Field icon={Users} label="Travellers" placeholder="2 adults" />
              <Field icon={Sparkles} label="Budget Tier" placeholder="From $5,000 pp" />
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                No commitment · Reply within 24h
              </p>
              <Button asChild variant="gold" size="pill">
                <Link to={`/customize?category=${active.slug}`}>Begin Customization</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Field = ({ icon: Icon, label, placeholder }: { icon: any; label: string; placeholder: string }) => (
  <div className="group relative">
    <label className="absolute left-12 top-3 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
      {label}
    </label>
    <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/70" />
    <input
      type="text"
      placeholder={placeholder}
      className="w-full rounded-xl border border-border/60 bg-background/40 pl-12 pr-4 pt-7 pb-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/60 transition-colors duration-500"
    />
  </div>
);

export default Customization;
