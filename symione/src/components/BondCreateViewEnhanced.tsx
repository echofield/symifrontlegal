import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Plus, AlertCircle, CheckCircle } from 'lucide-react';
import { BondAPI, useAPI, APIError, RateLimitError } from '../lib/api-client';
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
  milestones: any[];
  terms: string[];
  risks: string[];
  tags: string[];
}

interface Question {
  id: string;
  question: string;
  type: 'select' | 'multiselect' | 'text' | 'number' | 'date';
  options?: string[];
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string;
  };
  conditions?: {
    dependsOn: string;
    showIf: any;
  };
  help?: string;
  legalImplication?: string;
}

export function BondCreateViewEnhanced({ onNavigate }: BondCreateViewProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [suggestedContract, setSuggestedContract] = useState<string | null>(null);
  
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
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
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
      const response = await BondAPI.create({
        templateId: selectedTemplate,
        answers: answers
      });
      
      if (response.success) {
        onNavigate('bond-contract', response.contractId);
      }
    } catch (err) {
      console.error('Error creating contract:', err);
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
                className="bg-card border border-border rounded-xl p-6 cursor-pointer hover:border-accent hover:shadow-lg transition-all group"
              >
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">📋</div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">{template.title}</h3>
                <p className="text-muted-foreground mb-4">{template.description}</p>
                
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    <strong>Rôles:</strong> {template.roles?.join(', ') || 'Non spécifié'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <strong>Jalons:</strong> {template.milestones?.length || 0}
                  </div>
                  {template.popular && (
                    <div className="inline-flex items-center px-2 py-1 bg-accent/10 text-accent text-xs rounded-full">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Populaire
                    </div>
                  )}
                </div>
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
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold text-foreground">
                Configuration du Contrat
              </h1>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                ✕ Annuler
              </button>
            </div>
            
            <div className="w-full bg-muted rounded-full h-3">
              <motion.div 
                className="bg-accent h-3 rounded-full transition-all duration-300"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Question {currentQuestionIndex + 1} sur {questions.length} ({Math.round(progress)}%)
            </p>
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
              className="bg-card border border-border rounded-xl p-8"
            >
              <h2 className="text-xl font-semibold mb-4 text-foreground">
                {currentQuestion.question}
              </h2>
              
              {currentQuestion.help && (
                <p className="text-sm text-muted-foreground mb-4">{currentQuestion.help}</p>
              )}

              {/* Form field rendering based on type */}
              {currentQuestion.type === 'select' && (
                <select
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                  className="w-full p-3 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-colors"
                >
                  <option value="">Sélectionnez une option...</option>
                  {currentQuestion.options?.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              )}

              {currentQuestion.type === 'text' && (
                <textarea
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                  className="w-full p-3 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-colors resize-none"
                  rows={4}
                  placeholder="Décrivez votre projet..."
                />
              )}

              {currentQuestion.type === 'number' && (
                <input
                  type="number"
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, parseFloat(e.target.value))}
                  className="w-full p-3 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-colors"
                  placeholder="Montant en euros"
                />
              )}

              {currentQuestion.type === 'date' && (
                <input
                  type="date"
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                  className="w-full p-3 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-colors"
                />
              )}

              {currentQuestion.legalImplication && (
                <div className="mt-4 p-3 bg-accent/10 border border-accent/20 rounded-lg">
                  <p className="text-sm text-accent">
                    <strong>ℹ️ Implication légale:</strong> {currentQuestion.legalImplication}
                  </p>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className="px-6 py-3 border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
                >
                  Précédent
                </button>
                
                <div className="flex gap-3">
                  {currentQuestionIndex === questions.length - 1 && (
                    <LoadingButton
                      loading={suggestLoading}
                      onClick={handleSuggest}
                      className="px-6 py-3 bg-secondary text-secondary-foreground hover:bg-secondary/90"
                    >
                      Prévisualiser
                    </LoadingButton>
                  )}
                  
                  <LoadingButton
                    loading={createLoading}
                    onClick={currentQuestionIndex === questions.length - 1 ? handleSubmit : handleNext}
                    disabled={!answers[currentQuestion.id]}
                    className="px-6 py-3 bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    {currentQuestionIndex === questions.length - 1 ? 'Créer le contrat' : 'Suivant'}
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
              <div className="flex gap-3 mt-4">
                <LoadingButton
                  loading={createLoading}
                  onClick={handleSubmit}
                  className="px-6 py-3 bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  Créer le contrat
                </LoadingButton>
                <button
                  onClick={() => setSuggestedContract(null)}
                  className="px-6 py-3 border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  Modifier
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
