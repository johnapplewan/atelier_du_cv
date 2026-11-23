# France Travail : accès à l'API « Offres d'emploi »

## Décision en cours

**Option B retenue** : on se passe de l'API pour l'instant. Mesures en place dans l'application :

- `OFFRES_API_ACTIVE = false` (`app/index.html`) : le formulaire de recherche de l'onglet **Offres** est masqué ; un avis explique la situation et propose « Coller une annonce » (onglet Annonce) et la recherche d'entreprises. Repasser la constante à `true` quand un accès sera accordé.
- **Aucun envoi à l'IA du contenu d'une offre issue de l'API** (condition n° 2) : une annonce créée depuis l'API porte `annonce.source = "france-travail"` ; `offreVientDeLAPI()` bloque alors la reformulation du CV, la réécriture de la lettre par Claude et l'e-mail amélioré par l'IA (message `IA_OFFRE_API_MSG`), et `annonceForAI()` ne renvoie plus rien de l'offre. Relire une annonce par son lien (`fetchAnnonce`) remet la source à vide.

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

## Comment faire passer la prochaine demande

France Travail a posé des conditions de fond (voir plus haut). Le dossier de redépôt doit y répondre point par point, avec des preuves.

### 1. Démontrer une audience ou une stratégie de diffusion crédible

Le site n'a aucun outil de mesure (principe du produit) : l'audience se prouve autrement.

- Mettre le site en ligne sur son adresse définitive (landing, tarifs, pages légales complétées avec `legal/config.js`).
- Chiffrer la diffusion avec des moyens compatibles avec la confidentialité : nombre d'inscrits à la liste d'attente (`saas/liste-attente.html`), nombre de personnes ayant répondu à un questionnaire, retours écrits de bêta-testeurs (avec accord).
- Nouer des partenariats de diffusion et obtenir des **lettres d'intention** : écoles et universités (services d'insertion), missions locales, associations d'aide à l'emploi, Cap emploi, structures d'accompagnement de freelances et de reconversion.
- Rédiger un **plan de diffusion** daté (canaux, cibles, calendrier sur 6 mois) : relais d'associations, réseaux étudiants, contenus publics, référencement.

### 2. Montrer la complémentarité avec France Travail

Argumenter ce que l'outil fait **en plus** : base personnelle unique, CV et lettre composés pour chaque annonce, score de correspondance, suivi et relances, outils freelance. La candidature se fait toujours sur la source de l'offre.

### 3. Garantir par écrit et dans le produit la gratuité de l'accès aux offres

