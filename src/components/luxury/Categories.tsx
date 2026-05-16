import sportsImg from "@/assets/cat-sports.jpg";
import leisureImg from "@/assets/cat-leisure.jpg";
import volunteerImg from "@/assets/cat-volunteer.jpg";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const cards = [
  {
    img: sportsImg,
    title: "Sports",
    tag: "Performance",
    blurb: "Trail running, climbing, surf — coached journeys for those who travel to move.",
    href: "/categories/sports",
  },
  {
    img: leisureImg,
    title: "Sports & Leisure",
    tag: "Balance",
    blurb: "Cycling vineyards, sailing coastlines, slow mornings — exertion threaded with ease.",
    href: "/categories/leisure",
  },
  {
    img: volunteerImg,
    title: "Volunteering",
    tag: "Purpose",
    blurb: "Conservation, teaching, ocean cleanups — travel that gives back to the place.",
    href: "/categories/volunteering",
  },
];

const Categories = () => {
  return (
    <section id="categories" className="relative py-32 md:py-44 bg-secondary/40">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--gradient-soft)" }} aria-hidden />
      <div className="container-luxury relative">
        <div className="mb-20 max-w-2xl">
          <span className="eyebrow mb-6">Three Ways to Travel</span>
          <h2 className="display-lg font-display text-foreground">
            Choose your
            <span className="italic text-shimmer-gold"> rhythm.</span>
          </h2>
        </div>

        <div className="grid gap-6 md:gap-8 md:grid-cols-3">
          {cards.map((c, i) => (
            <Link
              key={c.title}
              to={c.href}
              className="reveal group relative block overflow-hidden rounded-2xl shadow-elegant corner-accents"
              style={{ aspectRatio: "3 / 4", animationDelay: `${0.15 * i}s` }}
            >
              <div className="luxury-image absolute inset-0">
                <img src={c.img} alt={c.title} loading="lazy" width={1600} height={1280} />
              </div>
              <div className="absolute inset-0 overlay-cinematic" />
              <div className="absolute inset-0 flex flex-col justify-end p-7 md:p-9 transition-transform duration-700 ease-cinematic group-hover:-translate-y-1">
                <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">
                  0{i + 1} · {c.tag}
                </div>
                <div className="flex items-end justify-between gap-4 mb-4">
                  <h3 className="font-display text-3xl md:text-4xl text-on-image">{c.title}</h3>
                  <ArrowUpRight className="h-6 w-6 text-on-image-soft transition-all duration-700 ease-cinematic group-hover:text-primary group-hover:-translate-y-1 group-hover:translate-x-1" />
                </div>
                <p className="text-sm text-on-image-soft leading-relaxed max-w-xs">{c.blurb}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
