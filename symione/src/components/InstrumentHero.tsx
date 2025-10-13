import { motion } from "motion/react";
import { useEffect, useState } from "react";

export function InstrumentHero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const opacity = Math.max(1 - scrollY / 400, 0);
  const translateY = scrollY * 0.2;

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-16">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 w-full">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'linear' }}
          style={{
            opacity,
            transform: `translateY(${translateY}px)`,
          }}
          className="relative"
        >
          {/* System identification */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="flex items-center gap-3 mb-12"
          >
            <div className="h-px w-12 bg-border" />
            <p
              className="text-[0.625rem] uppercase tracking-[0.15em] text-muted-foreground"
              style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
            >
              SYSTÈME D'INTELLIGENCE JURIDIQUE
            </p>
          </motion.div>

          {/* Main display */}
          <div className="space-y-8">
            <h1 
              className="text-[3.5rem] md:text-[5rem] lg:text-[7rem] tracking-[-0.03em]"
              style={{ 
                fontWeight: 700,
                lineHeight: 0.95
              }}
            >
              Documents.
              <br />
              Intelligence.
              <br />
              Précision.
            </h1>

            {/* System parameters */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="flex flex-wrap gap-6 md:gap-8 pt-4"
            >
              {[
                { label: 'PRÉCISION', value: '99.7%' },
                { label: 'JURIDICTIONS', value: '12+' },
                { label: 'LATENCE', value: '<200ms' },
              ].map((param, index) => (
                <div key={param.label} className="flex items-baseline gap-3">
                  <span
                    className="text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground"
                    style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
                  >
                    {param.label}
                  </span>
                  <span
                    className="text-[1rem] tracking-[-0.01em]"
                    style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}
                  >
                    {param.value}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Activation controls */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="mt-16 flex flex-col sm:flex-row gap-3"
          >
            <button className="group relative px-12 py-5 bg-accent text-accent-foreground overflow-hidden transition-all duration-200 hover:shadow-[0_0_20px_var(--accent-glow)] flex items-center justify-center gap-3">
              <span 
                className="relative z-10 text-[0.8125rem] uppercase tracking-[0.12em]"
                style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}
              >
                Commencer
              </span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="stroke-current">
                <path d="M2 7H12M12 7L8 3M12 7L8 11" strokeWidth="1.5" strokeLinecap="square" />
              </svg>
            </button>
            <button className="group px-12 py-5 border border-border hover:border-foreground transition-all duration-200 flex items-center justify-center gap-3">
              <span 
                className="text-[0.8125rem] uppercase tracking-[0.12em]"
                style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
              >
                Documentation
              </span>
            </button>
          </motion.div>
        </motion.div>

        {/* Progress indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="absolute bottom-12 left-6 lg:left-12"
          style={{ opacity: Math.max(1 - scrollY / 200, 0) }}
        >
          <div className="flex items-center gap-3">
            <div className="w-px h-16 bg-border relative overflow-hidden">
              <motion.div
                animate={{ y: [-64, 64] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="w-full h-4 bg-accent/50"
              />
            </div>
            <span
              className="text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground"
              style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}
            >
              SCROLL
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
