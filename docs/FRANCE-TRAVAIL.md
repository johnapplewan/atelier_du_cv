# France Travail : accès à l'API « Offres d'emploi »

## Décision en cours

**Option B retenue** : on se passe de l'API France Travail. Mesures en place dans l'application :

- L'onglet **Offres** utilise désormais **La bonne alternance** (`OFFRES_API_ACTIVE = true`, `functions/api/alternance.js`). Si la source est coupée (`false`), le formulaire est masqué et un avis propose « Coller une annonce » (onglet Annonce) et la recherche d'entreprises. Le code France Travail (`functions/api/offres.js`) reste en réserve, inutilisé.
- **Aucun envoi à l'IA du contenu d'une offre issue de l'API** (condition n° 2) : une annonce créée depuis une API d'offres porte `annonce.source = "france-travail"` ou `"la-bonne-alternance"` ; `offreVientDeLAPI()` bloque alors la reformulation du CV, la réécriture de la lettre par Claude et l'e-mail amélioré par l'IA (message `IA_OFFRE_API_MSG`), et `annonceForAI()` ne renvoie plus rien de l'offre. Relire une annonce par son lien (`fetchAnnonce`) remet la source à vide.

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

| Condition | Situation aujourd'hui | À garder |
|---|---|---|
| Aucun compte imposé | Respectée : aucun compte | À garder : des comptes ne devront jamais conditionner l'accès aux offres |
| Aucune contrepartie financière | Respectée : tout est gratuit, **aucun tarif** (formules payantes retirées) | À garder : aucun tarif ne doit toucher l'accès aux offres (voir `docs/OFFRES-ET-TARIFS.md`) |
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
| [La bonne alternance](https://www.data.gouv.fr/dataservices/api-la-bonne-alternance) | API publique d'opportunités d'alternance (offres, entreprises à fort potentiel d'embauche, formations) | Très adaptée à la cible **étudiants et alternants** | **Usage réservé aux usages non lucratifs** : voir « La bonne alternance : conditions lues » ci-dessous |
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


### La bonne alternance : conditions lues

Pages lues : fiche data.gouv, explorateur de l'API (api.apprentissage.beta.gouv.fr), CGU v1.0 du 31 mars 2025, page de la route « Recherche d'offres ». Éditeur selon les CGU : DGEFP ; producteur selon data.gouv : DINUM.

- **Contenu** : offres d'emploi en alternance (`offres_emploi_lba`, `offres_emploi_partenaires`), entreprises à fort potentiel d'embauche (`recruteurs_lba`), formations en apprentissage ; mise à jour quotidienne.
- **Accès** : inscription par adresse e-mail, lien de connexion, puis création d'un « code technique d'accès » (CGU art. 4). Validation manuelle, délai et méthode d'authentification : non indiqués dans les pages lues. Certaines routes (dépôt d'offres, candidature, rendez-vous) exigent une habilitation.
- **Gratuité** : oui (« gratuitement et en temps réel »), mais la page de la route précise : « L'utilisation de cette API est gratuite et **réservée à des usages non lucratifs** » ; « toute utilisation de ces données à des fins commerciales, telles que la revente ou la **facturation de l'accès pour des tiers comme des candidats** est interdite ». CGU art. 5.2 : l'utilisateur s'engage à ne pas commercialiser les données reçues.
- **Non indiqué** : obligation d'affichage ou de renvoi vers l'offre d'origine, règles de stockage, interdiction d'usage par une IA, licence des données (le site cite etalab-2.0 pour ses contenus).
- **Limites** : de 5 à 20 appels par seconde selon les routes.
- **Contact** : `contact-api@labonnealternance.apprentissage.beta.gouv.fr`. Statut : mission-apprentissage.github.io/upptime. Code source de l'API : github.com/mission-apprentissage/api-apprentissage.

