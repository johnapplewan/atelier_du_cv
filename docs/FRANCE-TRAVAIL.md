# France Travail : accès à l'API « Offres d'emploi »

## État

**Accès refusé à ce stade** (incident INC2791790, « Accès Offres Refusé », élément « API Gateway – Rechercher des offres », code de résolution « Conseil et accompagnement »). France Travail applique une **mesure conservatoire** : les demandes d'accès à l'API Recherche d'offres sont soumises à validation de ses responsables métiers. Le support a clôturé la demande « dans sa configuration actuelle ».

L'onglet **Offres** (`functions/api/offres.js`) reste dans le code mais **n'est pas activable** : il affiche « non activée ». Aucune offre France Travail n'est promise dans les textes publics (landing, tarifs).

## Conditions posées par France Travail (résumé de la réponse)

1. **Audience réelle ou stratégie de diffusion crédible** : le service doit être réellement utile, utilisé et utilisable, et compléter utilement les services déjà fournis par France Travail.
2. **Pas d'entraînement ni d'affinage ni de maintenance d'un modèle d'IA** avec l'API.
3. **Aucun compte personnel imposé** et **aucune contrepartie financière** pour accéder aux offres et y candidater.
4. **Article 5.1 de la licence de réutilisation** de la base des offres : aucune rétribution, directe ou indirecte, ne peut être exigée des personnes à la recherche d'un emploi en contrepartie de services de placement (article L. 5321-3 du code du travail). La « rétribution » est interprétée largement : transaction financière, mais aussi **toute collecte de données** (création de compte, obligation de fournir un CV ou des données personnelles en amont pour accéder aux offres ou y postuler).
5. France Travail a lu le projet comme **conditionnant le rapprochement profils / offres à la création d'un compte et à la transmission de données** : elle y voit une contrepartie indirecte.

Licence : https://francetravail.io/produits-partages/documentation/conditions-dutilisation-api/licence-offres-emploi

## Analyse par rapport au produit (à faire relire par un juriste)

| Condition | Situation aujourd'hui (bêta) | Situation prévue (SaaS) |
|---|---|---|
| Aucun compte imposé | Respectée : aucun compte | **Risque** : des comptes sont prévus (`saas/`) |
| Aucune contrepartie financière | Respectée : tout est gratuit | **Risque** : formules payantes (`docs/OFFRES-ET-TARIFS.md`) |
| Aucune collecte de données | Respectée : base dans le navigateur, seuls mots-clés, lieu et filtres partent vers le serveur | À garder : ne jamais stocker côté serveur le CV ou les recherches |
| Rapprochement profil / offre | Local (dans le navigateur) | À garder local ; ne pas le conditionner à un compte ou à un paiement |
| Pas d'entraînement d'IA | Respectée : aucun entraînement ; l'IA passe par le compte Claude de la personne | **À préciser** : le texte d'une offre peut être envoyé à Claude par la personne pour réécrire une lettre ; décider si on le permet pour les offres issues de l'API |
| Audience / diffusion crédible | **Non réunie** : le site n'est pas diffusé | À démontrer (plan de diffusion, audience) |
| Complémentarité avec France Travail | À argumenter : composition du CV et de la lettre, suivi, plaquettes freelance | À argumenter |

## Options

- **A. Redéposer plus tard** avec un modèle clarifié et une audience : la **recherche d'offres reste gratuite, sans compte et sans CV obligatoire**, quelle que soit la formule ; les formules payantes ne portent que sur les outils de composition (CV, lettre, plaquettes, suivi). À faire après la diffusion de la landing.
- **B. Se passer de l'API** : la personne colle le lien ou le texte d'une annonce (onglet Annonce, `/api/annonce`, déjà en service) et la recherche d'entreprises (`/api/entreprises`, data.gouv.fr) reste ouverte. Aucune dépendance à France Travail.
- **C. Autre source d'offres** : étudier d'autres fournisseurs (conditions et licences à vérifier un par un avant tout choix).
- **D. Retirer l'onglet Offres** de l'interface tant qu'aucune source n'est disponible.

**Recommandation** : B tout de suite (rien à changer), A après diffusion ; fixer dès maintenant la règle de conception « **l'accès aux offres ne dépend jamais d'un compte ni d'un paiement** » dans le SaaS (voir `docs/OFFRES-ET-TARIFS.md`).

## Brouillon de réponse (à adapter et à valider avant envoi)

> Bonjour,
>
> Merci pour votre réponse détaillée. Atelier Candidature est un outil local : le parcours de la personne reste dans son navigateur, sans compte ni envoi de CV. L'API ne reçoit que des mots-clés, un lieu et des filtres, et le rapprochement avec le parcours se fait sur l'appareil de la personne. L'accès aux offres est gratuit et n'exige ni compte ni CV. [À confirmer : cet engagement vaut quelle que soit l'évolution du service, y compris si des formules payantes existent pour les outils de rédaction.]
>
> L'API ne sert à aucun entraînement, affinage ou maintenance de modèle d'IA. [À confirmer : l'assistant d'écriture, facultatif, passe par le compte de la personne et n'est pas alimenté en masse par les offres.]
>
> Le service complète l'offre de France Travail : il aide à composer un CV et une lettre adaptés à chaque annonce et à suivre ses candidatures. Nous souhaitons déposer à nouveau la demande lorsque le service sera diffusé, avec [plan de diffusion à décrire].
>
> Cordialement,

## Fichiers concernés

`functions/api/offres.js`, `functions/api/ft-diagnostic.js` (inactif sans `FT_DIAG`), onglet **Offres** de `app/index.html` (module « OFFRES D'EMPLOI (France Travail) »), `legal/confidentialite.html` (section 5) et `legal/mentions-legales.html` (attribution), `README.md` (variables `FT_*`).
