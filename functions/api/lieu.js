// Cloudflare Pages Function : /api/lieu?q=Reims
// Transmet la saisie à l'API Adresse (base adresse nationale, api-adresse.data.gouv.fr) et renvoie des communes.
// Rien n'est stocké ni journalisé par l'application.

const UA = "AtelierCandidature/1.0 (recherche de commune)";

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "public, max-age=3600" },
  });
}

export async function onRequestGet(context) {
  const q = (new URL(context.request.url).searchParams.get("q") || "").trim().slice(0, 80);
  if (q.length < 2) return json({ ok: false, reason: "short" }, 400);
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  try {
    const u = "https://api-adresse.data.gouv.fr/search/?type=municipality&limit=6&q=" + encodeURIComponent(q);
    const res = await fetch(u, { signal: ctrl.signal, headers: { "user-agent": UA, accept: "application/json" } });
    if (!res.ok) return json({ ok: false, reason: "upstream_" + res.status });
    const data = await res.json();
    const places = (data.features || []).map((f) => ({
      label: f.properties.label,
      postcode: f.properties.postcode,
      citycode: f.properties.citycode,
      dep: f.properties.citycode ? String(f.properties.citycode).slice(0, String(f.properties.citycode).startsWith("97") ? 3 : 2) : "",
      context: f.properties.context,
      lat: f.geometry.coordinates[1],
      lon: f.geometry.coordinates[0],
    }));
    return json({ ok: true, places });
  } catch (e) {
    return json({ ok: false, reason: "unreachable" });
  } finally {
    clearTimeout(timer);
  }
}
