# SYMIONE — Cahier des Charges Design & Technique

## Philosophie du Système

> "Moins un site web, plus un panneau de contrôle pour la pensée juridique."

SYMIONE (anciennement lex-engine) est un **système d'intelligence juridique** conçu comme un instrument de précision. L'esthétique suit les principes du design suisse, du minimalisme industriel (Braun, Muji) et des interfaces de contrôle de mission (NASA). Chaque élément doit être **calculé, pas décoratif**.

---

## Identité Visuelle

### Branding
- **Nom principal** : SYMIONE (typo Inter, 700, 1.125rem)
- **Sous-titre** : lex-engine (typo IBM Plex Mono, 300, 0.5rem, opacity 50%, tracking élevé)
- **Positionnement** : lex-engine s'affiche discrètement sous SYMIONE dans le header

### Logo système
```
● SYMIONE
  lex-engine
```

---

## Routes & Structure (Invariants)

### Pages principales
- **/** — Accueil (hero + surface de contrôle)
- **/contracts** — Catalogue de modèles (liste recherchable)
- **/contracts/[id]** — Éditeur de contrat avec formulaire dynamique
- **/conseiller** — Module conseil juridique + recherche d'avocats

### API Backend (via rewrites)
Tous les appels API utilisent `/api/*` proxifié vers `API_BASE_URL` :

- `GET /api/contracts` — Liste des templates
- `GET /api/contracts/{id}` — Détail d'un template
- `POST /api/generate` — Génération de contrat
- `POST /api/review` — Analyse de conformité
- `POST /api/explain` — Explication de clauses
- `POST /api/advisor` — Conseil juridique IA
- `GET /api/lawyers/search?near={location}` — Recherche d'avocats
- `POST /api/export?format=pdf|docx` — Export de document

---

## Catégories de Contrats (Slugs Exacts — Ne Pas Modifier)

Ces slugs sont utilisés par l'API backend :

| Slug | Label français |
|------|----------------|
| `business` | Entreprise |
| `employment` | Emploi |
| `property` | Immobilier |
| `freelance` | Freelance |
| `personal` | Personnel |
| `closure` | Clôture |
| `custom` | Personnalisé |

---

## Design Tokens (Variables CSS — Ne Pas Renommer)

### Couleurs (:root)
```css
/* Couleurs principales */
--background, --foreground
--card, --card-foreground
--border
--muted, --muted-foreground

/* Accents système */
--accent, --accent-foreground, --accent-glow
--primary, --primary-foreground
--secondary, --secondary-foreground
--destructive, --destructive-foreground

/* États système */
--system-active    /* #1e3a8a (bleu) en mode clair, #d4af37 (or) en mode nuit */
--system-standby   /* #737373 (gris) */

/* Inputs */
--input-background
--ring             /* Couleur focus (1px underline) */
```

### Thèmes disponibles
- **White** (défaut) : fond #ffffff, accent bleu royal #1e3a8a
- **Off-white** : fond #fafafa, accent bleu royal
- **Night** : fond noir #0a0a0a, accent or mat #d4af37

### Typography
- **Sans-serif** : Inter (titres, corps, UI)
- **Monospace** : IBM Plex Mono (données, codes, métadonnées, labels système)

**Hiérarchie** :
| Élément | Taille | Poids | Usage |
|---------|--------|-------|-------|
| Hero h1 | 3.5-7rem | 700 | Titres principaux |
| h2 | 2-2.5rem | 600 | Titres de section |
| h3 | 1.125-1.5rem | 600 | Titres de carte |
| Corps | 0.875-1rem | 400 | Texte standard |
| Labels | 0.625-0.75rem | 400-500 | Codes système (uppercase, mono) |
| Micro | 0.5-0.625rem | 300 | Métadonnées (mono) |

### Espacement (Grille de base : 4px)
- Espacements internes : 6px, 12px, 24px, 48px
- Max-width conteneur : 1600px
- Padding mobile : 6-12px
- Padding desktop : 12-16px

### Bordures & Radius
- Radius : 0.125rem (2px) — ultra minimal
- Bordures : 1px, couleur `--border`
- Focus : 1px underline sur `--ring` (pas de shadow)

---

## Motion & Animation (Servo Precision)

