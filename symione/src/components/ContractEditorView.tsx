import { motion } from "motion/react";
import { ArrowLeft, Download, Save, Loader2, AlertTriangle, Sparkles, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { LexClient } from "../lib/lexClient";
import { supabase } from "../lib/supabaseClient";
import { downloadContractPdf } from "../lib/exportPdf";
import { showToast } from "./SystemToast";
import { useRateLimitCountdown } from "../hooks/useRateLimit";
import { ReviewPanel } from "./ReviewPanel";
import { LegalDisclaimerModal } from "./LegalDisclaimerModal";
import type { ContractTemplate, GenerateResponse } from "../types/contracts";
import { getTemplatePrice } from "../lib/pricing";

interface ContractEditorViewProps {
  templateId: string;
  jurisdiction?: string;
  onBack: () => void;
}

export function ContractEditorView({ templateId, jurisdiction, onBack }: ContractEditorViewProps) {
  const [template, setTemplate] = useState<ContractTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [generatedText, setGeneratedText] = useState<string>('');
  const [rateLimitRetry, setRateLimitRetry] = useState(0);
  const [showReview, setShowReview] = useState(false);
  
  const countdown = useRateLimitCountdown(rateLimitRetry);

  const price = getTemplatePrice(templateId);

  useEffect(() => {
    async function loadTemplate() {
      try {
        const { template: tmpl } = await LexClient.getTemplate(templateId, jurisdiction);
        setTemplate(tmpl);
        
        const defaults: Record<string, any> = {};
        tmpl.inputs.forEach((input) => {
          if (input.type === 'date') {
            defaults[input.key] = new Date().toISOString().split('T')[0];
          } else {
            defaults[input.key] = '';
          }
        });
        setFormData(defaults);
      } catch (err: any) {
        showToast(err.message || 'Failed to load template', 'error');
        onBack();
      } finally {
        setLoading(false);
      }
    }
    loadTemplate();
  }, [templateId, onBack]);

  const handleInputChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleGenerate = async () => {
    if (!template) return;

    const missingFields = (template.inputs || [])
      .filter((input) => input && input.required && !formData[input.key])
      .map((input) => input.label);

    if (missingFields.length > 0) {
      showToast(`Required fields missing: ${missingFields.join(', ')}`, 'error');
      return;
    }

    try {
      setGenerating(true);
      const response: GenerateResponse = await LexClient.generate({
        contract_id: templateId,
        user_inputs: formData,
        lawyer_mode: false,
      });
      setGeneratedText(response.generated_text);
      showToast('Contract generated successfully (preview)', 'success');
    } catch (err: any) {
      if (err.code === 'RATE_LIMIT') {
        setRateLimitRetry(err.retryInSec || 60);
        showToast(`Rate limit exceeded. Retry in ${err.retryInSec}s`, 'error');
      } else if (err.code === 'LIMIT_REACHED') {
        setShowDownloadModal(false);
        setShowUpgradeModal(true);
      } else {
        showToast(err.message || 'Generation failed', 'error');
      }
    } finally {
      setGenerating(false);
    }
  };

  const handlePayAndExport = async () => {
    try {
      if (!template) return;
      // Validate minimal required fields before checkout
      const missingFields = (template.inputs || [])
        .filter((input) => input && input.required && !formData[input.key])
        .map((input) => input.label);
      if (missingFields.length > 0) {
        showToast(`Required fields missing: ${missingFields.join(', ')}`, 'error');
        return;
      }
      setExporting(true);
      const resp = await fetch('https://api.symione.com/api/checkout/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId, price, inputs: formData }),
      }).then(r => r.json());
      if (resp?.url) {
        window.location.href = resp.url;
      } else {
        showToast('Checkout unavailable', 'error');
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to start checkout', 'error');
    } finally {
      setExporting(false);
    }
  };

  const handleExport = async (format: 'pdf' | 'docx') => {
    showToast('Use "Payer et exporter" to receive the final document', 'warning');
  };

  const confirmDownloadPdf = async () => {
    setExporting(true);
    try {
      await downloadContractPdf({
        contractText: generatedText,
        fileName: 'contrat.pdf',
        metadata: { version: template?.metadata.version, date: new Date().toISOString().split('T')[0] }
      });
      showToast('Contract exported as PDF', 'success');
      setShowDownloadModal(false);
    } catch (err: any) {
      showToast(err.message || 'Export failed', 'error');
    } finally {
      setExporting(false);
    }
  };

  if (loading || !template) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-accent" strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-[1920px] mx-auto px-6 lg:px-12 py-12">
        {/* System header */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'linear' }}
          className="mb-8"
        >
          <button
            onClick={onBack}
            className="flex items-center gap-2 mb-8 text-muted-foreground hover:text-foreground transition-colors duration-200 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-200" strokeWidth={1.5} />
            <span className="text-[0.625rem] uppercase tracking-[0.12em]" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
              Return to Template Library
            </span>
          </button>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pb-6 border-b border-border">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-1.5 h-1.5 rounded-full ${generating ? 'bg-accent animate-pulse' : 'bg-system-standby'}`} />
                <p className="text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
                  SYNTHESIS MODULE / {templateId.toUpperCase()}
                </p>
              </div>
              <h1 className="text-[2rem] md:text-[2.5rem] tracking-[-0.03em]" style={{ fontWeight: 600, lineHeight: 1.1 }}>
                {template.metadata.title}
              </h1>
              <p className="text-[0.75rem] text-muted-foreground mt-2" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                {template.metadata.jurisdiction} • v{template.metadata.version}
              </p>
              <p className="text-[0.875rem] mt-2" style={{ fontFamily: 'var(--font-mono)' }}>
                Prix: €{price}
              </p>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={handleGenerate}
                className="px-4 py-2 border border-border rounded-md"
              >
                Prévisualiser
              </button>
              <button 
                onClick={handlePayAndExport}
                className="px-4 py-2 bg-primary-blue text-white rounded-md"
                disabled={exporting}
              >
                Payer et exporter
              </button>
            </div>
          </div>
        </motion.div>

        {/* Two-column control interface */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.15, ease: 'linear' }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-border"
        >
          {/* Left: Parameter inputs */}
          <div className="bg-card p-6 lg:p-8 space-y-8">
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                <p className="text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
                  Input Parameters
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span className="text-[0.625rem] uppercase tracking-[0.1em] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                    ACTIVE
                  </span>
                </div>
              </div>

              <div className="space-y-5">
                {template.inputs.map((input) => (
                  <div key={input.key}>
                    <label className="block text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-2" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
                      {input.label}
                      {input.required && <span className="text-accent ml-1">*</span>}
                    </label>
                    
                    {input.type === 'textarea' ? (
                      <textarea
                        value={formData[input.key] || ''}
                        onChange={(e) => handleInputChange(input.key, e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2.5 bg-input-background border border-border focus-precision transition-all duration-200 text-[0.875rem] resize-none"
                        style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
                      />
                    ) : input.type === 'select' ? (
                      <select
                        value={formData[input.key] || ''}
                        onChange={(e) => handleInputChange(input.key, e.target.value)}
                        className="w-full px-3 py-2.5 bg-input-background border border-border focus-precision transition-all duration-200 text-[0.875rem]"
                        style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
                      >
                        <option value="">Select...</option>
                      </select>
                    ) : (
                      <input
                        type={input.type}
                        value={formData[input.key] || ''}
                        onChange={(e) => handleInputChange(input.key, e.target.value)}
                        className="w-full px-3 py-2.5 bg-input-background border border-border focus-precision transition-all duration-200 text-[0.875rem]"
                        style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Output preview */}
          <div className="bg-card p-6 lg:p-8 overflow-auto max-h-[calc(100vh-200px)] sticky top-20">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
              <p className="text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
                Output Preview
              </p>
              <div className="flex items-center gap-2">
                <div className={`h-px w-8 ${generatedText ? 'bg-accent' : 'bg-border'}`} />
                <span className="text-[0.625rem] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                  {generatedText ? 'READY' : 'STANDBY'}
                </span>
              </div>
            </div>

            {generatedText ? (
              <div className="prose prose-sm max-w-none">
                <div 
                  className="text-[0.875rem] whitespace-pre-wrap" 
                  style={{ lineHeight: 1.7, fontFamily: 'var(--font-mono)', fontWeight: 300 }}
                >
                  {generatedText}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-[0.75rem] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                  Remplissez les paramètres et cliquez sur Générer
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Review panel */}
      {showReview && generatedText && (
        <ReviewPanel 
          contractText={generatedText}
          onClose={() => setShowReview(false)}
        />
      )}

    {/* Modal before download */}
    <LegalDisclaimerModal
      isOpen={showDownloadModal}
      onClose={() => setShowDownloadModal(false)}
      onAccept={confirmDownloadPdf}
      type="contract"
    />

    {/* Upgrade modal */}
    {showUpgradeModal && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-card border border-border p-6 w-full max-w-md">
          <h3 className="text-[1.125rem] mb-2" style={{ fontWeight: 600 }}>Limite gratuite atteinte</h3>
          <p className="text-[0. NineTwoFiverem] text-muted-foreground" style={{ lineHeight: 1.6 }}>
            Vous avez généré 2 contrats ce mois. Passez au Plan Pro pour débloquer 20 contrats/mois.
          </p>
          <div className="mt-5 flex justify-end gap-2">
            <button onClick={() => setShowUpgradeModal(false)} className="px-4 py-2 border border-border">Annuler</button>
            <button
              onClick={async () => {
                try {
                  const res = await fetch('/api/stripe/create-checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ plan: 'pro' }) });
                  const data = await res.json();
                  if (data?.url) window.location.href = data.url; else window.location.href = '/prix';
                } catch {
                  window.location.href = '/prix';
                }
              }}
              className="px-4 py-2 bg-accent text-accent-foreground"
            >
              Passer au Plan Pro (149€/mois)
            </button>
          </div>
        </div>
      </div>
    )}
    </div>
  );
}
