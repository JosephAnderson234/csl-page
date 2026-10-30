import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { loadMemberProjects, loadOrgRepos } from "./lib/github";

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

// proyectos de miembros: se leen de awesome-utec al generar el sitio (ver src/lib/github.ts)
const projects = defineCollection({
	loader: loadMemberProjects,
	schema: z.object({
		order: z.number(),
		name: z.string(),
		authors: z.array(z.string()),
		summary: z.string(),
		tags: z.array(z.string()),
		lang: z.string().optional(),
		stars: z.number().optional(),
		url: z.string().url(),
	}),
});

// repos de la organización csl-club en GitHub
const repos = defineCollection({
	loader: loadOrgRepos,
	schema: z.object({
		name: z.string(),
		description: z.string(),
		lang: z.string().optional(),
		stars: z.number(),
		url: z.string().url(),
		homepage: z.string().optional(),
		pushedAt: z.coerce.date(),
	}),
});

export const collections = { events, projects, repos };
