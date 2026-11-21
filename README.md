# atelier_du_cv

Outil d'aide à la candidature : annonce, CV (bibliothèque + recomposition ATS), lettre de
motivation, annexe, suivi des candidatures et entraînement à l'entretien.

Tout fonctionne côté navigateur : bibliothèque, préférences et suivi des candidatures sont
stockés dans `localStorage`, rien n'est envoyé à un serveur. Les seules requêtes externes sont
le chargement de polices (Google Fonts) et de deux bibliothèques techniques publiques
(html2canvas, jsPDF) utilisées pour générer les PDF — aucune donnée saisie ne leur est transmise.

## Déploiement

Le site est 100 % statique (`index.html`), aucun build n'est nécessaire.

**Cloudflare Pages (recommandé) :**
1. Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git.
2. Sélectionner ce dépôt (`johnapplewan/atelier_du_cv`).
3. Build command : laisser vide. Build output directory : `/`.
4. Déployer — chaque push sur `main` republie automatiquement.

Un sous-domaine personnalisé (ex. un sous-domaine de johnapple.fr) se configure ensuite dans
l'onglet *Custom domains* du projet Pages.

**En local :** ouvrir `index.html` dans un navigateur, ou `npx serve .`.

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

`functions/api/offres.js` interroge l'API France Travail. Les identifiants ne sont jamais dans le code : ils se définissent dans
Cloudflare → Workers & Pages → projet → Settings → Variables and Secrets (type « Secret » pour les deux premiers), puis redéployer :

| Variable | Rôle |
|---|---|
| `FT_CLIENT_ID` | identifiant client de l'application créée sur francetravail.io |
| `FT_CLIENT_SECRET` | clé secrète de cette application |
| `FT_SCOPE` | facultatif ; défaut `api_offresdemploiv2 o2dsoffre` (à aligner sur les scopes affichés pour l'application) |

Tant que `FT_CLIENT_ID` et `FT_CLIENT_SECRET` sont absents, l'onglet « Offres » indique que la recherche n'est pas activée.
