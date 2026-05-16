import { useEffect, useState } from "react";
import { Quote } from "lucide-react";

const items = [
  {
    quote:
      "Kemaro composed a journey through Japan that felt like reading a private letter — every detail intentional, every silence earned.",
    name: "Eleanor Whitford",
    role: "Repeat Traveller · London",
  },
  {
    quote:
      "From a hidden vineyard in Piedmont to a chartered sail through the Aeolian Islands — three weeks of the most quietly remarkable days of our lives.",
    name: "Mateo & Camille Aragón",
    role: "Honeymoon · Mexico City",
  },
  {
    quote:
      "I have travelled with the great houses for thirty years. This was the first itinerary that surprised me from the first morning to the last.",
    name: "Dr. Henrik Voss",
    role: "Member · Copenhagen",
  },
];

const Testimonials = () => {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % items.length), 7000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="py-32 md:py-44 bg-secondary/40">
      <div className="container-luxury max-w-4xl text-center">
        <div className="flex justify-center mb-8"><span className="eyebrow">Letters from Travellers</span></div>

        <Quote className="mx-auto mb-10 h-10 w-10 text-primary/70" strokeWidth={1.2} />

        <div className="relative min-h-[260px] md:min-h-[220px]">
          {items.map((it, idx) => (
            <div
              key={idx}
              className="absolute inset-0 transition-opacity duration-1000 ease-cinematic"
              style={{ opacity: i === idx ? 1 : 0, pointerEvents: i === idx ? "auto" : "none" }}
            >
              <p className="font-display text-2xl md:text-4xl leading-[1.4] text-foreground italic">
                <span className="text-shimmer-gold not-italic mr-1">"</span>{it.quote}<span className="text-shimmer-gold not-italic ml-1">"</span>
              </p>
              <div className="mt-10">
                <div className="text-sm tracking-wide text-foreground">{it.name}</div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{it.role}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 flex justify-center gap-2">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              aria-label={`Testimonial ${idx + 1}`}
              className={`h-1 rounded-full transition-all duration-700 ease-cinematic ${
                i === idx ? "w-10 bg-primary" : "w-4 bg-border"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
