# Atelier Candidature : fonctionnement, fonctions et architecture

Document de passation pour retravailler le design (front, UX, UI) hors de la conversation de développement.
État du code : branche `claude/new-session-6jo73r`, fichier principal `index.html` (≈ 5 800 lignes).

---

## 1. Ce qu'est l'application

Un outil d'aide à la candidature, **100 % côté navigateur** : l'utilisateur constitue une **base personnelle** (expériences, formations, certifications, compétences, projets), crée des **profils de recherche** (IT, communication, immobilier…), puis, pour chaque annonce, candidature spontanée ou offre de service freelance, l'application compose automatiquement un **CV sur mesure**, une **lettre** et le **suivi**.

Principes de conception à conserver :

1. **Local-first et confidentialité** : rien de personnel ne quitte le navigateur (`localStorage`). Pas de compte, pas de cookie, pas d'outil de mesure, aucune ressource tierce chargée (polices et bibliothèques PDF auto-hébergées).
2. **L'application fait le tri elle-même** : dès que la base, le profil ou l'annonce change, le CV et les indicateurs se recalculent. L'utilisateur ajuste ensuite (cases à cocher, texte), il n'a pas à tout reconstruire.
3. **Rien n'est inventé** : tout contenu produit vient de la base de l'utilisateur ; ce qui manque est signalé par un astérisque (*) à l'écran, jamais comblé.
4. **Multi-personnes sur un même ordinateur** : chaque personne a sa base, sa « voix », ses profils, ses candidatures.
5. **IA facultative** : via le compte Claude de l'utilisateur (envoi direct sur claude.ai, sinon copier-coller). Jamais de clé API dans l'application.

---

## 2. Architecture technique

