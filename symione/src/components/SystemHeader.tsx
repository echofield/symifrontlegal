import { Activity } from "lucide-react";

interface SystemHeaderProps {
  onThemeChange?: (theme: 'white' | 'offwhite' | 'night') => void;
  currentTheme?: 'white' | 'offwhite' | 'night';
}

export function SystemHeader({ onThemeChange, currentTheme }: SystemHeaderProps) {
  const currentTime = new Date().toLocaleTimeString('fr-FR', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-[1920px] mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
        {/* System identifier */}
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-start gap-0.5">
            <div className="flex items-center gap-3">
              <div className="w-1 h-1 rounded-full bg-accent animate-pulse" />
              <h1 
                className="text-[1.125rem] tracking-[-0.02em]" 
                style={{ fontWeight: 700, lineHeight: 1, fontFamily: 'var(--font-sans)' }}
              >
                SYMIONE
              </h1>
            </div>
            <span 
              className="text-[0.5rem] uppercase tracking-[0.15em] text-muted-foreground/50 ml-4"
              style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}
            >
              lex-engine
            </span>
          </div>
          
          {/* System status */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Activity className="w-3 h-3 text-accent" strokeWidth={2} />
              <span 
                className="text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground"
                style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
              >
                ACTIVE
              </span>
            </div>
            <div className="h-3 w-px bg-border" />
            <span 
              className="text-[0.625rem] tracking-[0.05em] text-muted-foreground"
              style={{ fontFamily: 'var(--font-mono)', fontWeight: 300 }}
            >
              {currentTime}
            </span>
          </div>
        </div>

        {/* Control panel */}
        <div className="flex items-center gap-4">
          {/* Mode selector */}
          {onThemeChange && (
            <div className="flex items-center gap-1 bg-secondary/50 p-1">
              <button
                onClick={() => onThemeChange('white')}
                className={`px-3 py-1.5 transition-all duration-200 ${
                  currentTheme === 'white' 
                    ? 'bg-background shadow-sm' 
                    : 'hover:bg-background/50'
                }`}
                aria-label="White mode"
              >
                <span 
                  className="text-[0.625rem] uppercase tracking-[0.1em]"
                  style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
                >
                  WHT
                </span>
              </button>
              <button
                onClick={() => onThemeChange('offwhite')}
                className={`px-3 py-1.5 transition-all duration-200 ${
                  currentTheme === 'offwhite' 
                    ? 'bg-background shadow-sm' 
                    : 'hover:bg-background/50'
                }`}
                aria-label="Off-white mode"
              >
                <span 
                  className="text-[0.625rem] uppercase tracking-[0.1em]"
                  style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
                >
                  OFW
                </span>
              </button>
              <button
                onClick={() => onThemeChange('night')}
                className={`px-3 py-1.5 transition-all duration-200 ${
                  currentTheme === 'night' 
                    ? 'bg-background shadow-sm' 
                    : 'hover:bg-background/50'
                }`}
                aria-label="Night mode"
              >
                <span 
                  className="text-[0.625rem] uppercase tracking-[0.1em]"
                  style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
                >
                  NGT
                </span>
              </button>
            </div>
          )}
          
          {/* User session indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 border border-border">
            <div className="w-2 h-2 rounded-full bg-accent" />
            <span 
              className="text-[0.625rem] uppercase tracking-[0.1em]"
              style={{ fontFamily: 'var(--font-mono)', fontWeight: 400 }}
            >
              SESSION
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
