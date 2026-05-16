import dining from "@/assets/cta-dining.jpg";
import { Button } from "@/components/ui/button";

const CtaSection = () => {
  return (
    <section className="relative h-[80vh] min-h-[560px] w-full overflow-hidden">
      <div className="absolute inset-0 luxury-image">
        <img src={dining} alt="Sunset dining terrace" loading="lazy" width={1920} height={1080} />
      </div>
      <div className="absolute inset-0 overlay-hero" />

      <div className="container-luxury relative z-10 flex h-full flex-col items-center justify-center text-center">
        <span className="eyebrow mb-8 text-on-image-soft before:bg-on-image">Begin the Conversation</span>
        <h2 className="max-w-4xl display-lg font-display text-on-image">
          Your next chapter
          <span className="block italic text-shimmer-gold">awaits its setting.</span>
        </h2>
        <p className="mt-8 max-w-xl text-base md:text-lg text-on-image-soft">
          Share a few quiet details. We'll respond within 24 hours with a private proposal.
        </p>
        <div className="mt-12 flex flex-col sm:flex-row gap-5">
          <Button variant="gold" size="xl">Request a Proposal</Button>
          <Button variant="outlineGold" size="xl" className="text-on-image border-on-image hover:bg-on-image hover:text-foreground">Speak with a Curator</Button>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
