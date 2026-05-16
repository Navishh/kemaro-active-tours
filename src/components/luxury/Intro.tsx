const stats = [
  { v: "120+", l: "Curated Destinations" },
  { v: "24yr", l: "of Bespoke Travel" },
  { v: "98%", l: "Returning Travellers" },
];

const Intro = () => {
  return (
    <section className="py-32 md:py-44">
      <div className="container-luxury grid gap-16 md:grid-cols-12 md:gap-20 items-start">
        <div className="md:col-span-5">
          <span className="eyebrow mb-8">The Maison</span>
          <h2 className="display-lg font-display text-foreground">
            Travel,
            <span className="italic text-shimmer-gold"> reimagined </span>
            as a quiet art form.
          </h2>
        </div>

        <div className="md:col-span-7 md:pt-6">
          <p className="text-lg leading-loose text-muted-foreground">
            We design journeys for those who measure luxury in stillness, in
            craftsmanship, in unhurried mornings overlooking water no postcard could capture.
            Every itinerary is a private composition — never repeated, never replicated.
          </p>

          <div className="mt-16 grid grid-cols-3 gap-6 border-t border-border/60 pt-10">
            {stats.map((s) => (
              <div key={s.l}>
                <div className="font-display text-3xl md:text-5xl text-gold">{s.v}</div>
                <div className="mt-2 text-xs uppercase tracking-[0.25em] text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Intro;
