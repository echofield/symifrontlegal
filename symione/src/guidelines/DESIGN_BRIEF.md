# LEX-ENGINE — Brief Design & Contraintes Techniques

## Philosophie

> "Moins un site web, plus un panneau de contrôle pour la pensée."

LEX-ENGINE est un **système d'intelligence juridique** conçu comme un instrument de précision. L'esthétique suit les principes du design suisse, du minimalisme industriel (Braun, Muji) et des interfaces de mission control (NASA). Chaque élément doit être **calculé, pas décoratif**.

---

## Routes & Structure

### Pages principales
- **/** — Accueil (hero + modules)
- **/contracts** — Catalogue de modèles (liste recherchable)
- **/contracts/[id]** — Éditeur de contrat avec formulaire dynamique
- **/conseiller** — Module conseil juridique + recherche d'avocats

### Navigation
Pas de navigation fixe classique. Header minimaliste avec:
- Logo système (LEX-ENGINE)
- Indicateurs de statut
- Sélecteur de thème (WHT / OFW / NGT)
- Indicateur de session

---

## Catégories de Contrats (Slugs Exacts)

Ces slugs sont utilisés par l'API backend et **ne doivent pas être modifiés** :

- `business` → Entreprise
- `employment` → Emploi
- `property` → Immobilier
- `freelance` → Freelance
- `personal` → Personnel
- `closure` → Clôture
- `custom` → Personnalisé

---

## Design Tokens (Variables CSS à Respecter)

### Couleurs (:root)
```css
--background
--foreground
--card, --card-foreground
--border
--muted, --muted-foreground
--accent, --accent-foreground, --accent-glow
--primary, --primary-foreground
--secondary, --secondary-foreground
--destructive, --destructive-foreground
--input-background
--system-active, --system-standby
```

### Thèmes disponibles
- **White** (défaut) : fond blanc #ffffff, accent bleu royal #1e3a8a
- **Off-white** : fond #fafafa, accent bleu royal
- **Night** : fond noir #0a0a0a, accent or mat #d4af37

### Typography
- **Sans-serif** : Inter (titres, corps)
- **Monospace** : IBM Plex Mono (données, codes, métadonnées, labels)

**Poids** :
- Titres : 600-700
- Corps : 400
- Labels/codes : 300-400 (mono)

**Tailles** :
- Hero : 3.5-7rem (responsive)
- Titres : 1.5-3rem
- Corps : 0.875-1rem
- Labels/codes : 0.625-0.75rem (uppercase, tracking élevé)

### Espacement
- Grille de base : 4px
- Espacements internes : 6px, 12px, 24px, 48px
- Max-width conteneur : 1600px
- Padding mobile : 6-12px
- Padding desktop : 12-16px

### Bordures & Radius
- Radius : 0.125rem (2px) — ultra minimal
- Bordures : 1px, couleur `--border`
- Focus : 1px underline sur `--ring` (bleu ou or selon thème)

---

## Motion & Animation (Servo Precision)

### Principes
- **Pas d'élasticité** : linear easing uniquement
- **Durée courte** : 200-300ms maximum
- **Offset minimal** : translateY(6px) pour fade-in
- **Pas de bounce** : les éléments se déplacent comme des servomoteurs, pas des balles

### États
- **Loading** : spinner linéaire (Loader2 de lucide-react)
- **Success** : fade-in 200ms
- **Error** : toast glissant depuis le bas-droite
- **Hover** : border-color change, pas de shadow sauf glow accent

### Keyframes existantes
```css
@keyframes precision-fade-in
@keyframes pulse-indicator
@keyframes precision-wipe
```

---

## Composants & Classes Utilitaires

### Classes existantes à réutiliser
- `focus-precision` : focus avec underline 1px
- `swiss-grid` : grille 12 colonnes (4 sur mobile)
- `tracking-tight`, `tracking-normal`, `tracking-wide`

### Breakpoints
- Mobile : 375px
- Tablet : 768px
- Desktop : 1024px
- Large : 1280px

### Grilles responsive
- `grid-2` : 1 colonne mobile, 2 colonnes ≥768px
- `grid-5-7` : stack mobile, 5/7 (liste/carte) ≥1024px

---

## Module Conseiller (Google Maps)

