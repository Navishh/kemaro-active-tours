import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { z } from "https://esm.sh/zod@3.23.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const isoDate = z.string().refine((s) => !Number.isNaN(Date.parse(s)), {
  message: "Invalid date",
});

const BodySchema = z
  .object({
    category: z.enum(["sports", "leisure", "volunteering"]),
    interests: z.array(z.string().trim().min(1).max(40)).min(1).max(8),
    destination: z.string().trim().min(2).max(80),
    region: z.string().trim().max(60).optional().or(z.literal("")),
    startDate: isoDate,
    endDate: isoDate,
    flexible: z.boolean().default(false),
    adults: z.number().int().min(1).max(20),
    children: z.number().int().min(0).max(15),
    pace: z.enum(["relaxed", "balanced", "intense"]),
    accommodation: z.enum(["boutique", "luxury", "eco-lodge", "private-villa"]),
    budget: z.enum(["essential", "elevated", "premier", "ultra"]),
    notes: z.string().trim().max(1000).optional().or(z.literal("")),
    fullName: z.string().trim().min(2).max(100),
    email: z.string().trim().email().max(255),
    phone: z
      .string()
      .trim()
      .max(30)
      .regex(/^[+\d\s().-]*$/)
      .optional()
      .or(z.literal("")),
    consent: z.literal(true),
  })
  .refine((d) => new Date(d.endDate) >= new Date(d.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  });

// Naive in-memory rate limit (per cold instance) — 5 requests / minute / IP
const rateBucket = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60_000;

function rateLimited(ip: string) {
  const now = Date.now();
  const entry = rateBucket.get(ip);
  if (!entry || entry.reset < now) {
    rateBucket.set(ip, { count: 1, reset: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("cf-connecting-ip") ??
    "unknown";

  if (rateLimited(ip)) {
    return new Response(JSON.stringify({ error: "Too many requests" }), {
      status: 429,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return new Response(
      JSON.stringify({ error: "Validation failed", details: parsed.error.flatten() }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
  const d = parsed.data;

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) {
    return new Response(JSON.stringify({ error: "Server not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });

  const startDate = new Date(d.startDate).toISOString().slice(0, 10);
  const endDate = new Date(d.endDate).toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("trip_proposals")
    .insert({
      status: "draft",
      category: d.category,
      interests: d.interests,
      destination: d.destination,
      region: d.region || null,
      start_date: startDate,
      end_date: endDate,
      flexible: d.flexible,
      adults: d.adults,
      children: d.children,
      pace: d.pace,
      accommodation: d.accommodation,
      budget: d.budget,
      notes: d.notes || null,
      full_name: d.fullName,
      email: d.email,
      phone: d.phone || null,
      consent: d.consent,
    })
    .select("id, created_at")
    .single();

  if (error) {
    console.error("[trip-builder] insert error", error);
    return new Response(JSON.stringify({ error: "Could not save proposal" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(
    JSON.stringify({
      success: true,
      proposal: { id: data.id, status: "draft", createdAt: data.created_at },
    }),
    { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
