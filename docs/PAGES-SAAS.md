# Pages du site hors application : maquettes SaaS

Les pages ci-dessous sont des **maquettes statiques non routées** (dossier `saas/`) : elles ne sont pas reliées à l'application, n'enregistrent rien et portent `noindex`. Elles servent à prévoir la refonte du front-end et une éventuelle version avec comptes. Chaque page indique ses états à prévoir et ses points à trancher.

L'atelier est **gratuit pour le moment** : il n'y a ni abonnement, ni paiement, ni facture, ni justificatif. Ces maquettes ont été retirées (voir `docs/OFFRES-ET-TARIFS.md`).

Les pages publiques (`/` landing, `tarifs/`) sont routées : voir `docs/ARCHITECTURE.md`, section 13. Ouvrir `saas/index.html` pour la liste navigable.

## Parcours

1. **Inscription** : inscription → vérification de l'e-mail → bienvenue → reprise des données locales.
2. **Vie du compte** : compte → données.
3. **Accès perdu** : mot de passe oublié → nouveau mot de passe → connexion.
4. **Hors compte** : aide, liste d'attente, erreur 404, maintenance.

## Index

| Page | Fichier | URL prévue | Accès | Rôle | Dépend de |
|---|---|---|---|---|---|
| Connexion | `saas/connexion.html` | `/connexion` | Public | Se connecter à son compte | Inscription, mot de passe oublié |
| Inscription | `saas/inscription.html` | `/inscription` | Public | Créer un compte et indiquer sa situation | Connexion, vérification e-mail |
| Vérification de l'e-mail | `saas/verification-email.html` | `/inscription/verification-email` | Public (compte créé) | Confirmer l'adresse e-mail | Inscription |
| Mot de passe oublié | `saas/mot-de-passe-oublie.html` | `/mot-de-passe-oublie` | Public | Demander un lien de réinitialisation | Connexion |
| Nouveau mot de passe | `saas/nouveau-mot-de-passe.html` | `/mot-de-passe/nouveau` | Public avec jeton | Choisir un nouveau mot de passe | Mot de passe oublié |
| Bienvenue (onboarding) | `saas/bienvenue.html` | `/bienvenue` | Connecté, premier passage | Guider les premiers pas : objectif, CV, profil, première candidature | Inscription, import de données locales |
| Reprise des données locales | `saas/migration-donnees.html` | `/migration` | Connecté | Reporter la base enregistrée dans le navigateur vers le compte | Connexion, sauvegarde .json |
| Mon compte | `saas/compte.html` | `/compte` | Connecté | Gérer l'identité, la sécurité et les préférences | Connexion |
| Mes données | `saas/donnees.html` | `/compte/donnees` | Connecté | Exporter et supprimer ses données (droits RGPD) | Compte |
| Aide et contact | `saas/aide.html` | `/aide` | Public | Centre d'aide : réponses fréquentes et formulaire de contact | Compte (facultatif) |
| Liste d'attente | `saas/liste-attente.html` | `/liste-attente` | Public | Être prévenu de l'ouverture des comptes | Aucune |
| Page introuvable | `saas/erreur-404.html` | `/404` | Public | Page d'erreur : adresse inconnue | Aucune |
| Maintenance | `saas/maintenance.html` | `/maintenance` | Public | Page d'indisponibilité temporaire | Aucune |

## Détail par page

### Connexion

- Fichier : `saas/connexion.html` · URL prévue : `/connexion` · Accès : Public
- Rôle : Se connecter à son compte
- États à prévoir : identifiants incorrects (message neutre), compte non confirmé avec renvoi du lien, trop de tentatives avec délai d'attente, session expirée.
- Accès : public ; redirige vers l'application si déjà connecté.
- Données : aucune donnée de l'application ne transite avant la connexion.

### Inscription

- Fichier : `saas/inscription.html` · URL prévue : `/inscription` · Accès : Public
- Rôle : Créer un compte et indiquer sa situation
- Enchaînement : inscription → vérification de l'e-mail → bienvenue → reprise des données locales.
- Situation : étudiant, recherche d'emploi, transition, freelance : elle ne change que l'accueil et les écrans mis en avant, pas l'accès aux fonctions.
- États à prévoir : e-mail déjà utilisé, mot de passe trop faible, consentements non cochés.
- Données : e-mail, mot de passe, situation. Aucune donnée de CV.

### Vérification de l'e-mail

- Fichier : `saas/verification-email.html` · URL prévue : `/inscription/verification-email` · Accès : Public (compte créé)
- Rôle : Confirmer l'adresse e-mail
- États à prévoir : message renvoyé (avec compte à rebours), lien expiré, lien déjà utilisé, adresse confirmée (redirige vers la suite du parcours).
- Accès : public avec jeton de session d'inscription.

