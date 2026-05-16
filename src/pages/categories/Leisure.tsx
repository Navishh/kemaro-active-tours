import CategoryPage from "@/components/luxury/CategoryPage";
import hero from "@/assets/hero-leisure.jpg";
import pillar from "@/assets/cat-leisure.jpg";
import yoga from "@/assets/leisure-yoga.jpg";
import wine from "@/assets/leisure-wine.jpg";
import spa from "@/assets/leisure-spa.jpg";

const Leisure = () => (
  <CategoryPage
    category="leisure"
    eyebrow="Sports & Leisure"
    title={
      <>
        Movement, met with
        <span className="block italic text-gold">stillness.</span>
      </>
    }
    subtitle="Cycling through vineyards, sailing quiet coves, yoga at sunrise — itineraries that thread gentle exertion through long, unhurried days."
    heroImg={hero}
    introHeading={
      <>
        The art of
        <span className="italic text-gold"> active </span>
        rest.
      </>
    }
    introBody="Half-day rides, restorative afternoons, dinners that linger. We compose journeys for travellers who want their bodies engaged without their schedules consumed — every active morning earns a slow evening."
    stats={[
      { v: "4hr", l: "Avg. Daily Activity" },
      { v: "60+", l: "Wellness Partners" },
      { v: "5★", l: "Residence Tier" },
    ]}
    experiences={[
      { img: yoga, name: "Bali Wellness Retreat", region: "Ubud, Indonesia", duration: "8 nights", from: "$5,400", intensity: "Restorative" },
      { img: wine, name: "Tuscan Cycling & Wine", region: "Chianti, Italy", duration: "7 nights", from: "$6,900", intensity: "Easy" },
      { img: spa, name: "Moroccan Hammam Journey", region: "Marrakech, Morocco", duration: "6 nights", from: "$4,800", intensity: "Gentle" },
    ]}
    pillars={[
      { title: "Balanced Daily Rhythm", text: "Mornings of movement, afternoons of stillness — designed by wellness curators, not packed by salespeople." },
      { title: "Residence-Level Comfort", text: "Boutique villas, design hotels, private estates. Every place you sleep is part of the experience." },
      { title: "Quiet Logistics", text: "Private transfers, no group buses, no early-morning queues. The friction stays invisible." },
    ]}
    pillarImg={pillar}
  />
);

export default Leisure;