- Ajouter dans les conditions de vente (`saas/cgv.html`, section « Accès aux offres d'emploi » déjà prévue dans la maquette) et, **au moment du redépôt** (pas avant : aucune offre n'est proposée aujourd'hui), sur la page tarifs un **engagement public** : la recherche d'offres et la candidature restent gratuites, sans compte et sans CV obligatoire, dans toutes les formules.
- Ne jamais réserver l'accès aux offres, ni le rapprochement avec le parcours, à un compte ou à un tarif.
- Le rapprochement entre le parcours et les offres reste **local** (dans le navigateur) ; aucune donnée de CV ni historique de recherche n'est stocké côté serveur.

### 4. Respecter la licence dans le produit (déjà en place, à garder)

- Offres affichées **le temps de la recherche, non conservées**, avec mention de la source et lien vers l'offre d'origine.
- **Aucun usage pour l'IA** : garde-fou `offreVientDeLAPI()` ; engagement à ne jamais entraîner, affiner ni maintenir un modèle avec les offres.
- Mentions et politique de confidentialité à jour (`legal/`).

### 5. Préparer le dossier

- Une adresse de contact professionnelle et l'identité de l'éditeur renseignée.
- Une **démonstration** : adresse de test et courte vidéo du parcours (recherche locale, ouverture de l'offre sur la source).
- Un texte de demande court, factuel, qui reprend les cinq conditions et indique où chacune est respectée (utiliser le brouillon plus haut et le tableau d'analyse).
- Un calendrier réaliste : redéposer après quelques semaines de diffusion mesurable, en répondant dans l'incident ou par une nouvelle demande selon ce que permet le portail.

### À éviter

Annoncer des offres France Travail avant accord ; afficher un prix, un compte ou un envoi de CV comme préalable à la recherche d'offres ; stocker ou republier les offres ; envoyer un texte d'offre à une IA.

## Autres sources d'offres possibles

À vérifier une par une (conditions, licence, usage par une IA, obligation d'affichage, stockage interdit) avant tout choix. Informations issues de recherches web, non vérifiées auprès des fournisseurs.

| Source | Ce que c'est | Intérêt | Points à vérifier |
|---|---|---|---|
| [La bonne alternance](https://www.data.gouv.fr/dataservices/api-la-bonne-alternance) | API publique et gratuite d'opportunités d'alternance en France, alimentée par La bonne alternance et ses sites partenaires | Très adaptée à la cible **étudiants et alternants** | Conditions d'accès et d'usage, quotas, mentions obligatoires |
| [Offres d'emploi diffusées à France Travail (jeu de données)](https://data.gouv.fr/en/datasets/offres-demploi-diffusees-a-france-travail) | Données brutes publiées sur data.gouv.fr, mises à jour chaque trimestre | Statistiques et cartographie des métiers, pas une recherche en direct | Licence, fraîcheur des données |
| [Adzuna](https://developer.adzuna.com/overview) | API d'agrégation d'annonces ; clé gratuite immédiate | Recherche en direct | Voir « Adzuna : usage commercial et France » ci-dessous |
| [Jooble](https://jooble.jooble.org/api/about) | API REST (POST, clé personnelle) sur demande via un formulaire | Recherche en direct, large couverture | Quotas et durée de vie de la clé non confirmés ; une clé par pays ; conditions d'usage |
| [Careerjet](https://www.careerjet.im/partners/api) | API partenaire (clé par site éditeur, authentification Basic) | Recherche en direct, localisation française | Contrat partenaire, limites de requêtes, mentions obligatoires |


### Adzuna : usage commercial et France

Lu dans les [conditions](https://developer.adzuna.com/docs/terms_of_service) (non juridique, à confirmer avec Adzuna) :

- Usages autorisés sans accord écrit : recherche d'emploi personnelle, **publication des annonces Adzuna** (avec le libellé « Adzuna » d'au moins 116 × 23 px, lié à adzuna.co.uk ou au domaine local), publication des estimations de salaire Jobsworth, recherche personnelle ou académique. Tout autre usage « requires our written agreement ».
- Organisations commerciales : essai de **14 jours** « strictly for the purpose of validating the general coverage and quality of the data » ; ensuite, « for any use in a product or service that generates revenue or leads, a licence agreement is required ».
- **Gratuité de la partie recherche et candidature** : les conditions ne disent pas qu'un service gratuit pour l'utilisateur échappe au régime commercial. Le critère écrit est « generates revenue or leads ». Un produit qui a des formules payantes (même si la recherche est gratuite) entre très probablement dans ce cas. Pendant la bêta entièrement gratuite et sans publicité, la situation est ambiguë : la publication d'annonces avec le libellé Adzuna est un usage autorisé, mais l'accès reste « à la discrétion absolue » d'Adzuna. À trancher par **écrit auprès d'Adzuna**, en décrivant précisément le service.
- Autres règles : ne pas contacter les fournisseurs d'annonces (révocation immédiate), pas de comptes multiples, retrait des données à la résiliation, limites de requêtes visibles dans le compte (« we may vary limits ») ; **aucune mention de l'IA** sur les pages lues ; règles de stockage et de cache non précisées.
- **Annonces en France** : **non confirmé**. Les pages ne listent aucun pays (exemple `gb` seulement) ; une source communautaire indique `fr`. Pour vérifier : créer une clé gratuite et appeler `/v1/api/jobs/fr/search/1`, ou consulter la documentation interactive d'Adzuna.

### Dépôts et services signalés (à vérifier)

| Élément | Ce que c'est | Une nouvelle source d'offres ? |
|---|---|---|
| `etiennekintzler/api-offres-emploi` | Wrapper Python de l'API Offres d'emploi v2 de France Travail (paquet PyPI `api-offres-emploi`) | **Non** : même API, même accès refusé. Utile seulement comme exemple de code. |
| `creach-t/job-search-france-travail-api` | D'après son nom, un outil qui s'appuie sur l'API France Travail (dépôt non lu) | **Probablement non** : même source ; à confirmer en lisant son README. |
| `kitsuno-ai/agentic-job-search-eu` | Répertoire communautaire de sources d'offres joignables depuis l'Europe, avec couverture, type d'accès, limites et notes d'exploration (30 à plus de 50 sources annoncées ; dépôt non lu) | **Indirectement** : un annuaire pour **découvrir** des sources, pas une source. Chaque source garde ses propres conditions. |
| [LoopCV, API développeurs](https://www.loopcv.pro/fr/developers/) | API REST d'offres agrégées « depuis LinkedIn, Indeed, Glassdoor et 30+ autres plateformes », avec analyse de CV, score, candidature automatique | **À éviter pour les offres** : la page précise ne pas utiliser l'API officielle LinkedIn (collecte non détaillée), couverture France et limites du plan gratuit non indiquées, conditions non lues. Recoupe aussi le produit (analyse de CV côté serveur, ce qui heurte le principe « données dans le navigateur »). |
| [TheirStack (API)](https://theirstack.com/fr/pricing?tab=api) | Données d'offres d'emploi et de technologies utilisées par les entreprises, 195 pays ; dès 19 $ par mois pour 1 500 crédits (1 crédit par offre) ; plan gratuit annoncé de 200 crédits API par mois | **Intéressant pour les freelances** (repérer des entreprises qui recrutent sur une technologie), pas pour la recherche d'emploi grand public. Part de la France et conditions d'usage non indiquées. |
| [JobsPipe](https://jobspipe.dev/pricing) | API JSON de 30+ sources d'offres (ATS et sites d'emploi) ; 1 000 crédits gratuits une seule fois ; dès 19,60 $ par mois pour 10 000 crédits ; 12 mois d'historique | Possible, mais **couverture France non indiquée**. Le bac à sable public ne renvoie que 2 offres fictives : il ne permet pas de la mesurer. Conditions non lues. |

Aucun de ces services n'a été validé : prix, couverture France, droit de stockage, usage par une IA et usage commercial restent à vérifier dans leurs conditions complètes avant tout branchement. Ces dépôts n'ont pas été lus.

### Marche à suivre proposée

1. **La bonne alternance** d'abord (étudiants et alternants) : lire ses conditions d'accès.
2. **Adzuna** : créer une clé gratuite, tester la France, puis écrire à Adzuna pour savoir si un service gratuit avec formules payantes pour les outils de rédaction entre dans leur licence.
3. N'envisager les agrégateurs qui collectent sans accord des sources (LoopCV) qu'après lecture de leurs conditions complètes ; privilégier les sources dont la licence autorise explicitement l'affichage et le renvoi vers l'annonce.

Pistes non confirmées : offres de l'emploi public et de l'insertion (existence d'une API non établie), ainsi que les grands sites d'emploi (aucune API publique repérée ; ne pas récupérer leurs pages automatiquement). Pour chaque source, vérifier en particulier : l'interdiction éventuelle d'utiliser les contenus avec une IA, l'obligation de renvoyer vers la source, l'interdiction de conserver les offres, et la compatibilité avec une application sans compte ni serveur de stockage.

## Fichiers concernés

`functions/api/offres.js`, `functions/api/ft-diagnostic.js` (inactif sans `FT_DIAG`), onglet **Offres** de `app/index.html` (module « OFFRES D'EMPLOI (France Travail) » : `OFFRES_API_ACTIVE`, `offreVientDeLAPI`, `renderOffAvailability`, `IA_OFFRE_API_MSG` ; garde-fous dans `annonceForAI`, `iaReformulerCV`, l'affinage de la lettre et `emAI`), `legal/confidentialite.html` (section 5) et `legal/mentions-legales.html` (attribution), `README.md` (variables `FT_*`).
