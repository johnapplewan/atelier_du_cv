# Consignes de travail pour ce dépôt

## Documentation toujours à jour

À **chaque modification** (page, onglet, fonction, identifiant HTML, donnée enregistrée, tarif, formule, texte de positionnement, fichier ajouté ou retiré), mettre à jour **dans la même livraison** les documents concernés, en version complète et sans rien omettre :

| Si tu changes… | Mets à jour |
|---|---|
| un onglet, une fonction, un identifiant, le modèle de données, un moteur, le design, un fichier du dépôt | `docs/ARCHITECTURE.md` (tableau des écrans, modèle de données, moteurs, identifiants, index des fonctions, section 13 pour le site public et les maquettes) |
| une formule, un prix, une condition d'accès, une fonction réservée à une formule | `docs/OFFRES-ET-TARIFS.md`, puis `tarifs/index.html`, `index.html` (landing) et les maquettes `saas/` concernées |
| une page SaaS (ajout, retrait, état, point à trancher) | `docs/PAGES-SAAS.md`, `saas/index.html` et le tableau de la section 13 de `docs/ARCHITECTURE.md` |
| un message, une audience, une règle éditoriale | `docs/MARKETING.md` |
| une étape faite, en attente ou à venir | `docs/ROADMAP.md` |
| le fonctionnement général, le déploiement | `README.md` |

**Quand une information est retirée du code, la retirer exactement de la même façon dans la documentation** (ligne de tableau, identifiant, fonction, page, mention). Ne pas laisser de description d'une fonctionnalité qui n'existe plus.

## Principes du produit à respecter

- Données dans le navigateur ; aucune ressource externe (CSP dans `_headers`) ; aucun cookie ni outil de mesure.
- Rien d'inventé dans les documents produits ; les manques sont signalés par un astérisque.
- Pas de statistique, de témoignage ni d'avis sans source dans les textes publics ; les captures d'écran utilisent des données fictives.
- Interface en français, tutoiement.
- Pendant la bêta, toutes les formules sont gratuites : tout prix affiché porte la mention « gratuit pendant la bêta ».

## Vérifications avant livraison

Tester les parcours touchés avec Playwright (aucune erreur de console, pas de débordement horizontal sur mobile), puis pousser sur la branche de développement et ouvrir ou mettre à jour la pull request.
