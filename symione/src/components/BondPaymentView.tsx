import { motion } from "motion/react";
import { ArrowLeft, CreditCard, CheckCircle2, Clock, Shield } from "lucide-react";
import { useState } from "react";
import { Badge } from "./ui/badge";
import { BondAPI } from "./lib/useBondApi";

interface BondPaymentViewProps {
  milestoneId: string;
  onBack: () => void;
}

type PaymentStatus = 'pending' | 'processing' | 'confirmed' | 'transferred';

const mockMilestone = {
  id: 'm2',
  title: 'Développement MVP (Minimum Viable Product)',
  description: 'Développement des fonctionnalités core, intégration API, tests unitaires',
  amount: 28000,
  contractId: '001',
  contractTitle: 'Développement application mobile'
};

const statusLabels: Record<PaymentStatus, string> = {
  pending: 'En attente',
  processing: 'Traitement en cours',
  confirmed: 'Confirmé',
  transferred: 'Transféré'
};

const statusColors: Record<PaymentStatus, string> = {
  pending: 'bg-muted text-muted-foreground',
  processing: 'bg-accent/10 text-accent border-accent/20',
  confirmed: 'bg-accent/20 text-accent border-accent/30',
  transferred: 'bg-accent text-accent-foreground'
};

export function BondPaymentView({ milestoneId, onBack }: BondPaymentViewProps) {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('pending');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayNow = async () => {
    setIsProcessing(true);
    setPaymentStatus('processing');
    try {
      // Create a PaymentIntent for the contract (demo values)
      const intent = await BondAPI.intentCreate({ contractId: mockMilestone.contractId, amount: mockMilestone.amount, currency: 'eur' });
      console.log('clientSecret', intent?.clientSecret);
      setPaymentStatus('confirmed');
      await new Promise(r => setTimeout(r, 1200));
      setPaymentStatus('transferred');
    } catch (e) {
      setPaymentStatus('pending');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-[900px] mx-auto px-6 lg:px-12 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'linear' }}
          className="mb-12"
        >
          <button
            onClick={onBack}
            className="flex items-center gap-2 mb-8 text-muted-foreground hover:text-foreground transition-colors duration-200 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-200" strokeWidth={1.5} />
            <span className="text-[0.625rem] uppercase tracking-[0.12em]" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
              Retour au contrat
            </span>
          </button>

          <div className="pb-6 border-b border-border">
            <p className="text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-3" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
              PAIEMENT SÉCURISÉ / CONTRAT #{mockMilestone.contractId}
            </p>
            <h1 className="text-[2rem] md:text-[3rem] tracking-[-0.03em] mb-3" style={{ fontWeight: 600, lineHeight: 1.1 }}>
              Paiement jalon
            </h1>
            <p className="text-[0.875rem] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
              {mockMilestone.contractTitle}
            </p>
          </div>
        </motion.div>

        {/* Payment Status Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1, ease: 'linear' }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-[0.75rem] uppercase tracking-[0.1em]" style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
              État du paiement
            </span>
            <Badge className={`${statusColors[paymentStatus]} border text-[0.625rem] uppercase tracking-[0.1em]`} style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
              {statusLabels[paymentStatus]}
            </Badge>
          </div>

          {/* Progress Steps */}
          <div className="border border-border p-6">
            <div className="flex items-center justify-between">
              {(['pending', 'processing', 'confirmed', 'transferred'] as PaymentStatus[]).map((status, index) => {
                const isActive = paymentStatus === status;
                const isCompleted = (['pending', 'processing', 'confirmed', 'transferred'] as PaymentStatus[]).indexOf(paymentStatus) > index;
                
                return (
                  <div key={status} className="flex items-center flex-1">
                    <div className="flex flex-col items-center gap-2 flex-1">
                      <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        isActive || isCompleted
                          ? 'border-accent bg-accent text-accent-foreground'
                          : 'border-border text-muted-foreground'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5" strokeWidth={2} />
                        ) : isActive ? (
                          <Clock className="w-5 h-5" strokeWidth={2} />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                        )}
                      </div>
                      <span className={`text-[0.625rem] uppercase tracking-[0.1em] text-center ${
                        isActive || isCompleted ? 'text-accent' : 'text-muted-foreground'
                      }`} style={{ fontFamily: 'var(--font-mono)', fontWeight: isActive ? 500 : 300 }}>
                        {statusLabels[status]}
                      </span>
                    </div>
                    {index < 3 && (
                      <div className={`h-0.5 flex-1 mx-2 transition-all duration-200 ${
                        isCompleted ? 'bg-accent' : 'bg-border'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Milestone Details */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15, ease: 'linear' }}
          className="mb-8"
        >
          <h2 className="text-[0.75rem] uppercase tracking-[0.1em] mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
            <div className="w-1 h-1 rounded-full bg-accent" />
            Détails du jalon
          </h2>
          <div className="border border-border p-6">
            <h3 className="text-[1.25rem] mb-3" style={{ fontWeight: 600 }}>
              {mockMilestone.title}
            </h3>
            <p className="text-[0.875rem] text-muted-foreground mb-6" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
              {mockMilestone.description}
            </p>
            <div className="pt-6 border-t border-border">
              <div className="flex justify-between items-center">
                <span className="text-[0.75rem] uppercase tracking-[0.1em] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
                  Montant à payer
                </span>
                <span className="text-[2rem] tracking-[-0.02em]" style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                  {mockMilestone.amount.toLocaleString('fr-FR')} €
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Payment Method */}
        {paymentStatus === 'pending' && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2, ease: 'linear' }}
            className="mb-8"
          >
            <h2 className="text-[0.75rem] uppercase tracking-[0.1em] mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
              <div className="w-1 h-1 rounded-full bg-accent" />
              Méthode de paiement
            </h2>
            <div className="border border-border p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded border border-border flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-accent" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="text-[1rem] mb-1" style={{ fontWeight: 600 }}>
                    Carte bancaire
                  </div>
                  <div className="text-[0.75rem] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                    Paiement sécurisé via Stripe
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-border">
                <div className="flex items-start gap-2 text-[0.75rem] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                  <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                  <span>
                    Les fonds sont conservés en sécurité et ne seront transférés au prestataire qu'après validation du jalon par le client.
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25, ease: 'linear' }}
          className="mb-8"
        >
          <div className="bg-muted/30 border border-border p-6">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" strokeWidth={1.5} />
              <div>
                <h3 className="text-[0.875rem] mb-2" style={{ fontWeight: 600 }}>
                  Paiement sécurisé et garanti
                </h3>
                <p className="text-[0.75rem] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                  Vos paiements sont protégés par Symi Bond. Les fonds sont conservés en sécurité et ne sont transférés qu'après validation du livrable. En cas de litige, notre service d'arbitrage intervient pour garantir une résolution équitable.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3, ease: 'linear' }}
        >
          {paymentStatus === 'pending' && (
            <button
              onClick={handlePayNow}
              disabled={isProcessing}
              className="w-full px-12 py-5 bg-accent text-accent-foreground hover:shadow-[0_0_20px_var(--accent-glow)] transition-all duration-200 inline-flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
              style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}
            >
              <CreditCard className="w-5 h-5" strokeWidth={2} />
              <span className="text-[0.75rem] uppercase tracking-[0.12em]">Payer maintenant</span>
            </button>
          )}

          {paymentStatus === 'processing' && (
            <div className="text-center py-8">
              <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-6" />
              <p className="text-[0.875rem] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                Traitement du paiement en cours...
              </p>
            </div>
          )}

          {paymentStatus === 'confirmed' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-accent/10 mx-auto mb-6 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-accent" strokeWidth={2} />
              </div>
              <h3 className="text-[1.25rem] mb-3" style={{ fontWeight: 600 }}>
                Paiement confirmé
              </h3>
              <p className="text-[0.875rem] text-muted-foreground" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                Préparation du transfert sécurisé...
              </p>
            </div>
          )}

          {paymentStatus === 'transferred' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-accent/10 mx-auto mb-6 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-accent" strokeWidth={2} />
              </div>
              <h3 className="text-[1.5rem] mb-3" style={{ fontWeight: 600 }}>
                Transfert effectué
              </h3>
              <p className="text-[0.875rem] text-muted-foreground mb-8 max-w-md mx-auto" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                Le paiement a été transféré avec succès. Les fonds seront disponibles sous 2-3 jours ouvrés.
              </p>
              <button
                onClick={onBack}
                className="px-10 py-4 border border-border hover:border-foreground transition-all duration-200 inline-flex items-center gap-3"
                style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
              >
                <span className="text-[0.75rem] uppercase tracking-[0.12em]">Retour au contrat</span>
              </button>
            </div>
          )}
        </motion.div>

        {/* Transaction Details */}
        {(paymentStatus === 'confirmed' || paymentStatus === 'transferred') && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2, ease: 'linear' }}
            className="mt-8"
          >
            <h2 className="text-[0.75rem] uppercase tracking-[0.1em] mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
              <div className="w-1 h-1 rounded-full bg-accent" />
              Détails de la transaction
            </h2>
            <div className="border border-border p-6">
              <div className="space-y-3 text-[0.75rem]" style={{ fontFamily: 'var(--font-mono)' }}>
                <div className="flex justify-between">
                  <span className="text-muted-foreground" style={{ fontWeight: 300 }}>ID Transaction</span>
                  <span style={{ fontWeight: 400 }}>TXN-{Date.now().toString().slice(-8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground" style={{ fontWeight: 300 }}>Date</span>
                  <span style={{ fontWeight: 400 }}>{new Date().toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground" style={{ fontWeight: 300 }}>Heure</span>
                  <span style={{ fontWeight: 400 }}>{new Date().toLocaleTimeString('fr-FR')}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-border">
                  <span className="text-muted-foreground" style={{ fontWeight: 300 }}>Montant</span>
                  <span className="text-[1rem]" style={{ fontWeight: 600 }}>
                    {mockMilestone.amount.toLocaleString('fr-FR')} €
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
