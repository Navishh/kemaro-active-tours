import heroImg from "@/assets/hero-villa.jpg";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative h-[100svh] min-h-[700px] w-full overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="Overwater luxury villa at sunset"
          className="h-full w-full object-cover animate-slow-zoom"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 overlay-hero" />
      </div>

      <div className="container-luxury relative z-10 flex h-full flex-col items-center justify-center text-center">
        <span className="reveal eyebrow mb-8 text-on-image-soft before:bg-on-image">Curated Luxury Travel</span>

        <h1 className="reveal reveal-delay-1 max-w-5xl display-xl font-display text-on-image">
          A Cinematic Pursuit
          <span className="block italic text-shimmer-gold">of Extraordinary</span>
          Places.
        </h1>

        <p className="reveal reveal-delay-2 mt-10 max-w-xl text-base md:text-lg text-on-image-soft leading-relaxed">
          Bespoke itineraries crafted by seasoned travel curators — from overwater
          sanctuaries in the Maldives to private chalets above the Alps.
        </p>

        <div className="reveal reveal-delay-3 mt-12 flex flex-col sm:flex-row items-center gap-5">
          <Button variant="gold" size="xl">Begin Your Journey</Button>
          <Button variant="outlineGold" size="xl" className="text-on-image border-on-image hover:bg-on-image hover:text-foreground">Explore Destinations</Button>
        </div>

        <div className="reveal reveal-delay-4 absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <span className="text-[10px] uppercase tracking-[0.4em] text-on-image-faint">Scroll</span>
          <div className="h-12 w-px bg-primary/60 animate-shimmer-line" />
          <ArrowDown className="h-4 w-4 text-primary animate-float-soft" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
