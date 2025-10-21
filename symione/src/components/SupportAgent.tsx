import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, User, Loader2, FileText, Search, AlertCircle } from 'lucide-react';
import { AdvisorAPI } from '../lib/api-client';
import { useLoadingState } from './LoadingComponents';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  action?: {
    type: string;
    args?: Record<string, any>;
  };
  followupQuestion?: string;
}

export function SupportAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [context, setContext] = useState<Record<string, any>>({});
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { loading, error, startLoading, stopLoading, setErrorState } = useLoadingState();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: 'Bonjour ! Je suis votre assistant juridique intelligent SYMIONE. Je peux vous aider à :\n\n• Analyser vos situations juridiques\n• Recommander des contrats adaptés\n• Expliquer des clauses légales\n• Trouver des avocats spécialisés\n\nComment puis-je vous aider aujourd\'hui ?',
        timestamp: new Date(),
        followupQuestion: 'Je veux créer un contrat de travail',
      }]);
    }
  }, [isOpen, messages.length]);

  // Quick suggestions for common questions
  const quickSuggestions = [
    'Je veux créer un contrat de travail',
    'J\'ai un litige avec mon voisin',
    'Expliquez-moi les clauses d\'un NDA',
    'Trouvez-moi un avocat spécialisé',
  ];

  const handleSendMessage = async () => {
    if (!inputValue.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    startLoading();

    try {
      const response = await AdvisorAPI.chat({
        question: inputValue.trim(),
        context: context,
      });

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.output.reply_text,
        timestamp: new Date(),
        action: response.output.action,
        followupQuestion: response.output.followup_question || undefined,
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Update context with new information
      if (response.output.action?.args) {
        setContext(prev => ({ ...prev, ...response.output.action.args }));
      }

    } catch (err) {
      console.error('Chat error:', err);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Désolé, je rencontre un problème technique. Veuillez réessayer dans quelques instants.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      setErrorState('Erreur de communication avec l\'assistant');
    } finally {
      setIsTyping(false);
      stopLoading();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleActionClick = (action: ChatMessage['action']) => {
    if (!action) return;

    switch (action.type) {
      case 'generate_contract':
        // Navigate to contract creation
        window.location.href = '/contracts';
        break;
      case 'search_lawyers':
        // Navigate to conseiller
        window.location.href = '/conseiller';
        break;
      case 'explain':
        // Could open a modal or navigate to explanation
        console.log('Explain action:', action.args);
        break;
      default:
        console.log('Action not implemented:', action.type);
    }
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'generate_contract': return <FileText className="w-4 h-4" />;
      case 'search_lawyers': return <Search className="w-4 h-4" />;
      case 'explain': return <AlertCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const getActionLabel = (actionType: string) => {
    switch (actionType) {
      case 'generate_contract': return 'Créer un contrat';
      case 'search_lawyers': return 'Trouver un avocat';
      case 'explain': return 'Explication détaillée';
      default: return 'Action';
    }
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, duration: 0.2, ease: 'linear' }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-accent text-accent-foreground shadow-lg hover:shadow-[0_0_24px_var(--accent-glow)] transition-all duration-200 border border-accent"
        aria-label="Assistant SYMIONE"
      >
        {isOpen ? (
          <X className="w-6 h-6" strokeWidth={1.5} />
        ) : (
          <MessageSquare className="w-6 h-6" strokeWidth={1.5} />
        )}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'linear' }}
            className="fixed bottom-24 right-6 z-50 w-[420px] max-h-[600px] bg-card border border-border shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-border bg-accent/5">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <h3 
                  className="text-[1rem] tracking-[-0.01em]"
                  style={{ fontWeight: 600 }}
                >
                  Assistant SYMIONE
                </h3>
              </div>
              <p 
                className="text-[0.75rem] text-muted-foreground"
                style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}
              >
                Assistant juridique intelligent
              </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-accent" strokeWidth={1.5} />
                    </div>
                  )}
                  
                  <div className={`max-w-[80%] ${message.role === 'user' ? 'order-first' : ''}`}>
                    <div
                      className={`p-3 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-muted/30 text-foreground'
                      }`}
                    >
                      <p 
                        className="text-[0.875rem] whitespace-pre-wrap"
                        style={{ lineHeight: 1.5 }}
                      >
                        {message.content}
                      </p>
                    </div>
                    
                    {/* Action buttons */}
                    {message.action && (
                      <div className="mt-2">
                        <button
                          onClick={() => handleActionClick(message.action)}
                          className="flex items-center gap-2 px-3 py-2 bg-accent/10 hover:bg-accent/20 text-accent rounded-lg transition-colors text-[0.75rem]"
                        >
                          {getActionIcon(message.action.type)}
                          {getActionLabel(message.action.type)}
                        </button>
                      </div>
                    )}
                    
                    {/* Follow-up question */}
                    {message.followupQuestion && (
                      <div className="mt-2">
                        <button
                          onClick={() => setInputValue(message.followupQuestion!)}
                          className="px-3 py-2 bg-muted/50 hover:bg-muted text-foreground rounded-lg transition-colors text-[0.75rem] border border-border"
                        >
                          {message.followupQuestion}
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-accent-foreground" strokeWidth={1.5} />
                    </div>
                  )}
                </div>
              ))}
              
              {/* Typing indicator */}
              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-accent" strokeWidth={1.5} />
                  </div>
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <div className="flex items-center gap-1">
                      <Loader2 className="w-4 h-4 animate-spin text-accent" />
                      <span className="text-[0.75rem] text-muted-foreground">Assistant réfléchit...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick suggestions */}
            {messages.length <= 1 && (
              <div className="p-4 border-t border-border bg-muted/20">
                <p className="text-[0.75rem] text-muted-foreground mb-2" style={{ fontFamily: 'var(--font-mono)' }}>
                  Suggestions rapides :
                </p>
                <div className="flex flex-wrap gap-2">
                  {quickSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setInputValue(suggestion)}
                      className="px-3 py-1 bg-muted/50 hover:bg-muted text-foreground rounded-full transition-colors text-[0.75rem] border border-border hover:border-accent/50"
                      style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-border bg-muted/30">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Posez votre question juridique..."
                  disabled={loading}
                  className="flex-1 px-3 py-2 bg-input-background border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-colors text-[0.875rem] disabled:opacity-50"
                  style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || loading}
                  className="px-3 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>
              
              {error && (
                <div className="mt-2 p-2 bg-destructive/10 border border-destructive/20 rounded text-[0.75rem] text-destructive">
                  {error}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
