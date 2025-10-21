# FEEDBACK BOND + MODIFICATIONS FLOW QUESTIONS

## ✅ CE QUI A ÉTÉ FAIT (À CONSERVER)

### 1. BondCreateView.tsx - Transformation de la grille de templates
**STATUS : PARFAIT ✓**

La grille 3 colonnes a été transformée en **liste verticale élégante** (Step 0).

```tsx
// AVANT (grille 3 colonnes) ❌
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// APRÈS (liste verticale) ✓
<div className="space-y-3">
  {templates.map((template) => (
    <button className="w-full border p-6 text-left">
      <div className="flex items-start gap-6">
        {/* Icon */}
        <div className="text-[2rem]">{template.icon}</div>
        
        {/* Content avec metadata */}
        <div className="flex-1">
          <h3>{template.title}</h3>
          <p>{template.description}</p>
          
          {/* Métadonnées 👥 📋 */}
          <div className="flex items-center gap-4">
            <span>👥 Rôles: Client, Prestataire</span>
            <span>📋 Jalons: 3-5 étapes</span>
          </div>
        </div>
        
        {/* Checkbox de sélection à droite */}
        <div className="w-6 h-6 border" />
      </div>
    </button>
  ))}
</div>
```

**Résultat** : Design aligné avec ContractsListView, hiérarchie claire, respiration visuelle.

---

### 2. BondPricingModal.tsx - Création de la modal
**STATUS : PARFAIT ✓**

