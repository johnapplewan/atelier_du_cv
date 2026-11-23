# Positionnement, messages et règles éditoriales

Fiche projet à réutiliser pour toute page publique, tout e-mail ou tout contenu de lancement. Les textes de `presentation/index.html` et `tarifs/index.html` en découlent.

## Produit

Atelier Candidature : un outil de candidature **local-first** (les données restent dans le navigateur) qui compose un CV et une lettre pour chaque annonce à partir d'une base personnelle, suit les candidatures et, pour les freelances, produit des plaquettes commerciales et suit les retours.

## Positionnement

Pour les personnes qui candidatent souvent (étudiants, personnes en recherche d'emploi, freelances), **l'atelier part de leur parcours et compose chaque document pour chaque annonce, sans rien inventer, sans compte et sans envoyer leurs données ailleurs.** À la différence d'un modèle de CV qu'on remplit à la main ou d'un générateur de texte qui invente, la base est unique et les manques sont signalés.

## Audiences

| Audience | Situation | Promesse | Preuves vérifiables | Formule prévue |
|---|---|---|---|---|
| Étudiants et alternants | Peu d'expérience, besoin d'un premier CV, de stages, d'alternance | Un premier CV avec ce qu'on a déjà ; niveau honnête par métier ; manques signalés | Profils « accessible sans expérience », astérisques de manque, candidatures spontanées, fiche d'entretien | Étudiant, 10 € par an |
| Recherche d'emploi | Plusieurs candidatures par semaine, CV à adapter à chaque annonce | Dix candidatures sans dix CV à refaire | Score de correspondance, CV au format ATS, lettre avec contrôle de style, suivi et relances à 10 jours, e-mail d'envoi | Demandeur d'emploi, 20 € par an |
| Freelances | Démarcher des clients et des intermédiaires | Une offre claire, une plaquette A4, un e-mail qui se lit | Offres suggérées, accroches, 10 modèles de plaquette, suivi des envois et statistiques, signature avec SIRET | Freelance, 10 € par mois ou 79 € par an |

## Messages clés

1. **Une base, tous les documents** : on importe son parcours une fois.
2. **Rien d'inventé** : ce qui manque est signalé par un astérisque.
3. **Sur ton ordinateur** : pas de compte pendant la bêta, pas de cookie, pas de suivi.
4. **Gratuit pendant la bêta** : tarifs simples ensuite.

## Règles éditoriales

- Tutoiement partout (comme dans l'application). Phrases courtes, concrètes, sans exclamation.
- Pas de statistique, pas de témoignage, pas d'avis chiffré tant qu'on n'a pas de source. Les captures d'écran utilisent des données fictives et le disent.
- Pas de promesse de résultat (« décroche un emploi »). Dire ce que l'outil fait : compose, signale, suit.
- Pas de garantie de passage des logiciels de tri (ATS) : on décrit les bonnes pratiques et le score.
- Éviter les contrastes « ce n'est pas X, c'est Y », les listes de négations, les formules toutes faites (« libérez le potentiel », « solution innovante »).
- Le mot « bêta » et le prix prévu apparaissent ensemble partout où un prix est montré.
- Les prix et les conditions viennent de `docs/OFFRES-ET-TARIFS.md`.

## Parcours de conversion

Landing (`presentation/`) → application (`/`) : un seul appel à l'action principal, « Ouvrir l'atelier ». Page tarifs (`tarifs/`) → application. Aucune capture d'e-mail pendant la bêta (la maquette `saas/liste-attente.html` existe pour plus tard). Aucun outil de mesure : l'efficacité se lit à la main (retours directs) tant que la politique de confidentialité l'impose.

## Prochaines étapes de lancement

1. Compléter `legal/config.js` et faire relire les pages légales.
2. Choisir l'URL définitive et mettre à jour `sitemap.xml`, les balises canoniques et Open Graph.
3. Remplacer les données fictives des captures par de vrais cas autorisés (avec accord écrit) quand il y en aura.
4. Décider si la landing devient la racine du site (`/`) et l'application passe sous `/app/` (voir `docs/ARCHITECTURE.md`, section 13).
5. Ajouter des preuves publiables : retours d'utilisateurs de la bêta, avec leur accord.
