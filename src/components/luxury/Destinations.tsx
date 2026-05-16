import santorini from "@/assets/dest-santorini.jpg";
import kyoto from "@/assets/dest-kyoto.jpg";
import marrakech from "@/assets/dest-marrakech.jpg";
import alps from "@/assets/dest-alps.jpg";
import { ArrowUpRight } from "lucide-react";

const items = [
  { img: santorini, name: "Santorini", region: "Aegean Sea, Greece", tag: "Coastal" },
  { img: kyoto, name: "Kyoto", region: "Honshu, Japan", tag: "Cultural" },
  { img: marrakech, name: "Marrakech", region: "Atlas, Morocco", tag: "Heritage" },
  { img: alps, name: "Zermatt", region: "Valais, Switzerland", tag: "Alpine" },
];

const Destinations = () => {
  return (
    <section id="destinations" className="py-32 md:py-44 bg-secondary/40">
      <div className="container-luxury">
        <div className="mb-20 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div className="max-w-2xl">
            <span className="eyebrow mb-6">Featured Destinations</span>
            <h2 className="display-lg font-display text-foreground">
              Places that
              <span className="italic text-shimmer-gold"> linger </span>
              long after the journey ends.
            </h2>
          </div>
          <a href="#" className="gold-underline text-sm uppercase tracking-[0.3em] text-primary self-start md:self-end">
            View All Destinations →
          </a>
        </div>

        <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => (
            <a
              key={it.name}
              href="#"
              className="group relative block overflow-hidden rounded-2xl shadow-elegant corner-accents"
              style={{ aspectRatio: "3 / 4" }}
            >
              <div className="luxury-image absolute inset-0">
                <img src={it.img} alt={it.name} loading="lazy" width={1024} height={1280} />
              </div>
              <div className="absolute inset-0 overlay-cinematic" />
              <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-7">
                <span className="self-start rounded-full border-on-image bg-on-image-glass px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-on-image">
                  0{i + 1} · {it.tag}
                </span>
                <div className="transition-transform duration-700 ease-cinematic group-hover:-translate-y-1">
                  <div className="text-xs uppercase tracking-[0.3em] text-primary mb-2">{it.region}</div>
                  <div className="flex items-end justify-between">
                    <h3 className="font-display text-3xl md:text-4xl text-on-image">{it.name}</h3>
                    <ArrowUpRight className="h-6 w-6 text-on-image-soft transition-all duration-700 ease-cinematic group-hover:text-primary group-hover:-translate-y-1 group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Destinations;
