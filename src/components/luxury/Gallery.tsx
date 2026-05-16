import cappadocia from "@/assets/gal-cappadocia.jpg";
import tuscany from "@/assets/gal-tuscany.jpg";
import dubai from "@/assets/gal-dubai.jpg";
import yacht from "@/assets/showcase-yacht.jpg";
import dining from "@/assets/cta-dining.jpg";

const Gallery = () => {
  return (
    <section className="py-32 md:py-44">
      <div className="container-luxury">
        <div className="mb-16 max-w-2xl">
          <span className="eyebrow mb-6">Moments</span>
          <h2 className="text-4xl md:text-6xl leading-[1.05] text-foreground">
            Frames from
            <span className="italic text-gold"> recent journeys.</span>
          </h2>
        </div>

        <div className="grid grid-cols-12 gap-4 md:gap-6">
          <Tile src={cappadocia} alt="Cappadocia balloons" className="col-span-12 md:col-span-5 row-span-2" ratio="4/5" />
          <Tile src={tuscany} alt="Tuscany" className="col-span-12 md:col-span-7" ratio="16/10" />
          <Tile src={yacht} alt="Yacht" className="col-span-7 md:col-span-4" ratio="4/3" />
          <Tile src={dubai} alt="Dubai" className="col-span-5 md:col-span-3" ratio="3/4" />
          <Tile src={dining} alt="Dining" className="col-span-12 md:col-span-12" ratio="21/9" />
        </div>
      </div>
    </section>
  );
};

const Tile = ({ src, alt, className, ratio }: { src: string; alt: string; className: string; ratio: string }) => (
  <div className={`luxury-image group rounded-2xl overflow-hidden shadow-elegant corner-accents relative ${className}`} style={{ aspectRatio: ratio }}>
    <img src={src} alt={alt} loading="lazy" />
    <div className="absolute inset-0 overlay-cinematic opacity-0 group-hover:opacity-60 transition-opacity duration-700 ease-cinematic" />
  </div>
);

export default Gallery;
