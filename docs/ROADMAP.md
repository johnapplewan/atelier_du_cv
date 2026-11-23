# Feuille de route

Document vivant : ce qui est fait, ce qui attend un tiers, ce qui reste à faire, et les notes pour plus tard.

## Fait

- Base personnelle fusionnée à chaque import de CV, carte de la base, certifications, CV composé automatiquement selon le profil et l'annonce, astérisques des manques.
- Profils de recherche (13 domaines) avec CV type, recherche d'entreprises (candidatures spontanées), onglet Freelance (offre de service, ciblage des intermédiaires, lettre d'offre de service), **plaquette freelance (10 modèles A4, plusieurs plaquettes, offres suggérées, accroches, suivi des envois et statistiques)**.
- Lecture d'une annonce par son lien, analyse de l'émetteur (direct, cabinet, intérim, ESN), lettres RAPOS avec règles d'humanisation et contrôle de style, assistant IA par le compte Claude (sans clé API).
- Score ATS avec suggestions, optimisation automatique, plan d'action Markdown ; CV anonymisé.
- Suivi des candidatures avec relances, versions enregistrées, plusieurs personnes et plusieurs candidatures.
- Landing page à la racine (`/`), application sous `/app/`, page « Gratuit pour le moment » (`tarifs/`), sans prix, 13 maquettes SaaS non routées (`saas/`), documentation des offres et du positionnement.
- Assistant IA : clé d'API personnelle facultative (appel direct du navigateur, hors sauvegarde).
- E-mail d'envoi (cinq types, signature freelance, bonnes pratiques), fiche de préparation à l'entretien, banque d'images de la plaquette.
- Mobile (navigation par groupes), thème par bouton icône, accueil (premiers pas, alerte des relances).
- Pages légales, polices et bibliothèques auto-hébergées, en-têtes de sécurité, documentation (`ARCHITECTURE.md`, `METHODE-LETTRE-RAPOS.md`).

## En attente d'un tiers

| Sujet | Attente | Prochaine action |
|---|---|---|
| Offres d'emploi France Travail | **Accès refusé** (incident INC2791790, mesure conservatoire) ; option B retenue : formulaire masqué, aucun envoi d'offre à l'IA | Redéposer après diffusion avec le dossier décrit dans `docs/FRANCE-TRAVAIL.md` ; écrire à La bonne alternance (usage non lucratif exigé) et à Adzuna (tester la France, demander la licence) : brouillons dans `docs/FRANCE-TRAVAIL.md` |
| Sources d'offres de remplacement | Clés ajoutées dans le projet : `BONNE_ALTERNANCE_KEY`, `APP_ID`/`APP_KEY` (Adzuna, 25 appels), `AUTORISATION_KEY` (TheirStack, 200 crédits) | Activer `SOURCES_DIAG`, lancer chaque test une fois (`/api/sources-diag`), puis brancher la source retenue ; LoopCV écartée (pas d'offres via l'API) |
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
- **Visite des écrans** : repères sur la navigation par groupes (Préparer, Chercher, Candidater, Suivi), la composition automatique du CV, les astérisques de manque.
- **Mode démonstration** : jeu de données d'exemple, effaçable en un clic, pour essayer sans rien saisir.
- **Explication claire du stockage** : ce qui reste dans le navigateur, ce que fait la sauvegarde, ce que change un compte (synchronisation entre appareils).
- **Consentements et confidentialité** : politique mise à jour pour le SaaS (hébergement des données, durées, droits), choix explicite sur l'assistant IA.
- **Création de compte** et reprise des données locales existantes vers le compte (import du fichier de sauvegarde ou migration directe).
- **Mesure de l'activation** respectueuse (sans traceur tiers) : première candidature créée, premier PDF téléchargé.
- **Messages et courriels** d'accueil, de relance et de récupération de compte.

Prérequis SaaS associés : comptes et authentification, base de données côté serveur et chiffrement, clé API côté serveur pour l'assistant IA, facturation, RGPD (registre, DPA, droit d'accès et d'effacement), limites d'usage, supervision.
