import { z } from "zod";

export const CATEGORIES = ["sports", "leisure", "volunteering"] as const;
export const PACE = ["relaxed", "balanced", "intense"] as const;
export const ACCOMMODATION = ["boutique", "luxury", "eco-lodge", "private-villa"] as const;
export const BUDGET = ["essential", "elevated", "premier", "ultra"] as const;

export const stepCategorySchema = z.object({
  category: z.enum(CATEGORIES, { required_error: "Please choose a category" }),
  interests: z
    .array(z.string().trim().min(1).max(40))
    .min(1, { message: "Pick at least one interest" })
    .max(8, { message: "Up to 8 interests" }),
});

export const stepDestinationSchema = z.object({
  destination: z
    .string()
    .trim()
    .min(2, { message: "Destination is required" })
    .max(80, { message: "Keep it under 80 characters" }),
  region: z
    .string()
    .trim()
    .max(60, { message: "Keep it under 60 characters" })
    .optional()
    .or(z.literal("")),
});

export const stepDatesSchema = z
  .object({
    startDate: z.date({ required_error: "Pick a start date" }),
    endDate: z.date({ required_error: "Pick an end date" }),
    flexible: z.boolean().default(false),
  })
  .refine((d) => d.endDate >= d.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  })
  .refine((d) => d.startDate >= new Date(new Date().setHours(0, 0, 0, 0)), {
    message: "Start date cannot be in the past",
    path: ["startDate"],
  });

export const stepTravelersSchema = z.object({
  adults: z.coerce.number().int().min(1, { message: "At least 1 adult" }).max(20),
  children: z.coerce.number().int().min(0).max(15),
  pace: z.enum(PACE),
});

export const stepPreferencesSchema = z.object({
  accommodation: z.enum(ACCOMMODATION),
  budget: z.enum(BUDGET),
  notes: z
    .string()
    .trim()
    .max(1000, { message: "Notes must be under 1000 characters" })
    .optional()
    .or(z.literal("")),
});

export const stepContactSchema = z.object({
  fullName: z.string().trim().min(2, { message: "Name is required" }).max(100),
  email: z.string().trim().email({ message: "Invalid email" }).max(255),
  phone: z
    .string()
    .trim()
    .max(30)
    .regex(/^[+\d\s().-]*$/, { message: "Invalid phone number" })
    .optional()
    .or(z.literal("")),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Please accept to continue" }),
  }),
});

export const tripBuilderSchema = z.object({
  ...stepCategorySchema.shape,
  ...stepDestinationSchema.shape,
  startDate: z.date(),
  endDate: z.date(),
  flexible: z.boolean(),
  ...stepTravelersSchema.shape,
  ...stepPreferencesSchema.shape,
  ...stepContactSchema.shape,
});

export type TripBuilderData = z.infer<typeof tripBuilderSchema>;

export const INTEREST_OPTIONS: Record<(typeof CATEGORIES)[number], string[]> = {
  sports: ["Trail running", "Climbing", "Surfing", "Mountain biking", "Kite-surfing", "Skiing", "Diving", "Triathlon"],
  leisure: ["Wellness", "Sailing", "Gastronomy", "Wine", "Yoga", "Cycling", "Spa", "Cultural"],
  volunteering: ["Wildlife", "Marine", "Education", "Reforestation", "Community", "Conservation"],
};
