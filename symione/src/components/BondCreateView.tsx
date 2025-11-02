import { motion } from "motion/react";
import { ArrowLeft, Plus } from "lucide-react";
import { useState } from "react";

interface BondCreateViewProps {
  onNavigate: (view: string, contractId?: string) => void;
}

export function BondCreateView({ onNavigate }: BondCreateViewProps) {
  const [description, setDescription] = useState("");
  const safeText = (v: any): string => (typeof v === 'string' ? v : v == null ? '' : String(v));
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleSuggest = async () => {
    if (!safeText(description).trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('https://symilegalback.vercel.app/api/contracts/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description })
      });
      
      if (response.ok) {
        const data = await response.json();
        setSuggestions(Array.isArray(data) ? data : [data]);
      } else {
        console.error('Suggest failed:', response.status);
        // Fallback: show mock suggestions
        setSuggestions([
          "Contrat de prestation de services informatiques",
          "Contrat de freelance développement web",
          "Contrat de conseil en technologie"
        ]);
      }
    } catch (error) {
      console.error('Error:', error);
      // Fallback: show mock suggestions
      setSuggestions([
        "Contrat de prestation de services informatiques",
        "Contrat de freelance développement web", 
        "Contrat de conseil en technologie"
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'linear' }}
          className="mb-12"
        >
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pb-6 border-b border-border">
            <div>
              <p className="text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-3" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
                SYMI BOND / CRÉATION CONTRAT
              </p>
              <h1 className="text-[2rem] md:text-[3rem] tracking-[-0.03em]" style={{ fontWeight: 600, lineHeight: 1.1 }}>
                Créer un contrat
              </h1>
              <p className="text-[0.875rem] text-muted-foreground mt-3" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                L'AI vous aide à rédiger selon votre intent avec des questions spécifiques
              </p>
            </div>

            <button
              onClick={() => onNavigate('bond')}
              className="px-10 py-4 border border-border hover:border-foreground transition-all duration-200 inline-flex items-center gap-3"
              style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={2} />
              <span className="text-[0.75rem] uppercase tracking-[0.12em]">Retour</span>
            </button>
          </div>
        </motion.div>

        {/* Description Input */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'linear' }}
          className="mb-8"
        >
          <div className="max-w-2xl">
            <label className="block text-[0.75rem] uppercase tracking-[0.1em] text-muted-foreground mb-3" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
              Décrivez votre projet
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Je veux créer un contrat de freelance pour développement web avec paiement par jalons..."
              className="w-full p-4 border border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none transition-colors duration-200"
              rows={4}
              style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}
            />
            <button
              onClick={handleSuggest}
              disabled={loading || !safeText(description).trim()}
              className="mt-4 px-10 py-4 bg-accent text-accent-foreground hover:shadow-[0_0_20px_var(--accent-glow)] transition-all duration-200 inline-flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-accent-foreground border-t-transparent rounded-full animate-spin" />
                  <span className="text-[0.75rem] uppercase tracking-[0.12em]">Analyse en cours...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" strokeWidth={2} />
                  <span className="text-[0.75rem] uppercase tracking-[0.12em]">Analyser avec l'AI</span>
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* AI Suggestions */}
        {suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'linear' }}
            className="mb-8"
          >
            <h3 className="text-[1.25rem] mb-6" style={{ fontWeight: 600 }}>
              Suggestions de l'AI
            </h3>
            <div className="grid gap-4">
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.1, ease: 'linear' }}
                  className="p-6 border border-border hover:border-accent transition-all duration-200 cursor-pointer"
                  onClick={() => onNavigate('bond-contract', suggestion)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                      <Plus className="w-4 h-4 text-accent" strokeWidth={2} />
                    </div>
                    <div>
                      <h4 className="text-[1rem] mb-1" style={{ fontWeight: 500 }}>
                        {suggestion}
                      </h4>
                      <p className="text-[0.75rem] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                        Cliquez pour créer ce contrat
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'linear' }}
          className="text-center py-12"
        >
          <div className="max-w-2xl mx-auto">
            <h3 className="text-[1.25rem] mb-4" style={{ fontWeight: 600 }}>
              Comment ça marche ?
            </h3>
            <div className="grid gap-4 text-left">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center mt-1">
                  <span className="text-[0.75rem] text-accent font-bold">1</span>
                </div>
                <div>
                  <h4 className="text-[0.875rem] mb-1" style={{ fontWeight: 500 }}>Décrivez votre projet</h4>
                  <p className="text-[0.75rem] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                    L'AI analyse votre description pour comprendre votre intent
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center mt-1">
                  <span className="text-[0.75rem] text-accent font-bold">2</span>
                </div>
                <div>
                  <h4 className="text-[0.875rem] mb-1" style={{ fontWeight: 500 }}>Questions spécifiques</h4>
                  <p className="text-[0.75rem] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                    L'AI pose des questions adaptées à votre type de contrat
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center mt-1">
                  <span className="text-[0.75rem] text-accent font-bold">3</span>
                </div>
                <div>
                  <h4 className="text-[0.875rem] mb-1" style={{ fontWeight: 500 }}>Contrat personnalisé</h4>
                  <p className="text-[0.75rem] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                    Génération automatique avec vos réponses (montant ajouté par l'utilisateur)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}