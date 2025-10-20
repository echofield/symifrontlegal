import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus } from 'lucide-react';

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

export function BondCreateView({ onNavigate }: BondCreateViewProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les templates
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://symilegalback.vercel.app/api/contracts/templates');
        if (response.ok) {
          const data = await response.json();
          if (data.ok) {
            setTemplates(data.templates);
          } else {
            setError('Erreur lors du chargement des templates');
          }
        } else {
          setError('Erreur de connexion');
        }
      } catch (err) {
        setError('Erreur de connexion');
        console.error('Error loading templates:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTemplates();
  }, []);

  // Charger les questions quand un template est sélectionné
  useEffect(() => {
    if (!selectedTemplate) return;

    const loadQuestions = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://symilegalback.vercel.app/api/contracts/questions?id=${selectedTemplate}`);
        if (response.ok) {
          const data = await response.json();
          if (data.ok) {
            setQuestions(data.questions);
            setCurrentQuestionIndex(0);
          } else {
            setError('Erreur lors du chargement des questions');
          }
        } else {
          setError('Erreur de connexion');
        }
      } catch (err) {
        setError('Erreur de connexion');
        console.error('Error loading questions:', err);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [selectedTemplate]);

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

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://symilegalback.vercel.app/api/contracts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: selectedTemplate,
          answers: answers
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          onNavigate('bond-contract', data.contractId);
        } else {
          setError('Erreur lors de la création du contrat');
        }
      } else {
        setError('Erreur lors de la création du contrat');
      }
    } catch (err) {
      setError('Erreur lors de la création du contrat');
      console.error('Error creating contract:', err);
    } finally {
      setLoading(false);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  if (loading && templates.length === 0) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des templates...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erreur</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  // Vue de sélection des templates
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Créer un Contrat Sécurisé
            </h1>
            <p className="text-xl text-gray-600">
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
                className="bg-white rounded-xl border-2 border-gray-200 p-6 cursor-pointer hover:border-blue-300 hover:shadow-lg transition-all"
              >
                <div className="text-3xl mb-4">📋</div>
                <h3 className="text-xl font-semibold mb-3">{template.title}</h3>
                <p className="text-gray-600 mb-4">{template.description}</p>
                
                <div className="space-y-2">
                  <div className="text-sm text-gray-500">
                    <strong>Rôles:</strong> {template.roles.join(', ')}
                  </div>
                  <div className="text-sm text-gray-500">
                    <strong>Jalons:</strong> {template.milestones.length}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Vue des questions
  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header avec progression */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Configuration du Contrat
            </h1>
            <button
              onClick={() => setSelectedTemplate(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕ Annuler
            </button>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-blue-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Question {currentQuestionIndex + 1} sur {questions.length} ({Math.round(progress)}%)
          </p>
        </div>

        {/* Question actuelle */}
        {currentQuestion && (
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl border border-gray-200 p-8"
          >
            <h2 className="text-xl font-semibold mb-4">
              {currentQuestion.question}
            </h2>
            
            {currentQuestion.help && (
              <p className="text-sm text-gray-500 mb-4">{currentQuestion.help}</p>
            )}

            {/* Rendu du champ selon le type */}
            {currentQuestion.type === 'select' && (
              <select
                value={answers[currentQuestion.id] || ''}
                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="Décrivez votre projet..."
              />
            )}

            {currentQuestion.type === 'number' && (
              <input
                type="number"
                value={answers[currentQuestion.id] || ''}
                onChange={(e) => handleAnswerChange(currentQuestion.id, parseFloat(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Montant en euros"
              />
            )}

            {currentQuestion.type === 'date' && (
              <input
                type="date"
                value={answers[currentQuestion.id] || ''}
                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            )}

            {currentQuestion.legalImplication && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>ℹ️ Implication légale:</strong> {currentQuestion.legalImplication}
                </p>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="px-6 py-3 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Précédent
              </button>
              
              <button
                onClick={handleNext}
                disabled={!answers[currentQuestion.id]}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentQuestionIndex === questions.length - 1 ? 'Créer le contrat' : 'Suivant'}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
