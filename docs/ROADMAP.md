# Feuille de route

Document vivant : ce qui est fait, ce qui attend un tiers, ce qui reste à faire, et les notes pour plus tard.

## Fait

- Base personnelle fusionnée à chaque import de CV, carte de la base, certifications, CV composé automatiquement selon le profil et l'annonce, liste des manques à côté du CV.
- Profils de recherche (13 domaines) avec CV type, recherche d'entreprises (candidatures spontanées), onglet Freelance (offre de service, ciblage des intermédiaires, lettre d'offre de service), **plaquette freelance (10 modèles A4, plusieurs plaquettes, offres suggérées, accroches, suivi des envois et statistiques)**.
- Lecture d'une annonce par son lien, analyse de l'émetteur (direct, cabinet, intérim, ESN), lettres RAPOS avec règles d'humanisation et contrôle de style, assistant IA par le compte Claude (sans clé API).
- Score ATS avec suggestions, optimisation automatique, plan d'action Markdown ; CV anonymisé.
- Suivi des candidatures avec relances, versions enregistrées, plusieurs personnes et plusieurs candidatures.
- Landing page à la racine (`/`), application sous `/app/`, page « Gratuit pour le moment » (`tarifs/`), sans prix, 13 maquettes SaaS non routées (`saas/`), documentation des offres et du positionnement.
- Recherche d'offres d'alternance (La bonne alternance) et candidature spontanée aux entreprises qui recrutent souvent.
- Assistant IA : clé d'API personnelle facultative (appel direct du navigateur, hors sauvegarde).
- E-mail d'envoi (cinq types, signature freelance, bonnes pratiques), fiche de préparation à l'entretien, banque d'images de la plaquette.
- Onglet Règles : mise en avant selon la cible (poids et limites modifiables), principes de communication personnalisables vérifiés dans le CV, la lettre et la plaquette et transmis à l'IA, apprentissage des corrections, références freelance classées selon la cible et le persona.
- Miniature de partage 1200 × 630 avec l'accroche de la landing ; guide pas à pas pour les débutants (dont le questionnaire « je n'ai pas de CV »).
- Mobile (navigation par groupes), thème par bouton icône, accueil (premiers pas, alerte des relances).
- Pages légales, polices et bibliothèques auto-hébergées, en-têtes de sécurité, documentation (`ARCHITECTURE.md`, `METHODE-LETTRE-RAPOS.md`).

## Chantier en cours : candidatures adaptées et propositions freelance

Décisions du 26 novembre 2026. Vocabulaire : **candidature** pour une demande d'emploi (CV, lettre, e-mail), **proposition** pour le freelance. Chaque candidature ou proposition est une version à part entière ; un profil (orientation nommée) en regroupe plusieurs. Trois points d'entrée pour une candidature : **l'annonce**, **l'offre** trouvée dans l'onglet Offres, **la recherche** (entreprise ou poste visé, sans annonce).

| Étape | Contenu | État |
|---|---|---|
| 1. CV adaptatif | Profil sur mesure (nom de référence, titre, mots-clés, sans condition) ; carte « À qui s'adresse ce CV ? » (profil, poste ou secteur visé, entreprise visée) ; titre propre à chaque candidature (poste de l'annonce sans « H/F ») ; recomposition stricte (seuls les éléments concernés apparaissent) ; écart annonce/CV gradué sous le score (dans ta base ou absent de ta base, par priorité), aucun astérisque dans le CV ; aperçu avec coupures de pages et pastille de longueur (vert 1-2 pages, jaune 3, orange 4, rouge plus) | **Fait** |
| 2. Choix du CV depuis la recherche et les offres | Dans Recherche et Offres, menu « CV à envoyer » sur chaque entreprise et chaque offre (profil le plus proche proposé pour une offre) ; la candidature reprend ce profil, le titre du CV prend le poste de l'offre ; lettre et e-mail suivent le profil choisi | **Fait** |
| 3. Projets et propositions freelance | Un **projet** par client ou par cible (cible, persona en texte libre, destinataires professionnels, particuliers ou les deux), plusieurs **propositions** par projet, chacune partant d'un profil/CV ou libre ; tarif facultatif à 17 formules (à partir de, devis, gratuit et sans engagement…) | **Fait** |
| 4. Plaquettes multiples par proposition | Plusieurs plaquettes par proposition pour les tests A/B ; destinataires, cible et persona par plaquette (repris du projet) qui changent accroches et baselines ; suivi des retours conservé | **Fait** (références propres à chaque cible : à affiner selon les retours) |

## En attente d'un tiers

