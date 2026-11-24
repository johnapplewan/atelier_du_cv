// Cloudflare Pages Function : /api/alternance?lat=45.76&lon=4.84&radius=30
// Interroge l'API « La bonne alternance » (api.apprentissage.beta.gouv.fr, route job/v1/search) avec la clé BONNE_ALTERNANCE_KEY (variable du projet, jamais dans le code).
// Renvoie des offres d'alternance et des entreprises à fort potentiel d'embauche, normalisées. Seuls le lieu (coordonnées d'une commune) et le rayon transitent ;
// aucune donnée personnelle, rien n'est stocké ni journalisé. Usage gratuit et non lucratif exigé par la licence de l'API (voir docs/FRANCE-TRAVAIL.md).

const BASE = "https://api.apprentissage.beta.gouv.fr/api/job/v1/search";

function json(body, status = 200, cache = "no-store") {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": cache } });
}

const clean = (t, n) => String(t || "").replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim().slice(0, n);
function ville(addr) { const m = String(addr || "").match(/(\d{5})\s+(.+)$/); return m ? { cp: m[1], ville: m[2] } : { cp: "", ville: String(addr || "") }; }

export function normJob(j) {
  const w = j.workplace || {}, o = j.offer || {}, c = j.contract || {}, a = j.apply || {}, id = j.identifier || {};
  const addr = (w.location && w.location.address) || "";
  return {
    id: String(id.id || a.url || ""), intitule: clean(o.title, 160), entreprise: clean(w.brand || w.name || w.legal_name, 120), lieu: clean(addr, 160),
    contrat: Array.isArray(c.type) ? c.type.join(", ") : clean(c.type, 60), duree: c.duration ? c.duration + " mois" : "", debut: c.start || "",
    date: (j.publication && j.publication.creation) || "", description: clean(o.description, 4000), url: a.url || "", salaire: "", experience: "",
    source: "la-bonne-alternance", partenaire: id.partner_label || "", rome: o.rome_codes || [],
  };
}

export function normRecruiter(r) {
  const w = r.workplace || {}, a = r.apply || {}, id = r.identifier || {}, v = ville(w.location && w.location.address), naf = (w.domain && w.domain.naf) || {};
  return { id: String(id.id || w.siret || ""), nom: clean(w.brand || w.name || w.legal_name, 120), adresse: clean(w.location && w.location.address, 160), ville: v.ville, cp: v.cp,
    nafCode: naf.code || "", nafLabel: naf.label || "", siret: w.siret || "", url: a.url || "", taille: w.size || "" };
}

export async function onRequestGet(context) {
  const env = context.env || {}, fetchImpl = context.fetchImpl || fetch;
  const key = env.BONNE_ALTERNANCE_KEY;
  if (!key) return json({ ok: false, reason: "not_configured" });
  const p = new URL(context.request.url).searchParams;
  const lat = Number(p.get("lat")), lon = Number(p.get("lon")), radius = Math.min(100, Math.max(5, parseInt(p.get("radius"), 10) || 30));
  if (!(lat >= -90 && lat <= 90) || !(lon >= -180 && lon <= 180) || (!p.get("lat") || !p.get("lon"))) return json({ ok: false, reason: "place_required" }, 400);
  const url = BASE + "?latitude=" + lat + "&longitude=" + lon + "&radius=" + radius + "&caller=atelier-candidature";
  const ctrl = new AbortController(), timer = setTimeout(() => ctrl.abort(), 15000);
  try {
    const res = await fetchImpl(url, { headers: { authorization: "Bearer " + key, accept: "application/json" }, signal: ctrl.signal });
    if (res.status === 401 || res.status === 403) return json({ ok: false, reason: "auth" });
    if (res.status === 429) return json({ ok: false, reason: "rate" });
    if (!res.ok) return json({ ok: false, reason: "upstream_" + res.status });
    const data = await res.json();
    const jobs = (Array.isArray(data.jobs) ? data.jobs : []).map(normJob).filter((o) => o.intitule && o.url);
    const recruiters = (Array.isArray(data.recruiters) ? data.recruiters : []).map(normRecruiter).filter((r) => r.nom);
    return json({ ok: true, total: jobs.length, totalRecruiters: recruiters.length, results: jobs.slice(0, 120), recruiters: recruiters.slice(0, 60) }, 200, "public, max-age=600");
  } catch (e) {
    return json({ ok: false, reason: "unreachable" });
  } finally {
    clearTimeout(timer);
  }
}
