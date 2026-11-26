# Gratuité, offres et coût de l'IA

Source de vérité du modèle économique. La page `tarifs/index.html`, la section « Gratuit » de `index.html` (landing, à la racine), les maquettes `saas/` et les textes de `docs/MARKETING.md` doivent rester alignés sur ce document.

## Décision actuelle : gratuit pour le moment

- **Condition de La bonne alternance** (réponse écrite du 25 novembre 2026) : l'utilisation de ses API est autorisée **tant que le service est 100 % gratuit pour les candidats** (accord tacite, contrôles réguliers). Toute formule payante ou tout accès conditionné à un paiement annulerait cet accord ; voir `docs/FRANCE-TRAVAIL.md`.

- **Aucun prix, aucune formule, aucun paiement** n'est affiché ni prévu à cette date. Toutes les fonctions sont ouvertes à tout le monde, sans compte et sans carte bancaire. Les pages publiques disent « Gratuit pour le moment » et rien d'autre sur ce sujet.
- **Pourquoi** : rester dans un cadre **non commercial** pour pouvoir utiliser des sources d'offres dont la licence exclut les usages lucratifs ou la facturation de l'accès (La bonne alternance, France Travail ; voir `docs/FRANCE-TRAVAIL.md`), et ne pas avoir à payer l'IA de tout le monde.
- Les anciennes formules payantes et leurs maquettes (abonnement, paiement, factures, justificatif étudiant, vérification du SIRET, conditions de vente) ont été **retirées** ; elles restent consultables dans l'historique git (commit `7e6c84f` et précédents) et résumées en fin de document.

## Qui paie l'IA ?

**Aujourd'hui, personne côté éditeur : l'atelier n'appelle aucune IA à ses frais.** Le code n'a aucune clé d'API de l'éditeur ni appel serveur vers un modèle. L'assistant d'écriture (`iaAsk`) fonctionne de trois façons, toutes à la charge de la personne :

- **Direct** : uniquement quand la page est ouverte dans claude.ai (fonction `window.claude`), avec le compte Claude de la personne ;
- **Clé d'API personnelle** (facultative) : réglage de l'assistant ; appel direct du navigateur vers api.anthropic.com, facturé sur le compte API de la personne ;
- **Copier-coller** : le message est copié vers claude.ai, la réponse est collée dans l'atelier.

Les fonctions de base (CV, lettre, e-mail, plaquette, suivi) n'utilisent aucune IA. Les pages publiques l'expliquent (« Personne ne paie la consommation des autres »).

**Remarque** : sur un domaine propre, le mode direct (`window.claude`) n'existe pas ; restent la clé personnelle et le copier-coller.

## Options pour l'IA si on veut plus, sans devenir commercial ni payer pour tous

| Option | Principe | Coût pour l'éditeur | Remarques |
|---|---|---|---|
| **A. Statu quo** (recommandé) | Copier-coller vers claude.ai, direct dans claude.ai | Nul | Un peu moins fluide hors claude.ai |
| **B. Clé personnelle (BYOK)** — **en place** | La personne saisit sa propre clé d'API (réglages de l'assistant), stockée dans son navigateur hors sauvegarde, appels directs du navigateur vers api.anthropic.com, aperçu avant envoi, modèle au choix | Nul | `connect-src` de la CSP ouvert à `https://api.anthropic.com` ; facultatif ; la personne doit créer une clé dédiée avec une limite de dépenses ; toute personne utilisant le navigateur peut lire la clé |
| **C. Quota gratuit plafonné** | L'éditeur finance un petit nombre d'actions par personne et par mois, avec un plafond mensuel global qui coupe le service | Borné par le plafond | Demande un serveur, un compte ou un identifiant pour compter, et un modèle économique ; contraire à « sans compte » |
| **D. Modèle local dans le navigateur** | Petit modèle exécuté sur l'appareil (WebGPU) | Nul | Gros téléchargement, qualité limitée ; piste à long terme |
| **E. Financement non lucratif** | Association, mécénat, partenaires (écoles, collectivités), dons | Pris en charge par des tiers | Question juridique (définition de « non lucratif » selon chaque licence) à faire valider ; ne résout rien sans structure |
| **F. IA payante en option** | Formule payante pour l'IA seulement | Couvert par les revenus | **À éviter** tant qu'on dépend de sources d'offres exigeant un usage non lucratif (voir `docs/FRANCE-TRAVAIL.md`) |

**Décision** : A et B sont en place (la personne choisit) ; ne jamais financer l'IA des utilisateurs sans plafond. **Séparer deux choses** : l'accès aux offres et aux outils de base (gratuit, sans compte, sans condition) et l'assistant d'écriture (à la charge de la personne).

## Orientation décidée pour la suite (26 novembre 2026)

Le propriétaire a retenu, pour plus tard et sans rien annoncer aujourd'hui : un **abonnement pour les seules actions d'IA** (reformulation, entraînement à l'entretien…) qui n'envoient jamais d'annonce (mots-clés, titre du poste et spécialité du CV seulement), et un **abonnement pour les comptes et la synchronisation entre appareils** (il finance l'hébergement). Cela correspond à l'option F ci-dessus, jusqu'ici jugée « à éviter ».

- **Condition préalable** : obtenir l'accord écrit de La bonne alternance (service 100 % gratuit pour les candidats). La recherche d'offres et les outils de base restent gratuits et sans compte ; seul le payant est isolé.
- **Test ATS** : idée de l'inclure dans l'abonnement ; aucun ATS du marché n'est testable à distance, donc ne proposer que des contrôles de lisibilité automatique, sans l'appeler « test par un ATS réel ».
- **Structure juridique** : nécessaire dès qu'il y a un abonnement (facturation, TVA, conditions de vente, médiateur de la consommation, RGPD) ; à faire valider par un comptable ou un juriste.
- **Wording public** : tant que rien n'est lancé, « Gratuit pour le moment », sans prix ni mention d'abonnement.
- Reste à trancher : prix, plafond d'usage de l'IA, hébergeur, prestataire de paiement.

## Historique : hypothèse de quatre formules (retirée)

Pour mémoire, l'hypothèse étudiée puis écartée :

| Formule | Prix prévu | Accès |
|---|---|---|
| Gratuit | 0 € | 1 profil de recherche |
| Étudiant | 10 € par an | Justificatif d'inscription |
| Demandeur d'emploi (et salariés en transition) | 20 € par an | Sans justificatif |
| Freelance | 10 € par mois ou 79 € par an | SIRET vérifié à l'inscription |

Ces formules, la matrice de fonctions et les maquettes de paiement sont retirées du site et du dépôt. Elles pourront être reprises depuis l'historique si la décision change, après vérification des licences des sources d'offres.

## Où cette décision est utilisée

| Information | Fichiers |
|---|---|
| « Gratuit pour le moment », explication du coût de l'IA | `tarifs/index.html`, `index.html` (landing : badge, section « Gratuit », FAQ, microtextes), JSON-LD des deux pages (`price: 0`) |
| Inscription sans prix (situation seulement) | `saas/inscription.html`, `saas/liste-attente.html` |