### Principes absolus
✅ **Linear easing uniquement** (pas d'elastic, pas de bounce)  
✅ **Durée courte** : 200-300ms maximum  
✅ **Offset minimal** : translateY(6px) pour fade-in  
❌ **Interdit** : bounce, elastic, shadows décoratives (sauf glow accent)

### États & Transitions
| État | Motion | Durée |
|------|--------|-------|
| Fade-in | opacity 0→1 + translateY(6px→0) | 200ms linear |
| Hover | border-color change | 200ms |
| Loading | spinner linéaire (Loader2) | — |
| Focus | underline 1px glow | instant |
| Toast | slide from bottom-right | 200ms |

### Keyframes existantes
```css
@keyframes precision-fade-in
@keyframes pulse-indicator
@keyframes precision-wipe
```

---

## Module Conseiller (Google Maps)

### Contraintes fonctionnelles
- **Hauteur carte** : min 420px, fixe à 520px
- Layout : formulaire (gauche 5 cols) + carte (droite 7 cols) sur desktop
- **Sticky** : carte reste visible au scroll
- **API Key** : `VITE_GOOGLE_MAPS_API_KEY` (variable d'environnement)

### Flow utilisateur
1. User pose une question dans le formulaire
2. POST `/api/advisor` avec { message, context }
3. API répond avec `{ response, practice_area? }`
4. Si `practice_area` détecté → auto-trigger recherche avocats
5. GET `/api/lawyers/search?near={location}&q={practice}`
6. Afficher résultats sur carte + liste
7. CTA "Contacter" ou "Démarrer un contrat"

### Styles Google Maps (minimalistes)
```javascript
styles: [
  { featureType: 'all', elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#e5e5e5' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] }
]
```

### CTA obligatoires
- ✅ "Demander" (envoyer la question)
- ✅ "Trouver un avocat" ou "Chercher" (recherche sur carte)
- ✅ "Contacter" (action sur résultat avocat)

---

## Éditeur de Contrat (Dynamic Form)

### Comportement
1. Fetch template depuis `GET /api/contracts/{id}`
2. Générer formulaire dynamique depuis `template.inputs[]`
3. Valider les champs `required` avant génération
4. POST `/api/generate` avec `{ contract_id, user_inputs }`
5. Afficher output avec `whitespace: pre-wrap`

### CTA obligatoires
- ✅ "Générer" (génération contrat)
- ✅ "Télécharger le PDF" (export PDF)
- ⚙️ "Analyser" (review compliance — optionnel)

### États
| État | UI | Feedback |
|------|----|----|
| Standby | Preview vide | "Remplissez les paramètres..." |
| Generating | Spinner + disable | "Génération en cours" |
| Ready | Texte généré affiché | Status "PRÊT" |
| Rate-limited | Countdown | "Réessayer dans Xs" |

---

## Variables d'Environnement

### Production (obligatoires)
```
API_BASE_URL=https://YOUR-BACKEND.vercel.app
VITE_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_API_KEY
```

### Optionnel (authentification future)
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

---

## Livrables Figma Attendus

### 1. Design tokens
- Palette couleurs mappée aux variables CSS (`:root`)
- Échelle typographique (tailles, poids, line-height, tracking)
- Espacements (4px grid) et radius (2px)
- Glows (accent uniquement, pas d'ombres décoratives)

### 2. Composants avec variantes
| Composant | Variantes à prévoir |
|-----------|---------------------|
| Boutons | primary, secondary, destructive, disabled |
| Inputs | text, textarea, select, date + focus state |
| Cards | border, hover, active |
| Chips | category badges (7 catégories) |
| Toast | success, error, info |
| Loading | spinner linéaire (pas de skeleton) |

### 3. Pages annotées
- Layout grids (12 colonnes desktop, 4 mobile)
- Responsive contraintes (Auto-layout Figma)
- Redlines (marges, paddings, tailles exactes)
- États interactifs (hover, focus, disabled, loading)

### 4. Spécifications export
- ✅ SVG pour icônes (lucide-react recommandé)
- ❌ Pas d'images bitmap pour UI
- ✅ Nomenclature kebab-case (sans espaces)

---

## Invariants Techniques (Ne Pas Casser)

### Backend
- ✅ Slugs des catégories (`business`, `employment`, etc.)
- ✅ Routes API (`/api/*`)
- ✅ Structure des endpoints

### Frontend
- ✅ Noms des variables CSS (`:root`)
- ✅ Présence des CTA mentionnés
- ✅ Hauteur minimale carte Google Maps (420px)
- ✅ Classes utilitaires existantes (`focus-precision`, `swiss-grid`)

### Esthétique
- ✅ Motion linéaire (pas d'elastic/bounce)
- ✅ Typographie monospace pour données système
- ✅ Bordures ultra-fines (1px)
- ✅ Radius minimal (2px)
- ❌ Pas de dégradés saturés
- ❌ Pas d'ombres décoratives (sauf glow accent)

---

## Références Visuelles

### Inspiration
- **Braun** : minimalisme fonctionnel, grilles structurées
- **Muji** : réduction visuelle, clarté
- **NASA Mission Control** : interfaces de précision, data-driven
- **Neue Haas Grotesk / Helvetica** : typographie Swiss
- **IBM Design Language** : systems thinking
- **IDEO / Pentagram** : grilles modulaires

### Mots-clés
Swiss Design, Helvetica Neue, Inter, IBM Plex Mono, Precision instrumentation, Legal minimalism, Intelligent systems, Control panel interface, Calculated motion, Timeless modern, Braun aesthetics, NASA interface

---

## Workflow d'Implémentation

1. ✅ Designer envoie maquettes Figma + specs détaillées
2. ✅ Dev adapte en priorisant les tokens existants
3. ✅ Classes utilitaires étendues si besoin (pas de refonte globale)
4. ✅ Tests responsive sur tous breakpoints (375, 768, 1024, 1280)
5. ✅ Validation accessibilité (contraste AA, focus visible, ARIA)

---

## Contact & Repo

- **Nom produit** : SYMIONE (lex-engine)
- **Repo** : [symifrontlegal](https://github.com/echofield/symifrontlegal.git)
- **Stack** : React, Tailwind v4, Motion (Framer Motion), Vite
- **Backend** : API proxy via `API_BASE_URL` (rewrites)

Toute question ou clarification : demander **avant** de casser les invariants. 🎯

---

## Notes Finales

Ce système est un **instrument de précision juridique**, pas un site web classique. Chaque pixel, chaque motion, chaque token CSS doit servir la fonction, pas la décoration. Le design doit respirer la **confiance, l'intelligence et la précision** — comme un tableau de bord BMW Série 7 ou une montre Braun.

**"Calculated, not decorative."**
