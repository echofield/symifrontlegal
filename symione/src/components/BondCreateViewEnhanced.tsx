import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Plus, AlertCircle, CheckCircle } from 'lucide-react';
import { BondAPI, useAPI, APIError, RateLimitError } from '../lib/api-client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import type { BondMilestone } from '../lib/api-client';
import { LoadingSpinner, LoadingCard, LoadingButton, useLoadingState } from './LoadingComponents';
import { ErrorBoundary } from './ErrorBoundary';

interface BondCreateViewProps {
  onNavigate: (view: string, contractId?: string) => void;
}

interface Template {
  id: string;
  title: string;
  description: string;
  roles: string[];
  milestones: BondMilestone[];
  terms: string[];
  risks: string[];
  tags: string[];
}

interface Question {
  id: string;
  question: string;
  type: 'choice' | 'input';
  options?: string[];
  legalContext?: string;
}

export function BondCreateViewEnhanced({ onNavigate }: BondCreateViewProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [suggestedContract, setSuggestedContract] = useState<string | null>(null);
  const [projectAmount, setProjectAmount] = useState<number>(0);
  
  const { loading: templatesLoading, error: templatesError, data: templatesData } = useAPI(
    () => BondAPI.getTemplates(),
    [],
    { retryOnError: true, maxRetries: 3 }
  );

  const { loading: questionsLoading, error: questionsError, data: questionsData } = useAPI(
    () => selectedTemplate ? BondAPI.getQuestions(selectedTemplate) : Promise.resolve({ ok: true, questions: [] }),
    [selectedTemplate],
    { immediate: !!selectedTemplate, retryOnError: true }
  );

  const { loading: suggestLoading, error: suggestError, startLoading: startSuggest, stopLoading: stopSuggest } = useLoadingState();
  const { loading: createLoading, error: createError, startLoading: startCreate, stopLoading: stopCreate } = useLoadingState();

  // Update questions when data changes
  useEffect(() => {
    if (questionsData?.ok && questionsData.questions) {
      if (Array.isArray(questionsData.questions)) {
        setQuestions(questionsData.questions);
      } else if (selectedTemplate && questionsData.questions[selectedTemplate]) {
        setQuestions(questionsData.questions[selectedTemplate]);
      }
      setCurrentQuestionIndex(0);
    }
  }, [questionsData, selectedTemplate]);

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers(prev => {
      const newAnswers = {
        ...prev,
        [questionId]: value
      };
      
      // Extract project amount from number fields
      if (typeof value === 'number' && value > 0) {
        setProjectAmount(value);
      }
      
      return newAnswers;
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSuggest = async () => {
    if (!selectedTemplate) return;
    
    try {
      startSuggest();
      const response = await BondAPI.suggest({
        templateId: selectedTemplate,
        answers: answers
      });
      
      if (response.success) {
        setSuggestedContract(response.contract);
      }
    } catch (err) {
      console.error('Error suggesting contract:', err);
    } finally {
      stopSuggest();
    }
  };

  const handleSubmit = async () => {
    if (!selectedTemplate) return;
    
    try {
      startCreate();
      
      // First create the contract
      const response = await BondAPI.create({
        templateId: selectedTemplate,
        answers: answers
      });
      
      if (response.success) {
        // Calculate total amount
        const totalAmount = 119 + (projectAmount * 0.03);
        
        // Create Stripe payment intent
        const paymentResponse = await BondAPI.createPaymentIntent({
          contractId: response.contractId,
          amount: Math.round(totalAmount * 100), // Convert to cents
          currency: 'eur'
        });
        
        if (paymentResponse.success && paymentResponse.clientSecret) {
          // Redirect to Stripe Checkout or handle payment
          // For now, navigate to contract view
          onNavigate('bond-contract', response.contractId);
        } else {
          throw new Error('Failed to create payment intent');
        }
      }
    } catch (err) {
      console.error('Error creating contract or processing payment:', err);
    } finally {
      stopCreate();
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;
  const templates = templatesData?.templates || [];

  // Loading state for templates
  if (templatesLoading && templates.length === 0) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <LoadingCard message="Chargement des templates..." />
      </div>
    );
  }

  // Error state for templates
  if (templatesError) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Erreur</h2>
          <p className="text-muted-foreground mb-6">
            {templatesError instanceof APIError 
              ? templatesError.message 
              : 'Erreur lors du chargement des templates'
            }
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  // Template selection view
  if (!selectedTemplate) {
    return (
      <div className="min-h-screen pt-16">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Créer un Contrat Sécurisé
            </h1>
            <p className="text-xl text-muted-foreground">
              Choisissez le type de contrat qui correspond à votre projet
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => setSelectedTemplate(template.id)}
                className={`border border-border p-8 lg:p-10 text-left transition-all duration-200 hover:border-accent/50 group ${
                  selectedTemplate === template.id ? 'border-accent bg-accent/5 ring-2 ring-accent ring-offset-2' : ''
                }`}
              >
                <div className="text-[2.5rem] mb-6">{template.icon}</div>
                
                <h3 className="text-[1.25rem] mb-2 tracking-[-0.01em]" style={{ fontWeight: 600 }}>
                  {template.title}
                </h3>
                
                <p className="text-[0.75rem] text-muted-foreground mb-4" 
                   style={{ fontFamily: 'var(--font-mono)', fontWeight: 300, lineHeight: 1.5 }}>
                  {template.description}
                </p>
                
                {/* Métadonnées enrichies */}
                <div className="space-y-2 mb-4 pb-4 border-b border-border">
                  <div className="flex items-center gap-2 text-[0.625rem] text-muted-foreground" 
                       style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
                    <span>👥</span>
                    <span className="uppercase tracking-[0.1em]">Rôles:</span>
                    <span style={{ fontWeight: 300 }}>Client, Prestataire</span>
                  </div>
                  <div className="flex items-center gap-2 text-[0.625rem] text-muted-foreground" 
                       style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
                    <span>📋</span>
                    <span className="uppercase tracking-[0.1em]">Jalons:</span>
                    <span style={{ fontWeight: 300 }}>3-5 étapes</span>
                  </div>
                  {template.id === 'service' && (
                    <div className="bg-accent/10 text-accent border-accent/20 border text-[0.625rem] uppercase tracking-[0.1em] mt-2 inline-flex items-center px-2 py-1" 
                         style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                      Populaire
                    </div>
                  )}
                </div>
                
                {selectedTemplate === template.id && (
                  <div className="flex items-center gap-2 text-accent text-[0.75rem] uppercase tracking-[0.1em]" 
                       style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                    <CheckCircle className="w-4 h-4" strokeWidth={2} />
                    Sélectionné
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Questions view with enhanced error handling
  return (
    <ErrorBoundary>
      <div className="min-h-screen pt-16">
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Header with progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-[1.25rem] mb-2 tracking-[-0.01em]" style={{ fontWeight: 600 }}>
                  Configuration du contrat
                </h1>
                <p className="text-[0.75rem] text-muted-foreground" 
                   style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}>
                  Précisez les modalités de votre contrat
                </p>
              </div>
              
              {/* Indicateur de progression visible */}
              <div className="text-right">
                <div className="text-[1.5rem] tracking-[-0.02em] mb-1" 
                     style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                  {Math.round((currentQuestionIndex / questions.length) * 100)}%
                </div>
                <div className="text-[0.625rem] uppercase tracking-[0.1em] text-muted-foreground" 
                     style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
                  Question {currentQuestionIndex + 1} sur {questions.length}
                </div>
              </div>
            </div>
            
            <div className="w-full bg-muted h-2">
              <motion.div 
                className="bg-accent h-2 transition-all duration-300"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Error handling for questions */}
          {questionsError && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-destructive" />
                <p className="text-destructive">
                  {questionsError instanceof APIError 
                    ? questionsError.message 
                    : 'Erreur lors du chargement des questions'
                  }
                </p>
              </div>
            </div>
          )}

          {/* Loading state for questions */}
          {questionsLoading && (
            <LoadingCard message="Chargement des questions..." />
          )}

          {/* Current question */}
          {currentQuestion && !questionsLoading && (
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="border border-border p-8 lg:p-10"
            >
              <h2 className="text-xl font-semibold mb-4 text-foreground">
                {currentQuestion.question}
              </h2>
              
              {currentQuestion.legalContext && (
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
                      {currentQuestion.legalContext}
                    </p>
                  </div>
                </div>
              )}

              {/* Label du champ */}
              <label className="text-[0.625rem] uppercase tracking-[0.1em] text-muted-foreground block mb-2" 
                     style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}>
                Votre réponse
              </label>

              {/* Debug info */}
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 text-xs">
                <div><strong>Debug Info:</strong></div>
                <div>Question ID: {currentQuestion.id}</div>
                <div>Question Type: {currentQuestion.type}</div>
                <div>Options Count: {currentQuestion.options?.length || 0}</div>
                <div>Options: {JSON.stringify(currentQuestion.options)}</div>
                <div>Selected Template: {selectedTemplate}</div>
                <div>Questions Loading: {questionsLoading ? 'Yes' : 'No'}</div>
                <div>Questions Error: {questionsError ? 'Yes' : 'No'}</div>
              </div>

              {/* Fallback input if Select fails */}
              {(!currentQuestion.options || currentQuestion.options.length === 0) && (
                <div className="space-y-2">
                  <p className="text-sm text-red-600">⚠️ No options available for this question</p>
                  <input
                    type="text"
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                    placeholder="Votre réponse..."
                    className="w-full px-4 py-3 border border-border bg-background focus:border-accent focus:outline-none transition-colors duration-200 h-12"
                    style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
                  />
                </div>
              )}

              {/* Form field rendering based on type */}
              {currentQuestion.type === 'choice' && currentQuestion.options && (
                <div className="space-y-2">
                  <Select
                    value={answers[currentQuestion.id] || ''}
                    onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
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
                      {currentQuestion.options.map((option) => (
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
                </div>
              )}

              {currentQuestion.type === 'input' && (
                <textarea
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                  placeholder="Votre réponse..."
                  className="w-full px-4 py-3 border border-border bg-background focus:border-accent focus:outline-none transition-colors duration-200 min-h-[120px] resize-none"
                  style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
                />
              )}

              {currentQuestion.type === 'number' && (
                <input
                  type="number"
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, parseFloat(e.target.value))}
                  className="w-full px-4 py-3 border border-border bg-input-background focus:border-accent focus:outline-none transition-colors duration-200"
                  style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
                  placeholder="Montant en euros"
                />
              )}

              {currentQuestion.type === 'date' && (
                <input
                  type="date"
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                  className="w-full px-4 py-3 border border-border bg-input-background focus:border-accent focus:outline-none transition-colors duration-200"
                  style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
                />
              )}

              {currentQuestion.legalImplication && (
                <div className="mt-4 p-3 bg-accent/10 border border-accent/20 rounded-lg">
                  <p className="text-sm text-accent">
                    <strong>ℹ️ Implication légale:</strong> {currentQuestion.legalImplication}
                  </p>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between gap-4 pt-6 border-t border-border">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className="px-8 py-3 border border-border hover:border-foreground transition-all duration-200 inline-flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
                >
                  <ArrowLeft className="w-4 h-4" strokeWidth={2} />
                  <span className="text-[0.75rem] uppercase tracking-[0.12em]">Précédent</span>
                </button>
                
                <div className="flex gap-3">
                  {currentQuestionIndex === questions.length - 1 && (
                    <LoadingButton
                      loading={suggestLoading}
                      onClick={handleSuggest}
                      className="px-8 py-3 border border-border hover:border-foreground transition-all duration-200"
                      style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
                    >
                      <span className="text-[0.75rem] uppercase tracking-[0.12em]">Prévisualiser</span>
                    </LoadingButton>
                  )}
                  
                  <LoadingButton
                    loading={createLoading}
                    onClick={currentQuestionIndex === questions.length - 1 ? handleSubmit : handleNext}
                    disabled={!answers[currentQuestion.id]}
                    className="px-10 py-4 bg-accent text-accent-foreground hover:shadow-[0_0_20px_var(--accent-glow)] transition-all duration-200 inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}
                  >
                    <span className="text-[0.75rem] uppercase tracking-[0.12em]">
                      {currentQuestionIndex === questions.length - 1 ? 'Créer le contrat' : 'Suivant'}
                    </span>
                    {currentQuestionIndex < questions.length - 1 && (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="stroke-current">
                        <path d="M2 7H12M12 7L8 3M12 7L8 11" strokeWidth="1.5" strokeLinecap="square" />
                      </svg>
                    )}
                  </LoadingButton>
                </div>
              </div>
            </motion.div>
          )}

          {/* Contract preview */}
          {suggestedContract && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 bg-card border border-border rounded-xl p-8"
            >
              <h3 className="text-xl font-semibold mb-4 text-foreground">Aperçu du contrat</h3>
              <div className="bg-muted/30 rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-foreground">
                  {suggestedContract}
                </pre>
              </div>
              
              {/* Pricing Summary */}
              <div className="mt-6 p-4 border border-border rounded-lg bg-card">
                <h3 className="font-bold text-lg mb-4 text-foreground">Récapitulatif des frais:</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-foreground">Création contrat sur-mesure:</span>
                    <span className="font-bold text-accent">119€</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground">Commission escrow (3% sur {projectAmount || 0}€):</span>
                    <span className="font-bold text-accent">{((projectAmount || 0) * 0.03).toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold mt-4 pt-4 border-t border-border">
                    <span className="text-foreground">Total:</span>
                    <span className="text-accent">{119 + ((projectAmount || 0) * 0.03)}€</span>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-accent/5 border border-accent/20 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    💡 <strong>Paiement sécurisé via Stripe.</strong> Fonds bloqués sur compte escrow jusqu'à validation des milestones.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => {
                    // Create a blob with the contract content and download it
                    const blob = new Blob([suggestedContract || ''], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `contrat-${selectedTemplate}-${new Date().toISOString().split('T')[0]}.txt`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                  className="px-6 py-3 bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-lg transition-colors"
                >
                  📄 Télécharger le contrat (TXT)
                </button>
                <LoadingButton
                  loading={createLoading}
                  onClick={handleSubmit}
                  className="px-6 py-3 bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  Payer et activer l'escrow →
                </LoadingButton>
                <button
                  onClick={() => setSuggestedContract(null)}
                  className="px-6 py-3 border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  Modifier
                </button>
              </div>
              
              {/* Legal Disclaimers */}
              <div className="mt-6 space-y-4">
                {/* Yousign Disclaimer */}
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h3 className="font-bold flex items-center text-yellow-800 mb-2">
                    ⚠️ Étape importante: Signature électronique
                  </h3>
                  <p className="text-sm text-yellow-700 mb-3">
                    Pour que ce contrat soit <strong>juridiquement valide</strong>, 
                    il doit être signé électroniquement par toutes les parties.
                  </p>
                  <button 
                    onClick={() => window.open('https://yousign.com', '_blank')}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                  >
                    Envoyer pour signature via Yousign →
                  </button>
                  <p className="text-xs text-yellow-600 mt-2">
                    Yousign permet la signature électronique légale conforme au règlement eIDAS.
                  </p>
                </div>
                
                {/* Lawyer Consultation Disclaimer */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-bold flex items-center text-blue-800 mb-2">
                    ⚖️ Conseil recommandé
                  </h3>
                  <p className="text-sm text-blue-700 mb-3">
                    Ce contrat est généré automatiquement. Pour les situations complexes 
                    ou à fort enjeu financier, <strong>nous vous recommandons vivement de consulter 
                    un avocat</strong> avant signature.
                  </p>
                  <button 
                    onClick={() => onNavigate('conseiller')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Trouver un avocat spécialisé →
                  </button>
                </div>
                
                {/* Legal Disclaimer */}
                <div className="p-3 bg-muted/30 border border-border rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    ⚠️ <strong>SYMIONE</strong> fournit des outils de génération de contrats mais ne constitue pas 
                    un conseil juridique personnalisé. En cas de doute, consultez un professionnel du droit.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