**Lecture pour le produit** : avec un outil entièrement gratuit et sans revenu (formules payantes retirées), un usage non lucratif est défendable. Le risque reviendrait avec toute facturation, même hors accès aux offres : le texte interdit la « facturation de l'accès pour des tiers comme des candidats » et réserve l'API aux usages non lucratifs. **Ne pas construire de dépendance sans réponse écrite du contact de l'API.**

### Réponse de La bonne alternance (25 novembre 2026)

Réponse reçue à la question écrite (résumé fidèle) :

- **Autorisation** : « Tant que votre service de partage d'offres est **100 % gratuit pour les candidats**, vous pouvez utiliser les API de récupération des offres et d'envoi de candidature. » L'accord est **tacite**, et des **contrôles réguliers** sont réalisés pour vérifier son application.
- **Deux API pour récupérer les offres** : l'API de **recherche** (quelques centaines d'offres pour une recherche précise : celle que l'atelier utilise, `GET /api/job/v1/search`) et l'API d'**export** (toutes les offres en un appel : utile seulement pour couvrir l'intégralité de l'alternance).
- **Fraîcheur** : rafraîchir les offres **au moins une fois par jour** pour éviter les offres expirées et les liens morts (l'atelier n'enregistre rien et recharge à chaque recherche, avec un cache de 10 minutes).
- **Alternative proposée** : inviter les personnes à utiliser le moteur de La bonne alternance (lien ajouté dans l'onglet Offres).
- **Non traité dans la réponse** : règles de conservation, mention obligatoire de la source, usage avec une IA. Le blocage du texte des offres vers l'assistant IA est donc **conservé par précaution** tant que ces points ne sont pas précisés.

**Conséquences** :
- **Condition à garder** : le service reste **100 % gratuit pour les candidats**. Toute formule payante, tout accès conditionné à un paiement ou toute facturation aux candidats rompt l'accord tacite (voir `docs/OFFRES-ET-TARIFS.md`).
- **API d'envoi de candidature** : autorisée dans les mêmes conditions, mais elle ferait transiter des données de la personne (CV, coordonnées) par un serveur ; elle n'est **pas utilisée** (principe « données dans le navigateur »). À étudier seulement si la personne la demande explicitement.
- **Contrôles** : garder les offres non conservées, citer la source, renvoyer vers l'offre d'origine.

### Questions à poser par écrit (brouillons)

**À La bonne alternance** (réponse reçue, voir ci-dessus) (`contact-api@labonnealternance.apprentissage.beta.gouv.fr`) :

> Bonjour,
>
> Je développe Atelier Candidature, un outil gratuit, sans compte, qui aide étudiants et alternants à composer un CV et une lettre à partir d'une base qui reste dans leur navigateur (aucun compte, aucun CV envoyé à un serveur). Je souhaite afficher les offres d'alternance de votre API, avec renvoi vers l'offre d'origine, gratuitement et sans condition de compte.
>
> L'outil n'a aucun tarif aujourd'hui. Si une contribution devait exister un jour (par exemple un financement par des tiers), cet usage resterait-il compatible avec la mention « usages non lucratifs » et l'interdiction de « facturation de l'accès » ? Sous quelle forme pourrions-nous formaliser un accord ?
>
> Pouvez-vous aussi préciser : les règles de conservation des offres (affichage temporaire), l'obligation éventuelle d'afficher la source, et l'usage des données avec un assistant d'écriture facultatif que l'utilisateur déclenche lui-même ?
>
> Cordialement,

**À Adzuna** (formulaire de contact indiqué dans leurs conditions, sur adzuna.co.uk) :

> Hello,
>
> We are building Atelier Candidature, a French job-application tool (CV and cover-letter builder, tracking). The whole tool is free for users, with no account and no advertising, and we do not plan any fee. We would display Adzuna listings with the required Adzuna label and a link to the ad.
>
> Could you tell us: (1) whether this use falls under a licence agreement, (2) whether France (`fr`) is covered, with the approximate volume of French ads, (3) the rules on caching and storage, and (4) whether using listing text with an AI writing assistant triggered by the user is allowed?
>
> Thank you,

### Tester Adzuna soi-même (France)

Pour un test manuel :

1. Créer un compte sur developer.adzuna.com pour obtenir un `app_id` et un `app_key`.
2. Dans un terminal, remplacer les deux valeurs et lancer :

```bash
curl -s "https://api.adzuna.com/v1/api/jobs/fr/search/1?app_id=VOTRE_ID&app_key=VOTRE_CLE&results_per_page=5&what=communication&where=Lyon"
```

3. Une réponse avec un champ `count` non nul et des `results` en français confirme la couverture ; une erreur « pays inconnu » l'infirme. Ne partagez pas la clé dans une conversation.


### Adzuna : tarifs et décision

Tarifs indiqués par Adzuna : **12 £ pour 5 000 appels**, ou **API Pro à 30 £ par mois** avec les limites 100 appels par minute, 1 500 par jour, 7 500 par semaine et 20 000 par mois (un appel renvoie jusqu'à plusieurs dizaines d'annonces). **Décision : rester sur le plan gratuit (aucune intégration) et passer à un accès payant au moment de la diffusion, si le besoin d'offres généralistes se confirme**, après accord écrit d'Adzuna sur l'usage.

### JobsPipe : documentation lue (clé `PIPE_KEY`)

Lecture de https://jobspipe.dev/agent et de l'OpenAPI (environ 55 % lu ; conditions et licence non lues) :

- **Route** : `POST https://api.jobspipe.dev/v1/jobs/search` ; **authentification** `Authorization: Bearer jp_live_…` (lecture seule) ; bac à sable sans clé `POST /v1/sandbox/jobs/search` (données d'exemple).
- **Filtres** (tous optionnels, combinés en ET ; un champ inconnu renvoie 400) : `job_title_or`, `description_or`, `skills_or`, `job_country_code_or` (`["FR"]`), `language_or` (`["fr"]`), `job_location_or`, `city_or`, `employment_type_or` (dont `internship`), `posted_at_max_age_days`, `limit` (25 au plus en gratuit), `cursor`, `status`.
- **Coût** : **1 crédit par offre retournée** et pas déjà payée dans le mois ; une recherche sans résultat est gratuite ; 1 000 crédits offerts une seule fois ; ensuite 1,96 $ pour 1 000 offres. Limite : 2 requêtes par seconde en gratuit.
- **Réponse** : `data[]` avec `job_title`, `company`, `location`, `country_code`, `date_posted`, `url`, `description`, `employment_statuses`, `salary_*` ; `metadata` avec `credits_charged` et `credits_remaining`. Données actualisées sous 24 h (gratuit).
- **Test réel (25 novembre 2026)** : 1 recherche (`job_country_code_or ["FR"]`, `language_or ["fr"]`, titres « alternance » ou « développeur », 14 jours, 5 offres) = **5 crédits**, 995 restants. Résultats français et récents (Allianz France, La Poste…), descriptions complètes (2 700 à 3 900 caractères), liens vers **Welcome to the Jungle**. Pas de filtre géographique par rayon testé ; plusieurs offres identiques de La Poste dans des villes différentes (doublons à regrouper).
- **Conditions d'usage lues (25 novembre 2026)** : CGU (terms, mises à jour le 27 septembre 2026), usage acceptable (24 septembre), confidentialité, DPA ; pages en anglais seulement ; FAQ sur la page d'accueil.
  - **Affichage** : aucune clause ne permet ni n'interdit un affichage public gratuit ; la revente, la sous-licence et la redistribution **en masse ou comme jeu de données, flux ou API concurrente** sont interdites (CGU 3b). Il faut **garder le lien vers l'annonce d'origine** (CGU 4) et ne pas la présenter comme la sienne.
  - **Stockage** : pas de durée maximale ; obligation de supprimer ce qui n'est plus utile et, sur demande, les données d'une personne nommée.
  - **IA** : aucune clause n'interdit d'envoyer le texte à un modèle ; pas de reproduction en masse, pas de décision d'éligibilité ni de profilage ; les annonces peuvent citer des recruteurs (données personnelles sous la responsabilité de l'utilisateur de l'API).
  - **Clé unique pour de nombreux inconnus** : non prévu ; l'usage acceptable interdit le **partage de clés d'API** et le contournement des quotas. Un serveur de l'atelier qui sert tous les visiteurs avec une clé ressemble à ce cas, et chaque recherche consomme le quota commun.
  - **Plan gratuit** : 1 000 crédits **une seule fois**, jamais renouvelés, 25 résultats par appel, 2 requêtes par seconde. Payant : Seeker 19,60 $ par mois (10 000 crédits), Builder 49 $ (25 000), Growth 149 $ (100 000).
  - **Sources et droits** : Welcome to the Jungle, LinkedIn et Indeed sont cités comme sources ; JobsPipe ne revendique pas les contenus (propriété des employeurs) et ne vérifie pas les conditions des sites d'origine.
  - **Conclusion et décision (26 novembre 2026)** : pas de diffusion large sur une clé partagée sans accord écrit de legal@jobspipe.dev. **Décision du propriétaire : branché en phase de test seulement** (le site n'est pas diffusé, seuls le propriétaire et ses testeurs l'utilisent), pour tester les parcours « candidature depuis une annonce » ; si le module se révèle utile, demande d'accord écrit avant la diffusion (ou coupure avec `JOBSPIPE_OFF = 1`). Intégration : `functions/api/jobspipe.js`, sélecteur « Source des offres » de l'onglet Offres ; 25 offres au plus par recherche ; les offres JobsPipe ne sont **pas** bloquées pour l'IA (aucune clause ne l'interdit) ; le lien vers l'annonce d'origine est conservé.
- **Sources** : ATS (Workday, Lever, Greenhouse, SmartRecruiters…), LinkedIn et Indeed ; **sources françaises non précisées**. Conditions d'usage (commercial, stockage, IA) : non indiquées.

### Dépôts et services signalés (à vérifier)

| Élément | Ce que c'est | Une nouvelle source d'offres ? |
|---|---|---|
| `etiennekintzler/api-offres-emploi` | Wrapper Python de l'API Offres d'emploi v2 de France Travail (paquet PyPI `api-offres-emploi`) | **Non** : même API, même accès refusé. Utile seulement comme exemple de code. |
| `creach-t/job-search-france-travail-api` | D'après son nom, un outil qui s'appuie sur l'API France Travail (dépôt non lu) | **Probablement non** : même source ; à confirmer en lisant son README. |
| `kitsuno-ai/agentic-job-search-eu` | Répertoire communautaire de sources d'offres joignables depuis l'Europe, avec couverture, type d'accès, limites et notes d'exploration (30 à plus de 50 sources annoncées ; dépôt non lu) | **Indirectement** : un annuaire pour **découvrir** des sources, pas une source. Chaque source garde ses propres conditions. |
| [LoopCV, API développeurs](https://www.loopcv.pro/fr/developers/) | Selon la documentation de l'API (`b2b-api.loopcv.com/connect`, en-tête `X-API-KEY`), seules la **gestion de « loops »** (recherches automatisées) est exposée : création, lecture, modification, suppression. **Aucune route ne liste les offres trouvées.** | **Non, pas comme source d'offres** | Agrège LinkedIn, Indeed, Glassdoor sans leur API officielle ; analyse de CV côté serveur (heurte « données dans le navigateur ») ; quotas du plan gratuit non indiqués |
| [TheirStack (API)](https://theirstack.com/fr/pricing?tab=api) | Données d'offres d'emploi et de technologies utilisées par les entreprises, 195 pays ; dès 19 $ par mois pour 1 500 crédits (1 crédit par offre) ; plan gratuit annoncé de 200 crédits API par mois | **Intéressant pour les freelances** (repérer des entreprises qui recrutent sur une technologie), pas pour la recherche d'emploi grand public. Part de la France et conditions d'usage non indiquées. |
| [JobsPipe](https://jobspipe.dev/pricing) | API JSON de 30+ sources d'offres (ATS et sites d'emploi) ; 1 000 crédits gratuits une seule fois ; dès 19,60 $ par mois pour 10 000 crédits ; 12 mois d'historique | Possible, mais **couverture France non indiquée**. Le bac à sable public ne renvoie que 2 offres fictives : il ne permet pas de la mesurer. Conditions non lues. |

Aucun de ces services n'a été validé : prix, couverture France, droit de stockage, usage par une IA et usage commercial restent à vérifier dans leurs conditions complètes avant tout branchement. Ces dépôts n'ont pas été lus.

### Clés, variables et tests (sources d'offres)

Variables définies dans le projet Cloudflare Pages (invisibles depuis une session de développement : seules les fonctions déployées les lisent) :

| Variable | Source | Quota à respecter |
|---|---|---|
| `BONNE_ALTERNANCE_KEY` | La bonne alternance (en-tête `Authorization: Bearer …`) | 5 à 20 appels par seconde |
| `APP_ID`, `APP_KEY` | Adzuna (paramètres d'adresse `app_id` et `app_key`) | **25 appels au total** |
| `AUTORISATION_KEY` | TheirStack (`Authorization: Bearer …`) | **200 crédits** (1 crédit par offre renvoyée) |

**Fonction de test `sources-diag`** : utilisée une fois pour les tests ci-dessous, puis **supprimée du dépôt** (un point d'accès public qui pouvait consommer les quotas d'Adzuna et de TheirStack ne devait pas rester en ligne). Elle reste consultable dans l'historique git (commit `d691147`). Chaque appel de test était limité à une requête amont et ne renvoyait jamais de clé.

**Ce qui est déjà établi sans clé** : sur `api.apprentissage.beta.gouv.fr`, `GET /api/job/v1/search` et `/api/job/v1/export` existent (réponse 401 « clé d'API valide » sans clé) ; Adzuna répond 401 pour une clé invalide quel que soit le pays (la couverture de `fr` reste à vérifier avec la vraie clé) ; TheirStack : corps attendu `{"job_country_code_or":["FR"],"posted_at_max_age_days":7,"limit":2,"page":0}` (un filtre `posted_at_*` ou un identifiant est obligatoire ; champs de réponse `job_title`, `company`, `location`, `country_code`, `date_posted`, `url`, `description`).

**Connexion de LoopCV (pour mémoire)** : clé API dans Settings → API Key → « Generate API Key » (affichée une seule fois) ; connexion à Claude via un connecteur personnalisé (`https://api.loopcv.com/mcp`, OAuth) selon leur article. Cela ne donne pas accès à des offres pour l'atelier : l'API ne les expose pas.

### Résultats des tests (24 novembre 2026)

Un appel par source via la fonction de test `sources-diag` (retirée depuis), en production, quotas respectés :

| Source | Résultat | Consommation |
|---|---|---|
| **La bonne alternance** | Réponse 200 : **273 offres et 150 entreprises** autour de Lyon (rayon 30 km). Structure d'une offre : `identifier{id, partner_label, partner_job_id}`, `workplace{siret, brand, legal_name, name, size, location{address, geopoint}, domain{idcc, opco, naf{code, label}}}`, `apply{url, phone, recipient_id}`, `contract{start, start_type, duration, type[], remote}`, `offer{title, rome_codes, description, …}`, `is_delegated`. Listes `jobs`, `recruiters`, `warnings`. | 1 appel |
| **Adzuna** | Réponse 200 : **la France est couverte** (4 250 résultats pour « communication » à Lyon ; offres de stage et d'alternance ; liens vers adzuna.fr). | 1 appel sur 25 |
| **TheirStack** | Réponse 200 : offres en France du jour (`job_country_code_or: ["FR"]`), mais de toute nature (santé, restauration…) ; `total_results` vide sans `include_total_results`. | 2 crédits sur 200 |

**Décisions**

- **La bonne alternance est branchée** : `functions/api/alternance.js` et l'onglet **Offres** (offres d'alternance, entreprises qui recrutent souvent pour la candidature spontanée, mention de la source, lien vers l'offre d'origine). Gratuit et non lucratif ; la question écrite au contact de l'API reste recommandée (brouillon plus haut). Le contenu de ces offres n'est jamais envoyé à l'IA, par précaution.
- **Adzuna n'est pas branchable en l'état** : le plan gratuit (25 appels) sert à évaluer ; un usage réel demande un accord écrit d'Adzuna.
- **TheirStack : non branché, mais pas écarté.** Correction : des offres « de toute nature » étaient normales, le test n'avait aucun filtre de titre ; l'API sait filtrer (titre, description, pays) et **fonctionne pour la France**. Ce qui la limite est le budget : **1 crédit par offre affichée** (200 crédits gratuits, puis dès 19 $ par mois pour 1 500 crédits), très peu pour une recherche publique, et des conditions d'usage non lues. Payer une source de données ne rend pas l'atelier commercial (c'est un coût, pas un revenu), contrairement à ce que laissait entendre ma première formulation. Elle reste une piste pour une fonction freelance (entreprises qui recrutent sur une technologie).
- Les variables `SOURCES_DIAG`, `APP_ID`, `APP_KEY` et `AUTORISATION_KEY` peuvent être retirées du projet Cloudflare : plus aucune fonction ne les lit (en garder une copie si on veut retester).

### Marche à suivre proposée

1. **La bonne alternance** (étudiants et alternants) : branchée ; conditions lues, **usage non lucratif exigé** (cohérent avec l'abandon des formules payantes) ; envoyer la question écrite (brouillon ci-dessus) avant tout développement.
2. **Adzuna** (offres généralistes, France couverte) : facultatif ; écrire à Adzuna (brouillon ci-dessus) seulement pour ajouter une source d'offres autres que l'alternance.
3. **TheirStack** : réservé à une fonction freelance (entreprises qui recrutent sur une technologie), sous réserve de ses conditions.
3. N'envisager les agrégateurs qui collectent sans accord des sources (LoopCV) qu'après lecture de leurs conditions complètes ; privilégier les sources dont la licence autorise explicitement l'affichage et le renvoi vers l'annonce.

Pistes non confirmées : offres de l'emploi public et de l'insertion (existence d'une API non établie), ainsi que les grands sites d'emploi (aucune API publique repérée ; ne pas récupérer leurs pages automatiquement). Pour chaque source, vérifier en particulier : l'interdiction éventuelle d'utiliser les contenus avec une IA, l'obligation de renvoyer vers la source, l'interdiction de conserver les offres, et la compatibilité avec une application sans compte ni serveur de stockage.

## Fichiers concernés

`functions/api/offres.js`, `functions/api/ft-diagnostic.js` (inactif sans `FT_DIAG`), onglet **Offres** de `app/index.html` (module « OFFRES D'EMPLOI (France Travail) » : `OFFRES_API_ACTIVE`, `offreVientDeLAPI`, `renderOffAvailability`, `IA_OFFRE_API_MSG` ; garde-fous dans `annonceForAI`, `iaReformulerCV`, l'affinage de la lettre et `emAI`), `legal/confidentialite.html` (section 5) et `legal/mentions-legales.html` (attribution), `README.md` (variables `FT_*`).
