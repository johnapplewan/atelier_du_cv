// Cloudflare Pages Function : /api/offres
// Recherche d'offres d'emploi via l'API « Offres d'emploi » de France Travail (francetravail.io).
// Les identifiants restent côté serveur (variables d'environnement Cloudflare, jamais dans le navigateur) :
//   FT_CLIENT_ID, FT_CLIENT_SECRET   (obligatoires)
//   FT_SCOPE                         (facultatif, défaut : "api_offresdemploiv2 o2dsoffre")
//   FT_TOKEN_URL                     (facultatif, remplace l'adresse du serveur d'authentification)
// Seuls les critères de recherche sont transmis ; aucune donnée personnelle de l'utilisateur, aucune offre conservée.
//
// Paramètres : q (mots-clés) · commune (code INSEE, 5 chiffres) · distance (km) · contrat (CDI,CDD,MIS,LIB,...) ·
//              experience (D = débutant accepté, S = souhaitée, E = exigée) · depuis (1,3,7,14,31 jours) · page (1…)

// Serveur d'authentification « Partenaires » de France Travail (royaume /partenaire). L'ancienne adresse reste en secours.
const TOKEN_URLS = [
  "https://authentification-partenaire.francetravail.io/connexion/oauth2/access_token?realm=/partenaire",
  "https://entreprise.francetravail.fr/connexion/oauth2/access_token?realm=/partenaire",
];
const SEARCH_URL = "https://api.francetravail.io/partenaire/offresdemploi/v2/offres/search";
const PER_PAGE = 20;
const CONTRATS = ["CDI", "CDD", "MIS", "SAI", "LIB", "REPRISE", "DDI", "DIN", "FRA", "CCE"];

let cachedToken = null; // { value, exp } : conservé le temps de vie de l'instance

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

// Scopes essayés dans l'ordre : celui fixé par FT_SCOPE, sinon l'API seule, puis avec le scope propre à l'application
// (« application_ » + identifiant client), que certains comptes France Travail exigent.
function scopeCandidates(env) {
  if (env.FT_SCOPE) return [env.FT_SCOPE];
  return ["api_offresdemploiv2 o2dsoffre", "api_offresdemploiv2 o2dsoffre application_" + env.FT_CLIENT_ID];
}

async function getToken(env, fetchImpl) {
  if (cachedToken && cachedToken.exp > Date.now() + 30000) return { token: cachedToken.value };
  let last = { error: "token", detail: "" };
  for (const scope of scopeCandidates(env)) {
    const r = await requestToken(env, fetchImpl, scope);
    if (r.token) return r;
    last = r;
    if (r.error !== "scope") break; // seul un refus de scope justifie d'essayer le suivant
  }
  return last;
}

async function requestToken(env, fetchImpl, scope) {
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: env.FT_CLIENT_ID,
    client_secret: env.FT_CLIENT_SECRET,
    scope,
  });
  const urls = env.FT_TOKEN_URL ? [env.FT_TOKEN_URL] : TOKEN_URLS;
  let res = null, data = {};
  for (const u of urls) {
    try {
      res = await fetchImpl(u, { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: body.toString() });
      data = await res.json().catch(() => ({}));
      break; // une réponse HTTP (même un refus) est définitive : on n'essaie l'autre adresse qu'en cas d'échec réseau
    } catch (e) { res = null; }
  }
  if (!res) return { error: "token", detail: "serveur d'authentification injoignable" };
  if (!res.ok || !data.access_token) {
    const err = String(data.error || "");
    return { error: err === "invalid_scope" ? "scope" : (err === "invalid_client" ? "client" : "token"), detail: String(data.error_description || err || res.status).slice(0, 200) };
  }
  cachedToken = { value: data.access_token, exp: Date.now() + (Number(data.expires_in) || 1200) * 1000 };
  return { token: cachedToken.value };
}

export { requestToken };

