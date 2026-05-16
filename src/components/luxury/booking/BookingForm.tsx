import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, MapPin, Search, X, Hotel as HotelIcon, Compass, Loader2, ChevronsUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { toast } from "@/hooks/use-toast";
import type { Hotel, Place } from "@/lib/sriLanka/data";
import { useSriLankaData } from "@/lib/sriLanka/useSriLankaData";
import SriLankaMap, { type MapMode } from "./SriLankaMap";
import DetailDialog from "./DetailDialog";
import { cn } from "@/lib/utils";

const todayISO = () => new Date().toISOString().slice(0, 10);

const tripInfoSchema = z
  .object({
    cityIds: z.array(z.string().min(1)).min(1, "Select at least one city").max(15, "Up to 15 cities"),
    placeIds: z.array(z.string().min(1)).min(1, "Select at least one place").max(40, "Up to 40 places"),
    hotelIds: z.array(z.string().min(1)).max(20, "Up to 20 hotels"),
    arrival: z.string().min(1, "Pick an arrival date"),
    departure: z.string().min(1, "Pick a departure date"),
    adults: z.coerce.number().int("Whole number").min(1, "At least 1 adult").max(30, "Max 30 adults"),
    children: z.coerce.number().int("Whole number").min(0).max(20, "Max 20 children"),
    budgetPerPerson: z.coerce
      .number({ invalid_type_error: "Enter a budget" })
      .min(100, "Minimum USD 100")
      .max(100000, "Maximum USD 100,000"),
    travelMode: z.enum(["solo", "group"], { required_error: "Choose travel mode" }),
    groupSize: z.coerce.number().int().min(2).max(50).optional(),
  })
  .refine((d) => d.arrival >= todayISO(), {
    message: "Arrival cannot be in the past",
    path: ["arrival"],
  })
  .refine((d) => new Date(d.departure) > new Date(d.arrival), {
    message: "Departure must be after arrival",
    path: ["departure"],
  })
  .refine((d) => d.travelMode === "solo" || (d.groupSize ?? 0) >= 2, {
    message: "Group size of at least 2",
    path: ["groupSize"],
  });

const yourInfoSchema = z.object({
  fullName: z.string().trim().min(2, "Name is required").max(100, "Keep under 100 chars"),
  email: z.string().trim().email("Invalid email").max(255),
  whatsapp: z
    .string()
    .trim()
    .min(6, "WhatsApp number required")
    .max(30, "Keep under 30 chars")
    .regex(/^[+\d\s().-]+$/, "Only digits, spaces and + ( ) - ."),
  notes: z.string().trim().max(1000, "Keep under 1000 chars").optional().or(z.literal("")),
});

type TripInfo = z.infer<typeof tripInfoSchema>;
type YourInfo = z.infer<typeof yourInfoSchema>;

type CategorySlug = "sports" | "leisure" | "volunteering";
type Props = {
  category?: CategorySlug;
  initialCategory?: CategorySlug;
};

const CATEGORY_OPTIONS: { value: CategorySlug; label: string }[] = [
  { value: "sports", label: "Sports" },
  { value: "leisure", label: "Sports & Leisure" },
  { value: "volunteering", label: "Volunteering" },
];

