# Offres et tarifs

Source de vérité des formules. La page `tarifs/index.html`, la section « Tarifs » de `index.html` (landing, à la racine) et les maquettes `saas/inscription.html`, `saas/abonnement.html` et `saas/paiement.html` doivent rester alignées sur ce document.

## Statut actuel : bêta gratuite

Pendant la bêta, **les quatre formules sont gratuites** : aucune carte bancaire, aucun compte. Les prix ci-dessous sont les prix prévus à la fin de la bêta ; ils peuvent évoluer. Les pages publiques l'indiquent partout où un prix apparaît (badge « Gratuit pendant la bêta », bandeau en tête de la page tarifs).

## Les quatre formules

| Formule | Prix prévu | Accès | Profils de recherche | Fonctions freelance |
|---|---|---|---|---|
| **Gratuit** | 0 € | Aucune condition | **1** | Non |
| **Étudiant** | 10 € par an | Sur justificatif d'inscription (certificat de scolarité, carte d'étudiant), à renouveler chaque année | Illimités | Non |
| **Demandeur d'emploi** | 20 € par an | Ouverte à tous, sans justificatif : demandeurs d'emploi **et salariés en transition** (même formule, même tarif) | Illimités | Non |
| **Freelance** | 10 € par mois ou **79 € par an** (soit 6,58 € par mois, 41 € de moins qu'au mois) | Ouverte à tous ; **SIRET vérifié à l'inscription** (sert à rattacher la structure) | Illimités | Oui |

Les formules Étudiant et Demandeur d'emploi donnent **exactement les mêmes options** ; seuls l'accès et le prix changent. Les **salariés en transition** (quatrième audience) utilisent la formule Demandeur d'emploi, au même tarif : aucune formule distincte.

## Matrice des fonctions

| Fonction | Gratuit | Étudiant | Demandeur d'emploi | Freelance |
|---|---|---|---|---|
| Profils de recherche | 1 | Illimités | Illimités | Illimités |
| Base personnelle et import de CV | oui | oui | oui | oui |
| CV composé selon l'annonce, PDF | oui | oui | oui | oui |
| Score de correspondance (ATS) et plan d'action | oui | oui | oui | oui |
| Lettre, contrôle de style, PDF | oui | oui | oui | oui |
| CV anonymisé | oui | oui | oui | oui |
| Recherche d'entreprises (candidatures spontanées) | oui | oui | oui | oui |
| Suivi des candidatures et relances | oui | oui | oui | oui |
| E-mail d'envoi (offre, spontanée, relance, remerciement) | oui | oui | oui | oui |
| Fiche de préparation à l'entretien | oui | oui | oui | oui |
| Assistant IA par le compte Claude (facultatif) | oui | oui | oui | oui |
| Sauvegarde et restauration par fichier | oui | oui | oui | oui |
| Offres commerciales suggérées | non | non | non | oui |
| Accroches et baselines | non | non | non | oui |
| Plaquettes A4 (10 modèles, plusieurs plaquettes) | non | non | non | oui |
| Suivi des envois et statistiques de plaquettes | non | non | non | oui |
| Démarchage des intermédiaires, lettre d'offre de service | non | non | non | oui |
| E-mail d'offre de service, signature avec SIRET | non | non | non | oui |
| Compte et synchronisation entre appareils | à venir | à venir | à venir | à venir |

Hypothèses retenues faute d'indication : tout ce qui n'est pas lié au freelance est ouvert à toutes les formules ; seule la limite à un profil distingue le Gratuit. À confirmer (voir « Points à trancher »).

## Règles d'accès

- **Étudiant** : justificatif examiné (maquette `saas/verification-etudiant.html`). Pendant la vérification, la personne reste sur la formule Gratuit.
- **Demandeur d'emploi** : aucune démarche.
- **Freelance** : vérification du SIRET à l'inscription (maquette `saas/verification-siret.html`) : 14 chiffres, clé de Luhn, interrogation de l'annuaire des entreprises (la fonction serveur `functions/api/entreprises.js` existe déjà pour la recherche).
- **Retour au Gratuit** : une seule fiche de profil reste active ; la personne choisit laquelle garder.

## Points à trancher

1. Prix TTC ou HT, TVA, affichage des prix.
2. Règles de changement de formule, de résiliation, de remboursement et de prorata ; droit de rétractation pour un service numérique.
3. Justificatif étudiant : formats acceptés, vérification manuelle ou automatique, durée de conservation du fichier, délai de réponse.
4. SIRET : conservation du numéro (il rattache la structure et alimente la signature des e-mails), données affichées à la confirmation.
5. Le Gratuit doit-il inclure certaines fonctions seulement en lecture (par exemple une plaquette) ?
6. Existe-t-il d'autres limites par formule (nombre de candidatures, de PDF, de recherches d'entreprises) ?
7. Les fonctions de synchronisation entre appareils sont-elles réservées aux formules payantes ?
8. Prestataire de paiement, facturation, numérotation.
9. Remise ou période d'essai à la fin de la bêta pour les personnes inscrites pendant la bêta.

## Où chaque information est utilisée

| Information | Fichiers |
|---|---|
| Prix et conditions | `tarifs/index.html` (cartes, tableau, FAQ), `index.html` (landing : section Tarifs, panneaux « Pour qui »), `saas/inscription.html`, `saas/abonnement.html`, `saas/paiement.html` |
| Matrice des fonctions | `tarifs/index.html` (tableau comparatif) |
| Message « gratuit pendant la bêta » | `tarifs/index.html`, `index.html` (landing), `saas/inscription.html`, `saas/abonnement.html`, `saas/liste-attente.html`, JSON-LD des deux pages |

Toute modification d'un prix ou d'une fonction se fait ici d'abord, puis dans les fichiers de ce tableau.
