import CategoryPage from "@/components/luxury/CategoryPage";
import hero from "@/assets/hero-volunteer.jpg";
import pillar from "@/assets/cat-volunteer.jpg";
import wildlife from "@/assets/vol-wildlife.jpg";
import teaching from "@/assets/vol-teaching.jpg";
import ocean from "@/assets/vol-ocean.jpg";

const Volunteering = () => (
  <CategoryPage
    category="volunteering"
    eyebrow="Volunteer Travel"
    title={
      <>
        Travel that
        <span className="block italic text-gold">leaves something behind.</span>
      </>
    }
    subtitle="Vetted conservation, education and community projects — meaningful contribution paired with the same considered comfort as our other journeys."
    heroImg={hero}
    introHeading={
      <>
        Purpose,
        <span className="italic text-gold"> properly </span>
        organised.
      </>
    }
    introBody="Every project is selected with the local partner organisation, never imposed. Your contribution is measured, your skills are matched, and the long-term impact is reported back to you in the months that follow."
    stats={[
      { v: "32", l: "Vetted Partners" },
      { v: "100%", l: "Local-Led Projects" },
      { v: "12mo", l: "Impact Reporting" },
    ]}
    experiences={[
      { img: wildlife, name: "Sea Turtle Conservation", region: "Costa Rica", duration: "14 nights", from: "$3,900", intensity: "Field Work" },
      { img: teaching, name: "Himalayan Teaching Programme", region: "Ladakh, India", duration: "21 nights", from: "$4,600", intensity: "Education" },
      { img: ocean, name: "Coral Reef Restoration", region: "Raja Ampat, Indonesia", duration: "10 nights", from: "$5,200", intensity: "Diving" },
    ]}
    pillars={[
      { title: "Locally Led", text: "Projects designed and run by local NGOs and communities — we support, we never direct." },
      { title: "Skill-Matched Placement", text: "Your background, languages and certifications are matched to roles where they create real value." },
      { title: "Measurable Impact", text: "Twelve months of follow-up reporting, so you see what your time actually changed." },
    ]}
    pillarImg={pillar}
  />
);

export default Volunteering;