const BookingForm = ({ category, initialCategory }: Props) => {
  const { cities, places, hotels, loading, error } = useSriLankaData();

  const [pickedCategory, setPickedCategory] = useState<CategorySlug | undefined>(
    category ?? initialCategory,
  );
  const activeCategory = category ?? pickedCategory;
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [mode, setMode] = useState<MapMode>("places");
  const [cityPickerOpen, setCityPickerOpen] = useState(false);
  const [focus, setFocus] = useState<{ kind: "city" | "place" | "hotel"; id: string } | null>(null);
  const [detail, setDetail] = useState<((Place | Hotel) & { kind: "place" | "hotel" }) | null>(null);

  const tripForm = useForm<TripInfo>({
    resolver: zodResolver(tripInfoSchema),
    defaultValues: {
      cityIds: [],
      placeIds: [],
      hotelIds: [],
      arrival: "",
      departure: "",
      adults: 2,
      children: 0,
      budgetPerPerson: 2500,
      travelMode: "solo",
      groupSize: undefined,
    },
    mode: "onChange",
  });

  const youForm = useForm<YourInfo>({
    resolver: zodResolver(yourInfoSchema),
    defaultValues: { fullName: "", email: "", whatsapp: "", notes: "" },
    mode: "onChange",
  });

  const cityIds = tripForm.watch("cityIds");
  const placeIds = tripForm.watch("placeIds");
  const hotelIds = tripForm.watch("hotelIds");
  const travelMode = tripForm.watch("travelMode");

  const cityById = useMemo(() => new Map(cities.map((c) => [c.id, c])), [cities]);

  const placesForSelectedCities = useMemo(
    () => places.filter((p) => cityIds.includes(p.city)),
    [cityIds, places],
  );
  const hotelsForSelectedCities = useMemo(
    () => hotels.filter((h) => cityIds.includes(h.city)),
    [cityIds, hotels],
  );

  // Auto-prune selections when the parent city is removed.
  useEffect(() => {
    const validPlaceIds = placesForSelectedCities.map((p) => p.id);
    const filteredPlaces = placeIds.filter((id) => validPlaceIds.includes(id));
    if (filteredPlaces.length !== placeIds.length) {
      tripForm.setValue("placeIds", filteredPlaces, { shouldValidate: true });
    }
    const validHotelIds = hotelsForSelectedCities.map((h) => h.id);
    const filteredHotels = hotelIds.filter((id) => validHotelIds.includes(id));
    if (filteredHotels.length !== hotelIds.length) {
      tripForm.setValue("hotelIds", filteredHotels, { shouldValidate: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityIds.join(",")]);

  const toggleCity = (id: string) => {
    const next = cityIds.includes(id) ? cityIds.filter((x) => x !== id) : [...cityIds, id];
    tripForm.setValue("cityIds", next, { shouldValidate: true });
    setFocus(next.includes(id) ? { kind: "city", id } : null);
  };

  const togglePlace = (id: string) => {
    const next = placeIds.includes(id) ? placeIds.filter((x) => x !== id) : [...placeIds, id];
    tripForm.setValue("placeIds", next, { shouldValidate: true });
    setFocus(next.includes(id) ? { kind: "place", id } : null);
  };

  const toggleHotel = (id: string) => {
    const next = hotelIds.includes(id) ? hotelIds.filter((x) => x !== id) : [...hotelIds, id];
    tripForm.setValue("hotelIds", next, { shouldValidate: true });
    setFocus(next.includes(id) ? { kind: "hotel", id } : null);
  };

  const submitTrip = tripForm.handleSubmit(() => {
    if (!activeCategory) {
      toast({ title: "Pick a category", description: "Choose Sports, Sports & Leisure, or Volunteering to continue." });
      return;
    }
    setStep(2);
  });

  const submitFinal = youForm.handleSubmit((vals) => {
    const payload = { category: activeCategory, ...tripForm.getValues(), ...vals };
    // eslint-disable-next-line no-console
    console.log("[booking submission]", payload);
    toast({
      title: "Request received",
      description: "Our concierge will be in touch shortly.",
    });
    setStep(3);
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading the island…
      </div>
    );
  }
  if (error) {
    return (
      <div className="rounded-md border border-destructive/40 bg-destructive/5 p-6 text-sm text-destructive">
        Could not load destinations: {error}
      </div>
    );
  }

  const selectedCities = cityIds
    .map((id) => cityById.get(id))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
      {/* LEFT — form */}
      <div className="lg:col-span-7 xl:col-span-7">
        <div className="mb-8 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-primary/80">
          <span className={step === 1 ? "text-gold" : ""}>01 · Trip Information</span>
          <span className="h-px w-8 bg-border" />
          <span className={step === 2 ? "text-gold" : ""}>02 · Your Information</span>
        </div>

        {step === 1 && (
          <form onSubmit={submitTrip} className="space-y-10">
            {/* CATEGORY */}
            {!category && (
              <section>
                <Label className="text-xs uppercase tracking-[0.3em] text-primary/80">Category</Label>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {CATEGORY_OPTIONS.map((opt) => {
                    const active = pickedCategory === opt.value;
                    return (
                      <button
                        type="button"
                        key={opt.value}
                        onClick={() => setPickedCategory(opt.value)}
                        className={cn(
                          "rounded-md border px-4 py-3 text-sm transition-all duration-500 ease-cinematic",
                          active
                            ? "border-primary/70 bg-primary/10 text-foreground shadow-gold"
                            : "border-border/60 bg-secondary/30 text-foreground/80 hover:border-primary/40 hover:text-foreground",
                        )}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

            {/* CITIES — searchable picker + chips */}
            <section>
              <div className="flex items-center justify-between">
                <Label className="text-xs uppercase tracking-[0.3em] text-primary/80">
                  Cities · {cityIds.length} selected
                </Label>
                {cityIds.length > 0 && (
                  <button
                    type="button"
                    onClick={() => tripForm.setValue("cityIds", [], { shouldValidate: true })}
                    className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground"
                  >
                    Clear
                  </button>
                )}
              </div>

              <Popover open={cityPickerOpen} onOpenChange={setCityPickerOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="mt-3 flex w-full items-center justify-between rounded-md border border-border/60 bg-secondary/50 px-3 py-2.5 text-left text-sm text-foreground/80 hover:border-primary/40"
                  >
                    <span className="flex items-center gap-2">
                      <Search className="h-4 w-4 text-muted-foreground" />
                      Search Sri Lankan cities…
                    </span>
                    <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Type a city or region…" />
                    <CommandList>
                      <CommandEmpty>No matches.</CommandEmpty>
                      <CommandGroup>
                        {cities.map((c) => {
                          const active = cityIds.includes(c.id);
                          return (
                            <CommandItem
                              key={c.id}
                              value={`${c.name} ${c.region}`}
                              onSelect={() => toggleCity(c.id)}
                              className="flex items-center justify-between"
                            >
                              <span className="flex items-center gap-2">
                                <MapPin className={cn("h-3.5 w-3.5", active ? "text-gold" : "text-muted-foreground")} />
                                {c.name}
                                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{c.region}</span>
                              </span>
                              {active && <Check className="h-4 w-4 text-gold" />}
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {/* Selected city chips */}
              {cityIds.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedCities.map((c) => {
                    const isFocused = focus?.kind === "city" && focus.id === c.id;
                    return (
                      <div
                        key={c.id}
                        className={cn(
                          "group inline-flex items-center gap-1.5 rounded-full border pl-3 pr-1.5 py-1 text-xs transition-all",
                          isFocused
                            ? "border-gold bg-gold/25 text-foreground shadow-gold"
                            : "border-gold/60 bg-gold/15 text-foreground hover:bg-gold/25",
                        )}
                      >
                        <button
                          type="button"
                          onClick={() => setFocus({ kind: "city", id: c.id })}
                          title="View this city's selections on the map"
                          className="inline-flex items-center gap-1.5"
                        >
                          <MapPin className="h-3 w-3 text-gold" />
                          {c.name}
                        </button>
                        <button
                          type="button"
                          aria-label={`Remove ${c.name}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCity(c.id);
                          }}
                          className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/15 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
              {tripForm.formState.errors.cityIds && (
                <p className="mt-2 text-xs text-destructive">{tripForm.formState.errors.cityIds.message}</p>
              )}
            </section>

            {/* PLACES / HOTELS toggle list */}
            {cityIds.length > 0 && (
              <section>
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <Label className="text-xs uppercase tracking-[0.3em] text-primary/80">
                    {mode === "places"
                      ? `Stops · ${placeIds.length}/${placesForSelectedCities.length} selected`
                      : `Hotels · ${hotelIds.length}/${hotelsForSelectedCities.length} selected`}
                  </Label>
                  <div className="inline-flex rounded-full border border-border/60 bg-secondary/40 p-1">
                    <button
                      type="button"
                      onClick={() => setMode("places")}
                      className={cn(
                        "px-3 py-1 text-[10px] uppercase tracking-[0.25em] rounded-full transition-colors",
                        mode === "places" ? "bg-gold text-primary-foreground" : "text-foreground/70 hover:text-foreground",
                      )}
                    >
                      Places
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode("hotels")}
                      className={cn(
                        "px-3 py-1 text-[10px] uppercase tracking-[0.25em] rounded-full transition-colors",
                        mode === "hotels" ? "bg-gold text-primary-foreground" : "text-foreground/70 hover:text-foreground",
                      )}
                    >
                      Hotels
                    </button>
                  </div>
                </div>

                <div className="mt-4 rounded-md border border-border/60 bg-secondary/30 p-2">
                  {mode === "places" ? (
                    placesForSelectedCities.length === 0 ? (
                      <p className="px-3 py-4 text-xs text-muted-foreground">No places yet for the selected cities.</p>
                    ) : (
                      <ol className="space-y-1.5">
                        {placesForSelectedCities.map((p) => {
                          const selected = placeIds.includes(p.id);
                          return (
                            <li
                              key={p.id}
                              className={cn(
                                "group flex items-center gap-3 rounded-md border px-3 py-2.5 transition-all",
                                selected
                                  ? "border-gold bg-gold/15 shadow-gold"
                                  : "border-transparent bg-background/40 hover:border-primary/30",
                              )}
                            >
                              <button
                                type="button"
                                aria-label={selected ? "Remove stop" : "Add stop"}
                                onClick={() => togglePlace(p.id)}
                                className={cn(
                                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-sm transition-colors",
                                  selected ? "bg-gold text-primary-foreground" : "border border-border bg-background",
                                )}
                              >
                                {selected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setFocus({ kind: "place", id: p.id });
                                  if (!selected) togglePlace(p.id);
                                }}
                                className="flex flex-1 items-center justify-between gap-3 text-left"
                              >
                                <div className="min-w-0">
                                  <div className={cn("truncate text-sm", selected ? "text-foreground font-medium" : "text-foreground/85")}>
                                    {p.name}
                                  </div>
                                  <div className="truncate text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                                    {p.type} · {cityById.get(p.city)?.name}
                                  </div>
                                </div>
                                <span
                                  role="button"
                                  tabIndex={0}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDetail({ ...(p as Place), kind: "place" });
                                  }}
                                  className="text-[10px] uppercase tracking-[0.25em] text-primary hover:text-primary-glow"
                                >
                                  Details
                                </span>
                              </button>
                            </li>
                          );
                        })}
                      </ol>
                    )
                  ) : hotelsForSelectedCities.length === 0 ? (
                    <p className="px-3 py-4 text-xs text-muted-foreground">No hotels yet for the selected cities.</p>
                  ) : (
                    <ol className="space-y-1.5">
                      {hotelsForSelectedCities.map((h) => {
                        const selected = hotelIds.includes(h.id);
                        return (
                          <li
                            key={h.id}
                            className={cn(
                              "group flex items-center gap-3 rounded-md border px-3 py-2.5 transition-all",
                              selected
                                ? "border-gold bg-gold/15 shadow-gold"
                                : "border-transparent bg-background/40 hover:border-primary/30",
                            )}
                          >
                            <button
                              type="button"
                              aria-label={selected ? "Remove hotel" : "Add hotel"}
                              onClick={() => toggleHotel(h.id)}
                              className={cn(
                                "flex h-5 w-5 shrink-0 items-center justify-center rounded-sm transition-colors",
                                selected ? "bg-gold text-primary-foreground" : "border border-border bg-background",
                              )}
                            >
                              {selected ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : <HotelIcon className="h-3 w-3 text-muted-foreground" />}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setFocus({ kind: "hotel", id: h.id });
                                if (!selected) toggleHotel(h.id);
                              }}
                              className="flex flex-1 items-center justify-between gap-3 text-left"
                            >
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className={cn("truncate text-sm", selected ? "text-foreground font-medium" : "text-foreground/85")}>
                                    {h.name}
                                  </span>
                                  <span className="text-[10px] text-gold">{"★".repeat(h.stars)}</span>
                                </div>
                                <div className="truncate text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                                  {cityById.get(h.city)?.name}
                                </div>
                              </div>
                              <span
                                role="button"
                                tabIndex={0}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDetail({ ...(h as Hotel), kind: "hotel" });
                                }}
                                className="text-[10px] uppercase tracking-[0.25em] text-primary hover:text-primary-glow"
                              >
                                Details
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ol>
                  )}
                </div>
                {mode === "places" && tripForm.formState.errors.placeIds && (
                  <p className="mt-2 text-xs text-destructive">{tripForm.formState.errors.placeIds.message}</p>
                )}
              </section>
            )}

            {/* DATES */}
            <section className="grid gap-5 md:grid-cols-2">
              <div>
                <Label className="text-xs uppercase tracking-[0.3em] text-primary/80">Arrival</Label>
                <Input type="date" min={todayISO()} {...tripForm.register("arrival")} className="mt-2 bg-secondary/50 border-border/60" />
                {tripForm.formState.errors.arrival && <p className="mt-1 text-xs text-destructive">{tripForm.formState.errors.arrival.message}</p>}
              </div>
              <div>
                <Label className="text-xs uppercase tracking-[0.3em] text-primary/80">Departure</Label>
                <Input type="date" min={tripForm.watch("arrival") || todayISO()} {...tripForm.register("departure")} className="mt-2 bg-secondary/50 border-border/60" />
                {tripForm.formState.errors.departure && <p className="mt-1 text-xs text-destructive">{tripForm.formState.errors.departure.message}</p>}
              </div>
            </section>

            {/* TRAVELERS + BUDGET */}
            <section className="grid gap-5 md:grid-cols-3">
              <div>
                <Label className="text-xs uppercase tracking-[0.3em] text-primary/80">Adults</Label>
                <Input type="number" min={1} max={30} {...tripForm.register("adults")} className="mt-2 bg-secondary/50 border-border/60" />
                {tripForm.formState.errors.adults && <p className="mt-1 text-xs text-destructive">{tripForm.formState.errors.adults.message}</p>}
              </div>
              <div>
                <Label className="text-xs uppercase tracking-[0.3em] text-primary/80">Children</Label>
                <Input type="number" min={0} max={20} {...tripForm.register("children")} className="mt-2 bg-secondary/50 border-border/60" />
                {tripForm.formState.errors.children && <p className="mt-1 text-xs text-destructive">{tripForm.formState.errors.children.message}</p>}
              </div>
              <div>
                <Label className="text-xs uppercase tracking-[0.3em] text-primary/80">Budget / person (USD)</Label>
                <Input type="number" min={100} max={100000} step={50} {...tripForm.register("budgetPerPerson")} className="mt-2 bg-secondary/50 border-border/60" />
                {tripForm.formState.errors.budgetPerPerson && <p className="mt-1 text-xs text-destructive">{tripForm.formState.errors.budgetPerPerson.message}</p>}
              </div>
            </section>

            {/* TRAVEL MODE */}
            <section className="grid gap-5 md:grid-cols-3">
              <div>
                <Label className="text-xs uppercase tracking-[0.3em] text-primary/80">Travel mode</Label>
                <Select
                  value={travelMode}
                  onValueChange={(v: "solo" | "group") => tripForm.setValue("travelMode", v, { shouldValidate: true })}
                >
                  <SelectTrigger className="mt-2 bg-secondary/50 border-border/60">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solo">Solo</SelectItem>
                    <SelectItem value="group">Group</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {travelMode === "group" && (
                <div>
                  <Label className="text-xs uppercase tracking-[0.3em] text-primary/80">Group size</Label>
                  <Input type="number" min={2} max={50} {...tripForm.register("groupSize")} className="mt-2 bg-secondary/50 border-border/60" />
                  {tripForm.formState.errors.groupSize && <p className="mt-1 text-xs text-destructive">{tripForm.formState.errors.groupSize.message}</p>}
                </div>
              )}
            </section>

            <div className="flex justify-end pt-4">
              <Button type="submit" variant="gold" size="lg">
                Continue · Your Information
              </Button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={submitFinal} className="space-y-8">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <Label className="text-xs uppercase tracking-[0.3em] text-primary/80">Full name</Label>
                <Input {...youForm.register("fullName")} className="mt-2 bg-secondary/50 border-border/60" />
                {youForm.formState.errors.fullName && <p className="mt-1 text-xs text-destructive">{youForm.formState.errors.fullName.message}</p>}
              </div>
              <div>
                <Label className="text-xs uppercase tracking-[0.3em] text-primary/80">Email</Label>
                <Input type="email" {...youForm.register("email")} className="mt-2 bg-secondary/50 border-border/60" />
                {youForm.formState.errors.email && <p className="mt-1 text-xs text-destructive">{youForm.formState.errors.email.message}</p>}
              </div>
              <div className="md:col-span-2">
                <Label className="text-xs uppercase tracking-[0.3em] text-primary/80">WhatsApp</Label>
                <Input placeholder="+94 ..." {...youForm.register("whatsapp")} className="mt-2 bg-secondary/50 border-border/60" />
                {youForm.formState.errors.whatsapp && <p className="mt-1 text-xs text-destructive">{youForm.formState.errors.whatsapp.message}</p>}
              </div>
              <div className="md:col-span-2">
                <Label className="text-xs uppercase tracking-[0.3em] text-primary/80">Extra notes</Label>
                <Textarea
                  rows={5}
                  placeholder="Anything you'd like our concierge to know..."
                  {...youForm.register("notes")}
                  className="mt-2 bg-secondary/50 border-border/60"
                />
                {youForm.formState.errors.notes && <p className="mt-1 text-xs text-destructive">{youForm.formState.errors.notes.message}</p>}
              </div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <Button type="button" variant="outlineGold" onClick={() => setStep(1)}>
                ← Back
              </Button>
              <Button type="submit" variant="gold" size="lg">
                Submit Request
              </Button>
            </div>
          </form>
        )}

        {step === 3 && (
          <div className="rounded-md border border-primary/40 bg-primary/5 p-10 text-center">
            <Compass className="mx-auto h-10 w-10 text-gold" strokeWidth={1.2} />
            <h3 className="mt-6 font-display text-3xl text-foreground">Thank you.</h3>
            <p className="mt-3 text-sm text-muted-foreground">
              Your <span className="text-gold">{activeCategory}</span> journey request is with our concierge.
              We'll respond within one business day.
            </p>
          </div>
        )}
      </div>

      {/* RIGHT — map + toggle */}
      <div className="lg:col-span-5 xl:col-span-5">
        <div className="sticky top-28 h-[640px] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.3em] text-primary/80">Live Sri Lanka Map</span>
            <div className="inline-flex rounded-full border border-border/60 bg-secondary/40 p-1">
              <button
                type="button"
                onClick={() => setMode("places")}
                className={cn(
                  "px-3 py-1 text-[10px] uppercase tracking-[0.25em] rounded-full transition-colors",
                  mode === "places" ? "bg-gold text-primary-foreground" : "text-foreground/70 hover:text-foreground",
                )}
              >
                Places
              </button>
              <button
                type="button"
                onClick={() => setMode("hotels")}
                className={cn(
                  "px-3 py-1 text-[10px] uppercase tracking-[0.25em] rounded-full transition-colors",
                  mode === "hotels" ? "bg-gold text-primary-foreground" : "text-foreground/70 hover:text-foreground",
                )}
              >
                Hotels
              </button>
            </div>
          </div>
          <div className="relative flex-1">
            <SriLankaMap
              cities={cities}
              places={places}
              hotels={hotels}
              selectedCityIds={cityIds}
              selectedPlaceIds={placeIds}
              selectedHotelIds={hotelIds}
              focus={focus}
              mode={mode}
              onPickPlace={(p) => {
                setFocus({ kind: "place", id: p.id });
                setDetail({ ...p, kind: "place" });
              }}
              onPickHotel={(h) => {
                setFocus({ kind: "hotel", id: h.id });
                setDetail({ ...h, kind: "hotel" });
              }}
            />
            {focus && (
              <button
                type="button"
                onClick={() => setFocus(null)}
                className="absolute top-3 right-3 z-[400] inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/80 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-foreground/85 backdrop-blur-md hover:text-foreground"
              >
                <X className="h-3 w-3" /> Reset view
              </button>
            )}
          </div>
        </div>
      </div>

      {detail && (
        <DetailDialog
          open={!!detail}
          onOpenChange={(v) => !v && setDetail(null)}
          item={detail}
        />
      )}
    </div>
  );
};

export default BookingForm;