Modal de pricing créée avec :
- Prix "119 € + 3%" parfaitement visible (pas de transparence)
- Bouton fermer positionné à `-right-12` (juste à côté de la modal, pas à l'extrême droite)
- Features avec checkmarks carrés (design Braun)
- Sections Freelance/Partenariat

```tsx
{/* Close button - positioned to the right of the modal */}
<button
  onClick={onClose}
  className="absolute -right-12 top-0 w-10 h-10 border border-border"
>
  <X className="w-4 h-4" />
</button>
```

**Résultat** : Modal professionnelle, bouton fermer bien placé, design système cohérent.

---

### 3. BondDashboardView.tsx - Intégration de la modal
**STATUS : PARFAIT ✓**

```tsx
import { BondPricingModal } from "./BondPricingModal";

export function BondDashboardView({ onNavigate }: BondDashboardViewProps) {
  const [showPricingModal, setShowPricingModal] = useState(false);

  return (
    <>
      <BondPricingModal 
        isOpen={showPricingModal} 
        onClose={() => setShowPricingModal(false)}
        onCreateContract={() => {
          setShowPricingModal(false);
          onNavigate('bond-create');
        }}
      />
      {/* ... rest */}
    </>
  );
}
```

**Résultat** : Modal accessible, fermeture propre, flow intégré.

---

---

## 🎯 CE QUI DOIT ÊTRE MODIFIÉ

### ⚠️ PROBLÈME : Flow des questions (Step 2) utilise des boutons radio

**Actuellement dans BondCreateView.tsx** (Step 2) :
```tsx
{/* Options en grille avec boutons radio stylisés */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
  {question.options.map((option) => (
    <button className="px-6 py-4 border-2">
      <div className="flex items-center gap-3">
        <div className="w-4 h-4 rounded-full border-2" /> {/* Radio visuel */}
        <span>{option}</span>
      </div>
    </button>
  ))}
</div>
```

**❌ PROBLÈME** : Design trop lourd, pas assez minimaliste, ne correspond pas à l'intention initiale.

---

## ✨ SOLUTION : Utiliser des SELECTS minimalistes (comme l'intention page 2)

### RÉFÉRENCE VISUELLE (ton intention) :
```
┌─────────────────────────────────────────────┐
│ Type de client                              │
│                                             │
│ Sélectionnez une option...            ▼    │
│ ┌─────────────────────────────────────┐    │
│ │ Sélectionnez une option...          │    │
│ │ Particulier                         │    │
│ │ Professionnel                       │    │
│ │ Copropriété                         │    │
│ │ Collectivité                        │    │
│ └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

### CODE À IMPLÉMENTER :

#### 1. Importer le composant Select de shadcn/ui

```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
```

#### 2. Modifier le rendu des questions (Step 2)

**REMPLACER** :
```tsx
{question.type === 'choice' && question.options && (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
    {question.options.map((option) => (
      <button className="px-6 py-4 border-2">
        {/* ... */}
      </button>
    ))}
  </div>
)}
```

**PAR** :
```tsx
{question.type === 'choice' && question.options && (
  <div className="space-y-2">
    <Select
      value={answer?.value || ''}
      onValueChange={(value) => handleAnswer(question.id, value)}
    >
      <SelectTrigger 
        className="w-full border border-border bg-background hover:border-accent/50 transition-colors duration-200 h-12 px-4"
        style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
      >
        <SelectValue 
          placeholder="Sélectionnez une option..." 
          className="text-[0.875rem]"
        />
      </SelectTrigger>
      <SelectContent 
        className="border border-border bg-background"
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        {question.options.map((option) => (
          <SelectItem 
            key={option} 
            value={option}
            className="text-[0.875rem] py-3 px-4 hover:bg-accent/5 cursor-pointer transition-colors duration-200"
            style={{ fontWeight: 400 }}
          >
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
)}
```

---

### STYLE DU SELECT (important pour cohérence SYMIONE)

Le Select shadcn doit être **personnalisé** pour correspondre au design Braun/NASA :

#### Trigger (bouton principal)
```tsx
<SelectTrigger className="w-full border border-border bg-background hover:border-accent/50 transition-colors duration-200 h-12 px-4">
```

**Propriétés clés** :
- `border border-border` : bordure minimale 0.5px
- `bg-background` : fond blanc (pas de gris)
- `hover:border-accent/50` : bordure bleue au hover
- `h-12` : hauteur fixe pour cohérence
- `px-4` : padding horizontal
- `transition-colors duration-200` : animation servo (200ms linear)

#### Content (dropdown menu)
```tsx
<SelectContent className="border border-border bg-background">
```

**Propriétés clés** :
- `border border-border` : bordure minimale
- `bg-background` : fond blanc pur
- **PAS de rounded** : angles droits (design Braun)
- **PAS de shadow** : design plat

#### Item (option)
```tsx
<SelectItem className="text-[0.875rem] py-3 px-4 hover:bg-accent/5 cursor-pointer transition-colors duration-200">
```

**Propriétés clés** :
- `text-[0.875rem]` : taille de texte cohérente
- `py-3 px-4` : padding pour respiration
- `hover:bg-accent/5` : fond bleu très léger au hover (pas de bleu saturé)
- `transition-colors duration-200` : animation servo

---

### EXEMPLE COMPLET D'UNE QUESTION AVEC SELECT

```tsx
<div className="border border-border p-8 lg:p-10 mb-6">
  {/* Question */}
  <div className="mb-6">
    <h3 className="text-[1.125rem] mb-4 tracking-[-0.005em]" style={{ fontWeight: 600 }}>
      {question.question}
    </h3>
    
    {/* Info box contexte légal (si existe) */}
    {question.legalContext && (
      <div className="bg-accent/5 border border-accent/20 p-4 flex items-start gap-3 mb-6">
        <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg className="w-3 h-3 text-accent" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM8 11a.75.75 0 0 1-.75-.75v-3.5a.75.75 0 0 1 1.5 0v3.5A.75.75 0 0 1 8 11zm0-6a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5z"/>
          </svg>
        </div>
        <div className="flex-1">
          <div className="text-[0.625rem] uppercase tracking-[0.1em] text-accent mb-1" 
               style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
            Implication légale
          </div>
          <p className="text-[0.75rem] text-muted-foreground" 
             style={{ fontFamily: 'var(--font-mono)', fontWeight: 300, lineHeight: 1.5 }}>
            {question.legalContext}
          </p>
        </div>
      </div>
    )}
  </div>
  
  {/* Label du champ */}
  <label className="text-[0.625rem] uppercase tracking-[0.1em] text-muted-foreground block mb-2" 
         style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
    Votre réponse
  </label>
  
  {/* SELECT MINIMALISTE */}
  {question.type === 'choice' && question.options && (
    <Select
      value={answer?.value || ''}
      onValueChange={(value) => handleAnswer(question.id, value)}
    >
      <SelectTrigger 
        className="w-full border border-border bg-background hover:border-accent/50 focus:border-accent focus:ring-0 focus:ring-offset-0 transition-colors duration-200 h-12 px-4"
        style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
      >
        <SelectValue 
          placeholder="Sélectionnez une option..." 
          className="text-[0.875rem] text-muted-foreground"
        />
      </SelectTrigger>
      <SelectContent 
        className="border border-border bg-background max-h-[300px] overflow-y-auto"
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        {question.options.map((option) => (
          <SelectItem 
            key={option} 
            value={option}
            className="text-[0.875rem] py-3 px-4 hover:bg-accent/5 focus:bg-accent/10 cursor-pointer transition-colors duration-200 border-b border-border last:border-0"
            style={{ fontWeight: 400 }}
          >
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )}
  
  {/* Input texte (si question.type === 'input') */}
  {question.type === 'input' && (
    <Input
      value={answer?.value || ''}
      onChange={(e) => handleAnswer(question.id, e.target.value)}
      placeholder="Votre réponse..."
      className="border-border focus-visible:ring-accent text-[0.9375rem] h-12"
      style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
    />
  )}
</div>
```

---

## 📋 QUESTIONS ENRICHIES AVEC CONTEXTE LÉGAL

**Modifier les données de templates** pour inclure `legalContext` :

```tsx
const templates: Template[] = [
  {
    id: 'service',
    title: 'Prestation de service',
    description: 'Pour missions de conseil, développement, design, marketing...',
    icon: '💼',
    questions: [
      {
        id: 'client-type',
        question: 'Quel est le type de client ?',
        type: 'choice',
        options: ['Particulier', 'Professionnel', 'Copropriété', 'Collectivité'],
        legalContext: 'Détermine le droit applicable (B2C ou B2B) et les obligations légales (garantie consommateur, droit de rétractation, etc.)'
      },
      {
        id: 'payment-mode',
        question: 'Comment souhaitez-vous structurer le paiement ?',
        type: 'choice',
        options: ['Paiement unique', 'Paiement par jalons', 'Paiement mensuel'],
        legalContext: 'Le paiement par jalons sécurise les deux parties et facilite le suivi de l\'avancement du projet.'
      },
      {
        id: 'confidentiality',
        question: 'Souhaitez-vous inclure une clause de confidentialité ?',
        type: 'choice',
        options: ['Oui, confidentialité stricte', 'Oui, confidentialité standard', 'Non'],
        legalContext: 'Protège les informations sensibles échangées pendant la collaboration (données clients, processus métier, etc.)'
      },
      {
        id: 'ip-rights',
        question: 'Droits de propriété intellectuelle ?',
        type: 'choice',
        options: ['Transfert complet au client', 'Transfert partiel', 'Licence d\'exploitation'],
        legalContext: 'Définit qui possède les droits sur les créations produites (code, designs, contenus, etc.)'
      },
      {
        id: 'deadline',
        question: 'Quel est le délai prévu pour la mission ?',
        type: 'choice',
        options: ['Moins de 1 mois', '1-3 mois', '3-6 mois', 'Plus de 6 mois']
      }
    ]
  },
  {
    id: 'works',
    title: 'Travaux',
    description: 'Construction, rénovation, aménagements...',
    icon: '🧱',
    questions: [
      {
        id: 'project-type',
        question: 'Type de projet ?',
        type: 'choice',
        options: ['Construction neuve', 'Rénovation', 'Extension', 'Aménagement'],
        legalContext: 'Détermine les normes applicables et les garanties légales (décennale, biennale, etc.)'
      },
      {
        id: 'insurance',
        question: 'Une assurance décennale est-elle requise ?',
        type: 'choice',
        options: ['Oui, obligatoire', 'Non nécessaire'],
        legalContext: 'Obligatoire pour les travaux de construction qui touchent à la solidité de l\'ouvrage.'
      },
      {
        id: 'payment-schedule',
        question: 'Modalités de paiement souhaitées ?',
        type: 'choice',
        options: ['Acompte + Solde', 'Échelonné par phase', 'Mensuel'],
        legalContext: 'L\'acompte est limité à 30% du montant total pour les particuliers (loi Scrivener).'
      },
      {
        id: 'duration',
        question: 'Durée estimée des travaux ?',
        type: 'choice',
        options: ['Moins de 1 mois', '1-3 mois', '3-6 mois', 'Plus de 6 mois']
      }
    ]
  },
  {
    id: 'creative',
    title: 'Création artistique',
    description: 'Design, illustration, musique, vidéo...',
    icon: '🎨',
    questions: [
      {
        id: 'creation-type',
        question: 'Type de création ?',
        type: 'choice',
        options: ['Design graphique', 'Illustration', 'Vidéo', 'Musique', 'Photo', 'Autre'],
        legalContext: 'Chaque type de création a des spécificités en termes de droits d\'auteur et d\'exploitation.'
      },
      {
        id: 'rights',
        question: 'Cession des droits d\'auteur ?',
        type: 'choice',
        options: ['Cession totale', 'Cession partielle', 'Licence d\'exploitation exclusive', 'Licence non-exclusive'],
        legalContext: 'La cession de droits d\'auteur doit être expressément mentionnée et détaillée (support, durée, territoire).'
      },
      {
        id: 'revisions',
        question: 'Nombre de révisions incluses ?',
        type: 'choice',
        options: ['1-2 révisions', '3-5 révisions', 'Illimité (dans la limite du raisonnable)'],
        legalContext: 'Définit le nombre d\'allers-retours inclus dans le tarif initial. Au-delà, facturation supplémentaire.'
      },
      {
        id: 'usage',
        question: 'Usage prévu de la création ?',
        type: 'choice',
        options: ['Usage commercial', 'Usage personnel', 'Usage interne entreprise', 'Usage web uniquement'],
        legalContext: 'L\'étendue des droits cédés dépend de l\'usage prévu (commercial = tarif plus élevé).'
      }
    ]
  },
  {
    id: 'challenge',
    title: 'Pacte entre amis',
    description: 'Défis, paris, engagements personnels...',
    icon: '🎮',
    questions: [
      {
        id: 'challenge-type',
        question: 'Type de défi ?',
        type: 'choice',
        options: ['Défi sportif', 'Objectif personnel', 'Pari amical', 'Engagement mutuel']
      },
      {
        id: 'stake-type',
        question: 'Type d\'enjeu ?',
        type: 'choice',
        options: ['Financier', 'Symbolique', 'Service rendu', 'Don à une association']
      },
      {
        id: 'duration',
        question: 'Durée du défi ?',
        type: 'choice',
        options: ['1 semaine', '1 mois', '3 mois', '6 mois', '1 an']
      },
      {
        id: 'proof',
        question: 'Comment valider l\'accomplissement du défi ?',
        type: 'choice',
        options: ['Photo/Vidéo', 'Présence d\'un témoin', 'Auto-déclaration', 'Données trackées (app sport, etc.)']
      }
    ]
  },
  {
    id: 'custom',
    title: 'IA libre',
    description: 'Décrivez entièrement votre besoin, l\'IA s\'adapte',
    icon: '🧠',
    questions: [
      {
        id: 'custom-description',
        question: 'Décrivez votre besoin en détail',
        type: 'input'
      },
      {
        id: 'complexity',
        question: 'Complexité estimée du projet ?',
        type: 'choice',
        options: ['Simple', 'Moyen', 'Complexe']
      },
      {
        id: 'parties-count',
        question: 'Combien de parties impliquées ?',
        type: 'choice',
        options: ['2 parties', '3 parties', '4+ parties']
      },
      {
        id: 'special-clauses',
        question: 'Clauses particulières à prévoir ?',
        type: 'input'
      }
    ]
  }
];
```

---

## 🎨 STRUCTURE FINALE DU STEP 2 (QUESTIONS)

```tsx
{/* Step 2: Smart Q&A */}
{step === 2 && currentTemplate && (
  <motion.div
    key="step2"
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, ease: 'linear' }}
    className="space-y-8"
  >
    {/* Header avec badge template */}
    <div>
      <Badge className="bg-accent/10 text-accent border-accent/20 border mb-4 text-[0.625rem] uppercase tracking-[0.1em]" 
             style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
        {currentTemplate.icon} {currentTemplate.title}
      </Badge>
      <h2 className="text-[1.25rem] mb-3 tracking-[-0.01em]" style={{ fontWeight: 600 }}>
        Précisez les modalités de votre contrat
      </h2>
      <p className="text-[0.875rem] text-muted-foreground" 
         style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
        Répondez à ces questions pour personnaliser votre contrat
      </p>
    </div>

    {/* Questions (une seule affichée à la fois - flux linéaire) */}
    <div className="space-y-6">
      {currentTemplate.questions.map((question, index) => {
        const answer = answers.find(a => a.questionId === question.id);
        
        return (
          <div key={question.id} className="border border-border p-8 lg:p-10">
            {/* Header question */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[0.625rem] uppercase tracking-[0.1em] text-muted-foreground" 
                      style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                  Question {index + 1}/{currentTemplate.questions.length}
                </span>
              </div>
              <h3 className="text-[1.125rem] mb-4 tracking-[-0.005em]" style={{ fontWeight: 600 }}>
                {question.question}
              </h3>
              
              {/* Info box contexte légal */}
              {question.legalContext && (
                <div className="bg-accent/5 border border-accent/20 p-4 flex items-start gap-3 mb-6">
                  <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-accent" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM8 11a.75.75 0 0 1-.75-.75v-3.5a.75.75 0 0 1 1.5 0v3.5A.75.75 0 0 1 8 11zm0-6a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-[0.625rem] uppercase tracking-[0.1em] text-accent mb-1" 
                         style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                      Implication légale
                    </div>
                    <p className="text-[0.75rem] text-muted-foreground" 
                       style={{ fontFamily: 'var(--font-mono)', fontWeight: 300, lineHeight: 1.5 }}>
                      {question.legalContext}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Label */}
            <label className="text-[0.625rem] uppercase tracking-[0.1em] text-muted-foreground block mb-2" 
                   style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
              Votre réponse
            </label>

            {/* SELECT (pour choice) */}
            {question.type === 'choice' && question.options && (
              <Select
                value={answer?.value || ''}
                onValueChange={(value) => handleAnswer(question.id, value)}
              >
                <SelectTrigger 
                  className="w-full border border-border bg-background hover:border-accent/50 focus:border-accent focus:ring-0 focus:ring-offset-0 transition-colors duration-200 h-12 px-4"
                  style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
                >
                  <SelectValue 
                    placeholder="Sélectionnez une option..." 
                    className="text-[0.875rem] text-muted-foreground"
                  />
                </SelectTrigger>
                <SelectContent 
                  className="border border-border bg-background max-h-[300px] overflow-y-auto"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {question.options.map((option) => (
                    <SelectItem 
                      key={option} 
                      value={option}
                      className="text-[0.875rem] py-3 px-4 hover:bg-accent/5 focus:bg-accent/10 cursor-pointer transition-colors duration-200 border-b border-border last:border-0"
                      style={{ fontWeight: 400 }}
                    >
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* INPUT (pour input) */}
            {question.type === 'input' && (
              <Input
                value={answer?.value || ''}
                onChange={(e) => handleAnswer(question.id, e.target.value)}
                placeholder="Votre réponse..."
                className="border-border focus-visible:ring-accent text-[0.9375rem] h-12"
                style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
              />
            )}
          </div>
        );
      })}
    </div>

    {/* Actions */}
    <div className="flex items-center gap-3 pt-6 border-t border-border">
      <button
        onClick={() => setStep(1)}
        className="px-10 py-4 border border-border hover:border-foreground transition-all duration-200 inline-flex items-center gap-3"
        style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
      >
        <ArrowLeft className="w-4 h-4" strokeWidth={2} />
        <span className="text-[0.75rem] uppercase tracking-[0.12em]">Retour</span>
      </button>
      <button
        onClick={handleGenerate}
        disabled={answers.length < currentTemplate.questions.length || isGenerating}
        className="px-12 py-5 bg-accent text-accent-foreground hover:shadow-[0_0_20px_var(--accent-glow)] transition-all duration-200 inline-flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
        style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}
      >
        {isGenerating ? (
          <>
            <div className="w-4 h-4 border-2 border-accent-foreground border-t-transparent rounded-full animate-spin" />
            <span className="text-[0.75rem] uppercase tracking-[0.12em]">Génération en cours...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" strokeWidth={2} />
            <span className="text-[0.75rem] uppercase tracking-[0.12em]">Générer la proposition</span>
          </>
        )}
      </button>
    </div>
  </motion.div>
)}
```

---

## ✅ CHECKLIST DE MODIFICATIONS POUR CURSOR

### À FAIRE dans `/components/BondCreateView.tsx` :

1. **Importer Select** de shadcn/ui :
   ```tsx
   import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
   ```

2. **Remplacer les boutons radio** par des `<Select>` dans le Step 2

3. **Enrichir les données `templates`** avec :
   - Plus d'options dans chaque question
   - Ajouter `legalContext` pour les questions importantes
   - Améliorer les questions pour couvrir tous les cas d'usage

4. **Ajouter les info boxes** de contexte légal avec l'icône ℹ️

5. **Styliser le Select** selon le design système SYMIONE :
   - Border `border-border`
   - Hover `hover:border-accent/50`
   - Focus `focus:border-accent`
   - PAS de rounded, PAS de shadow
   - Font mono pour cohérence
   - Hauteur fixe `h-12`

6. **Vérifier que tous les items** ont :
   - `border-b border-border last:border-0` (séparateurs entre options)
   - `hover:bg-accent/5` (hover léger)
   - `py-3 px-4` (padding cohérent)

---

## 🎯 RÉSULTAT ATTENDU

Après modifications, le flow des questions (Step 2) doit :
- ✅ Utiliser des **selects minimalistes** (pas de boutons radio)
- ✅ Afficher des **info boxes de contexte légal** pour guider l'utilisateur
- ✅ Avoir une **hiérarchie visuelle claire** (question > contexte > input)
- ✅ Être **cohérent avec le design SYMIONE** (Braun/NASA, instrument panel)
- ✅ Offrir une **expérience fluide** (transitions 200ms linear, hover states précis)

---

**EXÉCUTE CES MODIFICATIONS** pour que le flow des questions Bond corresponde à l'intention design initiale ! 🚀
