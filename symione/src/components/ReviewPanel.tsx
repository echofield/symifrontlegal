import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { LexClient } from '../lib/lexClient';
import { showToast } from './SystemToast';
import type { ReviewResponse } from '../types/contracts';

interface ReviewPanelProps {
  contractText: string;
  onClose: () => void;
}

export function ReviewPanel({ contractText, onClose }: ReviewPanelProps) {
  const [reviewing, setReviewing] = useState(false);
  const [review, setReview] = useState<ReviewResponse | null>(null);

  const handleReview = async () => {
    setReviewing(true);
    try {
      const result = await LexClient.review({ contract_text: contractText });
      setReview(result);
    } catch (err: any) {
      showToast(err.message || 'Review failed', 'error');
    } finally {
      setReviewing(false);
    }
  };

  const riskColors = {
    low: 'text-accent',
    medium: 'text-yellow-600',
    high: 'text-destructive',
  };

  const severityIcons = {
    low: CheckCircle,
    medium: AlertTriangle,
    high: XCircle,
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2, ease: 'linear' }}
          onClick={(e) => e.stopPropagation()}
          className="bg-card border border-border max-w-3xl w-full max-h-[80vh] overflow-auto"
        >
          <div className="p-6 lg:p-8 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-2" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
                  Compliance Scanner
                </p>
                <h2 className="text-[1.5rem] tracking-[-0.01em]" style={{ fontWeight: 600 }}>
                  Contract Review
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="stroke-current">
                  <path d="M5 5L15 15M5 15L15 5" strokeWidth="1.5" strokeLinecap="square" />
                </svg>
              </button>
            </div>
          </div>

          <div className="p-6 lg:p-8">
            {!review && !reviewing && (
              <div className="text-center py-8">
                <p className="text-[0.875rem] text-muted-foreground mb-6" style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                  Analyze contract for compliance issues and risk factors
                </p>
                <button
                  onClick={handleReview}
                  className="px-6 py-3 bg-accent text-accent-foreground hover:shadow-[0_0_20px_var(--accent-glow)] transition-all duration-200 text-[0.625rem] uppercase tracking-[0.12em]"
                  style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}
                >
                  Start Review
                </button>
              </div>
            )}

            {reviewing && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-accent" strokeWidth={1.5} />
              </div>
            )}

            {review && (
              <div className="space-y-6">
                {/* Overall Risk */}
                <div className="border-l-2 border-accent pl-4">
                  <p className="text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-2" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
                    Overall Risk Level
                  </p>
                  <p className={`text-[1.25rem] uppercase tracking-wider ${riskColors[review.overall_risk]}`} style={{ fontWeight: 600 }}>
                    {review.overall_risk}
                  </p>
                </div>

                {/* Summary */}
                <div>
                  <p className="text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-3" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
                    Summary
                  </p>
                  <p className="text-[0.875rem]" style={{ lineHeight: 1.6 }}>
                    {review.summary}
                  </p>
                </div>

                {/* Red Flags */}
                {review.red_flags.length > 0 && (
                  <div>
                    <p className="text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-4" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
                      Issues Detected ({review.red_flags.length})
                    </p>
                    <div className="space-y-3">
                      {review.red_flags.map((flag, index) => {
                        const Icon = severityIcons[flag.severity];
                        return (
                          <div key={index} className="border border-border p-4">
                            <div className="flex items-start gap-3">
                              <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${riskColors[flag.severity]}`} strokeWidth={1.5} />
                              <div className="flex-1">
                                <p className="text-[0.75rem] uppercase tracking-[0.1em] text-muted-foreground mb-1" style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
                                  {flag.clause}
                                </p>
                                <p className="text-[0.875rem] mb-2" style={{ fontWeight: 500 }}>
                                  {flag.issue}
                                </p>
                                <p className="text-[0.8125rem] text-muted-foreground" style={{ lineHeight: 1.5 }}>
                                  {flag.suggestion}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
