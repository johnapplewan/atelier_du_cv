// Cloudflare Pages Function : /api/annonce?url=https://...
// Va chercher la page d'une offre d'emploi (le navigateur ne peut pas le faire lui-même : CORS) et en
// extrait un résultat structuré. Rien n'est stocké ni journalisé ; aucune donnée personnelle n'y transite,
// seulement l'adresse de l'annonce.

const MAX_BYTES = 1500000;
const TIMEOUT_MS = 10000;
const UA = "Mozilla/5.0 (compatible; AtelierCandidature/1.0; lecture d'une offre d'emploi demandée par l'utilisateur)";

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

function isPrivateHost(host) {
  const h = host.toLowerCase();
  if (h === "localhost" || h.endsWith(".localhost") || h.endsWith(".local") || h.endsWith(".internal")) return true;
  if (/^\d+\.\d+\.\d+\.\d+$/.test(h)) {
    const [a, b] = h.split(".").map(Number);
    return a === 10 || a === 127 || a === 0 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168);
  }
  if (h.includes(":") || h.startsWith("[")) return true; // IPv6 littérale : refusée
  return false;
}

function decodeEntities(s) {
  return s
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&rsquo;|&lsquo;/g, "'")
    .replace(/&laquo;/g, "«").replace(/&raquo;/g, "»").replace(/&hellip;/g, "…").replace(/&ndash;|&mdash;/g, "-")
    .replace(/&#(\d+);/g, (_, n) => { try { return String.fromCodePoint(+n); } catch { return " "; } })
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => { try { return String.fromCodePoint(parseInt(n, 16)); } catch { return " "; } });
}

