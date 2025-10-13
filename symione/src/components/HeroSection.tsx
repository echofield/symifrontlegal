import { motion } from "motion/react";
import { useEffect, useState } from "react";

export function HeroSection() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const opacity = Math.max(1 - scrollY / 400, 0);
  const translateY = scrollY * 0.3;

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-20">
      <div className="max-w-[1400px] mx-auto px-8 lg:px-16 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            opacity,
            transform: `translateY(${translateY}px)`,
          }}
          className="text-center"
        >
          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-[0.75rem] uppercase tracking-[0.15em] text-muted-foreground mb-8"
            style={{ fontWeight: 500 }}
          >
            Legal Intelligence Platform
          </motion.p>

          {/* Main headline */}
          <h1 
            className="text-[4rem] md:text-[6rem] lg:text-[8rem] tracking-[-0.03em] mb-6"
            style={{ 
              fontWeight: 700,
              lineHeight: 0.95
            }}
          >
            Contracts.
            <br />
            Intelligence.
            <br />
            Precision.
          </h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-[1rem] md:text-[1.125rem] text-muted-foreground max-w-2xl mx-auto"
            style={{ 
              lineHeight: 1.6,
              fontWeight: 400
            }}
          >
            Swiss-engineered legal automation for the modern era.
            <br />
            Built on precision, powered by intelligence.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button className="px-8 py-4 bg-accent text-accent-foreground hover:opacity-90 transition-opacity duration-300 text-[0.875rem] tracking-wide uppercase">
              Start Generation
            </button>
            <button className="px-8 py-4 border border-border hover:bg-secondary transition-colors duration-300 text-[0.875rem] tracking-wide uppercase">
              View Documentation
            </button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
          style={{ opacity: Math.max(1 - scrollY / 200, 0) }}
        >
          <div className="flex flex-col items-center gap-2">
            <p className="text-[0.625rem] uppercase tracking-[0.15em] text-muted-foreground" style={{ fontWeight: 500 }}>
              Scroll
            </p>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="w-px h-12 bg-border"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
