import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";

const sourceSchema = z.object({
  ref: z.string().min(1),
  url: z.string().min(1)
});

const actorSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  territories_controlled: z.array(z.string().min(2)),
  peak_year: z.number().int(),
  population_affected_M: z.number(),
  economic_extraction_estimate_B_USD: z.number(),
  responsibility_weight: z.number().min(0).max(1),
  confidence_level: z.enum(["high", "medium", "debated"]),
  sources: z.array(sourceSchema),
  disclaimer: z.string().nullable()
}).superRefine((actor, context) => {
  if (actor.responsibility_weight > 0 && actor.sources.length < 2) {
    if (actor.confidence_level !== "debated") {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${actor.id}: responsibility_weight avec moins de 2 sources exige confidence_level=debated`
      });
    }

    if (!actor.disclaimer) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${actor.id}: disclaimer requis quand moins de 2 sources justifient responsibility_weight`
      });
    }
  }
});

const periodSchema = z.object({
  start: z.number().int(),
  end: z.number().int(),
  actors: z.array(actorSchema),
  map_config: z.object({
    type: z.enum(["heatmap", "choropleth", "flow"]),
    intensity_field: z.string().min(1),
    flow_lines: z.boolean()
  })
}).superRefine((period, context) => {
  if (period.start > period.end) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: `période invalide: ${period.start}-${period.end}`
    });
  }

  const total = period.actors.reduce((sum, actor) => sum + actor.responsibility_weight, 0);
  if (period.actors.length > 0 && Math.abs(total - 1) > 0.001) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: `somme responsibility_weight=${total}; attendu 1.0`
    });
  }
});

const themeSchema = z.object({
  theme_id: z.string().min(1),
  theme_label: z.string().min(1),
  periods: z.array(periodSchema)
});

const themesDir = join(process.cwd(), "data", "themes");
const files = readdirSync(themesDir).filter((file) => file.endsWith(".json") && file !== "index.json");

for (const file of files) {
  const path = join(themesDir, file);
  const parsed = themeSchema.safeParse(JSON.parse(readFileSync(path, "utf8")));

  if (!parsed.success) {
    console.error(`Validation échouée: ${file}`);
    console.error(parsed.error.format());
    process.exitCode = 1;
  } else {
    console.log(`OK ${file}`);
  }
}
