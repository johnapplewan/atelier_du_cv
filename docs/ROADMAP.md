# Feuille de route

Document vivant : ce qui est fait, ce qui attend un tiers, ce qui reste à faire, et les notes pour plus tard.

## Fait

- Base personnelle fusionnée à chaque import de CV, carte de la base, certifications, CV composé automatiquement selon le profil et l'annonce, astérisques des manques.
- Profils de recherche (13 domaines) avec CV type, recherche d'entreprises (candidatures spontanées), onglet Freelance (offre de service, ciblage des intermédiaires, lettre d'offre de service), **plaquette freelance (10 modèles A4)**.
- Lecture d'une annonce par son lien, analyse de l'émetteur (direct, cabinet, intérim, ESN), lettres RAPOS avec règles d'humanisation et contrôle de style, assistant IA par le compte Claude (sans clé API).
- Score ATS avec suggestions, optimisation automatique, plan d'action Markdown ; CV anonymisé.
- Suivi des candidatures avec relances, versions enregistrées, plusieurs personnes et plusieurs candidatures.
- Mobile (navigation par groupes), thème par bouton icône, accueil (premiers pas, alerte des relances).
- Pages légales, polices et bibliothèques auto-hébergées, en-têtes de sécurité, documentation (`ARCHITECTURE.md`, `METHODE-LETTRE-RAPOS.md`).

## En attente d'un tiers

| Sujet | Attente | Prochaine action |
|---|---|---|
| Offres d'emploi France Travail | Accès à l'API « Offres d'emploi v2 » (demande au support faite) | Tester l'onglet Offres dès que le scope est accordé |
| La Bonne Boîte | Habilitation (scope accordé, API répond « 403 Invalid scope ») | Brancher la recherche d'entreprises « qui recrutent sans offre » |
| ROME 4.0 | Noms de scopes à confirmer sur l'application | Affiner les profils avec les métiers et compétences du référentiel |
| Identité de l'éditeur | À renseigner dans `legal/config.js` | Relecture juridique des pages légales |

## À faire ensuite (backlog)

1. Catégories de compétences modifiables à la main.
2. Préparation à l'entretien d'après l'annonce et le CV.
3. Plaquette : images libres de droits proposées, modèles supplémentaires, version deux pages.
4. Documents PDF balisés (accessibilité), audit RGAA.
5. Découper `index.html` (CSS, modules JavaScript) avant la refonte du design.

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
