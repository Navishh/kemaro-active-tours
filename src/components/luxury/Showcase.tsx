import yacht from "@/assets/showcase-yacht.jpg";
import { Button } from "@/components/ui/button";
import { Anchor, Compass, Gem, Sparkles } from "lucide-react";

const features = [
  { icon: Compass, title: "Private Itineraries", text: "Crafted around your pace, your interests, your silences." },
  { icon: Anchor, title: "Yacht & Aviation", text: "Seamless private transfers between continents and coves." },
  { icon: Gem, title: "Concierge Access", text: "Doors that don't open for everyone — opened for you." },
  { icon: Sparkles, title: "Cultural Immersion", text: "Local artisans, hidden ateliers, dinners with masters." },
];

const Showcase = () => {
  return (
    <section className="py-32 md:py-44">
      <div className="container-luxury grid gap-16 lg:grid-cols-12 lg:gap-20 items-center">
        <div className="lg:col-span-6 luxury-image group rounded-2xl shadow-float corner-accents relative" style={{ aspectRatio: "4 / 5" }}>
          <img src={yacht} alt="Private yacht at golden hour" loading="lazy" width={1600} height={1024} />
        </div>

        <div className="lg:col-span-6">
          <span className="eyebrow mb-6">The Experience</span>
          <h2 className="display-lg font-display text-foreground mb-8">
            Beyond
            <span className="italic text-shimmer-gold"> itineraries </span>
            — into atmosphere.
          </h2>
          <p className="text-lg leading-loose text-muted-foreground mb-12">
            Our travel curators spend years cultivating the relationships and the
            instinct required to design days that feel inevitable, never arranged.
          </p>

          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-10">
            {features.map((f) => (
              <div key={f.title} className="group">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-primary/40 text-gold transition-all duration-500 ease-cinematic group-hover:bg-primary group-hover:text-primary-foreground">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-2xl mb-2 text-foreground">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <Button variant="outlineGold" size="pill">Discover the Method</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Showcase;
