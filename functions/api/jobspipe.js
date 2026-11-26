// Cloudflare Pages Function : /api/jobspipe?q=monteur%20vidéo&ville=Reims&jours=30
// Source d'offres généralistes (CDI, CDD, stage, freelance…) : JobsPipe (api.jobspipe.dev), clé PIPE_KEY (variable du projet, jamais dans le code).
// PHASE DE TEST : une seule clé sert les testeurs, au plan gratuit (1 000 crédits uniques, 1 crédit par offre retournée, 7 offres par recherche).
// Les conditions de JobsPipe interdisent de partager une clé d'API : ne pas diffuser largement sans accord écrit (voir docs/FRANCE-TRAVAIL.md).
// Seuls les mots-clés et la commune transitent ; aucune donnée personnelle, rien n'est stocké ni journalisé. Le lien vers l'annonce d'origine est toujours conservé.
// Variable facultative JOBSPIPE_OFF = "1" : coupe la source (économise les crédits).

const URL_SEARCH = "https://api.jobspipe.dev/v1/jobs/search";

function json(body, status = 200, cache = "no-store") {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": cache } });
}
const clean = (t, n) => String(t || "").replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim().slice(0, n);

export function normJob(j) {
  const sal = j.salary_string ? clean(j.salary_string, 80)
    : (j.salary_min || j.salary_max) ? [j.salary_min, j.salary_max].filter(Boolean).join(" – ") + (j.salary_currency ? " " + j.salary_currency : "") + (j.salary_unit ? " / " + j.salary_unit : "") : "";
  const st = Array.isArray(j.employment_statuses) ? j.employment_statuses.join(", ") : clean(j.employment_statuses, 60);
  return {
    id: "jp-" + String(j.id || j.url || "").slice(-80), intitule: clean(j.job_title, 160), entreprise: clean(j.company, 120), lieu: clean(j.location, 160),
    contrat: st, duree: "", debut: "", date: String(j.date_posted || "").slice(0, 10), description: clean(j.description, 4000), url: j.url || "",
    salaire: sal, experience: "", source: "jobspipe", partenaire: "", rome: [],
  };
}

export async function onRequestGet(context) {
  const env = context.env || {}, fetchImpl = context.fetchImpl || fetch;
  if (!env.PIPE_KEY || env.JOBSPIPE_OFF === "1") return json({ ok: false, reason: "not_configured" });
  const p = new URL(context.request.url).searchParams;
  const q = String(p.get("q") || "").split(/[,;\n]/).map((s) => s.trim()).filter((s) => s.length >= 2).slice(0, 5);
  if (!q.length) return json({ ok: false, reason: "query_required" }, 400);
  const ville = String(p.get("ville") || "").trim().slice(0, 80), jours = Math.min(90, Math.max(1, parseInt(p.get("jours"), 10) || 30));
  const body = { job_country_code_or: ["FR"], language_or: ["fr"], job_title_or: q, posted_at_max_age_days: jours, limit: 7 };
  if (ville) body.city_or = [ville];
  const ctrl = new AbortController(), timer = setTimeout(() => ctrl.abort(), 20000);
  try {
    const res = await fetchImpl(URL_SEARCH, { method: "POST", headers: { authorization: "Bearer " + env.PIPE_KEY, "content-type": "application/json", accept: "application/json" }, body: JSON.stringify(body), signal: ctrl.signal });
    if (res.status === 401 || res.status === 403) return json({ ok: false, reason: "auth" });
    if (res.status === 402) return json({ ok: false, reason: "credits" });
    if (res.status === 429) return json({ ok: false, reason: "rate" });
    if (!res.ok) return json({ ok: false, reason: "upstream_" + res.status });
    const data = await res.json(), md = data.metadata || {};
    const jobs = (Array.isArray(data.data) ? data.data : []).map(normJob).filter((o) => o.intitule && o.url);
    return json({ ok: true, total: jobs.length, results: jobs, creditsRestants: typeof md.credits_remaining === "number" ? md.credits_remaining : null }, 200, "public, max-age=900");
  } catch (e) {
    return json({ ok: false, reason: "unreachable" });
  } finally {
    clearTimeout(timer);
  }
}
