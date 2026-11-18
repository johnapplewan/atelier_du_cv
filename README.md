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