export async function onRequestGet(context) {
  const env = context.env || {};
  const fetchImpl = context.fetchImpl || fetch; // injection possible pour les tests
  if (!env.FT_CLIENT_ID || !env.FT_CLIENT_SECRET) return json({ ok: false, reason: "not_configured" });

  const p = new URL(context.request.url).searchParams;
  const q = new URLSearchParams();
  const mots = (p.get("q") || "").trim().slice(0, 100);
  if (mots) q.set("motsCles", mots);
  const commune = (p.get("commune") || "").trim();
  if (/^\d{5}$|^2[AB]\d{3}$/i.test(commune)) {
    q.set("commune", commune.toUpperCase());
    const dist = parseInt(p.get("distance") || "", 10);
    if (isFinite(dist) && dist >= 0 && dist <= 100) q.set("distance", String(dist));
  }
  const contrat = (p.get("contrat") || "").toUpperCase();
  if (CONTRATS.includes(contrat)) q.set("typeContrat", contrat);
  const exp = (p.get("experience") || "").toUpperCase();
  if (["D", "S", "E"].includes(exp)) q.set("experienceExigence", exp);
  const depuis = parseInt(p.get("depuis") || "", 10);
  if ([1, 3, 7, 14, 31].includes(depuis)) q.set("publieeDepuis", String(depuis));
  const page = Math.max(1, Math.min(7, parseInt(p.get("page") || "1", 10) || 1));
  const start = (page - 1) * PER_PAGE;
  q.set("range", `${start}-${start + PER_PAGE - 1}`);
  q.set("sort", "1");
  if (!mots && !q.has("commune")) return json({ ok: false, reason: "criteria_required" }, 400);

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 12000);
  try {
    const t = await getToken(env, fetchImpl);
    if (t.error) return json({ ok: false, reason: "auth_" + t.error, detail: t.detail });
    const res = await fetchImpl(`${SEARCH_URL}?${q.toString()}`, { signal: ctrl.signal, headers: { authorization: "Bearer " + t.token, accept: "application/json" } });
    if (res.status === 204) return json({ ok: true, total: 0, page, totalPages: 0, results: [] });
    if (res.status === 401 || res.status === 403) { cachedToken = null; return json({ ok: false, reason: "auth_denied" }); }
    if (res.status === 429) return json({ ok: false, reason: "rate", retryAfter: parseInt(res.headers.get("retry-after") || "", 10) || null });
    if (res.status !== 200 && res.status !== 206) return json({ ok: false, reason: "upstream_" + res.status });
    const data = await res.json();
    const range = (res.headers.get("content-range") || "").match(/\/(\d+)\s*$/);
    const total = range ? parseInt(range[1], 10) : (data.resultats || []).length;
    const results = (data.resultats || []).map((o) => ({
      id: o.id,
      intitule: o.intitule || "",
      description: o.description || "",
      date: (o.dateCreation || "").slice(0, 10),
      lieu: (o.lieuTravail && o.lieuTravail.libelle) || "",
      cp: (o.lieuTravail && o.lieuTravail.codePostal) || "",
      entreprise: (o.entreprise && o.entreprise.nom) || "",
      contrat: o.typeContratLibelle || o.typeContrat || "",
      nature: o.natureContrat || "",
      experience: o.experienceLibelle || "",
      experienceExige: o.experienceExige || "",
      salaire: (o.salaire && (o.salaire.libelle || o.salaire.commentaire)) || "",
      duree: o.dureeTravailLibelle || "",
      competences: (o.competences || []).map((c) => c.libelle).filter(Boolean).slice(0, 12),
      origine: (o.origineOffre && o.origineOffre.urlOrigine) || "",
      url: "https://candidat.francetravail.fr/offres/recherche/detail/" + o.id,
    }));
    return json({ ok: true, total, page, totalPages: Math.min(7, Math.ceil(total / PER_PAGE)), results });
  } catch (e) {
    return json({ ok: false, reason: "unreachable" });
  } finally {
    clearTimeout(timer);
  }
}
