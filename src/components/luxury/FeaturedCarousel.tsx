import { useRef } from "react";
import amalfi from "@/assets/feat-amalfi.jpg";
import patagonia from "@/assets/feat-patagonia.jpg";
import serengeti from "@/assets/feat-serengeti.jpg";
import borabora from "@/assets/feat-borabora.jpg";
import iceland from "@/assets/feat-iceland.jpg";
import { ArrowLeft, ArrowRight } from "lucide-react";

const slides = [
  { img: amalfi, name: "Amalfi Coast", region: "Italy", duration: "7 nights", from: "$8,400" },
  { img: patagonia, name: "Patagonia", region: "Argentina", duration: "10 nights", from: "$12,200" },
  { img: serengeti, name: "Serengeti", region: "Tanzania", duration: "9 nights", from: "$14,800" },
  { img: borabora, name: "Bora Bora", region: "French Polynesia", duration: "7 nights", from: "$11,600" },
  { img: iceland, name: "Iceland", region: "Nordic", duration: "6 nights", from: "$7,900" },
];

const FeaturedCarousel = () => {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: "l" | "r") => {
    if (!ref.current) return;
    const w = ref.current.clientWidth * 0.6;
    ref.current.scrollBy({ left: dir === "l" ? -w : w, behavior: "smooth" });
  };

  return (
    <section className="py-32 md:py-44 bg-secondary/40">
      <div className="container-luxury">
        <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div className="max-w-2xl">
            <span className="eyebrow mb-6">Signature Journeys</span>
            <h2 className="text-4xl md:text-6xl leading-[1.05] text-foreground">
              Itineraries
              <span className="italic text-gold"> in motion.</span>
            </h2>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => scroll("l")}
              aria-label="Previous"
              className="h-12 w-12 rounded-full border border-border hover:border-primary hover:text-primary text-foreground transition-all duration-500 ease-cinematic flex items-center justify-center"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll("r")}
              aria-label="Next"
              className="h-12 w-12 rounded-full border border-border hover:border-primary hover:text-primary text-foreground transition-all duration-500 ease-cinematic flex items-center justify-center"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={ref}
        className="flex gap-6 md:gap-8 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-6 px-6 md:px-10 lg:px-[calc((100vw-1280px)/2+2.5rem)] no-scrollbar"
      >
        {slides.map((s) => (
          <article
            key={s.name}
            className="snap-start shrink-0 w-[85%] sm:w-[55%] lg:w-[38%] xl:w-[32%]"
          >
            <div className="luxury-image group relative rounded-2xl overflow-hidden mb-6 shadow-elegant corner-accents" style={{ aspectRatio: "4 / 5" }}>
              <img src={s.img} alt={s.name} loading="lazy" width={1280} height={896} />
              <div className="absolute inset-0 overlay-cinematic opacity-60" />
              <div className="absolute top-5 right-5 rounded-full border-on-image bg-on-image-glass px-4 py-1.5 text-[10px] uppercase tracking-[0.25em] text-on-image">
                {s.duration}
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.3em] text-primary mb-2">{s.region}</div>
                <h3 className="font-display text-3xl text-foreground">{s.name}</h3>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">From</div>
                <div className="font-display text-xl text-gold">{s.from}</div>
              </div>
            </div>
          </article>
        ))}
        <div className="shrink-0 w-2" />
      </div>
    </section>
  );
};

export default FeaturedCarousel;
