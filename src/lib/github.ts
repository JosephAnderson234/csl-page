// Datos de proyectos traídos al generar el sitio:
// - proyectos de miembros: content.yml de csl-club/awesome-utec (misma fuente que esa web)
// - repos del club: API pública de GitHub para la organización csl-club
import { parse as parseYaml } from "yaml";

export const ORG = "csl-club";
export const AWESOME_REPO = `${ORG}/awesome-utec`;
const AWESOME_CONTENT_URL = `https://raw.githubusercontent.com/${AWESOME_REPO}/HEAD/content.yml`;

// repos de la organización que no son proyectos del club (forks se excluyen aparte)
const HIDDEN_REPOS = new Set(["demo-repository", "scheme"]);

// sin token la API permite 60 pedidos por hora; con GITHUB_TOKEN en el entorno, muchos más
const headers: Record<string, string> = {
	Accept: "application/vnd.github+json",
	...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
};

interface GithubRepo {
	name: string;
	description: string | null;
	language: string | null;
	stargazers_count: number;
	html_url: string;
	homepage: string | null;
	pushed_at: string;
	fork: boolean;
	archived: boolean;
}

const getJson = async <T>(url: string): Promise<T> => {
	const res = await fetch(url, { headers });
	if (!res.ok) throw new Error(`${url} respondió ${res.status}`);
	return res.json() as Promise<T>;
};

// "github:Owner/repo" o "gitlab:Owner/repo" (formato de awesome-utec); cualquier otra cosa es una URL
const parseRepo = (repo: string) => {
	const match = repo.match(/^(github|gitlab):([^/]+)\/(.+)$/i);
	if (!match) return { url: repo, github: null };
	const [, type, owner, name] = match;
	const host = type.toLowerCase() === "github" ? "github.com" : "gitlab.com";
	return { url: `https://${host}/${owner}/${name}`, github: host === "github.com" ? `${owner}/${name}` : null };
};

interface AwesomeContent {
	authors: Record<string, { name: string }>;
	projects: { name: string; authors: string[]; repo: string; summary?: string; tags?: string[]; lang?: string }[];
}

export const loadMemberProjects = async () => {
	const res = await fetch(AWESOME_CONTENT_URL);
	if (!res.ok) throw new Error(`No se pudo leer ${AWESOME_CONTENT_URL} (${res.status})`);
	const content = parseYaml(await res.text()) as AwesomeContent;

	return Promise.all(
		content.projects.map(async (project, order) => {
			const repo = parseRepo(project.repo);
			// el lenguaje y las estrellas vienen de GitHub; si falla, se muestra lo que haya en el yml
			const remote = repo.github
				? await getJson<GithubRepo>(`https://api.github.com/repos/${repo.github}`).catch((err) => {
						console.warn(`[proyectos] ${err.message}`);
						return null;
					})
				: null;

			return {
				id: project.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
				order,
				name: project.name,
				// solo nombres: el yml también trae correos que no publicamos
				authors: project.authors.map((id) => content.authors[id]?.name ?? id),
				summary: project.summary ?? remote?.description ?? "",
				tags: project.tags ?? [],
				lang: project.lang ?? remote?.language ?? undefined,
				stars: remote?.stargazers_count,
				url: repo.url,
			};
		}),
	);
};

export const loadOrgRepos = async () => {
	const repos = await getJson<GithubRepo[]>(`https://api.github.com/orgs/${ORG}/repos?per_page=100`);
	return repos
		.filter((repo) => !repo.fork && !repo.archived && !HIDDEN_REPOS.has(repo.name))
		.map((repo) => ({
			id: repo.name,
			name: repo.name,
			description: repo.description ?? "",
			lang: repo.language ?? undefined,
			stars: repo.stargazers_count,
			url: repo.html_url,
			homepage: repo.homepage || undefined,
			pushedAt: new Date(repo.pushed_at),
		}));
};
