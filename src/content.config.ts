import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// un archivo .md por evento en src/content/events; el cuerpo es la descripción
const events = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/events" }),
	schema: z.object({
		title: z.string(),
		date: z.coerce.date(),
		endDate: z.coerce.date().optional(),
		cycle: z.string(),
		location: z.string(),
		attendees: z.number().optional(),
		partners: z.array(z.string()).default([]),
		talks: z.array(z.string()).default([]),
		photos: z.array(z.object({ src: z.string(), alt: z.string() })).default([]),
		link: z.string().url().optional(),
	}),
});

export const collections = { events };
