import { motion } from 'motion/react';
import { useState } from 'react';
import { Mail } from 'lucide-react';

export function ContactView() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: 'general',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    // Mock submission - in production, this would call your API
    alert('Message envoyé ! Notre équipe vous répondra sous 24h.');
  };

  return (
    <div className="min-h-screen py-20 lg:py-24">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: Contact info */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'linear' }}
          >
            <p 
              className="text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-4"
              style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
            >
              CONTACT / SUPPORT
            </p>
            <h1 
              className="text-[3rem] md:text-[4rem] mb-6 tracking-[-0.03em]"
              style={{ fontWeight: 600, lineHeight: 1.1 }}
            >
              Nous consulter.
            </h1>
            <p 
              className="text-[1rem] text-muted-foreground mb-12"
              style={{ lineHeight: 1.7 }}
            >
              Notre équipe est à votre disposition pour répondre à vos questions sur nos plans, fonctionnalités ou partenariats.
            </p>

            {/* Contact methods */}
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="p-3 border border-border">
                  <Mail className="w-5 h-5 text-accent" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 
                    className="text-[1rem] mb-1"
                    style={{ fontWeight: 600 }}
                  >
                    Email
                  </h3>
                  <a 
                    href="mailto:contact@symi.io"
                    className="text-[0.875rem] text-muted-foreground hover:text-accent transition-colors duration-200"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    contact@symi.io
                  </a>
                </div>
              </div>


            </div>

            {/* Quick links */}
            <div className="mt-12 pt-8 border-t border-border">
              <p 
                className="text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-4"
                style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
              >
                Liens rapides
              </p>
              <div className="space-y-2">
                <a 
                  href="mailto:sales@symi.io"
                  className="block text-[0.875rem] hover:text-accent transition-colors duration-200"
                >
                  → Demande commerciale
                </a>
                <a 
                  href="mailto:support@symi.io"
                  className="block text-[0.875rem] hover:text-accent transition-colors duration-200"
                >
                  → Support technique
                </a>
                <a 
                  href="mailto:partners@symi.io"
                  className="block text-[0.875rem] hover:text-accent transition-colors duration-200"
                >
                  → Partenariats cabinets
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right: Contact form */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'linear', delay: 0.1 }}
          >
            <form onSubmit={handleSubmit} className="border border-border bg-card p-8 lg:p-10">
              <div className="space-y-6">
                <div>
                  <label 
                    htmlFor="name"
                    className="block text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-2"
                    style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
                  >
                    Nom complet *
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-input-background border border-border focus:border-accent focus:outline-none transition-colors duration-200 text-[0.9375rem]"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  />
                </div>

                <div>
                  <label 
                    htmlFor="email"
                    className="block text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-2"
                    style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
                  >
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-input-background border border-border focus:border-accent focus:outline-none transition-colors duration-200 text-[0.9375rem]"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  />
                </div>

                <div>
                  <label 
                    htmlFor="company"
                    className="block text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-2"
                    style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
                  >
                    Entreprise / Cabinet
                  </label>
                  <input
                    id="company"
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-3 bg-input-background border border-border focus:border-accent focus:outline-none transition-colors duration-200 text-[0.9375rem]"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  />
                </div>

                <div>
                  <label 
                    htmlFor="subject"
                    className="block text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-2"
                    style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
                  >
                    Sujet *
                  </label>
                  <select
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-input-background border border-border focus:border-accent focus:outline-none transition-colors duration-200 text-[0.9375rem]"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    <option value="general">Question générale</option>
                    <option value="sales">Demande commerciale</option>
                    <option value="support">Support technique</option>
                    <option value="partnership">Partenariat cabinet</option>
                  </select>
                </div>

                <div>
                  <label 
                    htmlFor="message"
                    className="block text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground mb-2"
                    style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-input-background border border-border focus:border-accent focus:outline-none transition-colors duration-200 text-[0.9375rem] resize-none"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-8 py-5 bg-accent text-accent-foreground hover:shadow-[0_0_20px_var(--accent-glow)] transition-all duration-200 text-[0.75rem] uppercase tracking-[0.12em]"
                  style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}
                >
                  Envoyer le message
                </button>

                <p 
                  className="text-[0.75rem] text-muted-foreground text-center"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  Réponse sous 24h ouvrées
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
