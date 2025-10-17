import { motion } from 'motion/react';
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { showToast } from './SystemToast';

interface LoginViewProps {
  onNavigate: (view: 'home' | 'contracts') => void;
}

export function LoginView({ onNavigate }: LoginViewProps) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isSignup) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        showToast('Inscription réussie. Vérifiez votre email.', 'success');
        onNavigate('contracts');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        showToast('Connexion réussie', 'success');
        onNavigate('contracts');
      }
    } catch (err: any) {
      showToast(err.message || 'Erreur authentification', 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-6">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'linear' }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <p 
            className="text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-4"
            style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
          >
            ACCÈS PLATEFORME
          </p>
          <h1 
            className="text-[2.5rem] mb-4 tracking-[-0.03em]"
            style={{ fontWeight: 600, lineHeight: 1.1 }}
          >
            {isSignup ? 'Créer un compte.' : 'Connexion.'}
          </h1>
          <p 
            className="text-[0.875rem] text-muted-foreground"
            style={{ lineHeight: 1.7 }}
          >
            {isSignup 
              ? 'Commencez à générer vos contrats professionnels'
              : 'Accédez à votre espace de travail juridique'
            }
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border border-border bg-card p-8">
            <div className="space-y-6">
              <div>
                <label 
                  htmlFor="email"
                  className="block text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-2"
                  style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
                >
                  Adresse email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-input-background border border-border focus:border-accent focus:outline-none transition-colors duration-200 text-[0.9375rem]"
                  style={{ fontFamily: 'var(--font-mono)' }}
                  placeholder="votre@email.com"
                />
              </div>

              <div>
                <label 
                  htmlFor="password"
                  className="block text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-2"
                  style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
                >
                  Mot de passe
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-input-background border border-border focus:border-accent focus:outline-none transition-colors duration-200 text-[0.9375rem]"
                  style={{ fontFamily: 'var(--font-mono)' }}
                  placeholder="••••••••"
                />
              </div>

              {!isSignup && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4" />
                    <span 
                      className="text-[0.75rem]"
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      Se souvenir de moi
                    </span>
                  </label>
                  <button
                    type="button"
                    className="text-[0.75rem] text-accent hover:underline"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    Mot de passe oublié ?
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full px-8 py-5 bg-accent text-accent-foreground hover:shadow-[0_0_20px_var(--accent-glow)] transition-all duration-200 text-[0.75rem] uppercase tracking-[0.12em]"
            style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}
          >
            {isSignup ? 'Créer mon compte' : 'Se connecter'}
          </button>

          {/* Toggle mode */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsSignup(!isSignup)}
              className="text-[0.75rem] text-muted-foreground hover:text-foreground transition-colors duration-200"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {isSignup 
                ? 'Déjà un compte ? Se connecter →'
                : 'Pas encore de compte ? S\'inscrire →'
              }
            </button>
          </div>
        </form>

        {/* Social login (optional) */}
        <div className="mt-8 pt-8 border-t border-border">
          <p 
            className="text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground text-center mb-4"
            style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
          >
            Ou continuer avec
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={async () => { await supabase.auth.signInWithOAuth({ provider: 'google' }); }}
              className="px-6 py-4 border border-border hover:border-foreground transition-all duration-200 text-[0.75rem] tracking-[0.08em] uppercase"
              style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
            >
              Se connecter avec Google
            </button>
            <button
              type="button"
              onClick={async () => { await supabase.auth.signInWithOAuth({ provider: 'azure' }); }}
              className="px-6 py-4 border border-border hover:border-foreground transition-all duration-200 text-[0.75rem] tracking-[0.08em] uppercase"
              style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
            >
              Se connecter avec Microsoft
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