| Sujet | Attente | Prochaine action |
|---|---|---|
| Offres d'emploi France Travail | **Accès refusé** (incident INC2791790, mesure conservatoire) ; option B retenue : formulaire masqué, aucun envoi d'offre à l'IA | Redéposer après diffusion avec le dossier décrit dans `docs/FRANCE-TRAVAIL.md` ; écrire à La bonne alternance (usage non lucratif exigé) et à Adzuna (tester la France, demander la licence) : brouillons dans `docs/FRANCE-TRAVAIL.md` |
| Sources d'offres | La bonne alternance **branchée et autorisée** (réponse du 25 novembre : tacite tant que le service est 100 % gratuit pour les candidats) ; Adzuna (France couverte, 25 appels gratuits) et TheirStack (200 crédits) testées mais non branchables sans accord ; LoopCV écartée | Adzuna : rester en gratuit, passer à un accès payant (12 £ pour 5 000 appels ou 30 £ par mois) à la diffusion si besoin ; JobsPipe : **branché en phase de test** (`/api/jobspipe`, clé `PIPE_KEY`, sélecteur de source de l'onglet Offres) ; accord écrit de JobsPipe à demander avant toute diffusion large (clé partagée) |
| La Bonne Boîte | Habilitation (scope accordé, API répond « 403 Invalid scope ») ; même fournisseur que l'API Offres | Vérifier ses conditions avant toute nouvelle demande |
| ROME 4.0 | Noms de scopes à confirmer sur l'application | Affiner les profils avec les métiers et compétences du référentiel |
| Identité de l'éditeur | À renseigner dans `legal/config.js` | Relecture juridique des pages légales |

## À faire ensuite (backlog)

1. Catégories de compétences modifiables à la main.
2. Vérifier l'export PDF réel du CV avec les repères de pages (nombre de pages du PDF = nombre annoncé par l'aperçu).
3. Refaire la capture de la landing (`assets/landing/atelier-cv.webp` et celles qui montrent encore des astérisques ou l'ancien libellé « Titre / accroche »), avec des données fictives.
4. Affiner les références freelance selon les retours de test (classement par cible et persona, corrections apprises).
5. Entretien : simulation orale chronométrée avec corrigé par l'IA, suivi des entretiens passés.
6. Plaquette : images libres de droits proposées, modèles supplémentaires, version deux pages, bandeaux supplémentaires (zone d'intervention, appel découverte, QR vers un portfolio, certifications).
7. Documents PDF balisés (accessibilité), audit RGAA.
8. Découper `app/index.html` (CSS, modules JavaScript) avant la refonte du design.

## Modèle économique : gratuit pour le moment, orientation décidée pour la suite

Aujourd'hui : aucun prix ni formule affiché (voir `docs/OFFRES-ET-TARIFS.md`). **Orientation décidée le 26 novembre 2026 par le propriétaire, à ne jamais annoncer publiquement tant qu'elle n'est pas lancée** :

- **IA par abonnement** : un abonnement couvrirait seulement les actions d'IA (reformulation, entraînement à l'entretien…), sans envoyer d'annonce : l'IA ne reçoit que les mots-clés, le titre du poste visé et la spécialité du CV. Idée associée : y inclure un test ATS. Réserve : aucun ATS du marché n'offre d'accès public pour tester un CV ; ce que l'on pourrait proposer, ce sont des contrôles de lisibilité automatique, pas « le test par un ATS réel ». Ne rien promettre de plus.
- **Comptes et synchronisation entre appareils** : par abonnement aussi (l'abonnement finance l'hébergement).
- **Structure juridique** : « financement » désigne ici toute entrée d'argent (abonnements, dons, partenaires). Dès qu'il y a un abonnement, il faut un cadre pour facturer (micro-entreprise ou société), des conditions de vente, la TVA, un médiateur de la consommation et une politique RGPD adaptée : à faire valider par un comptable ou un juriste avant le lancement.
- **Point bloquant à lever avant tout lancement** : l'accord tacite de La bonne alternance exige un service **100 % gratuit pour les candidats**. Une option payante dans le même service peut le rompre. Avant de lancer l'abonnement, demander par écrit à La bonne alternance si une option payante, séparée de la recherche d'offres (qui resterait gratuite et sans compte), est compatible ; sinon, isoler le payant dans un autre service. Même vigilance pour un nouveau dépôt France Travail et pour JobsPipe.
- Reste à trancher : le prix, le plafond d'usage de l'IA, l'hébergeur et le prestataire de paiement, les maquettes payantes (retirées, récupérables dans l'historique git).

## Notes pour plus tard

### Onboarding complet avant le passage au SaaS

**Déjà livré** : le guide pas à pas (bouton « Guide » et carte « Nouveau ici ? », 7 étapes, questionnaire « je n'ai pas de CV »), le bandeau « Premiers pas » et les repères sur la composition du CV et les manques.

**Reste à concevoir et à livrer avant d'ouvrir le service avec des comptes** :

- **Mode démonstration** : jeu de données d'exemple, effaçable en un clic, pour essayer sans rien saisir.
- **Explication claire du stockage** : ce que fait la sauvegarde, ce que change un compte (synchronisation entre appareils).
- **Consentements et confidentialité** : politique mise à jour pour le SaaS (hébergement des données, durées, droits), choix explicite sur l'assistant IA et sur l'abonnement.
- **Création de compte** et reprise des données locales existantes (import du fichier de sauvegarde ou migration directe).
- **Mesure de l'activation** respectueuse (sans traceur tiers) : première candidature créée, premier PDF téléchargé.
- **Messages et courriels** d'accueil, de relance et de récupération de compte.

Prérequis SaaS associés : comptes et authentification, base de données côté serveur et chiffrement, clé API côté serveur pour l'assistant IA (financée par l'abonnement), facturation, RGPD (registre, DPA, droit d'accès et d'effacement), limites d'usage, supervision.
