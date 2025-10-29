import React, { useState, useRef, useEffect } from 'react';
import { apiClient } from '../lib/api-client';

/**
 * ConseillerChatView - Modern conversational UI for legal consultation
 * 
 * Design principles:
 * - Chat-based interaction (like Claude/ChatGPT)
 * - Progressive disclosure (one question at a time)
 * - Real-time partial analysis preview
 * - Mobile-first, accessible, 8pt grid aligned
 * 
 * @see DESIGN_VERIFICATION_CHECKLIST.md
 */

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: Date;
}

interface PartialAnalysis {
  summary?: string;
  category?: string;
  urgency?: string;
  complexity?: string;
  progress?: number; // 0-100
}

interface ChatSession {
  id: string;
  messages: Message[];
  partialAnalysis: PartialAnalysis | null;
  isComplete: boolean;
}

interface ServerQuestion {
  id: string;
  text: string;
  type: 'choice' | 'text' | 'number' | 'date' | 'boolean' | 'multi';
  options?: string[];
}

export const ConseillerChatView: React.FC = () => {
  const [session, setSession] = useState<ChatSession>({
    id: Math.random().toString(36).slice(2, 10),
    messages: [],
    partialAnalysis: null,
    isComplete: false,
  });
  const [currentQuestion, setCurrentQuestion] = useState<ServerQuestion | null>(null);
  const [progress, setProgress] = useState<{ answered: number; total: number }>({ answered: 0, total: 18 });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session.messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Initialize conversation and start deterministic session
  useEffect(() => {
    (async () => {
      const resp = await apiClient.post('/api/conseiller/chat/session/start', { sessionId: session.id });
      const q = (resp as any).nextQuestion as ServerQuestion;
      setCurrentQuestion(q);
      setProgress((resp as any).progress || { answered: 0, total: 18 });
      setSession(prev => ({
        ...prev,
        messages: [
          {
            id: 'welcome',
            role: 'assistant',
            content: 'Bonjour ! Je vais vous poser 18 questions pour comprendre votre situation. ' + q.text,
            timestamp: new Date(),
          },
        ],
      }));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setSession(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
    }));
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      if (!currentQuestion) {
        // Free-form before first question
        const response: any = await apiClient.post('/api/conseiller/chat/session/freeform', {
          sessionId: session.id,
          message: userMessage.content,
        });
        setProgress(response.progress);
        const nextQ = response.nextQuestion as ServerQuestion | null;
        setCurrentQuestion(nextQ);
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: nextQ ? nextQ.text : "Merci, poursuivons.",
          timestamp: new Date(),
        };
        setSession(prev => ({ ...prev, messages: [...prev.messages, assistantMessage] }));
      } else {
        // Deterministic answer
        const response: any = await apiClient.post('/api/conseiller/chat/session/answer', {
          sessionId: session.id,
          questionId: currentQuestion.id,
          answer: userMessage.content,
        });
        setProgress(response.progress);
        if (response.isComplete) {
          const final: any = await apiClient.post('/api/conseiller/chat/session/finalize', { sessionId: session.id });
          const finalMessage: Message = {
            id: `assistant-final-${Date.now()}`,
            role: 'assistant',
            content: "Parfait ! J'ai toutes les informations. Voici votre analyse.",
            timestamp: new Date(),
          };
          setSession(prev => ({
            ...prev,
            messages: [...prev.messages, finalMessage],
            partialAnalysis: {
              summary: final.analysis?.summary,
              category: final.analysis?.category,
              urgency: String(final.analysis?.urgency ?? '5'),
              complexity: final.analysis?.complexity,
              progress: 100,
            },
            isComplete: true,
          }));
          setCurrentQuestion(null);
        } else {
          const nextQ = response.nextQuestion as ServerQuestion | null;
          setCurrentQuestion(nextQ);
          const assistantMessage: Message = {
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            content: nextQ ? nextQ.text : "Merci. Poursuivons.",
            timestamp: new Date(),
          };
          setSession(prev => ({ ...prev, messages: [...prev.messages, assistantMessage] }));
        }
      }
    } catch (err: any) {
      console.error('[ConseillerChatView] Error:', err);
      setError(err.response?.data?.message || "Une erreur est survenue. Veuillez réessayer.");
      
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: "Désolé, une erreur technique est survenue. Pouvez-vous reformuler votre dernière réponse ?",
        timestamp: new Date(),
      };

      setSession(prev => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleExport = async () => {
    if (!session.isComplete) return;

    try {
      const response = await apiClient.post('/api/conseiller/export', {
        sessionId: session.id,
      }, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analyse-juridique-${session.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('[ConseillerChatView] Export error:', err);
      setError("Impossible d'exporter l'analyse. Veuillez réessayer.");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Conseiller Symione</h1>
            <p className="text-sm text-gray-500">Assistant juridique conversationnel</p>
          </div>
          {session.isComplete && (
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded shadow-sm transition-colors duration-200"
              aria-label="Exporter l'analyse en PDF"
            >
              Exporter PDF
            </button>
          )}
        </div>
      </header>

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {/* Messages */}
          {session.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-2xl px-4 py-3 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-900'
                } shadow-sm`}
              >
                <p className="text-base leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                <span
                  className={`block mt-2 text-xs ${
                    msg.role === 'user' ? 'text-primary-100' : 'text-gray-500'
                  }`}
                >
                  {msg.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-2xl px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="ml-2 text-sm text-gray-500">Analyse en cours...</span>
                </div>
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="flex justify-center">
              <div className="max-w-2xl px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg shadow-sm" role="alert">
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Partial Analysis Sidebar (Desktop only) */}
      {session.partialAnalysis && (
        <aside className="hidden lg:block fixed top-20 right-8 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Analyse en cours</h3>
          
          {/* Progress bar */}
          {session.partialAnalysis.progress !== undefined && (
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progression</span>
                <span>{session.partialAnalysis.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${session.partialAnalysis.progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Partial data */}
          <dl className="space-y-3">
            {session.partialAnalysis.category && (
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Catégorie</dt>
                <dd className="mt-1 text-sm text-gray-900">{session.partialAnalysis.category}</dd>
              </div>
            )}
            {session.partialAnalysis.urgency && (
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Urgence</dt>
                <dd className="mt-1">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                    parseInt(session.partialAnalysis.urgency) >= 7
                      ? 'bg-red-100 text-red-800'
                      : parseInt(session.partialAnalysis.urgency) >= 4
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {session.partialAnalysis.urgency}/10
                  </span>
                </dd>
              </div>
            )}
            {session.partialAnalysis.complexity && (
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Complexité</dt>
                <dd className="mt-1 text-sm text-gray-900">{session.partialAnalysis.complexity}</dd>
              </div>
            )}
            {session.partialAnalysis.summary && (
              <div>
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">Résumé</dt>
                <dd className="mt-1 text-sm text-gray-700 leading-relaxed">{session.partialAnalysis.summary}</dd>
              </div>
            )}
          </dl>
        </aside>
      )}

      {/* Input Footer */}
      <footer className="sticky bottom-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={session.messages.length <= 1 ? "Décrivez votre situation juridique..." : "Votre réponse..."}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-base"
              disabled={isLoading || session.isComplete}
              aria-label="Message à envoyer"
            />
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading || session.isComplete}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg shadow-sm transition-colors duration-200"
              aria-label="Envoyer le message"
            >
              {isLoading ? 'Envoi...' : 'Envoyer'}
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-500 text-center">
            Appuyez sur <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">Entrée</kbd> pour envoyer
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ConseillerChatView;