### Contraintes fonctionnelles
- **Hauteur carte** : min 420px, fixe à 520px
- Zone formulaire (gauche) : question juridique + recherche avocat
- Zone carte (droite) : Google Maps + résultats
- **Sticky** : carte reste visible au scroll
- **API Key** : `VITE_GOOGLE_MAPS_API_KEY` (env variable)

### Styles Google Maps
```javascript
styles: [
  { featureType: 'all', elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#e5e5e5' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] }
]
```

### CTA obligatoires
- "Demander" (envoyer la question)
- "Trouver un avocat" (recherche sur carte)

---

## Éditeur de Contrat (Dynamic Form)

### Comportement
1. Fetch template depuis `/api/contracts/[id]`
2. Générer formulaire dynamique depuis `template.inputs[]`
3. Valider les champs `required` avant génération
4. POST vers `/api/generate` avec `{ contract_id, user_inputs }`
5. Afficher output avec `whitespace: pre-wrap`

### CTA obligatoires
- "Générer" (génération contrat)
- "Télécharger le PDF" (export)
- "Analyser" (review compliance — optionnel)

### États
- Standby : preview vide
- Generating : spinner + disable button
- Ready : afficher texte généré
- Rate-limited : countdown "Réessayer dans Xs"

---

## États & Accessibilité

### États UI à prévoir
- Loading (spinner)
- Empty state (message monospace)
- Error (toast destructive)
- Disabled (opacity 50%)
- Focus (clavier : 1px underline)

### Accessibilité
- Contraste AA minimum
- Hit areas ≥ 40px hauteur
- Labels ARIA pour inputs
- Tooltips avec `aria-describedby`
- Focus visible (pas de `outline: none` sans remplacement)

---

## Variables d'Environnement

### Production
```
API_BASE_URL (backend proxy)
VITE_GOOGLE_MAPS_API_KEY (carte avocats)
```

### Optionnel (Supabase)
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

---

## Livrables Figma Attendus

### Design tokens
- Palette couleurs mappée aux variables CSS
- Échelle typographique (tailles, poids, line-height)
- Espacements et radius
- Ombres et glows (accent uniquement)

### Composants avec variantes
- Boutons (primary, secondary, destructive, disabled)
- Inputs (text, textarea, select, date) + focus state
- Cards (border, hover, active)
- Chips (category badges)
- Toast notifications (success, error, info)
- Loading states (spinner, skeleton)

### Pages annotées
- Layout grids (12 colonnes)
- Responsive contraintes (Auto-layout)
- Redlines (marges, paddings, tailles)
- États interactifs (hover, focus, disabled)

### Spécifications
- Export SVG pour icônes (lucide-react recommandé)
- Pas d'images bitmap pour UI
- Nomenclature sans espaces (kebab-case)

---

## Ce Qu'il Ne Faut Pas Casser

### Invariants techniques
- Slugs des catégories (`business`, `employment`, etc.)
- Routes API (`/api/*`)
- Structure des tokens CSS (noms de variables)
- Présence des CTA mentionnés
- Hauteur minimale carte Google Maps (420px)

### Invariants esthétiques
- Motion linéaire (pas d'elastic/bounce)
- Typographie monospace pour données
- Bordures ultra-fines (1px)
- Radius minimal (2px)
- Pas de dégradés saturés
- Pas d'ombres décoratives (sauf glow accent)

---

## Workflow d'Implémentation

1. Designer envoie maquettes Figma + specs
2. Dev adapte en priorisant les tokens existants
3. Classes utilitaires étendues si besoin
4. Pas de refonte CSS globale (update tokens uniquement)
5. Tests responsive sur tous breakpoints

---

## Références Visuelles

### Inspiration
- **Braun** : minimalisme fonctionnel
- **Muji** : réduction visuelle
- **NASA Mission Control** : interfaces de précision
- **Neue Haas Grotesk** : typographie Swiss
- **IDEO / Pentagram** : grilles structurées

### Mots-clés
Swiss Design, Helvetica Neue, Inter, IBM Plex Mono, Precision instrumentation, Legal minimalism, Intelligent systems, Timeless modern, Control panel interface, Calculated motion

---

## Contact & Repo

- **Repo** : [symifrontlegal](https://github.com/echofield/symifrontlegal.git)
- **Stack** : React, Tailwind v4, Motion (Framer Motion), Vite
- **Backend** : API proxy via `API_BASE_URL`

Toute question ou clarification : demander avant de casser les invariants. 🎯
