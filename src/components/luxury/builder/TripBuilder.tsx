import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import {
  ArrowLeft,
  ArrowRight,
  CalendarIcon,
  Check,
  Compass,
  Heart,
  MapPin,
  Sparkles,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

import StepShell from "./StepShell";
import Stepper from "./Stepper";
import {
  ACCOMMODATION,
  BUDGET,
  CATEGORIES,
  INTEREST_OPTIONS,
  PACE,
  stepCategorySchema,
  stepContactSchema,
  stepDatesSchema,
  stepDestinationSchema,
  stepPreferencesSchema,
  stepTravelersSchema,
  tripBuilderSchema,
  type TripBuilderData,
} from "@/lib/customization/schema";

const STEPS = [
  { key: "category", label: "Category", schema: stepCategorySchema },
  { key: "destination", label: "Destination", schema: stepDestinationSchema },
  { key: "dates", label: "Dates", schema: stepDatesSchema },
  { key: "travelers", label: "Travellers", schema: stepTravelersSchema },
  { key: "preferences", label: "Style", schema: stepPreferencesSchema },
  { key: "contact", label: "Contact", schema: stepContactSchema },
  { key: "review", label: "Review", schema: z.object({}) },
] as const;

const CATEGORY_LABELS: Record<(typeof CATEGORIES)[number], { title: string; copy: string }> = {
  sports: { title: "Sports", copy: "Adrenaline-led journeys for the active traveller." },
  leisure: { title: "Sports & Leisure", copy: "A balanced mix of movement, rest, and refinement." },
  volunteering: { title: "Volunteering", copy: "Purpose-driven travel with meaningful impact." },
};

const PROPOSAL_STORAGE_KEY = "kemaro:proposalId";
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const TripBuilder = () => {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [proposalId, setProposalIdState] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    const v = window.sessionStorage.getItem(PROPOSAL_STORAGE_KEY);
    return v && UUID_RE.test(v) ? v : null;
  });

  const setProposalId = (id: string | null) => {
    setProposalIdState(id);
    if (typeof window === "undefined") return;
    if (id) window.sessionStorage.setItem(PROPOSAL_STORAGE_KEY, id);
    else window.sessionStorage.removeItem(PROPOSAL_STORAGE_KEY);
  };

  const methods = useForm<TripBuilderData>({
    mode: "onTouched",
    resolver: zodResolver(tripBuilderSchema),
    defaultValues: {
      category: undefined as unknown as TripBuilderData["category"],
      interests: [],
      destination: "",
      region: "",
      flexible: false,
      adults: 2,
      children: 0,
      pace: "balanced",
      accommodation: "luxury",
      budget: "elevated",
      notes: "",
      fullName: "",
      email: "",
      phone: "",
      consent: false as unknown as true,
    },
  });

  const stepFields: Record<number, (keyof TripBuilderData)[]> = {
    0: ["category", "interests"],
    1: ["destination", "region"],
    2: ["startDate", "endDate", "flexible"],
    3: ["adults", "children", "pace"],
    4: ["accommodation", "budget", "notes"],
    5: ["fullName", "email", "phone", "consent"],
    6: [],
  };

  const next = async () => {
    const fields = stepFields[step];
    const ok = fields.length ? await methods.trigger(fields as any, { shouldFocus: true }) : true;
    if (ok) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const back = () => setStep((s) => Math.max(s - 1, 0));

  const onSubmit = methods.handleSubmit(async (data) => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const { data: res, error } = await supabase.functions.invoke("trip-builder", {
        body: {
          category: data.category,
          interests: data.interests,
          destination: data.destination,
          region: data.region || "",
          startDate: data.startDate.toISOString(),
          endDate: data.endDate.toISOString(),
          flexible: data.flexible,
          adults: data.adults,
          children: data.children,
          pace: data.pace,
          accommodation: data.accommodation,
          budget: data.budget,
          notes: data.notes || "",
          fullName: data.fullName,
          email: data.email,
          phone: data.phone || "",
          consent: data.consent,
        },
      });

      if (error || !res?.success) {
        const msg =
          (res as { error?: string } | null)?.error ??
          error?.message ??
          "Please try again in a moment.";
        toast({
          title: "Could not save your request",
          description: msg,
          variant: "destructive",
        });
        return;
      }

      const newId = (res as { proposal?: { id?: string } } | null)?.proposal?.id ?? null;
      if (!newId || !UUID_RE.test(newId)) {
        toast({
          title: "Saved, but reference missing",
          description: "We couldn't read your proposal reference. Please contact us.",
          variant: "destructive",
        });
        return;
      }
      setProposalId(newId);
      toast({
        title: "Your draft proposal is saved",
        description: "Our curators will reach out within 24 hours.",
      });
      setStep(STEPS.length - 1);
    } catch (err) {
      console.error("[trip-builder] submit failed", err);
      toast({
        title: "Network error",
        description: "We couldn't reach our servers. Please retry.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit} className="grid gap-12 lg:grid-cols-12">
        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <span className="eyebrow mb-6">Customization</span>
            <h1 className="text-4xl md:text-5xl leading-[1.05] text-foreground mb-6">
              Compose your
              <span className="italic text-gold"> private </span>
              journey.
            </h1>
            <p className="text-base leading-loose text-muted-foreground mb-10 max-w-md">
              Seven graceful steps. A bespoke proposal in your inbox within 24 hours — no
              commitment, no obligation.
            </p>
            <SummaryCard />
          </div>
        </aside>

        <section className="lg:col-span-8">
          <div className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur-xl p-8 md:p-12 shadow-elegant">
            <Stepper steps={STEPS.map((s) => s.label)} current={step} />

            {step === 0 && <StepCategory />}
            {step === 1 && <StepDestination />}
            {step === 2 && <StepDates />}
            {step === 3 && <StepTravelers />}
            {step === 4 && <StepPreferences />}
            {step === 5 && <StepContact />}
            {step === 6 && <StepReview proposalId={proposalId} />}

            {step < STEPS.length - 1 && (
              <div className="mt-12 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">
                <Button
                  type="button"
                  variant="ghostLine"
                  onClick={back}
                  disabled={step === 0 || submitting}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                {step === 5 ? (
                  <Button type="submit" variant="gold" size="pill" className="gap-2" disabled={submitting}>
                    {submitting ? "Saving…" : "Submit Request"} <Sparkles className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="button" variant="gold" size="pill" onClick={next} className="gap-2">
                    Continue <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </section>
      </form>
    </FormProvider>
  );
};

/* -------------------------------- Summary -------------------------------- */

const SummaryCard = () => {
  const { watch } = useFormContext<TripBuilderData>();
  const v = watch();
  const items: { label: string; value: string }[] = [];
  if (v.category) items.push({ label: "Category", value: CATEGORY_LABELS[v.category].title });
  if (v.destination) items.push({ label: "Destination", value: v.destination });
  if (v.startDate && v.endDate)
    items.push({
      label: "When",
      value: `${format(v.startDate, "MMM d")} – ${format(v.endDate, "MMM d, yyyy")}`,
    });
  if (v.adults) items.push({ label: "Travellers", value: `${v.adults} adults · ${v.children ?? 0} children` });
  if (v.accommodation) items.push({ label: "Style", value: `${v.accommodation} · ${v.budget}` });

  if (items.length === 0) return null;
  return (
    <div className="rounded-xl border border-border/60 bg-background/40 p-6">
      <p className="eyebrow mb-4">Your draft</p>
      <dl className="space-y-3">
        {items.map((it) => (
          <div key={it.label} className="flex justify-between gap-4 text-sm">
            <dt className="text-muted-foreground uppercase tracking-[0.2em] text-[10px]">
              {it.label}
            </dt>
            <dd className="text-foreground capitalize text-right">{it.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

/* ------------------------------- Step 1 ---------------------------------- */

const StepCategory = () => {
  const { setValue, watch, formState } = useFormContext<TripBuilderData>();
  const category = watch("category");
  const interests = watch("interests") ?? [];
  const errors = formState.errors;

  const toggleInterest = (i: string) => {
    const next = interests.includes(i) ? interests.filter((x) => x !== i) : [...interests, i];
    setValue("interests", next, { shouldValidate: true, shouldTouch: true });
  };

  return (
    <StepShell
      eyebrow="Step 01"
      title={
        <>
          What kind of journey
          <span className="italic text-gold"> calls </span>
          to you?
        </>
      }
      description="Choose a category, then pick the experiences that move you."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {CATEGORIES.map((c) => {
          const active = category === c;
          return (
            <button
              key={c}
              type="button"
              onClick={() =>
                setValue("category", c, { shouldValidate: true, shouldTouch: true })
              }
              className={cn(
                "group text-left rounded-xl border p-6 transition-all duration-500 ease-cinematic",
                active
                  ? "border-primary bg-primary/5 shadow-gold"
                  : "border-border/60 hover:border-primary/60 hover:-translate-y-1",
              )}
            >
              <Compass
                className={cn(
                  "h-5 w-5 mb-4 transition-colors",
                  active ? "text-primary" : "text-muted-foreground group-hover:text-primary",
                )}
              />
              <h3 className="text-xl text-foreground mb-2">{CATEGORY_LABELS[c].title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {CATEGORY_LABELS[c].copy}
              </p>
            </button>
          );
        })}
      </div>
      {errors.category && (
        <p className="mt-3 text-sm text-destructive">{errors.category.message as string}</p>
      )}

      {category && (
        <div className="mt-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <p className="eyebrow mb-4">Interests</p>
          <div className="flex flex-wrap gap-2">
            {INTEREST_OPTIONS[category].map((i) => {
              const active = interests.includes(i);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggleInterest(i)}
                  className={cn(
                    "rounded-full px-5 py-2 text-xs uppercase tracking-[0.25em] border transition-all duration-500 ease-cinematic",
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:text-primary hover:border-primary/60",
                  )}
                >
                  {i}
                </button>
              );
            })}
          </div>
          {errors.interests && (
            <p className="mt-3 text-sm text-destructive">{errors.interests.message as string}</p>
          )}
        </div>
      )}
    </StepShell>
  );
};

/* ------------------------------- Step 2 ---------------------------------- */

const StepDestination = () => {
  const { register, formState } = useFormContext<TripBuilderData>();
  const e = formState.errors;
  return (
    <StepShell
      eyebrow="Step 02"
      title={
        <>
          Where shall we
          <span className="italic text-gold"> wander </span>?
        </>
      }
      description="A country, a city, or simply a feeling — we'll do the rest."
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <FieldWrap icon={MapPin} label="Destination" error={e.destination?.message as string}>
          <Input
            {...register("destination")}
            placeholder="Patagonia, Bali, Lake Como…"
            maxLength={80}
            className="bg-background/40 border-border/60 h-14 pl-12 pt-6"
          />
        </FieldWrap>
        <FieldWrap icon={Compass} label="Region (optional)" error={e.region?.message as string}>
          <Input
            {...register("region")}
            placeholder="Andes, Bali, Lombardy…"
            maxLength={60}
            className="bg-background/40 border-border/60 h-14 pl-12 pt-6"
          />
        </FieldWrap>
      </div>
    </StepShell>
  );
};

/* ------------------------------- Step 3 ---------------------------------- */

const StepDates = () => {
  const { setValue, watch, formState } = useFormContext<TripBuilderData>();
  const start = watch("startDate");
  const end = watch("endDate");
  const flexible = watch("flexible");
  const e = formState.errors;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <StepShell
      eyebrow="Step 03"
      title={
        <>
          When does the
          <span className="italic text-gold"> story </span>
          begin?
        </>
      }
      description="Approximate dates are perfectly fine — toggle flexibility below."
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <DateField
          label="Start date"
          value={start}
          onChange={(d) => setValue("startDate", d as Date, { shouldValidate: true })}
          error={e.startDate?.message as string}
          disabled={(d) => d < today}
        />
        <DateField
          label="End date"
          value={end}
          onChange={(d) => setValue("endDate", d as Date, { shouldValidate: true })}
          error={e.endDate?.message as string}
          disabled={(d) => d < (start ?? today)}
        />
      </div>
      <label className="mt-8 flex items-center gap-3 cursor-pointer">
        <Checkbox
          checked={flexible}
          onCheckedChange={(v) => setValue("flexible", Boolean(v))}
          className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
        <span className="text-sm text-muted-foreground">My dates are flexible by ± 1 week</span>
      </label>
    </StepShell>
  );
};

const DateField = ({
  label,
  value,
  onChange,
  error,
  disabled,
}: {
  label: string;
  value?: Date;
  onChange: (d: Date | undefined) => void;
  error?: string;
  disabled?: (d: Date) => boolean;
}) => (
  <div>
    <Label className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
      {label}
    </Label>
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "h-14 w-full justify-start bg-background/40 border-border/60 text-left font-normal",
            !value && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-3 h-4 w-4 text-primary/70" />
          {value ? format(value, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          disabled={disabled}
          initialFocus
          className={cn("p-3 pointer-events-auto")}
        />
      </PopoverContent>
    </Popover>
    {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
  </div>
);

/* ------------------------------- Step 4 ---------------------------------- */

const StepTravelers = () => {
  const { register, setValue, watch, formState } = useFormContext<TripBuilderData>();
  const pace = watch("pace");
  const e = formState.errors;

  return (
    <StepShell
      eyebrow="Step 04"
      title={
        <>
          Who joins your
          <span className="italic text-gold"> escape </span>?
        </>
      }
      description="And tell us the rhythm you'd like to travel at."
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <FieldWrap icon={Users} label="Adults" error={e.adults?.message as string}>
          <Input
            type="number"
            min={1}
            max={20}
            {...register("adults", { valueAsNumber: true })}
            className="bg-background/40 border-border/60 h-14 pl-12 pt-6"
          />
        </FieldWrap>
        <FieldWrap icon={Heart} label="Children" error={e.children?.message as string}>
          <Input
            type="number"
            min={0}
            max={15}
            {...register("children", { valueAsNumber: true })}
            className="bg-background/40 border-border/60 h-14 pl-12 pt-6"
          />
        </FieldWrap>
      </div>

      <div className="mt-10">
        <p className="eyebrow mb-4">Pace</p>
        <RadioGroup
          value={pace}
          onValueChange={(v) => setValue("pace", v as TripBuilderData["pace"], { shouldValidate: true })}
          className="grid gap-3 sm:grid-cols-3"
        >
          {PACE.map((p) => (
            <label
              key={p}
              className={cn(
                "cursor-pointer rounded-xl border p-5 transition-all duration-500 ease-cinematic",
                pace === p
                  ? "border-primary bg-primary/5"
                  : "border-border/60 hover:border-primary/60",
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm uppercase tracking-[0.2em] text-foreground">{p}</span>
                <RadioGroupItem value={p} className="border-border" />
              </div>
              <p className="text-xs text-muted-foreground">
                {p === "relaxed" && "Slow mornings, long lunches."}
                {p === "balanced" && "A graceful mix of action and stillness."}
                {p === "intense" && "Full days, high adrenaline."}
              </p>
            </label>
          ))}
        </RadioGroup>
      </div>
    </StepShell>
  );
};

/* ------------------------------- Step 5 ---------------------------------- */

const StepPreferences = () => {
  const { register, setValue, watch, formState } = useFormContext<TripBuilderData>();
  const acc = watch("accommodation");
  const bud = watch("budget");
  const e = formState.errors;

  return (
    <StepShell
      eyebrow="Step 05"
      title={
        <>
          Refine your
          <span className="italic text-gold"> style </span>.
        </>
      }
      description="Where would you like to rest your head, and at what altitude of luxury?"
    >
      <div className="space-y-10">
        <div>
          <p className="eyebrow mb-4">Accommodation</p>
          <div className="grid gap-3 sm:grid-cols-4">
            {ACCOMMODATION.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setValue("accommodation", a, { shouldValidate: true })}
                className={cn(
                  "rounded-xl border p-4 text-sm uppercase tracking-[0.2em] transition-all duration-500 ease-cinematic",
                  acc === a
                    ? "border-primary bg-primary/5 text-foreground"
                    : "border-border/60 text-muted-foreground hover:border-primary/60 hover:text-foreground",
                )}
              >
                {a.replace("-", " ")}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="eyebrow mb-4">Budget tier</p>
          <div className="grid gap-3 sm:grid-cols-4">
            {BUDGET.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setValue("budget", b, { shouldValidate: true })}
                className={cn(
                  "rounded-xl border p-4 text-sm uppercase tracking-[0.2em] transition-all duration-500 ease-cinematic",
                  bud === b
                    ? "border-primary bg-primary/5 text-foreground"
                    : "border-border/60 text-muted-foreground hover:border-primary/60 hover:text-foreground",
                )}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label className="mb-2 block text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Anything else? (optional)
          </Label>
          <Textarea
            {...register("notes")}
            maxLength={1000}
            rows={5}
            placeholder="Anniversary, dietary needs, dream experiences…"
            className="bg-background/40 border-border/60"
          />
          {e.notes && <p className="mt-2 text-sm text-destructive">{e.notes.message as string}</p>}
        </div>
      </div>
    </StepShell>
  );
};

/* ------------------------------- Step 6 ---------------------------------- */

const StepContact = () => {
  const { register, setValue, watch, formState } = useFormContext<TripBuilderData>();
  const consent = watch("consent");
  const e = formState.errors;

  return (
    <StepShell
      eyebrow="Step 06"
      title={
        <>
          Where shall we
          <span className="italic text-gold"> reply </span>?
        </>
      }
      description="A curator will respond within 24 hours with a tailored proposal."
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <FieldWrap label="Full name" error={e.fullName?.message as string}>
          <Input
            {...register("fullName")}
            maxLength={100}
            placeholder="Your name"
            className="bg-background/40 border-border/60 h-14 pt-6"
          />
        </FieldWrap>
        <FieldWrap label="Email" error={e.email?.message as string}>
          <Input
            {...register("email")}
            type="email"
            maxLength={255}
            placeholder="you@example.com"
            className="bg-background/40 border-border/60 h-14 pt-6"
          />
        </FieldWrap>
        <FieldWrap label="Phone (optional)" error={e.phone?.message as string}>
          <Input
            {...register("phone")}
            maxLength={30}
            placeholder="+1 555 0100"
            className="bg-background/40 border-border/60 h-14 pt-6"
          />
        </FieldWrap>
      </div>

      <label className="mt-8 flex items-start gap-3 cursor-pointer">
        <Checkbox
          checked={!!consent}
          onCheckedChange={(v) => setValue("consent", Boolean(v) as true, { shouldValidate: true })}
          className="mt-1 border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
        <span className="text-sm text-muted-foreground leading-relaxed">
          I agree to be contacted by Kemaro Active Tours regarding this enquiry. No marketing.
        </span>
      </label>
      {e.consent && <p className="mt-2 text-sm text-destructive">{e.consent.message as string}</p>}
    </StepShell>
  );
};

/* ------------------------------- Step 7 ---------------------------------- */

type ProposalRecord = {
  id: string;
  status: string;
  category: string;
  interests: string[];
  destination: string;
  region: string | null;
  start_date: string;
  end_date: string;
  flexible: boolean;
  adults: number;
  children: number;
  pace: string;
  accommodation: string;
  budget: string;
  notes: string | null;
  full_name: string;
  email: string;
  phone: string | null;
  created_at: string;
};

const StepReview = ({ proposalId }: { proposalId: string | null }) => {
  const [loading, setLoading] = useState(false);
  const [proposal, setProposal] = useState<ProposalRecord | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!proposalId) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    (async () => {
      const { data, error: fnErr } = await supabase.functions.invoke("get-proposal", {
        body: { id: proposalId },
      });
      if (cancelled) return;
      if (fnErr || !data?.proposal) {
        setError((data as { error?: string } | null)?.error ?? fnErr?.message ?? "Could not load your proposal");
        setLoading(false);
        return;
      }
      setProposal(data.proposal as ProposalRecord);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [proposalId]);

  return (
    <StepShell
      eyebrow="Submitted"
      title={
        <>
          Your journey is
          <span className="italic text-gold"> in motion </span>.
        </>
      }
      description="A curator is composing your bespoke itinerary. Expect a reply within 24 hours."
    >
      <div className="rounded-xl border border-primary/40 bg-primary/5 p-8 flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20">
          <Check className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-foreground mb-1">Draft proposal saved</p>
          <p className="text-sm text-muted-foreground">
            We've received your preferences. You'll hear from a private curator shortly.
          </p>
          {proposalId && (
            <p className="mt-3 text-[11px] uppercase tracking-[0.25em] text-muted-foreground/80">
              Reference · <span className="text-foreground">{proposalId.slice(0, 8)}</span>
            </p>
          )}
        </div>
      </div>

      {proposalId && (
        <div className="mt-8 rounded-xl border border-border/60 bg-background/40 p-8">
          <p className="eyebrow mb-6">Saved details</p>

          {loading && (
            <p className="text-sm text-muted-foreground">Loading your proposal…</p>
          )}

          {!loading && error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          {!loading && !error && !proposal && (
            <p className="text-sm text-muted-foreground">
              No proposal details available for this reference.
            </p>
          )}

          {!loading && proposal && (
            <dl className="grid gap-4 sm:grid-cols-2">
              <Detail label="Category" value={CATEGORY_LABELS[proposal.category as keyof typeof CATEGORY_LABELS]?.title ?? proposal.category} />
              <Detail label="Status" value={proposal.status} />
              <Detail
                label="Destination"
                value={proposal.region ? `${proposal.destination} · ${proposal.region}` : proposal.destination}
              />
              <Detail
                label="When"
                value={`${format(new Date(proposal.start_date), "MMM d")} – ${format(new Date(proposal.end_date), "MMM d, yyyy")}${proposal.flexible ? " · flexible" : ""}`}
              />
              <Detail
                label="Travellers"
                value={`${proposal.adults} adults · ${proposal.children} children · ${proposal.pace}`}
              />
              <Detail label="Style" value={`${proposal.accommodation} · ${proposal.budget}`} />
              <Detail label="Interests" value={proposal.interests.join(", ") || "—"} className="sm:col-span-2" />
              {proposal.notes && (
                <Detail label="Notes" value={proposal.notes} className="sm:col-span-2" />
              )}
              <Detail label="Contact" value={`${proposal.full_name} · ${proposal.email}${proposal.phone ? ` · ${proposal.phone}` : ""}`} className="sm:col-span-2" />
            </dl>
          )}
        </div>
      )}
    </StepShell>
  );
};

const Detail = ({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) => (
  <div className={cn("flex flex-col gap-1", className)}>
    <dt className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{label}</dt>
    <dd className="text-sm text-foreground capitalize break-words">{value}</dd>
  </div>
);

/* -------------------------- Shared field wrap ---------------------------- */

const FieldWrap = ({
  icon: Icon,
  label,
  error,
  children,
}: {
  icon?: any;
  label: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <div className="relative">
    <Label className="absolute left-12 top-3 z-10 text-[10px] uppercase tracking-[0.25em] text-muted-foreground pointer-events-none">
      {!Icon && <span className="ml-[-2rem]">{label}</span>}
      {Icon && label}
    </Label>
    {Icon && (
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/70 z-10" />
    )}
    {children}
    {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
  </div>
);

export default TripBuilder;
