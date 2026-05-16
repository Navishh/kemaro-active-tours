import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import ThemeToggle from "@/components/ThemeToggle";

const links = [
  { label: "Sports", href: "/categories/sports" },
  { label: "Sports & Leisure", href: "/categories/leisure" },
  { label: "Volunteering", href: "/categories/volunteering" },
  { label: "Journal", href: "/#gallery" },
  { label: "Contact", href: "/#contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-700 ease-cinematic",
        scrolled
          ? "bg-background/85 backdrop-blur-xl border-b border-border/60 py-4"
          : "bg-transparent py-7",
      )}
    >
      <div className="container-luxury flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/50 text-gold font-display text-xl">K</div>
          <div className="leading-tight">
            <div className="font-display text-xl text-foreground">Kemaro</div>
            <div className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground">Active Tours</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-10">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.href}
              className="gold-underline text-sm tracking-wide text-foreground/80 hover:text-primary transition-colors duration-500 ease-cinematic"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button variant="gold" size="pill" className="hidden sm:inline-flex" asChild>
            <Link to="/customize">
              Plan a Journey
              <ArrowUpRight className="ml-1" />
            </Link>
          </Button>
          <button className="lg:hidden text-foreground" aria-label="Open menu">
            <Menu />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
