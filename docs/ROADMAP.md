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
- Mobile (navigation par groupes), thème par bouton icône, accueil (premiers pas, alerte des relances).
- Pages légales, polices et bibliothèques auto-hébergées, en-têtes de sécurité, documentation (`ARCHITECTURE.md`, `METHODE-LETTRE-RAPOS.md`).

## Chantier en cours : candidatures adaptées et propositions freelance

Décisions du 26 novembre 2026. Vocabulaire : **candidature** pour une demande d'emploi (CV, lettre, e-mail), **proposition** pour le freelance. Chaque candidature ou proposition est une version à part entière ; un profil (orientation nommée) en regroupe plusieurs. Trois points d'entrée pour une candidature : **l'annonce**, **l'offre** trouvée dans l'onglet Offres, **la recherche** (entreprise ou poste visé, sans annonce).

| Étape | Contenu | État |
|---|---|---|
| 1. CV adaptatif | Profil sur mesure (nom de référence, titre, mots-clés, sans condition) ; carte « À qui s'adresse ce CV ? » (profil, poste ou secteur visé, entreprise visée) ; titre propre à chaque candidature (poste de l'annonce sans « H/F ») ; recomposition stricte (seuls les éléments concernés apparaissent) ; écart annonce/CV gradué sous le score (dans ta base ou absent de ta base, par priorité), aucun astérisque dans le CV ; aperçu avec coupures de pages et pastille de longueur (vert 1-2 pages, jaune 3, orange 4, rouge plus) | **Fait** |
| 2. Choix du CV depuis la recherche et les offres | Dans Recherche et Offres, choisir le profil (donc le CV) pour chaque entreprise ou offre, avec création de la candidature à partir de l'un des trois points d'entrée ; lettre et e-mail suivent le profil choisi | À faire |
| 3. Projets et propositions freelance | Un **projet** par client ou par cible (persona, destinataire professionnel ou particulier), plusieurs **propositions** par projet, chacune avec son profil de départ ; remplacer le formulaire actuel (offre, TJM) jugé trop étroit par des champs libres | À faire |
| 4. Plaquettes multiples par proposition | Plusieurs plaquettes par proposition pour les tests A/B, destinataires entreprises ou particuliers, accroches, stratégies et références selon la cible et le persona ; suivi des retours conservé | À faire |

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
2. Entretien : simulation orale chronométrée avec corrigé par l'IA, suivi des entretiens passés.
3. Plaquette : images libres de droits proposées, modèles supplémentaires, version deux pages, bandeaux supplémentaires (zone d'intervention, appel découverte, QR vers un portfolio, certifications).
4. Documents PDF balisés (accessibilité), audit RGAA.
5. Découper `index.html` (CSS, modules JavaScript) avant la refonte du design.

## Modèle économique : gratuit pour le moment

Décision : aucun prix ni formule (voir `docs/OFFRES-ET-TARIFS.md`). Il reste à trancher :

- le financement de l'IA au-delà du copier-coller et de la clé personnelle (déjà en place) : plafond, financement par des tiers ;
- la structure juridique si un financement apparaît ;
- les comptes et la synchronisation entre appareils, si on les ouvre : qui finance l'hébergement ;
- l'abandon ou la reprise des maquettes payantes (retirées, récupérables dans l'historique git).

## Notes pour plus tard

### Onboarding complet avant le passage au SaaS

À concevoir et à livrer **avant** d'ouvrir le service avec des comptes. Aujourd'hui l'accueil se limite à un bandeau « Premiers pas » (importer un CV, créer un profil, préparer une candidature).

À prévoir :

- **Parcours guidé** à la première ouverture : objectif de la personne (chercher un poste, candidater en spontané, se lancer en freelance), import du premier CV, création du premier profil, première candidature, téléchargement du premier PDF.
- **Visite des écrans** : repères sur la navigation par groupes (Préparer, Chercher, Candidater, Suivi), la composition automatique du CV, la liste des manques.
- **Mode démonstration** : jeu de données d'exemple, effaçable en un clic, pour essayer sans rien saisir.
- **Explication claire du stockage** : ce qui reste dans le navigateur, ce que fait la sauvegarde, ce que change un compte (synchronisation entre appareils).
- **Consentements et confidentialité** : politique mise à jour pour le SaaS (hébergement des données, durées, droits), choix explicite sur l'assistant IA.
- **Création de compte** et reprise des données locales existantes vers le compte (import du fichier de sauvegarde ou migration directe).
- **Mesure de l'activation** respectueuse (sans traceur tiers) : première candidature créée, premier PDF téléchargé.
- **Messages et courriels** d'accueil, de relance et de récupération de compte.

Prérequis SaaS associés : comptes et authentification, base de données côté serveur et chiffrement, clé API côté serveur pour l'assistant IA, facturation, RGPD (registre, DPA, droit d'accès et d'effacement), limites d'usage, supervision.