function htmlToText(html) {
  return decodeEntities(
    String(html || "")
      .replace(/<(script|style|noscript|svg|template)[\s\S]*?<\/\1>/gi, " ")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(p|div|li|ul|ol|h[1-6]|tr|section|article)>/gi, "\n")
      .replace(/<li[^>]*>/gi, "- ")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/[ \t ]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function metaContent(html, key) {
  const re1 = new RegExp(`<meta[^>]+(?:property|name)=["']${key}["'][^>]*content=["']([^"']*)["']`, "i");
  const re2 = new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]*(?:property|name)=["']${key}["']`, "i");
  const m = html.match(re1) || html.match(re2);
  return m ? decodeEntities(m[1]).trim() : "";
}

// Parcourt les blocs JSON-LD et renvoie le premier JobPosting.
function findJobPosting(html) {
  const blocks = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
  const walk = (node) => {
    if (!node || typeof node !== "object") return null;
    if (Array.isArray(node)) { for (const n of node) { const r = walk(n); if (r) return r; } return null; }
    const t = node["@type"];
    if (t === "JobPosting" || (Array.isArray(t) && t.includes("JobPosting"))) return node;
    if (node["@graph"]) return walk(node["@graph"]);
    return null;
  };
  for (const b of blocks) {
    try { const r = walk(JSON.parse(b.trim())); if (r) return r; } catch { /* bloc invalide : on passe */ }
  }
  return null;
}

function place(loc) {
  const l = Array.isArray(loc) ? loc[0] : loc;
  if (!l) return "";
  const a = l.address || l;
  if (typeof a === "string") return a;
  return [a.addressLocality, a.postalCode, a.addressRegion, a.addressCountry && (a.addressCountry.name || a.addressCountry)]
    .filter((x) => x && typeof x === "string").join(", ");
}

function salary(job) {
  const s = job.baseSalary;
  if (!s) return "";
  const v = s.value || {};
  const cur = s.currency || v.currency || "";
  if (typeof v === "number" || typeof v === "string") return `${v} ${cur}`.trim();
  const range = v.minValue && v.maxValue ? `${v.minValue} à ${v.maxValue}` : (v.value || v.minValue || v.maxValue || "");
  return `${range} ${cur}${v.unitText ? " / " + String(v.unitText).toLowerCase() : ""}`.trim();
}

function mainText(html) {
  const pick = html.match(/<(article|main)[\s\S]*?<\/\1>/i);
  const text = htmlToText(pick ? pick[0] : html);
  return text.slice(0, 14000);
}

export async function onRequestGet(context) {
  const reqUrl = new URL(context.request.url);
  const target = (reqUrl.searchParams.get("url") || "").trim();
  if (!target) return json({ ok: false, reason: "no_url" }, 400);

  let u;
  try { u = new URL(target); } catch { return json({ ok: false, reason: "bad_url" }, 400); }
  if (!/^https?:$/.test(u.protocol)) return json({ ok: false, reason: "bad_url" }, 400);
  const allowPrivate = context.env && context.env.ALLOW_PRIVATE === "1";
  if (!allowPrivate && isPrivateHost(u.hostname)) return json({ ok: false, reason: "forbidden_host" }, 400);

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  let res;
  try {
    res = await fetch(u.toString(), {
      signal: ctrl.signal, redirect: "follow",
      headers: { "user-agent": UA, accept: "text/html,application/xhtml+xml", "accept-language": "fr-FR,fr;q=0.9,en;q=0.6" },
    });
  } catch (e) {
    clearTimeout(timer);
    return json({ ok: false, reason: "unreachable", host: u.hostname });
  }
  clearTimeout(timer);

  const finalHost = new URL(res.url || u.toString()).hostname;
  if (!allowPrivate && isPrivateHost(finalHost)) return json({ ok: false, reason: "forbidden_host" }, 400);
  if (res.status === 401 || res.status === 403 || res.status === 429 || res.status === 999) {
    return json({ ok: false, reason: "blocked", status: res.status, host: finalHost });
  }
  if (!res.ok) return json({ ok: false, reason: "http_" + res.status, host: finalHost });
  const ctype = res.headers.get("content-type") || "";
  if (!/html|xml|text/i.test(ctype)) return json({ ok: false, reason: "not_html", host: finalHost });

  const buf = await res.arrayBuffer();
  const html = new TextDecoder("utf-8").decode(buf.byteLength > MAX_BYTES ? buf.slice(0, MAX_BYTES) : buf);

  const job = findJobPosting(html);
  let out;
  if (job) {
    const org = job.hiringOrganization;
    out = {
      source: "jsonld",
      title: decodeEntities(String(job.title || "")).trim(),
      company: decodeEntities(String((org && (org.name || (typeof org === "string" ? org : ""))) || "")).trim(),
      companyUrl: org && (org.sameAs || org.url) ? String(org.sameAs || org.url) : "",
      location: place(job.jobLocation) || (job.jobLocationType === "TELECOMMUTE" ? "Télétravail" : ""),
      contract: [].concat(job.employmentType || []).join(", "),
      salary: salary(job),
      datePosted: job.datePosted || "",
      validThrough: job.validThrough || "",
      description: htmlToText(job.description || ""),
    };
  } else {
    const title = metaContent(html, "og:title") || (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1] || (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || "";
    out = {
      source: "html",
      title: htmlToText(title).slice(0, 160),
      company: metaContent(html, "og:site_name"),
      companyUrl: "", location: "", contract: "", salary: "", datePosted: "", validThrough: "",
      description: mainText(html),
    };
  }

  // Page « mur » (captcha, JavaScript requis) : trop peu de contenu exploitable
  if (!out.description || out.description.length < 200) {
    const wall = /captcha|enable javascript|activez javascript|vérification|are you a human|access denied/i.test(html.slice(0, 20000));
    return json({ ok: false, reason: wall ? "blocked" : "empty", host: finalHost, partial: { title: out.title, company: out.company } });
  }
  out.description = out.description.slice(0, 14000);
  return json({ ok: true, host: finalHost, finalUrl: res.url || u.toString(), ...out });
}
