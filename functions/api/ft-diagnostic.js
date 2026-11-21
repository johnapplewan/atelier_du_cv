// Diagnostic temporaire des accès France Travail : /api/ft-diagnostic
// DÉSACTIVÉ par défaut. Il ne répond que si la variable d'environnement FT_DIAG vaut "1" ; à retirer une fois le branchement validé.
// Il ne renvoie jamais d'identifiant ni de clé secrète : seulement, pour chaque scope testé, « accordé » ou « refusé ».
//   ?probe=1                          teste une liste de scopes connus
//   ?scope=api_xxx&path=/partenaire/…   appelle un chemin de api.francetravail.io (lecture seule) et renvoie un extrait de la réponse

import { requestToken } from "./offres.js";

const CANDIDATES = [
  "api_offresdemploiv2 o2dsoffre",
  "api_labonneboitev2", "api_labonneboitev1", "api_labonneboite",
  "api_rome-metiersv1", "api_rome-competencesv1", "api_rome-fiches-metiersv1", "api_rome-contextesv1", "api_romev1",
  "api_stats-offres-demandes-emploiv1", "api_infotravailv1",
];

function json(body, status = 200) {
  return new Response(JSON.stringify(body, null, 1), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
}

export async function onRequestGet(context) {
  const env = context.env || {};
  const fetchImpl = context.fetchImpl || fetch;
  if (env.FT_DIAG !== "1") return json({ ok: false, reason: "disabled" }, 404);
  if (!env.FT_CLIENT_ID || !env.FT_CLIENT_SECRET) return json({ ok: false, reason: "not_configured" });
  const p = new URL(context.request.url).searchParams;

  if (p.get("probe")) {
    const out = [];
    for (const base of CANDIDATES) {
      let r = await requestToken(env, fetchImpl, base);
      let used = base;
      if (!r.token && r.error === "scope") {
        used = base + " application_" + env.FT_CLIENT_ID;
        r = await requestToken(env, fetchImpl, used);
      }
      out.push({ scope: base, avec_scope_application: used !== base, accorde: !!r.token, erreur: r.token ? "" : r.error, detail: r.token ? "" : String(r.detail || "").replace(env.FT_CLIENT_ID, "<id>") });
    }
    return json({ ok: true, scopes: out });
  }

  const path = p.get("path") || "", scope = p.get("scope") || "";
  if (!/^\/partenaire\/[A-Za-z0-9_\-\/.?=&%,:]*$/.test(path) || path.includes("..") || !/^[a-z0-9_ \-]+$/i.test(scope)) return json({ ok: false, reason: "bad_request" }, 400);
  let r = await requestToken(env, fetchImpl, scope);
  if (!r.token && r.error === "scope") r = await requestToken(env, fetchImpl, scope + " application_" + env.FT_CLIENT_ID);
  if (!r.token) return json({ ok: false, reason: "auth_" + r.error, detail: String(r.detail || "").replace(env.FT_CLIENT_ID, "<id>") });
  const res = await fetchImpl("https://api.francetravail.io" + path, { headers: { authorization: "Bearer " + r.token, accept: "application/json" } });
  const text = await res.text();
  return json({ ok: true, status: res.status, contentRange: res.headers.get("content-range") || "", extrait: text.slice(0, 2500) });
}
