# atelier_du_cv

Outil d'aide à la candidature : annonce, CV (bibliothèque + recomposition ATS), lettre de
motivation, annexe, suivi des candidatures et entraînement à l'entretien.

Tout fonctionne côté navigateur : bibliothèque, préférences et suivi des candidatures sont
stockés dans `localStorage`, rien n'est envoyé à un serveur. Les polices et les bibliothèques
PDF (html2canvas, jsPDF) sont hébergées avec le site (`vendor/`) : aucune ressource externe,
aucun cookie, aucun outil de mesure.

## Contenu du dépôt

| Élément | Rôle |
|---|---|
| `index.html` | Landing page (racine du site) |
| `app/index.html` | L'application (tout le HTML, le CSS et le JavaScript), servie sous `/app/` |
| `tarifs/` | Page tarifs (publique) |
| `saas/` | Maquettes de pages pour la version SaaS (non routées, `noindex`) |
| `site/`, `assets/` | Style et script communs des pages publiques ; captures (`assets/landing/`) et banque d'images de la plaquette (`assets/plaquette/`) |
| `functions/` | Fonctions serveur Cloudflare Pages |
| `legal/` | Pages légales |
| `docs/` | Documentation : `ARCHITECTURE.md` (référence complète), `ROADMAP.md`, `OFFRES-ET-TARIFS.md`, `PAGES-SAAS.md`, `MARKETING.md`, `METHODE-LETTRE-RAPOS.md` |

La documentation est tenue à jour à chaque modification (voir `CLAUDE.md`).

## Déploiement

Le site est 100 % statique (`index.html`, `app/`, `tarifs/`), aucun build n'est nécessaire.

**Cloudflare Pages (recommandé) :**
1. Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git.
2. Sélectionner ce dépôt (`johnapplewan/atelier_du_cv`).
3. Build command : laisser vide. Build output directory : `/`.
4. Déployer — chaque push sur `main` republie automatiquement.

Un sous-domaine personnalisé (ex. un sous-domaine de johnapple.fr) se configure ensuite dans
l'onglet *Custom domains* du projet Pages.

**En local :** ouvrir `app/index.html` dans un navigateur (l'application) ou `index.html` (la landing), ou `npx serve .` puis `/` et `/app/`.

## Lecture automatique d'une annonce par son lien

Le dossier `functions/` contient une Cloudflare Pages Function (`/api/annonce`). Cloudflare Pages la déploie
toute seule avec le site (aucune configuration ni clé). Elle récupère la page de l'annonce, lit les données
structurées (schema.org `JobPosting`) ou, à défaut, le texte de la page, et les renvoie à l'application.
Seule l'adresse de l'annonce transite par cette fonction ; rien n'est stocké. Les sites qui bloquent les
robots (LinkedIn, Indeed…) ne peuvent pas être lus : on colle alors le texte de l'annonce.

## Recherche d'entreprises

`functions/api/entreprises.js` et `functions/api/lieu.js` interrogent les API publiques « Recherche d'entreprises » et « API Adresse »
(data.gouv.fr, Licence Ouverte 2.0) pour l'onglet Recherche (candidatures spontanées). Seuls le secteur, la zone et la taille sont transmis.

## Pages légales et conformité

- Pages : `legal/mentions-legales.html`, `legal/confidentialite.html`, `legal/cgu.html`, `legal/accessibilite.html`.
- **À compléter avant production** : `legal/config.js` (identité de l'éditeur, adresse, contact, directeur de la publication). Les champs vides s'affichent en rouge « À COMPLÉTER ».
- Polices (`vendor/fonts*`) et bibliothèques PDF (`vendor/*.js`) sont hébergées sur le site : aucune ressource tierce n'est chargée.
- `_headers` : politique de sécurité du contenu (CSP), HSTS, X-Frame-Options, etc. (Cloudflare Pages).
- `robots.txt` et `sitemap.xml` : à garder à jour si le domaine change.

## Offres France Travail (API « Offres d'emploi »)

**État : accès refusé par France Travail à ce stade** (voir `docs/FRANCE-TRAVAIL.md`) ; le formulaire de l'onglet Offres est masqué (`OFFRES_API_ACTIVE`) et le contenu d'une offre issue de l'API n'est jamais envoyé à l'IA. `functions/api/offres.js` interroge l'API France Travail. Les identifiants ne sont jamais dans le code : ils se définissent dans
Cloudflare → Workers & Pages → projet → Settings → Variables and Secrets (type « Secret » pour les deux premiers), puis redéployer :

| Variable | Rôle |
|---|---|
| `FT_CLIENT_ID` | identifiant client de l'application créée sur francetravail.io |
| `FT_CLIENT_SECRET` | clé secrète de cette application |
| `FT_SCOPE` | facultatif ; défaut `api_offresdemploiv2 o2dsoffre` (à aligner sur les scopes affichés pour l'application) |

Tant que `FT_CLIENT_ID` et `FT_CLIENT_SECRET` sont absents, l'onglet « Offres » indique que la recherche n'est pas activée.

### Diagnostic des accès France Travail (temporaire)

`functions/api/ft-diagnostic.js` est **désactivé** tant que la variable `FT_DIAG` n'est pas `1`. Activé, `/api/ft-diagnostic?probe=1` indique,
pour une liste de scopes connus, lesquels sont accordés à l'application (aucun identifiant ni secret n'est renvoyé). Retirer `FT_DIAG` après usage.
Si `FT_SCOPE` est absent, la fonction `/api/offres` essaie `api_offresdemploiv2 o2dsoffre`, puis la même chose avec `application_<FT_CLIENT_ID>`.
