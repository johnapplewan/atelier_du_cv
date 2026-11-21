// Cloudflare Pages Function : /api/entreprises
// Interroge l'API publique « Recherche d'entreprises » (recherche-entreprises.api.gouv.fr, Licence Ouverte)
// pour trouver des entreprises actives d'un secteur (codes NAF) dans une zone. Rien n'est stocké ni journalisé
// par l'application ; seuls les critères de recherche (secteur, lieu, taille) sont transmis.
//
// Paramètres : naf=62.01Z,62.02A  lat & lon & radius (km, 1-50)  |  dep=51  |  taille=tpe|pme|eti  |  page=1

const UA = "AtelierCandidature/1.0 (recherche d'entreprises pour candidatures spontanées)";
const BASE = "https://recherche-entreprises.api.gouv.fr";

const EFFECTIF = {
  NN: "Non renseigné", "00": "0 salarié", "01": "1 à 2", "02": "3 à 5", "03": "6 à 9", "11": "10 à 19", "12": "20 à 49",
  "21": "50 à 99", "22": "100 à 199", "31": "200 à 249", "32": "250 à 499", "41": "500 à 999", "42": "1 000 à 1 999",
  "51": "2 000 à 4 999", "52": "5 000 à 9 999", "53": "10 000 et plus",
};
const TAILLES = { tpe: "01,02,03", pme: "11,12,21,22,31", eti: "32,41,42,51,52,53" };

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "public, max-age=300" },
  });
}

export async function onRequestGet(context) {
  const p = new URL(context.request.url).searchParams;
  const naf = (p.get("naf") || "").split(",").map((x) => x.trim()).filter((x) => /^\d{2}\.\d{2}[A-Z]$/.test(x)).slice(0, 8);
  if (!naf.length) return json({ ok: false, reason: "naf_required" }, 400);

  const q = new URLSearchParams();
  q.set("activite_principale", naf.join(","));
  q.set("etat_administratif", "A");
  q.set("per_page", "20");
  q.set("page", String(Math.max(1, Math.min(50, parseInt(p.get("page") || "1", 10) || 1))));
  const taille = TAILLES[p.get("taille") || ""];
  if (taille) q.set("tranche_effectif_salarie", taille);

  let path = "/search";
  const lat = parseFloat(p.get("lat")), lon = parseFloat(p.get("lon")), radius = parseFloat(p.get("radius"));
  const dep = (p.get("dep") || "").trim();
  if (isFinite(lat) && isFinite(lon) && isFinite(radius) && radius > 0) {
    path = "/near_point";
    q.set("lat", lat.toFixed(5)); q.set("long", lon.toFixed(5)); q.set("radius", String(Math.min(50, Math.max(1, radius))));
  } else if (/^(\d{2}|\d[AB]|97\d)$/i.test(dep)) {
    q.set("departement", dep.toUpperCase());
  }

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 10000);
  try {
    const res = await fetch(`${BASE}${path}?${q.toString()}`, { signal: ctrl.signal, headers: { "user-agent": UA, accept: "application/json" } });
    if (res.status === 429) return json({ ok: false, reason: "rate" });
    if (!res.ok) return json({ ok: false, reason: "upstream_" + res.status });
    const data = await res.json();
    const results = (data.results || []).map((r) => {
      const m = (r.matching_etablissements && r.matching_etablissements[0]) || r.siege || {};
      const siege = r.siege || {};
      return {
        siren: r.siren,
        nom: r.nom_complet || r.nom_raison_sociale || "",
        naf: r.activite_principale || m.activite_principale || "",
        effectifCode: m.tranche_effectif_salarie || siege.tranche_effectif_salarie || "NN",
        categorie: r.categorie_entreprise || "",
        effectif: EFFECTIF[m.tranche_effectif_salarie] || EFFECTIF[siege.tranche_effectif_salarie] || EFFECTIF.NN,
        employeur: (m.caractere_employeur || siege.caractere_employeur) === "O",
        ville: m.libelle_commune || siege.libelle_commune || "",
        cp: m.code_postal || siege.code_postal || "",
        adresse: m.adresse || siege.adresse || "",
        creation: (r.date_creation || "").slice(0, 4),
        fiche: "https://annuaire-entreprises.data.gouv.fr/entreprise/" + r.siren,
      };
    });
    // /near_point ne filtre pas par taille : on filtre ici, en gardant les tailles non renseignées
    const wanted = taille ? taille.split(",") : null;
    const kept = path === "/near_point" && wanted ? results.filter((x) => wanted.includes(x.effectifCode) || x.effectifCode === "NN" || !x.effectifCode) : results;
    return json({ ok: true, total: data.total_results || results.length, page: data.page || 1, totalPages: data.total_pages || 1, filtered: kept.length !== results.length, results: kept });
  } catch (e) {
    return json({ ok: false, reason: "unreachable" });
  } finally {
    clearTimeout(timer);
  }
}
