import CategoryPage from "@/components/luxury/CategoryPage";
import hero from "@/assets/hero-sports.jpg";
import pillar from "@/assets/cat-sports.jpg";
import mtb from "@/assets/sport-mtb.jpg";
import climb from "@/assets/sport-climb.jpg";
import surf from "@/assets/sport-surf.jpg";

const Sports = () => (
  <CategoryPage
    category="sports"
    eyebrow="Sports Travel"
    title={
      <>
        Travel that
        <span className="block italic text-gold">moves you forward.</span>
      </>
    }
    subtitle="Coached, expedition-grade journeys for runners, climbers, cyclists and surfers — designed around performance, recovery, and the landscapes worth chasing."
    heroImg={hero}
    introHeading={
      <>
        Engineered for
        <span className="italic text-gold"> athletes </span>
        who travel.
      </>
    }
    introBody="Each itinerary is built with performance coaches and local guides — pacing, altitude acclimation, recovery windows and nutrition planned alongside the route itself. You arrive ready, you leave stronger."
    stats={[
      { v: "1:1", l: "Coach Ratio" },
      { v: "40+", l: "Trail & Climb Routes" },
      { v: "24/7", l: "On-Trip Support" },
    ]}
    experiences={[
      { img: mtb, name: "Dolomites Singletrack", region: "Italian Alps", duration: "7 nights", from: "$6,400", intensity: "Intermediate" },
      { img: climb, name: "Yosemite Big Wall", region: "California, USA", duration: "9 nights", from: "$9,800", intensity: "Advanced" },
      { img: surf, name: "Mentawai Surf Charter", region: "Indonesia", duration: "10 nights", from: "$8,200", intensity: "All Levels" },
    ]}
    pillars={[
      { title: "Performance Coaching", text: "Pre-trip programming, on-trip pacing and recovery from certified coaches in your discipline." },
      { title: "Expedition-Grade Logistics", text: "Permits, transfers, equipment, weather windows — every variable handled before you arrive." },
      { title: "Recovery Built In", text: "Sports massage, ice baths, mobility sessions and nutrition woven into the daily rhythm." },
    ]}
    pillarImg={pillar}
  />
);

export default Sports;
