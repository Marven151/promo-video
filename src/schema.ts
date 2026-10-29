import { z } from "zod";
import { zColor } from "@remotion/zod-types";

export const promoSchema = z.object({
  business: z.object({
    name: z.string(),
    tagline: z.string(),
    city: z.string(),
    phone: z.string(),
    website: z.string().optional(),
    established: z.string().optional(),
  }),
  // 1–3 very short lines, set huge in the opening shot. The last one takes the accent color.
  hook: z.array(z.string()).min(1).max(3),
  services: z
    .array(
      z.object({
        title: z.string(),
        tag: z.string().optional(),
        line: z.string(),
      }),
    )
    .min(3)
    .max(4),
  cta: z.object({
    headline: z.string(),
    sub: z.string().optional(),
  }),
  // On-screen captions for the hook, brand and end scenes. Service captions use services[].line.
  captions: z.object({
    hook: z.string(),
    brand: z.string(),
    end: z.string(),
  }),
  colors: z.object({
    ink: zColor(),
    paper: zColor(),
    accent: zColor(),
    onAccent: zColor().optional(),
  }),
  // Inline SVG markup. Use fill="currentColor" so the mark recolors per scene.
  logoSvg: z.string().optional(),
  // File in public/ (e.g. "music/track.mp3") or an https URL. Left empty in the samples.
  music: z.string().optional(),
  // Small line in the top bar, e.g. "Sample – fictional business".
  disclaimer: z.string().optional(),
});

export type PromoProps = z.infer<typeof promoSchema>;

export const FPS = 30;

// Scene lengths in frames at 30 fps.
export const T = {
  hook: 72,
  brand: 78,
  service: 69,
  end: 120,
  wipe: 16,
} as const;

export const totalFrames = (serviceCount: number) =>
  T.hook + T.brand + serviceCount * T.service + T.end;
