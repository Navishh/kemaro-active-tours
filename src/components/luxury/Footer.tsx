const cols = [
  { title: "Maison", links: ["Our Philosophy", "The Curators", "Press", "Careers"] },
  { title: "Journeys", links: ["Destinations", "Private Yachts", "Cultural Immersions", "Wellness"] },
  { title: "Concierge", links: ["Contact", "Members Lounge", "Gift Journeys", "FAQ"] },
];

const Footer = () => {
  return (
    <footer className="border-t border-border/60 bg-background pt-24 pb-10">
      <div className="container-luxury">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/50 text-gold font-display text-xl">K</div>
              <div>
                <div className="font-display text-2xl">Kemaro Active Tours</div>
                <div className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground">Curated Luxury Travel</div>
              </div>
            </div>
            <p className="max-w-md text-muted-foreground leading-relaxed">
              An atelier of journey-makers designing the most quietly remarkable travel on earth.
            </p>
          </div>

          {cols.map((c) => (
            <div key={c.title} className="md:col-span-2">
              <h4 className="text-xs uppercase tracking-[0.3em] text-primary mb-5">{c.title}</h4>
              <ul className="space-y-3">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-500 ease-cinematic">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="md:col-span-1" />
        </div>

        <div className="mt-20 pt-8 border-t border-border/60 flex flex-col md:flex-row items-center justify-between gap-4 text-xs uppercase tracking-[0.25em] text-muted-foreground">
          <div>© {new Date().getFullYear()} Maison Voyage</div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
