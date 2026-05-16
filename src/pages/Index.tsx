import Navbar from "@/components/luxury/Navbar";
import Hero from "@/components/luxury/Hero";
import Intro from "@/components/luxury/Intro";
import Categories from "@/components/luxury/Categories";
import Destinations from "@/components/luxury/Destinations";
import Customization from "@/components/luxury/Customization";
import FeaturedCarousel from "@/components/luxury/FeaturedCarousel";
import Showcase from "@/components/luxury/Showcase";
import Gallery from "@/components/luxury/Gallery";
import Testimonials from "@/components/luxury/Testimonials";
import CtaSection from "@/components/luxury/CtaSection";
import Footer from "@/components/luxury/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Intro />
      <Categories />
      <Destinations />
      <Customization />
      <FeaturedCarousel />
      <Showcase />
      <Gallery />
      <Testimonials />
      <CtaSection />
      <Footer />
    </main>
  );
};

export default Index;