### Mot de passe oublié

- Fichier : `saas/mot-de-passe-oublie.html` · URL prévue : `/mot-de-passe-oublie` · Accès : Public
- Rôle : Demander un lien de réinitialisation
- Règle de sécurité : la réponse est la même que le compte existe ou non (la zone verte s'affiche dans tous les cas).
- États à prévoir : limite d'envois, adresse mal formée.

### Nouveau mot de passe

- Fichier : `saas/nouveau-mot-de-passe.html` · URL prévue : `/mot-de-passe/nouveau` · Accès : Public avec jeton
- Rôle : Choisir un nouveau mot de passe
- États à prévoir : lien expiré (zone rouge ci-dessus), mots de passe différents, mot de passe trop faible, succès avec retour à la connexion.
- Sécurité : déconnecter les autres sessions après le changement.

### Bienvenue (onboarding)

- Fichier : `saas/bienvenue.html` · URL prévue : `/bienvenue` · Accès : Connecté, premier passage
- Rôle : Guider les premiers pas : objectif, CV, profil, première candidature
- Origine : la feuille de route prévoit un onboarding complet avant l'ouverture des comptes (voir `docs/ROADMAP.md`).
- À prévoir : mode démonstration avec données d'exemple effaçables, visite des écrans, explication du stockage local et de la synchronisation, mesure d'activation sans traceur tiers.
- États à prévoir : étape terminée, étape passée, reprise là où l'on s'est arrêté.

### Reprise des données locales

- Fichier : `saas/migration-donnees.html` · URL prévue : `/migration` · Accès : Connecté
- Rôle : Reporter la base enregistrée dans le navigateur vers le compte
- Pourquoi : toutes les personnes de la bêta ont leurs données dans le navigateur ; la reprise évite de tout ressaisir.
- États à prévoir : aucune donnée locale détectée, conflit entre local et compte, import en cours, import terminé avec récapitulatif, fichier invalide.
- Sécurité : télécharger une sauvegarde avant toute écriture.

### Mon compte

- Fichier : `saas/compte.html` · URL prévue : `/compte` · Accès : Connecté
- Rôle : Gérer l'identité, la sécurité et les préférences
- Accès : connecté.
- États à prévoir : confirmation de changement d'e-mail, mot de passe modifié, double authentification (à venir), déconnexion des autres appareils.
- Données : identité du compte uniquement ; la base de CV reste séparée.

### Mes données

- Fichier : `saas/donnees.html` · URL prévue : `/compte/donnees` · Accès : Connecté
- Rôle : Exporter et supprimer ses données (droits RGPD)
- États à prévoir : export en préparation, export prêt, suppression confirmée par saisie, suppression programmée avec délai de rétractation.
- À compléter : durées de conservation (compte, sauvegardes, journaux), sous-traitants.

### Aide et contact

- Fichier : `saas/aide.html` · URL prévue : `/aide` · Accès : Public
- Rôle : Centre d'aide : réponses fréquentes et formulaire de contact
- États à prévoir : aucun résultat de recherche, message envoyé, erreur d'envoi, limite anti-spam.
- Données : ne jamais demander de joindre un CV complet ; préciser quoi masquer.

### Liste d'attente

- Fichier : `saas/liste-attente.html` · URL prévue : `/liste-attente` · Accès : Public
- Rôle : Être prévenu de l'ouverture des comptes
- À trancher : stockage de la liste (hors navigateur), durée de conservation, désinscription en un clic.
- Usage : utile tant que les comptes ne sont pas ouverts ; à retirer ensuite.

### Page introuvable

- Fichier : `saas/erreur-404.html` · URL prévue : `/404` · Accès : Public
- Rôle : Page d'erreur : adresse inconnue
- Hébergement : Cloudflare Pages sert un fichier `404.html` à la racine ; cette maquette en est la base.

### Maintenance

- Fichier : `saas/maintenance.html` · URL prévue : `/maintenance` · Accès : Public
- Rôle : Page d'indisponibilité temporaire
- États à prévoir : maintenance programmée (avec heure de retour), incident en cours, retour à la normale.

## Règles communes

- Toutes les maquettes partagent `site/site.css` et `site/site.js` avec la landing et la page « Gratuit ».
- Le bandeau « Maquette non routée » et les blocs « Notes pour la refonte » sont à retirer au moment du routage.
- Aucune donnée de CV ne transite avant la connexion ; les messages d'erreur d'authentification restent neutres.
- Tout champ qui enregistre une donnée personnelle renvoie vers la politique de confidentialité.
- Aucune page ne demande de paiement ni ne conditionne l'accès aux fonctions ou aux offres à une situation ou à un tarif.
