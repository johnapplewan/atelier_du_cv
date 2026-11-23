// Diagnostic temporaire des sources d'offres : /api/sources-diag
// DÉSACTIVÉ par défaut : il ne répond que si la variable d'environnement SOURCES_DIAG vaut "1". À retirer une fois les branchements validés.
// Il protège les quotas : une seule requête amont par appel, et seulement avec confirm=1 (sans lui, il décrit ce qu'il ferait).
// Il ne renvoie jamais de clé : seulement un statut, des comptages et quelques champs (titre, entreprise, lieu, date).
//   ?source=lba|adzuna|theirstack            décrit la requête (aucun appel)
//   ?source=lba|adzuna|theirstack&confirm=1  fait UN appel amont minimal
// Variables : BONNE_ALTERNANCE_KEY (La bonne alternance), APP_ID et APP_KEY (Adzuna, 25 appels au total), AUTORISATION_KEY (TheirStack, 200 crédits).

function json(body, status = 200) {
  return new Response(JSON.stringify(body, null, 1), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
}

function plan(source, env) {
  if (source === "lba") {
    const key = env.BONNE_ALTERNANCE_KEY;
    return { configured: !!key, cost: "1 appel (quota de 5 à 20 appels par seconde)", method: "GET",
      url: "https://api.apprentissage.beta.gouv.fr/api/job/v1/search?latitude=45.764&longitude=4.835&radius=30&caller=atelier-candidature",
      headers: { authorization: "Bearer " + (key || "") } };
  }
  if (source === "adzuna") {
    const id = env.APP_ID || env.ADZUNA_APP_ID, key = env.APP_KEY || env.ADZUNA_APP_KEY;
    return { configured: !!(id && key), cost: "1 appel sur les 25 disponibles", method: "GET",
      url: "https://api.adzuna.com/v1/api/jobs/fr/search/1?results_per_page=3&what=communication&where=Lyon&app_id=" + encodeURIComponent(id || "") + "&app_key=" + encodeURIComponent(key || ""), headers: { accept: "application/json" }, secrets: [id, key] };
  }
  if (source === "theirstack") {
    const key = env.AUTORISATION_KEY;
    return { configured: !!key, cost: "2 crédits au plus (1 crédit par offre renvoyée, limit = 2)", method: "POST",
      url: "https://api.theirstack.com/v1/jobs/search",
      headers: { authorization: "Bearer " + (key || ""), "content-type": "application/json" },
      body: JSON.stringify({ job_country_code_or: ["FR"], posted_at_max_age_days: 7, limit: 2, page: 0, include_total_results: false }) };
  }
  return null;
}

const pick = (o, path) => path.split(".").reduce((a, k) => (a == null ? a : a[k]), o);
const host = (u) => { try { return new URL(u).host; } catch (e) { return ""; } };

function summarize(source, data) {
  if (source === "adzuna") {
    const r = Array.isArray(data.results) ? data.results : [];
    return { count: data.count, results: r.slice(0, 3).map(x => ({ titre: x.title, entreprise: pick(x, "company.display_name"), lieu: pick(x, "location.display_name"), date: x.created, source_lien: host(x.redirect_url) })) };
  }
  if (source === "theirstack") {
    const r = Array.isArray(data.data) ? data.data : [];
    return { metadata: data.metadata || null, results: r.slice(0, 2).map(x => ({ titre: x.job_title, entreprise: x.company, lieu: x.location, pays: x.country_code, date: x.date_posted, source_lien: host(x.url) })) };
  }
  // La bonne alternance : structure non documentée publiquement, on renvoie la forme (clés) et un extrait court
  const shape = {};
  if (data && typeof data === "object") for (const k of Object.keys(data)) shape[k] = Array.isArray(data[k]) ? "tableau de " + data[k].length : typeof data[k];
  const firstList = data && Object.values(data).find(v => Array.isArray(v) && v.length);
  return { forme: shape, premier_element_cles: firstList ? Object.keys(firstList[0] || {}) : [], premier_element: firstList ? JSON.stringify(firstList[0]).slice(0, 1200) : "" };
}

export async function onRequestGet(context) {
  const env = context.env || {};
  const fetchImpl = context.fetchImpl || fetch;
  if (env.SOURCES_DIAG !== "1") return json({ ok: false, reason: "disabled" }, 404);
  const p = new URL(context.request.url).searchParams;
  const source = p.get("source") || "";
  const pl = plan(source, env);
  if (!pl) return json({ ok: false, reason: "bad_request", sources: ["lba", "adzuna", "theirstack"] }, 400);
  const safe = (t) => { let s = String(t); [env.BONNE_ALTERNANCE_KEY, env.APP_ID, env.APP_KEY, env.ADZUNA_APP_ID, env.ADZUNA_APP_KEY, env.AUTORISATION_KEY].filter(Boolean).forEach(k => { s = s.split(k).join("<secret>"); }); return s; };
  if (!pl.configured) return json({ ok: false, reason: "not_configured" });
  if (p.get("confirm") !== "1") return json({ ok: true, dry_run: true, source, will_do: { method: pl.method, url: safe(pl.url), cost: pl.cost }, hint: "Ajoute &confirm=1 pour faire cet appel unique." });
  let res, text;
  try {
    res = await fetchImpl(pl.url, { method: pl.method, headers: pl.headers, body: pl.body });
    text = await res.text();
  } catch (e) { return json({ ok: false, reason: "network", detail: safe(e && e.message) }); }
  let data = null;
  try { data = JSON.parse(text); } catch (e) { /* réponse non JSON */ }
  if (!res.ok || !data) return json({ ok: false, source, status: res.status, extrait: safe(text).slice(0, 1500) });
  return json({ ok: true, source, status: res.status, cost: pl.cost, resume: summarize(source, data) });
}