| Élément | Rôle |
|---|---|
| `index.html` | **Toute l'application** : HTML des écrans, CSS (`<style>`), JavaScript (`<script>`, sans framework ni build). |
| `vendor/` | `fonts.css` + `fonts/*.woff2` (Newsreader, Public Sans, IBM Plex Mono, latin et latin-ext), `html2canvas.min.js`, `jspdf.umd.min.js` (génération PDF). |
| `functions/api/*.js` | Cloudflare Pages Functions (côté serveur, voir §7). |
| `prompts.js` | Méthodes d'écriture données à l'assistant IA (lettre RAPOS, règles d'humanisation, reformulation du CV). Chargé avant le script principal. Référence lisible : `docs/METHODE-LETTRE-RAPOS.md`. |
| `legal/` | Pages légales statiques : mentions légales, confidentialité, CGU, accessibilité (`config.js` = identité de l'éditeur à compléter, `legal.css` = style propre). |
| `_headers` | En-têtes de sécurité Cloudflare Pages (CSP restrictive, HSTS, X-Frame-Options…). |
| `robots.txt`, `sitemap.xml` | Référencement. |
| Hébergement | Cloudflare Pages (déploiement automatique à chaque fusion sur `main`). |

**Contraintes qui pèsent sur un redesign**

- **CSP** (`_headers`) : `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'`. Aucune ressource externe (CDN, polices distantes, analytics) ne doit être ajoutée. Le JavaScript est inline : si on le sort dans des fichiers, garder `'self'`.
- **Pas de framework ni de build** aujourd'hui. Un redesign peut introduire un build, mais l'ensemble doit rester servable en statique sur Cloudflare Pages.
- **Une version publiée comme artefact claude.ai** existe (même `index.html` + `vendor/`) ; elle ne peut pas appeler `/api/*` (la lecture d'annonce par lien, la recherche d'entreprises et d'offres n'y fonctionnent pas, un message l'indique).
- Le HTML est **en grande partie généré en JavaScript** (`innerHTML` dans les fonctions `render…`). Les classes CSS et les `id` listés en §8 et §9 sont donc un **contrat** entre le style et le code.

### Flux de données

```
Navigateur (localStorage)  ←→  index.html (état + moteurs de composition)
        │                              │
        │                              ├─ /api/annonce     → page d'une offre (lecture par lien)
        │                              ├─ /api/lieu        → API Adresse (communes)
        │                              ├─ /api/entreprises → API Recherche d'entreprises (data.gouv.fr)
        │                              └─ /api/offres      → API Offres d'emploi de France Travail (accès en attente)
        └─ Assistant IA (facultatif) : copier-coller vers claude.ai, ou envoi direct dans la version claude.ai
```

Les fonctions serveur ne reçoivent que des critères de recherche ou une URL. Elles ne stockent rien.

---

## 3. Écrans (onglets du rail)

Le rail latéral (`#rail`, boutons `.rail-item[data-tab]`) ouvre un panneau `section.panel#panel-<onglet>`. `switchTab(tab)` gère l'affichage ; `statusFor(tab)` + `refreshStatusDots()` alimentent la pastille d'état (`.status-dot[data-state]` : vide / partiel / prêt).

| N° | Onglet (`data-tab`) | Rôle | Éléments principaux |
|---|---|---|---|
| 01 | **Ma base** (`base`) | Constituer et fusionner la base de la personne | Import de CV (nom du CV + texte, case « remplacer »), listes modifiables expériences / formations / rubriques / compétences / certifications, liste des CV importés, **carte de la base** (SVG radial + détail par branche, mise en évidence par profil) |
| 02 | **Mes profils** (`profils`) | Créer des profils de recherche et leur CV type | Profils proposés d'après la base (niveau : déjà exercé / base suffisante / accessible sans expérience / pas assez d'éléments), « Viser un autre métier », éditeur par profil (titre visé, lieu, rayon, contrats, mots-clés, accroche, ton, à compléter, import de texte, **CV type** avec aperçu, ajustements, PDF) |
| 03 | **Recherche** (`recherche`) | Entreprises à démarcher (candidatures spontanées) | Profil, lieu (recherche de commune), rayon, taille, résultats avec « Candidature spontanée », lien page recrutement, fiche, écarter |
| 04 | **Offres** (`offres`) | Offres d'emploi France Travail | Profil, mots-clés, lieu, rayon, contrat, période, correspondance avec la base, « Candidater avec cette offre ». **Accès API en attente côté France Travail** : l'onglet affiche « non activée » tant que l'accès n'est pas accordé |
| 05 | **Freelance** (`freelance`) | Offre de service et démarchage des intermédiaires | Prestations, disponibilité, modalités, tarif facultatif, références (cases parmi les expériences), import de texte, types de structures (ESN, conseil, intérim, recrutement, portage, formation, agences, entreprises du secteur), recherche, « Lettre d'offre de service » |
| 06 | **Annonce** (`annonce`) | Saisir ou récupérer l'annonce | Champ lien + « Récupérer l'annonce », poste, entreprise, texte, mots-clés détectés, encadré d'analyse (qui publie : direct / cabinet / intérim / ESN, entreprise finale, lieu, contrat, rémunération, profil utilisé) |
| 07 | **CV** (`cv`) | CV de la candidature en cours | Identité (nom, contacts, photo, langue FR/EN, accroche), **composition** (cases par élément, manques `*`), score ATS + suggestions + optimisation + plan d'action, **aperçu éditable**, PDF et PDF anonymisé |
| 08 | **Lettre** (`lettre`) | Lettre de motivation / spontanée / offre de service | Destinataire, langue, ton, affinage (boutons rapides + remarques + « Réécrire avec Claude »), voix de la personne, texte modifiable, aperçu éditable, PDF |
| 09 | **Annexe** (`annexe`) | Contenus complémentaires par catégorie de métier | Grille de catégories, suggestions, éléments, aperçu, PDF |
| 10 | **Candidatures** (`candidatures`) | Suivi | Une ligne par candidature (créée automatiquement), statut, notes, versions enregistrées, « Revenir à cette version » |
| 11 | **Entretien** (`entretien`) | Entraînement | Questions générées d'après l'annonce, réponses, corrigé heuristique |

**Barre haute** : marque, bouton icône de thème (soleil, lune ou demi-cercle pour automatique ; un clic passe au suivant), « Assistant IA : <mode> », « Tout effacer », « CV + Lettre (PDF) », « Télécharger le dossier complet (PDF) ».
**Barre Personne** : choisir, ajouter, renommer, supprimer une personne.
**Barre Candidature** : choisir, nommer, nouvelle, dupliquer, supprimer, Sauvegarder (fichier .json) / Restaurer.
**Pied de page** : liens vers les pages légales.
**Bandeau d'accueil** (`#home-strip`, en haut du contenu) : « Premiers pas » (importer un CV, créer un profil, préparer une candidature ; masquable, mémorisé par personne) et alerte « N relances à faire » (« Voir », « Plus tard »). À l'ouverture, une base vide ouvre directement « Ma base ».

### Parcours principaux

1. **Première utilisation** : Ma base → importer un ou plusieurs CV → Mes profils → créer un profil → Annonce (coller un lien ou un texte) → CV → Lettre → PDF.
2. **Candidature spontanée** : Recherche → choisir un profil et un lieu → résultats → « Candidature spontanée » → CV + lettre générés → suivi créé avec relance à 10 jours.
3. **Offre France Travail** (quand l'accès sera accordé) : Offres → résultats → « Candidater avec cette offre » → CV et lettre sur mesure.
4. **Freelance** : Freelance → décrire l'offre → choisir les types de structures → résultats → « Lettre d'offre de service ».
5. **Enrichir la base** : n'importe quand, Ma base ou l'encart « Compléter avec un texte » d'un profil / de l'onglet Freelance → la base fusionne et tout se recalcule.

---

## 4. Modèle de données

Clé de stockage : `localStorage["atelier-candidature-v2"]` (nom historique, contenu en version 4). Autres clés : `atelier-candidature-theme` (`light`/`dark`, absent = auto), `atelier-candidature-ia-pref` (`{skip}`).

```
Stockage = { version: 4, currentPersonId, people: [ Personne ] }

Personne = { id, nom, data: {
  profil:        { nom, titre, email, tel, ville, lien, langues, atouts[], photo (data URL),
                   voix:{ description, formuleFinale, eviter },
                   freelance:{ services[{titre,description}], offre, expIds[], dispo, mode, zone, tjm, showTjm },
                   ecartes{siren:true}, offresEcartees{id:true} },
  library:       { experiences[{id,poste,entreprise,dates,details,src[]}],   // details = une réalisation par ligne
                   formations[{id,diplome,etablissement,dates,details,src[]}],
                   competences[{id,label,cat?,src[]}],
                   certifications[{id,label,organisme,annee,src[]}],
                   sections[{id,titre,texte,src[]}],                         // texte structuré : "## sous-titre", "- puce"
                   sources[{id,label,date}],                                 // CV importés
                   lettresArchive[], annexeItems[] },
  profils:       [ { id, domaine, nom, titreVise, titresAlt[], secteur, lieu, rayon, contrats[], ton,
                     motsCles[], accroche, niveau, modes{spontanee,offres,debutant}, cvPrefs{pins{},hides{}} } ],
  candidatures:  [ { id, poste, entreprise, lien, date, statut, notes, type (offre|spontanee|service), versions[], lastSync } ],
  dossiers:      [ Dossier ], currentId } }

Dossier (une candidature en cours) = { id, titre, titreAuto, candidatureId,
  annonce:  { poste, entreprise, url, texte, keywords[{term,count,kind}], meta{lieu,contrat,salaire,date,secteur},
              emetteur{type,manual,raisons[]}, clientFinal, spontanee, service, cible, source },
  cv:       { lang, titre, resume, resumeOrig?, profilId, profilManuel, pins{}, hides{}, expOverrides{id:texte},
              compo (calculé), selectedExp[], excludedExp[], selectedForm[] },
  lettre:   { lang, ton, destinataire, disponibilite, options{court,concret}, remarques[], motivations[],
              competencesChoisies[], corps (paragraphes modifiés ou null), corpsPrev, seed },
  annexeDossier: { categorie, selectedItemIds[] },
  entretien: { questions[], reponses{}, seed, corrigeVisible } }
```

**Alias d'exécution** : `state.profil`, `state.library`, `state.profils`, `state.candidatures`, `state.dossiers` pointent vers la personne active ; `state.annonce`, `state.cv`, `state.lettre`, `state.annexeDossier`, `state.entretien` vers la candidature active. Changer de personne ou de candidature = réassigner ces alias puis relancer les rendus (`syncPersonUI()`, `syncDossierUI()`).

`persist()` écrit tout. Elle est appelée après chaque modification.

---

## 5. Moteurs (règles métier)

| Moteur | Fonctions clés | Règle en une phrase |
|---|---|---|
| Extraction de mots-clés | `extractKeywords` | Lexique de compétences (`SKILL_DICTIONARY`) + mots fréquents du texte de l'annonce. |
| Import / nettoyage de CV | `normalizeImportLines`, `parseImportedCv`, `parseEntries` | Retire le Markdown, reconnaît les rubriques par leur titre (profil, expériences, formations, compétences, certifications, langues, services…) et découpe en entrées (poste, entreprise, dates, puces). |
| Fusion dans la base | `mergeImportIntoBase`, `findSameExperience`, `mergeLines` | Une même expérience (entreprise + poste ou année) est enrichie, pas dupliquée ; les puces proches (≥ 60 % de mots communs) ne sont pas ajoutées deux fois. |
| Composition du CV | `composeCv`, `compoDecision` | Pour chaque catégorie, score de pertinence (annonce ×2 + mots-clés du profil), sélection automatique (5 expériences, 5 puces pour les 2 premières puis 3, 16 compétences, 4 formations, certifications utiles, rubriques utiles), puis priorité aux choix de la personne : `cv.hides/pins` (cette candidature) > `profil.cvPrefs` > automatique. |
| Manques | `computeGaps`, `gapStar` | Dates, réalisations, chiffres, accroche, certifications, langues, contacts, mots-clés visés absents. |
| Score ATS | `atsAnalysis`, `atsOptimize`, `atsPlanMarkdown` | % de mots-clés de l'annonce présents dans le CV composé ; actions « faisables » (remettre une expérience, ajouter une compétence présente ailleurs dans la base, adapter l'accroche) vs « à toi » ; plan d'action Markdown ; message « trop éloigné » sous 40 %. |
| Profils | `profilEvidence`, `profilSuggestions`, `createProfil`, `profilTodo`, `bestProfilForAnnonce` | 13 domaines avec mots-clés et codes NAF ; niveaux « exercé » (≥ 3 mots dans les expériences), « base suffisante » (≥ 3 au total), « accessible sans expérience » (domaines débutants), sinon « pas assez d'éléments ». |
| Émetteur d'annonce | `analyseEmetteur` | Direct / cabinet / intérim / ESN d'après le nom de l'entreprise et des formules du texte ; modifiable. |
| Lettres | `generateLettre` → `generateLettreParagraphs` (offre), `LETTRE_SPONTANEE`, `generateOffreServiceParagraphs` | Ouverture selon le ton et le type d'émetteur, expériences proches, réalisations, mots-clés maîtrisés, voix de la personne, clôture. Aucun fait inventé. |
| Anonymisation | `anonymizedCvElement`, `scrubForAI` | Retire nom, contacts, photo, liens ; options pour masquer employeurs et établissements. |
| Export PDF | `buildPdfFromSections`, `fitPdfClone`, `addCanvasAsPages` | Recompose le document hors écran à largeur A4, resserre pour tenir en 2 pages (CV) / 1 page (lettre), coupe entre deux blocs, retire astérisques et zones éditables. |
| Assistant IA | `iaAsk`, `iaReformulerCV`, `btn-affiner-ia` | Message sans nom ni coordonnées ni noms d'employeurs ; mode direct (version claude.ai) ou copier-coller ; règles de `prompts.js` envoyées à chaque demande ; réponse `{paragraphs, remarques}`. |
| Contrôle de style | `styleReport`, `renderStyleCheck` | Port JavaScript de l'analyseur d'humanisation : formules typiques, contrastes, tirets, rythme, débuts répétés, triades, paragraphes uniformes ; score estimé /100, longueur 150 à 250 mots, noms d'employeurs cités ; bouton « Corriger ces points avec Claude ». |

---

## 6. Fonctions serveur (`functions/api/`)

| Route | Paramètres | Renvoie | Données transmises |
|---|---|---|---|
| `/api/annonce` | `url` | Titre, entreprise, lieu, contrat, salaire, description (JSON-LD `JobPosting`, sinon texte de la page) ; refuse les adresses internes ; échec clair si le site bloque | L'URL |
| `/api/lieu` | `q` | Communes (libellé, code postal, code INSEE, département, latitude, longitude) | Le nom saisi (API Adresse) |
| `/api/entreprises` | `naf`, `lat`/`lon`/`radius` ou `dep`, `taille`, `page` | 20 entreprises actives (nom, activité, effectif, ville, fiche) | Secteur, zone, taille (API Recherche d'entreprises) |
| `/api/offres` | `q`, `commune`, `distance`, `contrat`, `experience`, `depuis`, `page` | 20 offres normalisées | Critères de recherche (API France Travail ; variables `FT_CLIENT_ID`, `FT_CLIENT_SECRET`, `FT_SCOPE` facultatif) |
| `/api/ft-diagnostic` | `probe`, `scope`, `path` | Diagnostic des accès France Travail ; **inactif** tant que la variable `FT_DIAG` n'existe pas (à supprimer du dépôt si inutile) | — |

---

## 7. Design actuel

### Identité

Sobre, éditorial, papier et encre, accent bleu nuit, laiton comme second accent. L'utilisateur a jugé le rendu **« austère, pas assez grand public »** et prépare une référence visuelle : tout est à rouvrir.

### Jetons (variables CSS, `:root`)

Couleurs (clair → sombre) : `--bg`, `--surface`, `--surface-2`, `--border`, `--border-strong`, `--ink-900/600/400`, `--accent` `#2E4C82` (sombre `#8CA9DE`), `--accent-ink`, `--accent-soft`, `--on-accent`, `--brass`, `--brass-soft`, `--success`, `--caution`, `--danger` (+ variantes `-soft`), `--shadow`, `--radius: 10px`.
Polices : `--font-display` Newsreader (titres), `--font-body` Public Sans (texte), `--font-mono` IBM Plex Mono (étiquettes, puces, chiffres).
Thème : clair / sombre / auto, bouton icône `#btn-theme` qui fait défiler les trois (`prefers-color-scheme`, attribut `data-theme` sur `<html>`, préférence mémorisée).

### Composants CSS existants

`.app` (grille : barre haute, barre personne, barre candidature, rail + contenu), `.topbar`, `.dossier-bar` (barres Personne / Candidature), `.rail` / `.rail-item` / `.status-dot`, `.workspace`, `.panel` / `.panel-head`, `.split` / `.controls-col` / `.preview-frame` / `.preview-toolbar` (colonne de réglages + aperçu), `.card`, `.exp-block` / `.exp-block-head` (bloc d'édition d'un élément), `.field` / `.row2`, `.btn` (`-primary`, `-ghost`, `-sm`), `.icon-btn`, `.chip` / `.chips` (étiquettes ; `.suggest` = pointillé), `.segmented` (bascule), `.tier-pill` (`success`/`caution`/`danger`), `.gauge-wrap` / `.gauge-num` (score ATS), `.ats-list`, `.eyebrow`, `.hint`, `.empty-note`, `.toolbar-row`, `.download-status`, `.cat-card` / `.category-grid` (annexe), `.ref-panel`, `.app-footer`, documents : `.paper` + `.cv-doc` / `.lettre-doc` / `.annexe-doc` (voir contrainte PDF ci-dessous).


### Navigation mobile (≤ 860 px)

- **Barre du bas** (`#bottom-nav`) : 4 groupes, Préparer (Ma base, Mes profils), Chercher (Recherche, Offres, Freelance), Candidater (Annonce, CV, Lettre, Annexe), Suivi (Candidatures, Entretien). Pastille sur Suivi quand une relance est due.
- **Bande d'onglets du haut** (`#rail`, collante) : n'affiche que les onglets du groupe actif (`body[data-group]`, attribut `data-group` sur chaque `.rail-item`). Le dernier onglet visité de chaque groupe est mémorisé (`lastTabByGroup`).
- **Bouton Menu** (`#btn-menu`) : déplie les réglages d'interface, les barres Personne et Candidature, les exports (`body.menu-open`). Le titre de la candidature en cours s'affiche sous la marque (`#mobile-title`).
- **Réglages / Aperçu** : sur les écrans à deux colonnes (`.panel-doc` : Ma base, CV, Lettre, Annexe), une bascule `.mobile-switch` montre une colonne à la fois (`data-view`).
- Champs à 16 px (évite le zoom iOS), cibles tactiles d'au moins 44 px, `viewport-fit=cover` et marge de sécurité en bas (`env(safe-area-inset-bottom)`).

### Responsive et accessibilité (état)

Points de rupture : 960 px, 860 px (navigation mobile, voir ci-dessus), 520 px. `prefers-reduced-motion` respecté. Contrastes vérifiés AA (clair et sombre). Boutons-icônes avec nom accessible, pastilles d'état avec alternative, lien d'évitement sur les pages légales. Non fait : audit RGAA complet, PDF non balisés, éditeurs `contenteditable` non testés avec tous les lecteurs d'écran.

### Contrainte forte : les documents (CV, lettre) et le PDF

- Les aperçus `.cv-doc` / `.lettre-doc` sont **la source du PDF** : le PDF est une image de ce rendu, recomposée à largeur A4 par `makePdfClone`. Les tailles de texte y sont en `px` fixes ; le CV doit rester lisible à ≈ 9–10 pt une fois imprimé (largeur de composition 680–800 px).
- Un redesign de l'**interface** peut être libre ; un redesign des **documents** doit rester sobre, monochrome (couleurs sûres à l'impression), texte réel (pas d'images de texte), structure ATS (titres de rubriques standard, compétences en texte, pas de colonnes ni de tableaux).
- À l'écran seulement : `.gap-star`, `.gap-note`, `[contenteditable]` (survol/focus). Ils sont retirés au moment du PDF.

---

## 8. Contrat entre le HTML et le JavaScript : identifiants

Les `id` ci-dessous sont lus par le script. **Ne pas les renommer sans adapter le code.** Les attributs `data-*` générés dynamiquement (`data-tab`, `data-pin`, `data-edit="type:id:champ"`, `data-create-profil`, `data-branch`, `data-fl-*`, `data-off-*`, etc.) sont aussi des points d'accroche.

**Barre haute, sélecteurs personne/candidature, dialogues, rail, pied de page**

`#ia-dialog`, `#ia-mode-line`, `#ia-skip`, `#ia-save`, `#ia-paste`, `#ia-paste-what`, `#ia-paste-prompt`, `#ia-paste-copy`, `#ia-paste-copied`, `#ia-paste-answer`, `#ia-paste-error`, `#ia-paste-cancel`, `#ia-paste-ok`, `#ia-confirm`, `#ia-confirm-what`, `#ia-confirm-text`, `#ia-confirm-no`, `#ia-confirm-yes`, `#app`, `#btn-theme`, `#theme-icon`, `#theme-label`, `#btn-ia-settings`, `#ia-state`, `#btn-reset`, `#btn-export-cv-lettre`, `#btn-export-all`, `#person-bar`, `#person-select`, `#btn-new-person`, `#btn-rename-person`, `#btn-del-person`, `#dossier-bar`, `#dossier-select`, `#dossier-title`, `#btn-new-dossier`, `#btn-dup-dossier`, `#btn-del-dossier`, `#btn-backup`, `#btn-restore`, `#restore-file`, `#export-cv-lettre-status`, `#export-all-status`, `#rail`, `#dot-base`, `#dot-profils`, `#dot-recherche`, `#dot-offres`, `#dot-freelance`, `#dot-annonce`, `#dot-cv`, `#dot-lettre`, `#dot-annexe`, `#dot-candidatures`, `#dot-entretien`, `#' + exp.id + '`, `#' + exp.id + '`, `#' + exp.id + '`, `#' + exp.id + '`, `#' + f.id + '`, `#' + f.id + '`, `#' + f.id + '`, `#' + f.id + '`, `#' + c.id + '`, `#' + sec.id + '`, `#' + sec.id + '`, `#lettre-body`, `#'+it.id+'`, `#'+it.id+'`, `#'+it.id+'`, `#' + c.id + '`, `#' + c.id + '`, `#' + c.id + '`, `#' + c.id + '`, `#' + c.id + '`, `#' + c.id + '`, `#' + c.id + '`, `#' + c.id + '`, `#' + c.id + '`

**panel-base**

`#panel-base`, `#cv-import-label`, `#cv-import-text`, `#btn-import-cv`, `#cv-import-replace`, `#cv-import-status`, `#btn-recompose`, `#btn-ia-cv`, `#btn-ia-cv-undo`, `#btn-add-exp`, `#ia-cv-status`, `#exp-list`, `#btn-add-formation`, `#formation-list`, `#btn-add-section`, `#section-list`, `#cv-skill-input`, `#btn-add-skill`, `#cv-skill-chips`, `#cv-skill-suggest`, `#btn-add-cert`, `#cert-list`, `#sources-list`, `#base-map-card`, `#map-profil`, `#base-map`, `#base-map-detail`

**panel-profils**

`#panel-profils`, `#profils-suggestions`, `#viser-metier`, `#btn-viser-metier`, `#viser-result`, `#profils-list`

**panel-recherche**

`#panel-recherche`, `#rech-profil`, `#rech-taille`, `#rech-lieu`, `#btn-rech-lieu`, `#rech-lieu-list`, `#rech-rayon`, `#btn-rech-go`, `#rech-status`, `#rech-results`, `#rech-more`

**panel-offres**

`#panel-offres`, `#off-profil`, `#off-q`, `#off-exp-note`, `#off-lieu`, `#btn-off-lieu`, `#off-lieu-list`, `#off-dist`, `#off-contrat`, `#off-depuis`, `#btn-off-go`, `#off-status`, `#off-results`, `#off-more`, `#off-attrib`

**panel-freelance**

`#panel-freelance`, `#fl-services`, `#btn-fl-add`, `#fl-offre`, `#btn-fl-offre-gen`, `#fl-dispo`, `#fl-mode`, `#fl-zone`, `#fl-tjm`, `#fl-showtjm`, `#fl-refs`, `#fl-import`, `#btn-fl-import`, `#fl-import-status`, `#fl-profil`, `#fl-taille`, `#fl-cibles`, `#fl-lieu`, `#btn-fl-lieu`, `#fl-lieu-list`, `#fl-rayon`, `#btn-fl-go`, `#fl-status`, `#fl-results`, `#fl-more`

**panel-annonce**

`#panel-annonce`, `#an-poste`, `#an-entreprise`, `#an-url`, `#btn-fetch-annonce`, `#fetch-status`, `#an-texte`, `#an-keywords`, `#an-emetteur`, `#an-emetteur-why`, `#an-profil-field`, `#an-profil`, `#an-client-field`, `#an-client`, `#an-lieu`, `#an-contrat`, `#an-salaire`

**panel-cv**

`#panel-cv`, `#cv-nom`, `#cv-titre`, `#cv-email`, `#cv-tel`, `#cv-ville`, `#cv-lien`, `#cv-resume`, `#btn-resume-auto`, `#resume-auto-status`, `#cv-langues`, `#prof-atouts-input`, `#btn-add-atout`, `#prof-atouts-chips`, `#prof-photo-thumb-wrap`, `#prof-photo-input`, `#lang-segmented`, `#card-compo`, `#compo-intro`, `#btn-compo-regen`, `#btn-compo-reset`, `#compo-gaps`, `#compo-lists`, `#ats-score`, `#ats-tier`, `#ats-missing`, `#ats-panel`, `#btn-ats-optimize`, `#btn-ats-plan`, `#btn-ats-plan-copy`, `#ats-result`, `#ats-suggestions`, `#btn-print-cv`, `#btn-print-cv-anon`, `#anon-mask-employers`, `#anon-mask-schools`, `#cv-preview`, `#cv-download-status`

**panel-lettre**

`#panel-lettre`, `#l-destinataire`, `#lettre-lang-segmented`, `#tone-segmented`, `#card-affiner`, `#affiner-chips`, `#affiner-input`, `#btn-affiner-add`, `#affiner-remarques`, `#btn-affiner-ia`, `#btn-affiner-go`, `#btn-affiner-undo`, `#affiner-status`, `#card-voix`, `#voix-description`, `#voix-eviter`, `#voix-formule`, `#lettre-texte`, `#question-bank`, `#motiv-list`, `#btn-add-motiv`, `#l-skill-suggest`, `#l-skill-chosen`, `#l-disponibilite`, `#btn-add-archive`, `#archive-list`, `#btn-analyser-patterns`, `#patterns-result`, `#lettre-reference`, `#reference-list`, `#btn-reroll`, `#lettre-edit-note`, `#btn-print-lettre`, `#lettre-preview`, `#lettre-download-status`

**panel-annexe**

`#panel-annexe`, `#cat-grid`, `#annexe-suggest`, `#btn-add-annexe-item`, `#annexe-items-list`, `#btn-print-annexe`, `#annexe-preview`, `#annexe-download-status`

**panel-candidatures**

`#panel-candidatures`, `#btn-save-current-candidature`, `#btn-add-candidature`, `#candidatures-summary`, `#candidatures-list`

**panel-entretien**

`#panel-entretien`, `#btn-generer-questions`, `#btn-voir-corrige`, `#entretien-questions`, `#entretien-corrige`, `#' + exp.id + '`, `#' + exp.id + '`, `#' + exp.id + '`, `#' + exp.id + '`, `#' + f.id + '`, `#' + f.id + '`, `#' + f.id + '`, `#' + f.id + '`, `#' + c.id + '`, `#' + sec.id + '`, `#' + sec.id + '`, `#lettre-body`, `#'+it.id+'`, `#'+it.id+'`, `#'+it.id+'`, `#' + c.id + '`, `#' + c.id + '`, `#' + c.id + '`, `#' + c.id + '`, `#' + c.id + '`, `#' + c.id + '`, `#' + c.id + '`, `#' + c.id + '`, `#' + c.id + '`


---

## 9. Points d'attention UX connus (pour votre refonte)

1. **Densité** : les onglets de réglages (Ma base, CV, Lettre) sont de longues colonnes de cartes. Une navigation interne (sections repliables, étapes) aiderait.
2. **Onze onglets** dans le rail : regrouper (Préparer : base et profils ; Chercher : recherche, offres, freelance ; Candidater : annonce, CV, lettre, annexe ; Suivre : candidatures, entretien) est une piste évidente.
3. **Parcours de démarrage** : aucun assistant « première fois ». Un écran d'accueil guidant import → profil → première candidature manque.
4. **Aperçu et réglages** : sur mobile, l'aperçu se retrouve sous une longue colonne ; prévoir un basculement réglages / aperçu.
5. **Barres Personne et Candidature** : très présentes alors que beaucoup d'utilisateurs n'ont qu'une personne ; elles pourraient se replier.
6. **Composition du CV** : liste de cases dense ; l'idée (cocher / décocher, voir ce qui est automatique) est bonne mais à rendre plus visuelle (par exemple glisser, pastilles « auto / choisi »).
7. **Carte de la base** : première version (SVG radial + liste) ; à rendre plus lisible et plus interactive.
8. **Astérisques de manque** : rouges, discrets ; prévoir un vrai état « à compléter » cliquable qui amène à l'élément concerné.
9. **Messages d'état** : beaucoup de `<p class="hint">` en texte brut ; un système de notifications (succès, avertissement, erreur) harmoniserait.
10. **Dialogues** : `<dialog>` natifs sans style commun (assistant IA, copier-coller, confirmation).
11. **Libellés** : tutoiement partout, vocabulaire « base », « profil », « candidature (dossier) » à clarifier pour un public grand public.

---

## 10. Lancer et tester en local

L'application est statique : n'importe quel serveur de fichiers suffit pour tout sauf `/api/*`.

```bash
python3 -m http.server 8080      # puis http://localhost:8080
```

Pour les routes `/api/*`, utiliser `npx wrangler pages dev .` (Cloudflare) ou déployer sur Cloudflare Pages. Les variables `FT_*` ne sont nécessaires que pour `/api/offres`.

Tests : scripts Playwright ad hoc utilisés pendant le développement (non versionnés) ; le comportement testé couvre : import et fusion de CV, composition, ATS, anonymisation, PDF (≤ 2 pages), lettres (offre, spontanée, offre de service), recherche d'entreprises, offres (simulées), pages légales, absence de requête vers un domaine externe, absence d'erreur console.

---

## 11. Index des fonctions JavaScript

Numéros de ligne omis (ils changent) : chercher le nom dans `index.html`. Regroupées par module, dans l'ordre du fichier.

**SOCLE PARTAGÉ**

`esc`, `stripAccents`, `norm`, `icon`, `uid`, `djb2`, `mulberry32`, `pick`, `shuffle`, `escapeRegex`, `termRegex`, `countTerm`, `debounce`, `scoreAgainstKeywords`, `orderedList`, `fileSafe`, `extractKeywords`, `defaultState`, `makeDossier`, `normDossier`, `normPersonData`, `currentPerson`, `loadPerson`, `currentDossier`, `activateDossier`, `dossierAutoTitle`, `syncCandidatureTracking`, `syncCurrentDossier`, `persist`, `statusFor`, `refreshStatusDots`, `switchTab`, `saveFileEverywhere`, `addCanvasAsPages`, `pdfLibsReady`, `makePdfClone`, `pdfBreaks`, `fitPdfClone`, `buildPdfFromSections`, `wireExportButton`

**THÈME (clair / sombre / auto)**

`getThemeChoice`, `applyTheme`

**MODULE ANNONCE**

`renderKeywordChips`, `guessAnnonceMeta`, `reanalyzeAnnonce`

**MODULE CV (bibliothèque + auto-composition)**

`refreshCVStatus`, `atsTier`, `variantsOf`, `hasTerm`, `ownMaterialText`, `annonceLooksEnglish`, `atsAnalysis`, `computeATS`, `renderATS`, `atsOptimize`, `atsPlanMarkdown`, `renderExpList`, `renderFormList`, `addSkillRaw`, `addSkill`, `yearOfToken`, `isPlausibleYear`, `detectDateInLine`, `stripImportBullet`, `splitTitleLine`, `isLikelySkillLine`, `isFormationBlock`, `cleanTitleLine`, `parseImportedCvLegacy`, `importSectionKey`, `stripInlineMarkdown`, `normalizeImportLines`, `isHeadingLine`, `splitListItems`, `toStructuredText`, `parseEntries`, `parseImportedCv`, `doImportCv`, `renderSkillChips`, `renderSkillSuggestions`, `addAtout`, `renderAtoutsChips`, `renderPhotoThumb`, `structuredToHtml`, `htmlToStructured`, `renderSectionsList`, `initPreviewEditing`, `renderCVPreview`, `cvHtml`, `anonymizedCvElement`, `initCVModule`

**MODULE LETTRE**

`renderQuestionBank`, `addMotivFromQuestion`, `renderMotivList`, `toggleLettreCompetence`, `renderLettreSkillSuggestions`, `renderArchiveList`, `renderReferencePanel`, `analyserPatterns`, `expDetails`, `lowerFirst`, `trimEnd`, `displayTerm`, `humanList`, `cleanLetterText`, `datesFr`, `pickProjects`, `generateLettre`, `generateLettreParagraphs`, `renderLettrePreview`

**MODULE ANNEXE (bibliothèque de contenus)**

`renderAnnexeCategoryGrid`, `currentAnnexeCategory`, `renderAnnexeSuggestions`, `renderAnnexeItemsList`, `renderAnnexePreview`

**MODULE CANDIDATURES (suivi local des annonces postulées)**

`candidatureStatutMeta`, `todayISO`, `renderCandidaturesSummary`, `renderCandidaturesList`, `versionsBlockHtml`, `saveVersion`, `restoreVersion`

**MODULE ENTRETIEN (entraînement local, corrigé heuristique)**

`genererQuestionsEntretien`, `renderEntretienQuestions`, `renderEntretienCorrige`

**RÉCUPÉRATION D'UNE ANNONCE PAR SON LIEN + ANALYSE DE L'ÉMETTEUR**

`analyseEmetteur`, `renderAnalyseCard`, `runEmetteurAnalysis`, `fetchAnnonce`

**MES PROFILS DE RECHERCHE**

`profilBaseSources`, `profilEvidence`, `profilSuggestions`, `profilAccroche`, `profilTodo`, `createProfil`, `profilNiveauPill`, `renderProfils`, `renderProfilsList`, `newDossierWithProfil`, `currentProfil`, `profilKeywords`, `applyProfilToDossier`, `bestProfilForAnnonce`, `renderProfilSelect`, `autoProfilForAnnonce`

**RECHERCHE D'ENTREPRISES (candidatures spontanées)**

`titleCaseName`, `rechProfilOptions`, `rechCurrentProfil`, `rechLoadProfil`, `rechLieuSearch`, `rechOffline`, `rechFetch`, `rechRun`, `renderRechResults`, `startSpontanee`

**FREELANCE : offre de service et démarchage des intermédiaires**

`flState`, `renderFreelance`, `flProfil`, `flRecommended`, `renderFlCibles`, `flFetch`, `flLieuSearch`, `flRun`, `flCibleDe`, `renderFlResults`, `startOffreService`, `generateOffreServiceParagraphs`

**OFFRES D'EMPLOI (France Travail)**

`offProfilOptions`, `offCurrentProfil`, `offLoadProfil`, `offLieuSearch`, `offRun`, `offMatch`, `renderOffResults`, `startFromOffre`

**MA BASE : fusion de CV, catégories, certifications, carte**

`skillCat`, `bulletWords`, `similarText`, `mergeLines`, `startYear`, `addSource`, `findSameExperience`, `mergeImportIntoBase`, `renderCertList`, `renderSources`, `onBaseChanged`, `leafDomains`, `baseTree`, `renderBaseMap`

**COMPOSITION DU CV : ce que la base fournit, trié et organisé selon le profil et l'annonce**

`dateRank`, `compoKeywords`, `compoDecision`, `composeCv`, `recomposerCV`, `compoText`, `cvFullText`, `computeGaps`, `gapStar`, `renderComposition`, `profilCvElement`, `renderProfilCvBox`

**CANDIDATURES MULTIPLES : barre, bascule, sauvegarde locale**

`renderDossierBar`, `syncDossierUI`, `switchDossier`, `personLabel`, `renderPersonBar`, `syncPersonUI`, `switchPerson`

**CONTRÔLE DE STYLE DE LA LETTRE (heuristique locale)**

`styleWords`, `styleSentences`, `coefVar`, `styleCount`, `styleReport`, `renderStyleCheck`

**ASSISTANT IA (facultatif) + AFFINAGE DE LA LETTRE + VOIX**

`iaPrefs`, `iaPrefSave`, `iaOn`, `refreshIaState`, `scrubForAI`, `extractJson`, `iaAsk`, `iaConfirm`, `relevantExperiences`, `annonceForAI`, `iaReformulerCV`, `refreshAffinerUI`, `addRemarque`, `lettreCurrentParagraphs`, `renderVoixCard`

---

## 12. Dette technique à connaître

- Fichier unique de ≈ 5 800 lignes : le découper (CSS, modules JS) facilitera le travail de design sans toucher à la logique.
- HTML généré par concaténation de chaînes dans les fonctions `render…` : à migrer vers des gabarits (ou un composant) si un framework est introduit.
- Quelques noms historiques (`atelier-candidature-v2`, `annexe`, `dossier`) ; la migration d'anciennes données est gérée par `normPersonData`.
- Les listes de mots (domaines, catégories de compétences, détection d'émetteur) sont en dur dans le script ; elles gagneraient à être externalisées en JSON.
