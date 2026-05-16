## Goal
Elevate the visual feel of the site (colors, typography, spacing, animations, micro-interactions, cards, gallery, hero) across both light and dark themes — without changing any functionality, routes, data, or form logic.

## Scope (visual only)
- Global tokens (`src/index.css`, `tailwind.config.ts`)
- Hero, Intro, Categories, Destinations, Customization, FeaturedCarousel, Showcase, Gallery, Testimonials, CtaSection, Footer, Navbar
- Booking form chrome (cards, chips, buttons) — NOT logic
- Cursor / pointer micro-interactions
- New shared primitives inspired by 21st.dev patterns (no new deps unless trivial)

## Design direction
A refined "editorial luxury" aesthetic — warm ivory light theme + deep cinematic dark theme, with:
- Warmer gold + a secondary muted teal/emerald accent for variety
- Typographic rhythm: larger display sizes, tighter tracking on display, looser on eyebrow, fluid clamps
- Soft-glass cards (subtle backdrop blur + 1px gold hairline + layered shadow)
- Smooth reveal-on-scroll (IntersectionObserver-based, no new deps)
- Custom luxury cursor (gold dot + ring follower; hides on touch / coarse pointers)
- Hero: parallax slow-zoom + animated gold underline shimmer + staggered text reveal
- Image tiles: Ken-burns hover, gold corner accents, caption slide-up
- Buttons: refined gold gradient with subtle inner highlight + magnetic hover lift

## Light/dark contrast rules
- Card backgrounds get their OWN foreground token (`--card-foreground`) — already present; ensure all card text uses `text-card-foreground` not `text-foreground`
- Add `--on-dark` and `--on-light` helper tokens for sections that use imagery/dark overlays in BOTH themes (hero, CTA, showcase) so text stays light regardless of theme
- New utility classes `.text-on-image` (always light) and `.surface-dark` (forces dark surface + light text in both themes) for image-overlay sections

## Technical changes

### 1. Tokens (`src/index.css`)
- Refine light palette: ivory `36 40% 98%`, warm ink `28 22% 14%`, deeper gold `36 70% 44%`, glow `42 85% 62%`
- Add: `--accent-2` (muted teal `175 28% 38%`), `--surface-elevated`, `--hairline` (gold @ 20%), `--shadow-soft`, `--shadow-float`, `--blur-glass`
- Add `.dark` variants for all new tokens
- New utilities: `.glass-card`, `.hairline-gold`, `.text-on-image`, `.surface-dark`, `.kenburns`, `.reveal-on-view`, `.magnetic`, `.gold-underline`
- Fluid typography: `.display-xl`, `.display-lg`, `.display-md` using `clamp()`

### 2. Tailwind (`tailwind.config.ts`)
- Add `accent-2`, `hairline`, `surface` color refs
- Add keyframes: `kenburns`, `float`, `gold-shimmer`, `marquee`, `reveal-up-soft`
- Add animations + a `font-display` size scale

### 3. New primitives
- `src/components/luxury/fx/Cursor.tsx` — dual-layer cursor follower (rAF-based, hides on touch)
- `src/components/luxury/fx/Reveal.tsx` — IntersectionObserver wrapper for scroll reveals
- `src/components/luxury/fx/MagneticButton.tsx` — wrapper that adds magnetic hover on pointer
- `src/components/luxury/fx/GoldDivider.tsx` — animated hairline divider

### 4. Component refinements (visual only — no prop/logic changes)
- `Navbar.tsx`: thinner top bar when scrolled, animated gold underline on hover, subtle blur
- `Hero.tsx`: tighter headline rhythm, gold shimmer line, parallax via transform on scroll
- `Categories.tsx` + `CategoryPage.tsx`: glass cards with gold corner accents + ken-burns image, caption slide-up
- `Destinations.tsx` / `FeaturedCarousel.tsx` / `Showcase.tsx`: refined cards, captions, hover states
- `Gallery.tsx`: bento polish — hairline borders, hover ken-burns, lazy reveal
- `Testimonials.tsx`: serif pull-quotes, gold quote mark, subtle marquee option
- `CtaSection.tsmx`: stronger overlay, refined CTAs, eyebrow with gold shimmer line
- `Footer.tsx`: hairline divider, refined link hovers
- `BookingForm.tsx`: only swap card chrome to `glass-card` + tighten spacing — NO logic changes
- `Customize.tsx`: page background gradient + container polish

### 5. Mount global FX
- `src/App.tsx` (or `src/pages/Index.tsx` + `Customize.tsx` + category pages): mount `<Cursor />` once at app root

## Out of scope
- No changes to data fetching, Supabase queries, validation, routing, or form fields
- No new dependencies beyond what's already installed
- No content/copy changes

## Deliverable
A more refined, editorial, cinematic feel across all pages in both themes, with proper text contrast on dark image overlays even in light mode.